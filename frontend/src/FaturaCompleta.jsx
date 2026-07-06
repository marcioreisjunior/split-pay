import {useState, useEffect} from "react";
import './FaturaCompleta.css'
import { use } from "react";

const urlBaseAPI = "http://localhost:8000"

function FaturaCompleta(fatura, aoVoltar){
    const[compras, setCompras] = useState([])
    useEffect(() =>{
        const buscarCompras = async() => {
            try {
                const resposta = await fetch(`${urlBaseAPI}/fatura?${fatura.id}/compras`)
                if (resposta.ok){
                    const dadosDoBanco = await resposta.json()
                    const comprasParaTela = dadosDoBanco.map()
                }
            }
        }
    })
}