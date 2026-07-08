from fastapi import APIRouter
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

URL_DO_BANCO = os.getenv("DATABASE_URL")

class ResumoFatura(BaseModel):
    mes_referencia : str
    dia_vencimento: str
    valor_usuario_total: float
    valor_terceiro_total: float
    valor_total: float
    status: str



@router.get("/resumofatura")
def listar_resumo_faturas(usuario: int, cartao: int):
   try:
      conexao = psycopg2.connect(URL_DO_BANCO)
      cursor = conexao.cursor(cursor_factory=RealDictCursor)

      comando_sql =  """SELECT
              f.id, f.status,
          TO_CHAR(MAX(data_vcto), 'MM/YYYY') AS mes_referencia,
          TO_CHAR(MAX(data_vcto), 'DD') AS dia_vencimento,
          COALESCE(SUM(CASE WHEN a.id_perfil = %(id_usuario)s THEN valor_atribuido ELSE 0 END),0) as valor_usuario_total,
          COALESCE(SUM(CASE WHEN a.id_perfil != %(id_usuario)s THEN valor_atribuido ELSE 0 END),0) as valor_terceiro_total,
          COALESCE(SUM(valor_atribuido),0) AS valor_total
        FROM parcela p 
        INNER JOIN atribuicao a ON (p.id = a.id_parcela)
        RIGHT JOIN fatura f ON (f.id = p.id_fatura)
          WHERE id_cartao = %(id_cartao)s
        GROUP BY f.id, f.status
        ORDER BY MAX(data_vcto) """
      
      valor = { "id_usuario" : usuario, "id_cartao" : cartao }

      cursor.execute(comando_sql, valor)

      resumo = cursor.fetchall()
      
      lista_final =[]

      for cada_resumo in resumo:
          resumo_fatura = ResumoFatura(**cada_resumo)
          lista_final.append(resumo_fatura)

      cursor.close()
      conexao.close()

      return lista_final
   except Exception as erro:
      return "Erro ao buscar dados na API: ", str(erro)

       
      


