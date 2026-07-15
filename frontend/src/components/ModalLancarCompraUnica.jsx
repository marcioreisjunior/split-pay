import React from "react";
import "../FaturaCompleta.css"

function modalLancarCompraUnica ({aoFechar, aoSalvar}) {
    const manipularEnvio = (e) => {
        e.preventDefault();
        const formCompraUnica = new FormData(e.target);
        const dadosCompraUnica = Object.fromEntries(formData)
        console.log(dadosCompraUnica)
        aoSalvar(dadosCompraUnica)
    };

    return (
        <div className=" modal-overlay">
            <div className="modal-conteudo">
                <h2>Nova Compra Unica</h2>
            </div>
        </div>
    )
}//fim da função

export  default modalLancarCompraUnica