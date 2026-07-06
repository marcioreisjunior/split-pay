import { useState, useEffect } from 'react'
import './App.css'
import ResumoFaturas from './ResumoFaturas.jsx'



const cartaoImagem = {
  Nubank: "/cartoes/NubankImg.png",
  Bb: "/cartoes/BbImg.png",
  Magalu: "/cartoes/MagaluImg.png",
  Sams: "/cartoes/SamsImg.png",
  Amazon: "/cartoes/AmazonImg.png",
  Itau: "/cartoes/ItauImg.png",
  Santander: "/cartoes/SantanderImg.png",
  Porto: "/cartoes/PortoImg.png"
}

function App() {
  const [meusCartoes, setMeusCartoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false)
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);

  const idUsuarioLogado = 1;
  const urlBaseAPI = "http://localhost:8000";

  useEffect(() => {
    const buscarCartao = async () => {
      try {
        const resposta = await fetch(`${urlBaseAPI}/cartoes?id_usuario=${idUsuarioLogado}`);
        if (resposta.ok) {
          const dadosDoBanco = await resposta.json();

          const cartoesParaTela = dadosDoBanco.map(cartaoAPI => ({
            id: cartaoAPI.id,
            nome: cartaoAPI.nome,
            fundo: cartaoAPI.fundo,
            diaCorte: cartaoAPI.dia_corte,
            diaVcto: cartaoAPI.dia_vcto,
            idUsuario: cartaoAPI.id_usuario
          }));

          setMeusCartoes(cartoesParaTela);
        }
      } catch (erro) {
        console.error("Erro ao conectar com a API Python:", erro);
      }
    };
    buscarCartao();
  }, []);

  const adicionarCartao = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const novoCartaoPayload = {
      nome: formData.get('nome'),
      fundo: formData.get('fundo'),
      dia_corte: Number(formData.get('diaCorte')),
      dia_vcto: Number(formData.get('diaVcto')),
      id_usuario: idUsuarioLogado

    };

    try {
      const resposta = await fetch(`${urlBaseAPI}/cartoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify(novoCartaoPayload)
      });

      if (resposta.ok) {
        const cartaoCriadoNoBanco = await resposta.json();

        // Agora nós temos o ID definitivo gerado pelo PostgreSQL!
        const cartaoPronto = {
          id: cartaoCriadoNoBanco.id,
          nome: cartaoCriadoNoBanco.nome,
          fundo: cartaoCriadoNoBanco.fundo,
          diaCorte: cartaoCriadoNoBanco.dia_corte,
          diaVcto: cartaoCriadoNoBanco.dia_vcto,
          idUsuario: cartaoCriadoNoBanco.id_usuario
        };

        // Atualiza a tela sem precisar recarregar a página
        setMeusCartoes([...meusCartoes, cartaoPronto]);
        setModalAberto(false)
      }
    } catch (erro) {
      console.error("Erro ao enviar cartão para a API:", erro);
    }
  };
  return (
    <>
      {cartaoSelecionado ? (

        <ResumoFaturas
          cartao={cartaoSelecionado}
          aoVoltar={() => setCartaoSelecionado(null)}
        />

      ) : (
        <>
          <div className='App-header'
            style={{ marginBottom: "70px" }}>
            <h1>Meus Cartões</h1>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "90%"
          }}>
            <button className="btn-adicionar" onClick={() => setModalAberto(true)} >
              + Adicionar cartão
            </button>
          </div>
          <hr style={{
            width: '80%',
            border: '1px solid #ccc'

          }}></hr>

          <div className="app-container">
            {meusCartoes.map((card) => (
              <div
                key={card.id} className="cartao-card"
                style={{
                  backgroundImage: `url(${cartaoImagem[card.fundo]})`,
                  cursor: 'pointer'
                }}
                onClick={() => setCartaoSelecionado(card)}
              >
              </div>
            ))}
          </div>
        </>
      )}

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h2>Novo Cartão</h2>

            {/* O SEU FORMULÁRIO ENTRA EXATAMENTE AQUI */}
            <form onSubmit={adicionarCartao}>
              <div className="input-group">
                <label>Nome do Cartão (Ex: Meu Nubank):</label>
                <input
                  type="text"
                  name="nome"
                  required
                  placeholder="Digite um nome..."
                />
              </div>

              <div className="input-group">
                <label>Dia de corte:</label>
                <input
                  type="number"
                  name="diaCorte"
                  required
                  min="1"
                  max="31"
                  placeholder="Ex: 2"
                />
              </div>

              <div className="input-group">
                <label>Dia do Vencimento:</label>
                <input
                  type="number"
                  name="diaVcto"
                  required
                  min="1"
                  max="31"
                  placeholder="Ex: 15"
                />
              </div>

              <div className="input-group">
                <label>Escolha o Banco / Fundo:</label>
                <select name="fundo" defaultValue="Nubank">
                  <option value="Nubank">Nubank</option>
                  <option value="Bb">Banco do Brasil</option>
                  <option value="Magalu">Magalu</option>
                  <option value="Sams">Sam's Club</option>
                  <option value="Amazon">Amazon Prime</option>
                  <option value="Itau">Itaú</option>
                  <option value="Santander">Santander</option>
                  <option value="Porto">Porto Seguro</option>
                </select>
              </div>

              {/* Botões para fechar ou enviar */}
              <div className="modal-botoes">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  Adicionar Cartão
                </button>
              </div>
            </form>
            {/* FIM DO FORMULÁRIO */}

          </div>
        </div>
      )}


    </>
  )
}

export default App
