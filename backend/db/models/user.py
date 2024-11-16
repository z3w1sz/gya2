from pydantic import BaseModel
from typing import List


class User(BaseModel):
    id: str | None = None
    email: str


class UserProfile(BaseModel):
    email: str
    picture: str


class Code(BaseModel):
    code: str


class UserCreated(BaseModel):
    email: str
    password: str


class CartProduct(BaseModel):
    name: str
    material: str
    images: list
    price: str
    code: str
    quantity: int


class Cart(BaseModel):
    products: List[CartProduct] = []


class GoogleUserDB(BaseModel):
    id: str
    email: str
    name: str
    picture: str
    refresh_token: str
    cart: Cart


class GoogleUser(BaseModel):
    email: str
    name: str
    picture: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UpdatedUser(BaseModel):
    email: str
    password: str | None = None
    name: str | None = None
