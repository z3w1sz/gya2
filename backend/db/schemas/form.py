import bcrypt

from fastapi.security import OAuth2PasswordRequestForm


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()


def tranform_form(form: OAuth2PasswordRequestForm) -> dict:
    return {"username": form.username, "password": hash_password(form.password)}
