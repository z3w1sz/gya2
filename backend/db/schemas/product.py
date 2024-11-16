from db.models.product import Product, ProductSimple
from typing import List


def transform_product(product) -> dict:
    return {
        "id": str(product["_id"]),
        "post_publication_date": product["post_publication_date"],
        "name": product["name"],
        "description": product["description"],
        "category": product["category"],
        "subcategory": product["subcategory"],
        "material": product["material"],
        "images": product["images"],
        "price": product["price"],
        "discount": product["discount"],
        "code": product["code"],
    }


def transform_products(products) -> List[Product]:
    product_list = []
    for product in products:
        product_list.append(Product(**transform_product(product)))

    return product_list


def transform_product_simple(product) -> dict:
    return {
        "name": product["name"],
        "material": product["material"],
        "images": product["images"],
        "price": product["price"],
        "code": product["code"],
        "category": product["category"],
    }


def transform_products_simple(products) -> List[ProductSimple]:
    product_list = []
    for product in products:
        product_list.append(ProductSimple(**transform_product_simple(product)))

    return product_list
