"use strict";

/*
* Classe que guarda informações gerais do projeto
*
* Criador : Polegar
*/
import GeradorNumeroAleatorio from './GeradorNumeroAleatorio.js';

class Projeto {

	constructor(){
		this.fases = [];
		this.funcionarios = [];
		this.orcamento_limite = 0;
	}

	setFases(fases){
		this.fases = fases;
	}

	setOrcamentoLimite(limite){
		this.orcamento_limite = limite; 
	}

	getOrcamentoLimite(){
		return this.orcamento_limite;
	}

	getFases(){
		return this.fases;
	}

	setFuncionarios(func){
		this.funcionarios = func;
	}

	getFuncionarios(){
		return this.funcionarios;
	}

	getHoraAleatoriaFase(fase){
		if(this.functionarios.length == 0)
			return null;

		let horasFase = [];

		horasFase = this.functionarios.map( (funcionario) => {
			return functionario.getHoraFase(fase);
		});

		let numAleatorio = GeradorNumeroAleatorio.gerar(0, horasFase.length-1);

		return horasFase[numAleatorio];
	}

	printHorasTrabalhadas(){
		let tabela = "------------------ Horas Trabalhadas ---------------------\n";
		
		for(let funcionario in this.funcionarios){
			tabela += "|".concat(this.funcionarios[funcionario].getNome());
		}

		tabela.concat("\n");

		
		console.log(tabela);
	}

	getOrcamento(){

		let orcamento = this.funcionarios.reduce( (total, func) => {
							return total + func.getCusto();
						}, 0);
		
		return orcamento;

	}

	orcamentoDentroDoLimite(){
		return this.orcamento_limite >= this.getOrcamento();
	}
}

module.exports = Projeto;