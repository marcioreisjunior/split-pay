import { useState, useEffect } from "react";
import "./FaturaCompleta.css";
import { use } from "react";
import ModalLancarFaturas from "./components/modalLancarFatura";
import ModalLancarCompraUnica from "./components/ModalLancarCompraUnica";

const urlBaseAPI = "http://localhost:8000";



function FaturaCompleta({ fatura, aoVoltar }) {
  const [compras, setCompras] = useState([]);
  const [detalheCompras, setDetalheCompras] = useState(null)
  const [modalUnicoAberto, setModalUnicoAberto] = useState(false);
  const [modalMultiploAberto, setModalMultiploAberto] = useState(false);
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

  const lancarCompraUnica = async (compraUnicaForm) => {
    const novaCompra = {
      idFatura: fatura.id,
      valorTotal: Number(compraUnicaForm.valorTotal),
      descricao: compraUnicaForm.descricao,
      data: compraUnicaForm.data,
      quantidadeParcela: Number(compraUnicaForm.quantidadeParcela),
      valorParc: Number(compraUnicaForm.valorParc),

    };//fim da novaCompra
    try{
      const resposta = await fetch(`urlBaseAPI/faturadetalhada`, {
        method: 'POST',
        Headers: {
          'content-type': 'application/json'},
        body: JSON.stringify(novaCompra)
      })
      if (resposta.ok) {
        const compraCriadaNoBanco = await resposta.json();

        const compraUnicaPronta = {
          ...compraCriadaNoBanco,
          valorParc: compraCriadaNoBanco.valor_parc,
          numeroParc: compraCriadaNoBanco.numero_parc,
          valorAtribuido: compraCriadaNoBanco.valor_atribuido
        };
        setCompras([...compras, compraUnicaPronta])
        setModalUnicoAberto(false)
      }
    } catch (erro) { //Fim try
      console.error("Erro ao enviar a fatura na API: ", erro)
    }
}//fim da função lancar compra unica

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
                        <td className="fatura-descricao">{`${compras.descricao} (${compras.numeroParc})`}</td>
                        <td className="fatura-responsavel">{compras.responsavel}</td>
                        <td className="fatura-valorParcela">{formatarMoeda(compras.valorParc)}</td>
                        <td className="fatura-valorAtribuido">{formatarMoeda(compras.valorAtribuido)}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    {modalUnicoAberto && (
      <ModalLancarCompraUnica
      aoFechar={() => setModalUnicoAberto(false)}
      aoSalvar={lancarCompraUnica}
      />)}
    </>
  );
} //fim da função Fatura faturas




export default FaturaCompleta;
