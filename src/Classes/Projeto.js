"use strict";

/*
* Classe que guarda informações gerais do projeto
*
* Criador : Polegar
*/

class Projeto {

	constructor(){
		this.fases = [];
		this.funcionarios = [];
	}

	setFases(fases){
		this.fases = fases;
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
}

module.exports = Projeto;