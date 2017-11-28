"use strict";

class GeradorNumeroAleatorio {
	
	construct(){
		//
	}

	static gerar(min, max){
		return Math.floor(Math.random() * max) + min;
	}

}

module.exports = GeradorNumeroAleatorio;