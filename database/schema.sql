CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE perfil (
    id SERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    cor VARCHAR(100) NOT NULL, 
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    id_usuario INTEGER,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE RESTRICT
);

CREATE TABLE autorizacao (
    id SERIAL PRIMARY KEY,

    tipo_autorizacao INTEGER NOT NULL,

    id_usuario INTEGER NOT NULL,
    id_perfil INTEGER NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_perfil) REFERENCES perfil(id) ON DELETE RESTRICT

);

CREATE TABLE cartao (
    id SERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    cor VARCHAR(100) NOT NULL,
    dia_corte INTEGER NOT NULL,
    dia_vcto INTEGER NOT NULL,

    id_usuario INTEGER NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,

    UNIQUE (id_usuario, nome)
);

CREATE TABLE fatura (
    id SERIAL PRIMARY KEY,

    data_vcto DATE NOT NULL,
    valor_pago DECIMAL(10,2),
    status VARCHAR(15),

    id_cartao INTEGER NOT NULL,

    FOREIGN KEY (id_cartao) REFERENCES cartao(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_fatura_unica_mes
    ON fatura (id_cartao,
               EXTRACT(month FROM data_vcto),
               EXTRACT(year FROM data_vcto)
    );

CREATE TABLE compra (
    id SERIAL PRIMARY KEY,
    valor_total DECIMAL(10,2) NOT NULL,
    descricao VARCHAR(100),
    data_compra DATE,
    quantidade_parc INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE parcela (
    id SERIAL PRIMARY KEY,
    numero_parc INTEGER NOT NULL,
    valor_parc DECIMAL(10,2) NOT NULL,

    id_compra INTEGER NOT NULL,
    id_fatura INTEGER NOT NULL,

    FOREIGN KEY (id_compra) REFERENCES compra(id) ON DELETE CASCADE,
    FOREIGN KEY (id_fatura) REFERENCES fatura(id) ON DELETE CASCADE
);

CREATE TABLE atribuicao (
    id SERIAL PRIMARY KEY,
    valor_atribuido DECIMAL(10,2) NOT NULL,

    id_perfil INTEGER NOT NULL,
    id_parcela INTEGER NOT NULL,

    FOREIGN KEY (id_perfil) REFERENCES perfil(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_parcela) REFERENCES parcela(id) ON DELETE RESTRICT
);
