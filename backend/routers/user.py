import requests
from dotenv import load_dotenv
from os import getenv
from datetime import timedelta, datetime, timezone

import jwt
from fastapi import APIRouter, HTTPException, Request, Response, status
from passlib.context import CryptContext

from db.models.user import (
    Token,
    UserCreated,
    GoogleUserDB,
    Code,
    UserProfile,
    GoogleUser,
    UpdatedUser,
)
from db.client import user_collection
from .jwt_tokens import create_token, decode_token, get_refresh_token

load_dotenv()  # Load the .env

router = APIRouter(prefix="/users")

password_context = CryptContext(schemes="bcrypt")  # Use password context


# Create user traditional method
# You should be pass a post like
# {
#   "username" : "example"
#   "password" : "example123"
#   "email" : "example@example.com"
# }
# You can manage the data with the entity UserCreated
@router.post("/register")
async def register_user(user: UserCreated, response: Response):
    # Check on the user collection if there are other
    # user with the same email
    existing_user = user_collection.find_one({"email": user.email})
    if existing_user != None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo elijido ya está en uso",
        )

    # Hashing the password with bcrypt
    password_hashed = password_context.hash(user.password)

    # Converting the UserCreated entity on a dict
    user_dict = dict(user)

    # Overwrite the field password (non-hashed) with the
    # password hashed (hashed-bcrypt)
    user_dict["password"] = password_hashed

    refresh_token = create_token(
        data={"sub": user_dict["email"]},
        secret=getenv("REFRESH_TOKEN_SECRET"),
        expiration_time=timedelta(days=int(getenv("REFRESH_TOKEN_EXPIRE_DAYS"))),
    )

    expiration = datetime.now(timezone.utc) + timedelta(days=30)

    # On the secure cookie set the refresh_token
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=expiration.strftime("%a, %d-%b-%Y %H:%M:%S GMT"),
        httponly=True,
        secure=True,  # True on production
        samesite="strict",  # Strict on production
    )

    user_dict["refresh_token"] = refresh_token

    seed = user_dict["email"].split("@")[0]

    picture = f"https://api.dicebear.com/9.x/pixel-art/svg?seed={seed}"

    user_dict["picture"] = picture

    user_dict["cart"] = {"products": []}

    # Insert the user on the DB and stay with the DB id
    user_collection.insert_one(user_dict)

    return {"state": "success"}


# Register use with google auth
@router.post("/auth/callback")
async def auth_callback(code: Code, response: Response):
    code_dict = dict(code)

    # Send the secure code and it's return the token
    token_response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code_dict["code"],
            "client_id": getenv("CLIENT_ID"),
            "client_secret": getenv("CLIENT_SECRET"),
            "redirect_uri": getenv("REDIRECT_URI"),
            "grant_type": "authorization_code",
        },
    )

    # Convert the Response entity to json
    tokens = token_response.json()

    if token_response.status_code != 200:
        print(f"Error response: {token_response.text}")
        raise HTTPException(status_code=token_response.status_code, detail=tokens)

    google_access_token = tokens.get("access_token")

    # Get info to the google user
    url = "https://www.googleapis.com/oauth2/v1/userinfo"
    google_response = requests.get(
        url, headers={"Authorization": f"Bearer {google_access_token}"}
    )

    if google_response.status_code != 200:
        raise HTTPException(
            status_code=google_response.status_code, detail="Failed to fetch user info"
        )

    # Convert the Response entity to json
    user_info = google_response.json()

    # Get the email
    email = user_info.get("email")

    # Check if the user already exists
    user = user_collection.find_one({"email": email})

    expiration = datetime.now(timezone.utc) + timedelta(days=30)

    if user:
        user_dict = dict(user)
        # The GoogleUserDB entity contains the refresh_token
        # if exists set the cookie that is storage on the DB
        response.set_cookie(
            key="refresh_token",
            value=user_dict["refresh_token"],
            expires=expiration.strftime("%a, %d-%b-%Y %H:%M:%S GMT"),
            httponly=True,
            secure=True,  # True on production
            samesite="strict",  # Strict on production
        )
        return {"error": "user already exists"}

    # If not exists the user create a token
    refresh_token = create_token(
        data={"sub": email},
        secret=getenv("REFRESH_TOKEN_SECRET"),
        expiration_time=timedelta(days=int(getenv("REFRESH_TOKEN_EXPIRE_DAYS"))),
    )

    # On the secure cookie set the refresh_token
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=expiration.strftime("%a, %d-%b-%Y %H:%M:%S GMT"),
        httponly=True,
        secure=True,  # True on production
        samesite="strict",  # Strict on production
    )

    user_info["cart"] = {"products": []}

    # Storage the new user on the DB
    user_db = GoogleUserDB(**user_info, refresh_token=refresh_token)

    # Convierte el usuario a un diccionario compatible con MongoDB antes de insertar
    user_collection.insert_one(user_db.model_dump())

    return {"cookie": "setted"}


@router.post("/refresh")
async def refresh_access_token(request: Request):
    # Get the cookies on the request
    refresh_token: str = get_refresh_token(request=request)

    try:
        # Verify if the refresh_token is valid and see if exists a user with
        # this refresh_token
        user = user_collection.find_one({"refresh_token": refresh_token})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Bad refresh token"
            )

        # Decode the refresh_token
        refresh_token_decoded = decode_token(
            refresh_token, secret=getenv("REFRESH_TOKEN_SECRET")
        )

        access_token = create_token(
            data={"sub": refresh_token_decoded["sub"]},
            secret=getenv("ACCESS_TOKEN_SECRET"),
            expiration_time=timedelta(
                minutes=int(getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
            ),
        )
        return {"access_token": access_token, "token_type": "Bearer"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )


@router.post("/verify/access_token")
async def verify_access_token(token: Token):
    token_dict = dict(token)
    access_token = token_dict["access_token"]

    try:
        # Decode the access_token
        access_token_decoded = decode_token(
            token=access_token, secret=getenv("ACCESS_TOKEN_SECRET")
        )

        user = user_collection.find_one({"email": access_token_decoded["sub"]})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Bad refresh token"
            )

        return {"state": "sucessful"}

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )


@router.post("/secure")
async def verify_if_is_secure(request: Request):
    refresh_token: str = get_refresh_token(request=request)
    user = user_collection.find_one({"refresh_token": refresh_token})
    if user is None:
        raise HTTPException(400, "Bad token")
    user_dict = dict(user)
    refresh_token_decoded = decode_token(refresh_token, getenv("REFRESH_TOKEN_SECRET"))
    if user_dict["email"] != refresh_token_decoded["sub"]:
        raise HTTPException(400, "Bad refresh token")
    if user_dict["email"] != "gyaaccesorios.shop@gmail.com":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthorized")
    return {"state": "success"}


@router.get("/profile")
async def get_account(request: Request):
    refresh_token: str = get_refresh_token(request)
    if refresh_token is None:
        raise HTTPException(400, "Bad refresh token")
    refresh_token_decoded = decode_token(refresh_token, getenv("REFRESH_TOKEN_SECRET"))
    user = user_collection.find_one({"email": refresh_token_decoded["sub"]})
    if user is None:
        raise HTTPException(400, "Bad refresh token")
    user_dict = dict(user)
    del user_dict["_id"]
    if "password" in user_dict and user_dict["password"]:
        return UserProfile(**user_dict)
    return GoogleUser(**user_dict)


@router.post("/logout")
async def logout_account(request: Request, response: Response):
    refresh_token: str = get_refresh_token(request)
    if refresh_token is None:
        raise HTTPException(400, "Bad refresh token")
    refresh_token_decoded = decode_token(refresh_token, getenv("REFRESH_TOKEN_SECRET"))
    user = user_collection.find_one_and_delete({"email": refresh_token_decoded["sub"]})
    if user is None:
        raise HTTPException(400, "Bad refresh token")
    response.delete_cookie("refresh_token")
    return {"state": "succesfully logout"}


@router.put("/update")
async def update_user(user: UpdatedUser, request: Request, response: Response):
    if not user:
        raise HTTPException(404, "User not found")

    user_dict = dict(user)

    refresh_token = get_refresh_token(request)
    refresh_token_decoded: str = decode_token(
        refresh_token, getenv("REFRESH_TOKEN_SECRET")
    )

    refresh_token = create_token(
        data={"sub": user_dict["email"]},
        secret=getenv("REFRESH_TOKEN_SECRET"),
        expiration_time=timedelta(days=int(getenv("REFRESH_TOKEN_EXPIRE_DAYS"))),
    )
    expiration = datetime.now(timezone.utc) + timedelta(days=30)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=expiration.strftime("%a, %d-%b-%Y %H:%M:%S GMT"),
        httponly=True,
        secure=True,  # True on production
        samesite="strict",  # Strict on production
    )
    user_dict["refresh_token"] = refresh_token
    if user_dict["password"]:
        del user_dict["name"]
        password_hashed = password_context.hash(user.password)
        user_dict["password"] = password_hashed
        user_collection.find_one_and_update(
            {"email": refresh_token_decoded["sub"]}, {"$set": user_dict}
        )

    del user_dict["password"]
    user_collection.find_one_and_update(
        {"email": refresh_token_decoded["sub"]}, {"$set": user_dict}
    )


@router.post("/login")
async def login_account(user: UserCreated, response: Response):
    # Buscar el usuario en la base de datos
    user_db = user_collection.find_one({"email": user.email})
    if not user_db:
        raise HTTPException(
            status_code=404, detail="Usuario no encontrado. Por favor registrarse"
        )

    # Convertir el resultado en un diccionario
    user_dict = dict(user_db)

    # Verificar si la clave 'password' existe en el usuario
    if "password" not in user_dict or not password_context.verify(
        user.password, user_dict["password"]
    ):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    # Establecer cookie segura con el token de refresco
    expiration = datetime.now(timezone.utc) + timedelta(days=30)
    response.set_cookie(
        key="refresh_token",
        value=user_dict.get(
            "refresh_token", ""
        ),  # Usa un valor por defecto en caso de que no exista
        expires=expiration.strftime("%a, %d-%b-%Y %H:%M:%S GMT"),
        httponly=True,
        secure=True,  # Cambiar a True en producción
        samesite="strict",  # Cambiar a 'strict' en producción
    )

    return {"state": "success"}
