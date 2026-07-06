from fastapi import APIRouter
from pydantic import BaseModel
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
URL_DO_BANCO = os.getenv("DATABASE_URL")

class NovoUsuario(BaseModel):
    nome: str
    email: str
    senha: str

@router.get("/usuarios")
def listar_usuarios():
    try:
        conexao = psycopg2.connect(URL_DO_BANCO)
        cursor = conexao.cursor(cursor_factory=RealDictCursor)

        cursor.execute("SELECT * FROM usuario;")
        usuarios = cursor.fetchall()

        cursor.close()
        conexao.close()
        
        return usuarios
    except Exception as erro:
        return {"Erro, falha ao buscar os usuários, erro: ": str(erro)}
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conexao' in locals(): conexao.close()
    
@router.post("/usuarios")
def criar_usuarios(usuario : NovoUsuario):
    try:
        conexao = psycopg2.connect(URL_DO_BANCO)
        cursor = conexao.cursor(cursor_factory=RealDictCursor)

        comando_Sql = "INSERT INTO usuario (nome, email, senha) VALUES (%s, %s,%s) RETURNING *;"
        valores = (usuario.nome, usuario.email, usuario.senha)

        cursor.execute(comando_Sql, valores)
        usuario_criado = cursor.fetchone()

        conexao.commit()
        cursor.close()
        conexao.close()
        

        return {"Usuário criado com sucesso, usuario:  ": usuario_criado   }
    except Exception as erro:
        return{"Erro ao criar usuario, motivo: ": str(erro)}
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conexao' in locals(): conexao.close()
