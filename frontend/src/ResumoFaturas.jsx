import React, {useState, useEffect} from "react";
import './ResumoFaturas.css'
import ModalLancarFaturas from "./components/modalLancarFatura.jsx";


const usuario = 1
function statusFatura(dataFatura){
  const hojeTexto = new Date().toLocaleDateString("en-CA");
  if (dataFatura > hojeTexto) {
    return "Aberta"
  } else return "Atrasada"

}
const urlBaseAPI = "http://localhost:8000"

function ResumoFaturas({ cartao, aoVoltar }) {
  const [modalAberto, setModalAberto] = useState(false) 
  const [faturas, setFaturas] = useState([])
  useEffect(() => {
    const buscarFatura = async () =>{
      try {
        const resposta = await fetch(`${urlBaseAPI}/resumofatura?usuario=${usuario}&cartao=${cartao.id}`);
        if (resposta.ok) {
          const dadosDoBanco = await resposta.json()

          const faturaParaTela = dadosDoBanco.map(faturaAPI => ({
            
              id: faturaAPI.id,
              mes_referencia:  faturaAPI.mes_referencia,
              dia_vencimento:  faturaAPI.dia_vencimento,
              valor_usuario: faturaAPI.valor_usuario_total,
              valor_terceiros: faturaAPI.valor_terceiro_total,
              valor_total:faturaAPI.valor_total,
              status: faturaAPI.status
            }));

            setFaturas(faturaParaTela);
        }
      } catch(erro) {
        console.error("Erro ao conectar com a API Python:", erro);
      }
    };
  
    buscarFatura(cartao);

  }, [])

  const formatarMoeda = (valor) => {
    const numeroSeguro = Number(valor) || 0;
    return numeroSeguro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const lancarFatura = async (dataVctoForm) => {
    console.log(cartao)
    const novaFatura = {
      id: Number(Date.now()),
      data_vcto: dataVctoForm,
      valor_pago: 0,
      status: statusFatura(dataVctoForm),
      id_cartao: cartao.id
    };
    try {
      const resposta = await fetch(`${urlBaseAPI}/faturas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify(novaFatura)
      })
      if (resposta.ok) {
        const faturaCriadaNoBanco = await resposta.json();

        const dataVctoSegura = String(faturaCriadaNoBanco.data_vcto || dataVctoForm);

        const [ano, mes, dia] = dataVctoSegura.split('-');

        const faturaPronta = {
          id:faturaCriadaNoBanco.id,
          mes_referencia: (mes && ano) ? `${mes}/${ano}` : dataVctoSegura,
          dia_vencimento: (dia) ? `${dia}` : dataVctoSegura,
          valor_usuario: 0.00,
          valor_terceiros: 0.00,
          valor_total:0.00,
          status: faturaCriadaNoBanco.status || "aberta",
          idCartao: faturaCriadaNoBanco.id_cartao
        }
        setFaturas ([...faturas, faturaPronta])
        setModalAberto(false)
      }
    }catch (erro) {
      console.error("Erro ao enviar a fatura para a API", erro);
    }
    }

  // Trava de segurança para o botão de deletar que planejamos
  const temFaturas = faturas.length > 0;

  return (
    <>
    <div className="resumo-container">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="resumo-cabecalho">
        <div className="info-titulo">
          <button className="btn-voltar" onClick={aoVoltar}>
            ⬅ Voltar
          </button>
          <h2>Faturas - {cartao.nome}</h2>
        </div>

        {/* A LIXEIRA INTELIGENTE QUE PLANEJAMOS */}
        <button 
          className="btn-deletar-cartao"
          disabled={temFaturas}
          title={temFaturas ? "Não é possível deletar cartões com faturas registradas." : "Deletar cartão"}
          onClick={() => alert("Função de deletar no banco será chamada aqui!")}
        >
          🗑️ Excluir Cartão
        </button>
        <button
            className="btn-lancar-fatura"
            onClick={() => setModalAberto(true)}
            >Lançar Fatura
            </button>
        
      </div>

      <hr className="divisor" />

      {/* TABELA DE RESUMO */}
      <div className="tabela-responsiva">
        <table className="tabela-faturas">
          <thead>
            <tr>
              <th>Mês Ref.</th>
              <th>Vencimento</th>
              <th>Meu Gasto</th>
              <th>Terceiros (Split)</th>
              <th>Valor Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {faturas.map((fatura) => (
              <tr 
              key={fatura.id}
              className={`linha-fatura status-${fatura.status.toLowerCase()}`}
              onClick={() => AbrirDetalhesFatura(fatura)}
              >
                <td className="destaque-mes">{fatura.mes_referencia}</td>
                <td>{fatura.dia_vencimento}</td>
                <td className="valor-usuario">{formatarMoeda(fatura.valor_usuario)}</td>
                <td className="valor-terceiro">{formatarMoeda(fatura.valor_terceiros)}</td>
                <td className="valor-total">{formatarMoeda(fatura.valor_total)}</td>
                <td className="coluna-status">
                    <strong>{fatura.status}</strong>
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
    {modalAberto && (
        <ModalLancarFaturas
          aoFechar={() => setModalAberto(false)} 
          aoSalvar={lancarFatura} 
        />
      )}
  </>
  );
}

export default ResumoFaturas;