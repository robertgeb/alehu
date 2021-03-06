"use strict";

import MapaProdutividade from './MapaProdutividade.js';
import MapaHorasTrabalhadas from './MapaHorasTrabalhadas.js';
class Funcionario {

	constructor(){
		this.nome = "";
		this.custoHora = 0.00;
		this.mapaProdutividade = null;	//array de unidades de produtividade que o funcionário desenvolve (indexado pela área de conhecimento)
		this.mapaHorasTrabalhadas = null;	
	}	

	getNome(){
		return this.nome;
	}

	getMapaProdutividades(){
		return this.mapaProdutividade;
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

	setCustoHora(custo){
		this.custoHora = custo;
	}

	setMapaHorasTrabalhadas(horasTrabalhadas){
		this.mapaHorasTrabalhadas = horasTrabalhadas;
	}

	setHorasTrabalhadasFase(fase, hora){
		this.getMapaHorasTrabalhadas().setHorasByFase(fase, horas);
	}

	getHoraTrabalhadasFase(fase){
		return this.getMapaHorasTrabalhadas().getHoraFase(fase);
	}

	toString(){
		return JSON.stringify(this);
	}

	getCusto(){
		return this.custoHora * this.mapaHorasTrabalhadas.getSomaHoras();
	}

	clonar(fases)
	{
		let funcionario = new Funcionario();
		const mapaProd = Object.assign( {}, this.getMapaProdutividades() );
		Object.setPrototypeOf( mapaProd, MapaProdutividade.prototype );
		funcionario.setNome(this.getNome());
		funcionario.setCustoHora(this.getCustoHora());
		funcionario.setMapaProdutividade(mapaProd);
		funcionario.setMapaHorasTrabalhadas(new MapaHorasTrabalhadas(fases));
		return funcionario;
	}
}

module.exports = Funcionario;