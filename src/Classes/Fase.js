"use strict";

class Fase {

	constructor(nome, duracao){
		this.nome = nome;
		this.duracao = duracao;
	}	

	getNome(){
		return this.nome;
	}

	getDuracao(){
		return this.duracao;
	}
}

module.exports = Fase;