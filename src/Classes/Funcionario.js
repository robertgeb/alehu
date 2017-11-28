"use strict";

class Funcionario {

	constructor(){
		this.nome = "";
		this.disponibilidadeHoras = 0;	
		this.custoHora = 0.00;
		this.mapaProdutividade = null;				//array de unidades de produtividade que o funcionário desenvolve (indexado pela área de conhecimento)
		this.mapaHorasTrabalhadas = null;	
	}	

	getNome(){
		return this.nome;
	}

	getMapaProdutividades(){
		return this.produtividades;
	}

	getDisponibilidadeHoras(){
		return this.disponibilidadeHoras;
	}

	getCustoHora(){
		return this.custoHora;
	}

	getMapaHorasTrabalhadas(){
		return this.mapaHorasTrabalhadas;
	}

	setNome(nome){
		this.nome = nome;
	}

	setMapaProdutividade(mapaProd){
		this.mapaProdutividade = mapaProd;
	}

	setDisponibilidadeHoras(disp){
		this.disponibilidadeHoras = disp;
	}

	setCustoHora(custo){
		this.custoHora = custo;
	}

	setMapaHorasTrabalhadas(horasTrabalhadas){
		this.mapaHorasTrabalhadas = horasTrabalhadas;
	}

	toString(){
		return JSON.stringify(this);
	}
}

module.exports = Funcionario;