from fastapi import Request, HTTPException, status
from datetime import timedelta, datetime, timezone
from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError
from os import getenv

# Definir algoritmos permitidos
ALLOWED_ALGORITHMS = [
    "HS256",
    "RS256",
]  # Define aquí los algoritmos que consideras seguros


def get_refresh_token(request: Request) -> str:
    """
    Extrae el token de refresco de las cookies de la solicitud.
    """
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token"
        )
    return refresh_token


def create_token(data: dict, secret: str, expiration_time: timedelta) -> str:
    if not isinstance(data, dict):
        raise ValueError("Los datos deben ser un diccionario")
    if not isinstance(expiration_time, timedelta):
        raise ValueError("El tiempo de expiración debe ser un objeto timedelta")

    # Copiar datos para evitar modificar el original
    data_to_encode = data.copy()

    # Agregar expiración
    expire = datetime.now(timezone.utc) + expiration_time
    data_to_encode.update({"exp": expire})

    # Generar el token JWT
    algorithm = getenv("JWT_ALGORITHM", "HS256")
    if algorithm not in ALLOWED_ALGORITHMS:
        raise ValueError("Algoritmo de JWT no permitido")

    jwt_token = encode(
        data_to_encode,
        secret,
        algorithm=algorithm,
    )
    return jwt_token


def decode_token(token: str, secret: str) -> dict:
    try:
        # Validar algoritmo permitido
        algorithm = getenv("JWT_ALGORITHM", "HS256")
        if algorithm not in ALLOWED_ALGORITHMS:
            raise ValueError("Algoritmo de JWT no permitido")

        # Decodificar el token
        jwt_token_decoded = decode(
            token,
            secret,
            algorithms=[algorithm],
        )

        # Verificar si el token contiene un campo de expiración
        if "exp" not in jwt_token_decoded:
            raise HTTPException(status_code=401, detail="El token no tiene expiración")

        return jwt_token_decoded

    # Manejo de errores específicos de JWT
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="El token ha expirado")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
