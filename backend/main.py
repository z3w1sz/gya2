from fastapi import FastAPI, HTTPException
from routers import user, products
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uvicorn import Config, Server

app = FastAPI()

app.include_router(router=user.router)
app.include_router(router=products.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://gya2.vercel.app"],  # Cambia a la URL de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    config = Config(app=app, host="0.0.0.0", port=5000)
    server = Server(config)
    server.run()
