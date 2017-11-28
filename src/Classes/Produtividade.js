"use strict";

class Produtividade {

	constructor(fase, produtividade){
		this.fase = fase
		this.produtividade = produtividade;
	}	

	getFase(){
		return this.fase;
	}

	getProdutividade(){
		return this.produtividade;
	}
}

module.exports = Produtividade;