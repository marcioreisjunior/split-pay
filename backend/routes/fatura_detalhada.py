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
                    COALESCE(c.descricao, 'Sem descrição') AS descricao,
                    COALESCE(p.valor_parc, 0.0) AS valor_parc,
                    COALESCE(a.valor_atribuido, 0.0) AS valor_atribuido,
                    COALESCE(pe.nome, 'Não atribuído') AS responsavel,
                    COALESCE(p.numero_parc, 1) AS numero_parc,
                    COALESCE(a.id, 0) AS id
                FROM parcela p 
                LEFT JOIN compra c ON (c.id = p.id_compra)
                LEFT JOIN atribuicao a ON (p.id = a.id_parcela)
                LEFT JOIN perfil pe ON (pe.id = a.id_perfil)
                WHERE p.id_fatura = %(id_fatura)s
                ORDER BY p.id, a.id;"""
        
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
