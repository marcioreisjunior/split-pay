from fastapi import FastAPI
import os
import psycopg2
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from routes.usuarios import router as rotas_usuarios
from routes.cartoes import router as rotas_cartoes
from routes.resumo_faturas import router as rotas_resumo_faturas

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O "*" significa: "Libere o acesso para qualquer frontend rodando no meu computador"
    allow_credentials=True,
    allow_methods=["*"],  # Libera todos os comandos: GET, POST, PUT, DELETE
    allow_headers=["*"],  # Libera todos os cabeçalhos
)

app.include_router(rotas_usuarios)
app.include_router(rotas_cartoes)
app.include_router(rotas_resumo_faturas)

@app.get("/")
def home():
    return {"Mensagem: site em construção"}
