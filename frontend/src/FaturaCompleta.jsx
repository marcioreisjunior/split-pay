import { useState, useEffect } from "react";
import "./FaturaCompleta.css";
import { use } from "react";

const urlBaseAPI = "http://localhost:8000";

function FaturaCompleta({ fatura, aoVoltar }) {
  const [compras, setCompras] = useState([]);
  const [detalheCompras, setDetalheCompras] = useState(null)
  useEffect(() => {
    const buscarCompras = async () => {
      try {
        const resposta = await fetch(
          `${urlBaseAPI}/faturadetalhada?fatura=${fatura.id}`,
        );
        if (resposta.ok) {
          const dadosDoBanco = await resposta.json();
          const comprasParaTela = dadosDoBanco.map((faturaAPI) => ({
            id: faturaAPI.id,
            numeroParc: faturaAPI.numero_parc,
            descricao: faturaAPI.descricao,
            responsavel: faturaAPI.responsavel,
            valorParc: faturaAPI.valor_parc,
            valorAtribuido: faturaAPI.valor_atribuido,
          }));

          setCompras(comprasParaTela);
        }
      } catch (erro) {
        console.error("Erro ao conectar com a API, motivo: ", erro);
      }
    };

    buscarCompras(fatura);
  }, []);

  const formatarMoeda = (valor) => {
    const numeroSeguro = Number(valor) || 0;
    return numeroSeguro.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const temCompras = compras.length > 0;

  return (
    <>
      <div className="fatura-conteiner">
        <div className="fatura-cabecalho">
          <div className="fatura-titulo">
            <button className="btn-voltar" onClick={aoVoltar}>
              ⬅ Voltar
            </button>
            <h2>Faturas de - {fatura.mes_referencia}</h2>
          </div>
          <button
            className="btn-deletar-fatura"
            disabled={temCompras}
            title={
              temCompras
                ? "Não é possível deletar faturas com compras registradas."
                : "Deletar Fatura"
            }
            onClick={() =>
              alert("Função de deletar no banco será chamada aqui!")
            }
          >
            🗑️ Excluir Fatura
          </button>
          <button
            className="btn-lancar-compra-unica"
            onClick={() => setModalUnicoAberto(true)}
          >
            Lançar Compra Unica
          </button>
          <button
            className="btn-lancar-compra-multipla"
            onClick={() => setModalMultiploAberto(true)}
          >
            Lançar Compras Multiplas
          </button>
        </div>

        <hr className="divisor"></hr>
        <div className="tabela-responsiva">
          <table className="tabela-fatura-completa">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Responsável</th>
                <th>Valor da Parcela</th>
                <th>Valor Atribuido</th>
              </tr>
            </thead>
            <tbody>
                {compras.map(compras => (
                    <tr
                    key={compras.id}
                    className="linha-fatura-completa"
                    onClick={() => setDetalheCompra(compras)}
                    >
                        <td className="fatura-descricao">{compras.descricao}</td>
                        <td className="fatura-responsavel">{compras.responsavel}</td>
                        <td className="fatura-valorParcela">{formatarMoeda(compras.valorParc)}</td>
                        <td className="fatura-valorAtribuido">{formatarMoeda(compras.valorAtribuido)}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
} //fim da função resumo faturas

export default FaturaCompleta;
