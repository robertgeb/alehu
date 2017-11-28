"use strict";

class HorasTrabalhadas {

	constructor(fase, horasTrabalhadas){
		this.fase = fase
		this.horasTrabalhadas = horasTrabalhadas;
	}	

	getFase(){
		return this.fase;
	}

	getHorasTrabalhadas(){
		return this.horasTrabalhadas;
	}
}

module.exports = HorasTrabalhadas;