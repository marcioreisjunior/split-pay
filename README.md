# split-pay
Sistema web para gestão, parcelamento e rateio de faturas de cartão de crédito.

# Gestão de Faturas e Rateio de Cartão:
Um sistema web completo desenvolvido para facilitar o parcelamento, a atribuição de valores e o rateio de despesas de cartão de crédito entre múltiplos perfis, garantindo a integridade matemática de cada fechamento mensal.

# O Problema que este projeto resolve:
A gestão financeira de cartões de crédito compartilhados gera confusão em faturas com muitas compras e compras parceladas. Este sistema auxilia na divisão justa das despesas, permitindo que cada usuário saiba exatamente qual é a sua fatia da fatura no mês de vencimento, eliminando planilhas manuais e erros de cálculo.

# Arquitetura e Regras de Negócio:
Para garantir a escalabilidade e a blindagem contra falhas lógicas, o projeto foi documentado com as principais práticas de Engenharia de Software antes da codificação:

### 1. Fluxo Principal (BPMN)
O diagrama abaixo mapeia o core business da aplicação: desde a inserção da compra, passando pelo motor de cálculo de parcelas, até a trava de segurança que impede o rateio incorreto.

<img width="838" height="663" alt="image" src="https://github.com/user-attachments/assets/c1c0ff7a-8684-4cec-9398-4d38cdb7f354" />


### 2. Modelagem do Banco de Dados (DER Físico)
O banco de dados foi rigorosamente normalizado. A separação entre Compra, Parcela e Fatura garante que não existam anomalias de atualização ou repetição de dados desnecessários.

<img width="1434" height="766" alt="image" src="https://github.com/user-attachments/assets/c324e48c-26e2-455e-aee3-0b93b0ebce77" />


# Tecnologias Utilizadas

### Back-end: Python com FastAPI
### Front-end: React
### Banco de Dados: PostgreSQL (com hospedagem em nuvem gratuita)

# Status do Projeto
Em desenvolvimento ágil. Você pode acompanhar o andamento das tarefas e os próximos passos diretamente no Quadro Kanban do projeto.
