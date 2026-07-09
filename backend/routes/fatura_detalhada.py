from fastapi import APIRouter, HTTPException
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

URL_DO_BANCO = os.getenv("DATABASE_URL")

class ListarCompras (BaseModel):
    id: int
    numero_parc: int
    descricao: str
    responsavel: str
    valor_parc: float
    valor_atribuido: float

@router.get("/faturadetalhada")
def listar_fatura_detalhada(fatura: int):
    try:
        conexao = psycopg2.connect(URL_DO_BANCO)
        cursor = conexao.cursor(cursor_factory=RealDictCursor)
        comando_sql =  """SELECT
                c.descricao, p.valor_parc, a.valor_atribuido, pe.nome AS responsavel, p.numero_parc, a.id
            FROM parcela p 
            INNER JOIN atribuicao a ON (p.id = a.id_parcela)
            INNER JOIN compra c ON (c.id = p.id_compra)
            INNER JOIN perfil pe ON (pe.id = a.id_perfil)
            WHERE p.id_fatura = %(id_fatura)s
            ORDER BY a.id"""
        
        valor = { "id_fatura" : fatura }

        cursor.execute(comando_sql, valor)
        fatura_detalhada = cursor.fetchall()

        lista_final =[]

        for item in fatura_detalhada:
            lista_final.append(ListarCompras(**item))

        return lista_final
    except Exception as erro:
        raise HTTPException(status_code=500, detail=str(erro))
    
    finally:
        if 'cursor' in locals() and cursor is not None:
            cursor.close()
        if 'conexao' in locals() and conexao is not None:
            conexao.close()
