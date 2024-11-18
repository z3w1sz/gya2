# Fastapi
from fastapi import APIRouter, HTTPException, status, Request, Query

# Models
from db.models.product import (
    Product,
    UpdateCartItem,
    Category,
    ProductSimple,
    OrderData,
    ProductQuery,
)
from db.models.user import CartProduct, Cart

# Schemas
from db.schemas.product import transform_products_simple

# Third party libraries
from datetime import datetime
from os import getenv
from typing import List
import mercadopago

# Helpers
from .jwt_tokens import get_refresh_token, decode_token

# MongoDB collections
from db.client import user_collection, categories_collection, products_collection

router = APIRouter(prefix="/products")


@router.post("/")
async def create_product(product: Product):
    product_dict = dict(product)
    if products_collection.find_one({"code": product_dict["code"]}) != None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            {"error": "El producto ya existe verifique las imagenes"},
        )
    del product_dict["id"]
    post_publication_date = datetime.now().strftime("%d-%m-%Y")
    product_dict["post_publication_date"] = post_publication_date
    products_collection.insert_one(product_dict)


@router.get("/simple")
async def get_search_products(page: int = 1, limit: int = 20) -> List[ProductSimple]:
    """
    Obtiene una lista de productos simples paginados, ordenados por los más recientes.
    """
    # Obtener todos los productos
    products = list(products_collection.find())

    # Ordenar todos los productos por fecha de publicación
    sorted_products = sorted(
        products,
        key=lambda x: datetime.strptime(x["post_publication_date"], "%d-%m-%Y"),
        reverse=True,
    )

    # Aplicar la paginación después de ordenar
    offset = (page - 1) * limit
    paginated_products = sorted_products[offset : offset + limit]

    return transform_products_simple(paginated_products)


@router.get("/store")
async def get_store_products(page: int = Query(1, ge=1)):
    """
    Obtiene productos paginados para la tienda, ordenados por los más recientes.
    """
    limit_per_page = 21
    init = (page - 1) * limit_per_page

    # Obtener todos los productos
    products = list(products_collection.find())

    # Ordenar todos los productos por fecha de publicación
    sorted_products = sorted(
        products,
        key=lambda x: datetime.strptime(x["post_publication_date"], "%d-%m-%Y"),
        reverse=True,
    )

    # Aplicar la paginación después de ordenar
    paginated_products = sorted_products[init : init + limit_per_page]

    # Contar el total de productos en la colección
    total_products = len(sorted_products)

    # Verificar si hay productos en la página solicitada
    if not paginated_products and init >= total_products:
        raise HTTPException(status_code=404, detail="Página no encontrada")

    return {
        "products": transform_products_simple(
            paginated_products
        ),  # Asegúrate de que esta función retorne los productos en el formato correcto
        "total": total_products,  # Retornar el total de productos
        "page": page,
        "limit": limit_per_page,
    }


@router.get("/")
async def get_products_home() -> List[ProductSimple]:
    """
    Obtiene los 3 productos más recientes para mostrar en la página principal.
    """
    # Obtener todos los productos
    products = list(products_collection.find())

    # Ordenar todos los productos por fecha de publicación
    sorted_products = sorted(
        products,
        key=lambda x: datetime.strptime(x["post_publication_date"], "%d-%m-%Y"),
        reverse=True,
    )

    # Obtener los 3 más recientes
    newest_products = sorted_products[:3]

    return transform_products_simple(newest_products)


@router.get("/store/{subcategory}")
async def get_products_for_subcategory(subcategory: str, page: int = Query(1, ge=1)):
    limit_per_page = 21
    init = (page - 1) * limit_per_page

    # Obtener productos paginados desde MongoDB
    products_cursor = (
        products_collection.find({"subcategory": subcategory})
        .skip(init)
        .limit(limit_per_page)
    )
    products = list(products_cursor)  # Convertir a lista

    # Contar el total de productos en la colección
    total_products = products_collection.count_documents({})

    # Verificar si hay productos en la página solicitada
    if not products and init >= total_products:
        raise HTTPException(status_code=404, detail="Página no encontrada")

    return {
        "products": transform_products_simple(
            products
        ),  # Asegúrate de que esta función retorne los productos en el formato correcto
        "total": total_products,  # Retornar el total de productos
        "page": page,
        "limit": limit_per_page,
    }


@router.get("/detail/{code}")
async def get_product_detail(code: str) -> Product:
    try:
        validated_query = ProductQuery(code=code)  # Validación automática
        product = products_collection.find_one({"code": validated_query.code})
        if not product:
            raise HTTPException(404, "Producto no encontrado")
        return Product(**product)
    except:
        raise HTTPException(400, "Código de producto inválido")


@router.delete("/{code}")
async def delete_product(code: str):
    product = products_collection.delete_one({"code": code})
    if product is None:
        raise HTTPException(404, "Product not found")
    return {"status": "success"}


# Cart section
@router.put("/cart")
async def update_cart(request: Request, cartProduct: CartProduct):
    refresh_token: str = get_refresh_token(request=request)
    refresh_token_decoded = decode_token(
        refresh_token, secret=getenv("REFRESH_TOKEN_SECRET")
    )
    user = user_collection.find_one({"email": refresh_token_decoded["sub"]})

    if user is None:
        raise HTTPException(400, "Bad refresh token")

    # Asegurarse de que el carrito esté inicializado
    if "cart" not in user or user["cart"] is None:
        # Inicializar el carrito como un objeto con una lista vacía
        user["cart"] = {"products": []}

    # Verificar si el producto ya existe en el carrito
    existing_product = next(
        (
            product
            for product in user["cart"]["products"]
            if product["code"] == cartProduct.code
        ),
        None,
    )

    if existing_product:
        # Si el producto ya está en el carrito, actualizamos solo la cantidad
        updated_user = user_collection.find_one_and_update(
            {"email": user["email"], "cart.products.code": cartProduct.code},
            {"$inc": {"cart.products.$.quantity": cartProduct.quantity}},
            return_document=True,
        )
    else:
        # Si el producto no está en el carrito, lo agregamos
        updated_user = user_collection.find_one_and_update(
            {"email": user["email"]},
            {"$push": {"cart.products": cartProduct.dict()}},
            return_document=True,
        )

    if updated_user:
        updated_user["_id"] = str(updated_user["_id"])  # Convertir ObjectId a string
        return {"status": "success", "data": updated_user}
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/cart")
async def get_cart_products(request: Request):
    refresh_token: str = get_refresh_token(request=request)
    refresh_token_decoded = decode_token(
        refresh_token, secret=getenv("REFRESH_TOKEN_SECRET")
    )
    user = user_collection.find_one({"email": refresh_token_decoded["sub"]})

    if user is None:
        raise HTTPException(400, "Bad refresh token")

    user_dict = dict(user)

    cart = user_collection.find_one({"cart": user_dict["cart"]})

    if cart is None:
        raise HTTPException(404, "Cart not found")

    dict_cart = dict(cart)["cart"]

    return Cart(**dict_cart)


@router.delete("/cart/{code}")
async def delete_cart_product(code: str, request: Request):
    refresh_token: str = get_refresh_token(request=request)
    refresh_token_decoded = decode_token(
        refresh_token, secret=getenv("REFRESH_TOKEN_SECRET")
    )
    user = user_collection.find_one({"email": refresh_token_decoded["sub"]})

    if user is None:
        raise HTTPException(400, "Bad refresh token")

    updated_products = [
        product for product in user["cart"]["products"] if product["code"] != code
    ]

    result = user_collection.update_one(
        {"email": user["email"]}, {"$set": {"cart.products": updated_products}}
    )

    if result.modified_count == 0:
        raise HTTPException(
            500, "Error al actualizar el carrito o producto no encontrado"
        )

    return {"message": "Producto eliminado del carrito"}


@router.put("/cart/{product_code}")
async def update_cart_quantity(
    product_code: str, item: UpdateCartItem, request: Request
):
    refresh_token: str = get_refresh_token(request=request)
    refresh_token_decoded = decode_token(
        refresh_token, secret=getenv("REFRESH_TOKEN_SECRET")
    )
    user = user_collection.find_one({"email": refresh_token_decoded["sub"]})

    if user is None:
        raise HTTPException(400, "Bad refresh token")

    # Encuentra el producto en el carrito
    product_to_update = next(
        (p for p in user["cart"]["products"] if p["code"] == product_code), None
    )

    if not product_to_update:
        raise HTTPException(404, "Product not found in cart")

    # Actualiza la cantidad del producto
    new_quantity = item.quantity
    if new_quantity <= 0:
        raise HTTPException(400, "Quantity must be greater than 0")

    # Actualiza la cantidad en el carrito
    user_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {f"cart.products.$[elem].quantity": new_quantity}},
        array_filters=[{"elem.code": product_code}],
    )

    return {"message": "Product quantity updated successfully"}


@router.get("/cart/number/of/products")
async def get_cart_products_number(request: Request):
    refresh_token: str = get_refresh_token(request=request)
    refresh_token_decoded = decode_token(
        refresh_token, secret=getenv("REFRESH_TOKEN_SECRET")
    )
    user = user_collection.find_one({"email": refresh_token_decoded["sub"]})

    if user is None:
        raise HTTPException(400, "Bad refresh token")

    user_dict = dict(user)

    # Usar len() para obtener el número de productos
    if "cart" in user_dict and "products" in user_dict["cart"]:
        return {"number": len(user_dict["cart"]["products"])}
    else:
        raise HTTPException(400, "Cart or products not found")


# Categories
@router.get("/categories")
async def get_categories() -> List[Category]:
    categories = []
    for category in list(categories_collection.find()):
        del category["_id"]
        categories.append(category)

    return categories


@router.get("/category/{category}")
async def get_category(category: str) -> Category:
    category_clean = category.replace("%20", " ")

    category_db = categories_collection.find_one({"name": category_clean})

    if category_db is None:
        raise HTTPException(404, "Category not found")

    category_dict = dict(category_db)

    del category_dict["_id"]

    return Category(**category_dict)


@router.get("/store/category/{category}")
async def get_category(category: str) -> List[Product]:
    products = list(products_collection.find({"category": category}))
    products_list = []
    for product in products:
        del product["_id"]
        products_list.append(product)
    return products_list


sdk = mercadopago.SDK(getenv("MERCADO_PAGO_ACCESS_TOKEN"))


@router.post("/create_preference")
def create_preference(order_data: OrderData):
    try:
        # Crea la preferencia de pago
        preference_data = {
            "payer": {
                "name": order_data.payer.first_name,
                "surname": order_data.payer.last_name,
                "email": order_data.payer.email,
            },
            "items": [
                {
                    "id": item.id,
                    "title": item.title,
                    "description": item.description,
                    "category_id": item.category_id,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                }
                for item in order_data.items
            ],
            "external_reference": order_data.external_reference,
            "notification_url": order_data.notification_url,
        }
        preference_response = sdk.preference().create(preference_data)
        return {"preference_id": preference_response["response"]["id"]}
    except:
        raise HTTPException(
            status_code=500, detail="Error al crear la preferencia de pago"
        )
