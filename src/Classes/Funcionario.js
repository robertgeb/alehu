"use strict";

class Funcionario {

	constructor(nome, produtividades,disponibilidadeHoras,custoHora,horasTrabalhadas){
		this.nome = nome;
		this.produtividades = produtividades;				//array de unidades de produtividade que o funcionário desenvolve (indexado pela área de conhecimento)
		this.disponibilidadeHoras = disponibilidadeHoras;	
		this.custoHora = custoHora;	
		this.horasTrabalhadas = horasTrabalhadas;	
	}	

	getNome(){
		return this.nome;
	}

	getProdutividades(){
		return this.produtividades;
	}

	getDisponibilidadeHoras(){
		return this.disponibilidadeHoras;
	}

	getCustoHora(){
		return this.custoHora;
	}

	getHorasTrabalhadas(){
		return this.horasTrabalhadas;
	}

	setHorasTrabalhadas(horasTrabalhadas){
		this.horasTrabalhadas = horasTrabalhadas;
	}

	toString(){
		return JSON.stringify(this);
	}
}

module.exports = Funcionario;