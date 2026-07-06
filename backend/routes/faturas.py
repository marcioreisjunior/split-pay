from fastapi import APIRouter, HTTPException
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import date

load_dotenv()

router = APIRouter()

URL_DO_BANCO = os.getenv("DATABASE_URL")

class CriarFatura(BaseModel):
    data_vcto: date
    valor_pago: float
    status: str
    id_cartao: int

@router.get("/faturas")
def listar_faturas(id_cartao: int = None, data_vcto: date = None):
    try:
        conexao = psycopg2.connect(URL_DO_BANCO)
        cursor = conexao.cursor(cursor_factory=RealDictCursor)

        if(id_cartao is not None and data_vcto is not None):
            comando_sql = "SELECT * FROM fatura WHERE id_cartao = %s AND data_vcto = %s;"
            valor = (id_cartao, data_vcto)
            cursor.execute(comando_sql, valor)

        elif(id_cartao is not None and data_vcto is None):
                comando_sql = "SELECT * FROM fatura WHERE id_cartao = %s;"
                valor = (id_cartao,)
                cursor.execute(comando_sql, valor)

        else:
            cursor.execute("SELECT * FROM fatura;")
            
        fatura = cursor.fetchall()

        cursor.close()
        conexao.close()

        return fatura
    except Exception as erro:
         return{" Erro ao buscar a fatura desejada, motivo: ": str(erro)}
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conexao' in locals(): conexao.close()

@router.post("/faturas")
def criar_fatura(fatura : CriarFatura):
     try:
        conexao = psycopg2.connect(URL_DO_BANCO)
        cursor = conexao.cursor(cursor_factory=RealDictCursor)

        comando_sql = "INSERT INTO fatura(data_vcto, valor_pago, status, id_cartao) VALUES (%s, %s, %s, %s) RETURNING *;"
        valor = (fatura.data_vcto, fatura.valor_pago, fatura.status, fatura.id_cartao)

        cursor.execute(comando_sql, valor)

        nova_fatura = cursor.fetchone()
        
        conexao.commit()        
        cursor.close()
        conexao.close()
        
        return dict(nova_fatura) if (nova_fatura) else {}
     except Exception as erro:
          raise HTTPException(status_code=500, detail=f"Erro ao criar fatura no banco: {str(erro)}")
     finally:
        if 'cursor' in locals(): cursor.close()
        if 'conexao' in locals(): conexao.close()
