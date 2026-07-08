from fastapi import APIRouter
import os
import psycopg2
from pydantic import BaseModel
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

load_dotenv()

router = APIRouter()

URL_DO_BANCO = os.getenv("DATABASE_URL")


class CriarCartao(BaseModel):
    nome: str
    fundo: str
    dia_corte: int
    dia_vcto: int
    id_usuario: int

@router.get("/cartoes")
def listar_cartao(id_usuario: int = None):
    try:
        conexao = psycopg2.connect(URL_DO_BANCO)
        cursor = conexao.cursor(cursor_factory=RealDictCursor)

        if(id_usuario is not None):
            comando_sql = "SELECT * FROM cartao WHERE id_usuario = %s;"
            valor = (id_usuario,)

            cursor.execute(comando_sql, valor)

        else:
            cursor.execute("SELECT * FROM cartao;")

        cartoes = cursor.fetchall()

        cursor.close()
        conexao.close()
        

        return cartoes
    except Exception as erro:
        return {"Erro ao buscar cartões, motivo: ": str(erro)}
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conexao' in locals(): conexao.close()
    
@router.post("/cartoes")
def criar_cartao(cartao: CriarCartao):
    try:
        conexao = psycopg2.connect(URL_DO_BANCO)
        cursor = conexao.cursor(cursor_factory=RealDictCursor)

        comando_sql = "INSERT INTO cartao(nome, fundo, dia_corte, dia_vcto, id_usuario) VALUES (%s, %s, %s, %s, %s) RETURNING *;"
        values = (cartao.nome, cartao.fundo, cartao.dia_corte, cartao.dia_vcto, cartao.id_usuario)

        cursor.execute(comando_sql, values)

        cartao_criado = cursor.fetchone()

        conexao.commit()
        cursor.close()
        conexao.close()
        
        return cartao_criado
    except Exception as erro:
        return {"Erro ao criar cartao: ": str(erro)}
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conexao' in locals(): conexao.close()
    



        
