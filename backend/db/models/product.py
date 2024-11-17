from pydantic import BaseModel, Field
from typing import List, Optional


class Product(BaseModel):
    id: Optional[str] = None
    post_publication_date: Optional[str] = None
    name: str
    description: str
    category: str
    subcategory: str
    material: str
    images: list
    price: str
    discount: str
    code: str


class ProductQuery(BaseModel):
    code: str = Field(..., min_length=1, max_length=12)


class Payer(BaseModel):
    first_name: str
    last_name: str
    email: str


class Item(BaseModel):
    id: str
    title: str
    description: str
    category_id: str
    quantity: int
    unit_price: float


class OrderData(BaseModel):
    payer: Payer
    items: list[Item]
    external_reference: str
    notification_url: str


class ProductSimple(BaseModel):
    name: str
    material: str
    images: list
    price: str
    code: str
    category: str


class UpdateCartItem(BaseModel):
    quantity: int


class Subcategory(BaseModel):
    name: str
    img: str


class Category(BaseModel):
    name: str
    subcategories: Optional[List[Subcategory]] = None


class UpdateCategory(BaseModel):
    name: str
    subcategories: List[Subcategory]
