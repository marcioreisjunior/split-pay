import React from "react";
import "../ResumoFaturas.css"

function ModalLancarFaturas({aoFechar, aoSalvar}) {
    const manipularEnvio = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dataVctoForm = formData.get('dataVcto');
        aoSalvar(dataVctoForm);
    };

    return (
        <div className="modal-overlay">
        <div className="modal-conteudo">
          <h2>Nova Fatura</h2>
          <form onSubmit={manipularEnvio}>
            <div className="input-group">
              <label>Data de Vencimento</label>
              <input
                type="date"
                 name="dataVcto"
                 required
              />

              <div className="modal-botoes">
                <button 
                    type="button"
                    className="btn-cancelar"
                    onClick={aoFechar}>
                    Cancelar
                </button>
                <button 
                    type="submit"
                    className="btn-lancar">
                    Lançar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
}
export default ModalLancarFaturas