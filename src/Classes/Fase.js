"use strict";

class Fase {

	constructor(nome, duracao){
		this.nome = nome;
		this.duracao = duracao;
	}	

	getNome(){
		return this.nome;
	}
}

module.exports = Fase;