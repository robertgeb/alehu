"use strict";

import GeradorNumeroAleatorio from './GeradorNumeroAleatorio.js';
/*
*
* Classe que guarda toda a lógica do algoritmo genético.
*
* Criador: Polegar
*/

class AlgoritmoGenetico {

	constructor(){
		
		/* 
		* Número MÁXIMO de horas gerado pelo método gerarPopulacaoAleatoria() 
		* Por padrão 100, podendo ser alterado via método setMaxNumHorasAleatorio()
		*/
		this.maxNumHorasAleatorio = 100;
		/* 
		* Número MÍNIMO de horas gerado pelo método gerarPopulacaoAleatoria() 
		* Por padrão 1, podendo ser alterado via método setMinNumHorasAleatorio()
		*/
		this.minNumHorasAleatorio = 1;

		/*
		* População inicial
		*/
		this.populacaoInicial = [];


		/*
		* População atual
		*/
		this.populacaoAtual = [];
	}

	setMaxNumHorasAleatorio(max){
		this.maxNumHorasAleatorio = max;
	}

	setMinNumHorasAleatorio(min){
		this.minNumHorasAleatorio = min;
	}

	setPopulacaoInicial(pop){
		this.populacaoInicial = pop;
		this.populacaoAtual = pop;
	}

	setPopulacaoInicial(pop){
		this.populacaoInicial = pop;
	}

	/*
	* Método para gerar uma populãção aleatória
	* Recebe um objeto da classe Projeto como parâmetro
	* Retorna um array de funcionarios com um MapaHorasTrabalhadas preenchido aleatóriamente
	*/
	gerarPopulacaoAleatoria(projeto){

		let funcionarios = projeto.getFuncionarios(),
			fases = projeto.getFases(),
			populacao = [];

		/*
		* Para cada funcionário gera um número de horas aleatória para cada etapa.
		*/
		for(let i=0 ; i<funcionarios.length ; i++){

			let funcionario = funcionarios[i],
				hrsTrabTmp = funcionario.getMapaHorasTrabalhadas();

			/* 
			* Para cada etapa seta um novo mapa de horas trabalhadas para o funcionário e adiciona-o 
			* ao array de funcionários que será retornado
			*/
			for(let j=0 ; j<fases.length ; j++){
				let hrAleatoria = GeradorNumeroAleatorio.gerar(this.minNumHorasAleatorio, 
															   this.maxNumHorasAleatorio);
				hrsTrabTmp.setHorasByFase(fases[j].getNome(), hrAleatoria);
			}
			
			funcionario.setMapaHorasTrabalhadas(hrsTrabTmp);
			funcionarios[i] = funcionario;

		}

		return funcionarios;
	}


	/*
	* Recebe um array de funcionários (chamada de população)
	* itera sobre eles e caso estejam 
	*/

}

module.exports = AlgoritmoGenetico;