INSERT INTO usuario (nome, email,senha)
VALUES (
    'Marcio Reis',
    'marcinhoreisjr@gmail.com',
    'Senha123'
);

INSERT INTO perfil (nome, cor, ativo, id_usuario)
VALUES 
(
    'Marcinho',
    'azul',
    TRUE,
    1
),
(
    'Mirelly',
    'vermelho',
    TRUE,
    1
),
(
    'Vitória',
    'rosa',
    FALSE,
    1
);

INSERT INTO autorizacao (tipo_autorizacao, id_usuario, id_perfil)
VALUES(
    1,
    1,
    1
);

INSERT INTO cartao (nome, cor, dia_corte, dia_vcto, id_usuario)
VALUES(
    'Nubank',
    'roxo',
    '5',
    '12',
    1

);
                                                           
INSERT INTO fatura (data_vcto, valor_pago, id_cartao)
VALUES(
    '2026-06-12',
    0.0,
    1
);

INSERT INTO compra (valor_total, descricao, data_compra, quantidade_parc)
VALUES
(
    50,
    'farmacia',
    '2026-06-01',
    2
),
(
    60,
    NULL,
    NULL,
    DEFAULT
);

INSERT INTO parcela (numero_parc, valor_parc, id_compra, id_fatura)
VALUES(
    1,
    25,
    1,
    1
),
(
    2,
    25,
    1,
    1
),
(
    1,
    60,
    2,
    1
);

INSERT INTO atribuicao (valor_atribuido, id_perfil, id_parcela)
VALUES
(
    25,
    1,
    1
),
(
    25,
    2,
    2
),
(
    60,
    1,
    3
);