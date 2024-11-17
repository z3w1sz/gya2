from fastapi import FastAPI, HTTPException
from routers import user, products
from fastapi.middleware.cors import CORSMiddleware
import mercadopago
from pydantic import BaseModel
from uvicorn import Config, Server

app = FastAPI()

app.include_router(router=user.router)
app.include_router(router=products.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Cambia a la URL de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sdk = mercadopago.SDK(
    "APP_USR-3611394123389137-101718-c6696376f98aab16d5de134d2dc3207d-2030239191"
)


# Modelo de datos para la preferencia
class Item(BaseModel):
    title: str
    unit_price: float
    quantity: int


class PreferenceRequest(BaseModel):
    items: list[Item]


@app.post("/api/create_preference")
async def create_preference(preference_request: PreferenceRequest):
    print(preference_request)
    preference_data = {
        "items": [dict(item) for item in preference_request.items],
        "back_urls": {
            "success": "http://localhost:3000/success",
            "failure": "http://localhost:3000/failure",
            "pending": "http://localhost:3000/pending",
        },
        "auto_return": "approved",
    }

    try:
        preference_response = sdk.preference().create(preference_data)
        print(preference_response)
        return preference_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    config = Config(app=app, host="0.0.0.0", port=5000)
    server = Server(config)
    server.run()
