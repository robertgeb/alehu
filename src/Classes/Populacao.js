"use strict";


const util = require('util');
import GeradorNumeroAleatorio from './GeradorNumeroAleatorio.js';
import Projeto from './Projeto.js';
class Populacao {

	constructor(projeto, tamanho){
		this.elementos = [];
		this.sumFitness = 0;
		// Gerando população aleatoria
		for (let i = 0; i < tamanho; i++) {
			// Clonando projeto
			let individuo = Object.assign( {}, projeto );
			Object.setPrototypeOf( individuo, Projeto.prototype );

			// Gerando valores aleatorios
			individuo.setFuncionarios(this.gerarPopulacaoAleatoria(projeto));
			
			this.sumFitness += this.avaliarFitness(individuo);
			// Inserindo na população
			this.elementos.push(individuo);
		}
		// Organizando elementos por qualidade
		this.elementos.sort((individuoA,individuoB) => {
			return this.avaliarFitness(individuoB) - this.avaliarFitness(individuoA);
		});
	}

	gerarPopulacaoAleatoria(projeto){

		let funcionarios = projeto.getFuncionarios(),
			novosFuncionarios = [],
			fases = projeto.getFases();
		let hrsLimiteFase = [];
		fases.forEach(element => {
			hrsLimiteFase.push(element.getDuracao());
		});


		/* 

		*/
		for(let i=0 ; i<funcionarios.length ; i++){
			
			
			let funcionario = funcionarios[i].clonar(fases);
			
			/*
			* Para cada funcionário gera um número de horas aleatórias
			*/
			for(let j=0 ; j<fases.length ; j++){				
				//limite de horas total para a fase (limite da soma das horas de todos os funcionários para essa fase)

				let hrAleatoria;

				//o último funcionário fica com o restante das horas. Os primeiros são randômicos
				if(i != funcionarios.length-1){
					hrAleatoria = GeradorNumeroAleatorio.gerar(0, 
														   hrsLimiteFase[j]);
				} else {
					hrAleatoria = hrsLimiteFase[j];
				}

				//limite decrementa, pois o funcionário corrente já alocou uma porcentagem do tempo dessa etapa
				hrsLimiteFase[j] -= hrAleatoria;
				
				funcionario.getMapaHorasTrabalhadas().setHorasByFase(fases[j].getNome(), hrAleatoria);
				
			}
			novosFuncionarios.push(funcionario);
			
		}
		
		return novosFuncionarios;
	}

	avaliarFitness(projeto){

		let fitness = 0;

		let funcionarios = projeto.getFuncionarios();
		let fases = projeto.getFases();

		//funcionários do projeto
		for(let i=0 ; i<funcionarios.length ; i++){

			let funcionario = funcionarios[i];			

			//mapa de horas do funcionário corrente
			let mapaHoras = funcionario.getMapaHorasTrabalhadas();
			let mapaProdutividade = funcionario.getMapaProdutividades();

			for(let j=0 ; j<fases.length ; j++){

				let fase = fases[j].getNome();
				
				//horas trabalhadas nessa fase
				let horasTrabalhadasNessaFase = mapaHoras.getHorasByFase(fase);
				
				//produtividade do funcionário nessa fase
				let produtividadeNessaFase = mapaProdutividade.getProdByFase(fase);

				let producao = produtividadeNessaFase * horasTrabalhadasNessaFase;


				//horas do funcionário e da fase corrente
				fitness += producao;
			}
		}
		return fitness;

	}

	/*
	* 	Seleciona um indvíduo 
	*/
	selecionarIndividuo()
	{
		let pesoAleatorio = Math.random();
		let normalize = function(val, max, min) { return (val - min) / (max - min); };
		let menorFitness = this.avaliarFitness(this.elementos[0]);
		let maiorFitness = this.avaliarFitness(this.elementos[0]);
		for (let i = 0; i < this.elementos.length; i++){
			if(this.avaliarFitness(this.elementos[i]) < menorFitness)
				menorFitness = this.avaliarFitness(this.elementos[i]);
			if(this.avaliarFitness(this.elementos[i]) > maiorFitness)
				maiorFitness = this.avaliarFitness(this.elementos[i]);
		}

		for (let i = 0; i < this.elementos.length; i++){
			let fitnessNormalizado = normalize(this.avaliarFitness(this.elementos[i]), maiorFitness, menorFitness);
			if(fitnessNormalizado < pesoAleatorio)
				return this.elementos[i];
		}
		// process.exit();
		return this.selecionarIndividuo();
		
	}

	selecionarMelhor(projeto, estagnada)
	{
		if(this.avaliarFitness(projeto) >= this.avaliarFitness(this.elementos[0])){
			estagnada(true);
			return projeto;
		}
		estagnada(false);
		return this.elementos[0];

	}

	setElementos(elementos){
		this.elementos = [];
		this.sumFitness = 0;
		for (let i = 0; i < elementos.length; i++) {
			this.sumFitness += this.avaliarFitness(elementos[i]);
			// Inserindo na população
			this.elementos.push(elementos[i]);
		}

		let that = this;
		// Organizando elementos por qualidade
		this.elementos.sort((individuoA,individuoB) => {
			return that.avaliarFitness(individuoB) - that.avaliarFitness(individuoA);
		});
	}

	getElementos(){
		return this.elementos;
	}

	toArray(){
		return this.elementos;
	}

	/*
	* Realiza o crossover dos elementos
	*/
	/*crossover(){
		//funções possíveis para pegar horas orientadas a funcionários, ou de uma fase
		//0 = hora aleatoria da fase ; 1 = hora aleatoria do funcionario
		//funções possíveis para pegar horas orientadas a funcionários, ou de uma fase
		//0 = fase aleatória ; 1 = funcionário aleatória
		let funcionarios = this.elementos;
		    fases = funcionarios[0].getMapaHorasTrabalhadas().getNomeFases();
		    faseOuFuncionario = GeradorNumeroAleatorio.gerar(0,1),
		 	  idxFaseAleatoria = GeradorNumeroAleatorio.gerar(0, fases.length-1),
		 	  idxFuncionarioAleatorio = GeradorNumeroAleatorio.gerar(0, funcionarios.length-1);

   		//orientado a fase
		if( faseOuFuncionario == 0 ){
		  
		  //pegando as fases a partir do índice gerado aleatóriamente
			for(let i = idxFaseAleatoria; idxFaseAleatoria <= fases.length; i++ ){
			  
	        //coletando a string da fase corrente
  				let fase = fases[i],
  				
  				//array das horas da fase corrente
  			   horasFase = [];
  
  				for(let j=0; j < funcionarios.length ; j++){
  				  horasFase[j] = funcionarios[j].getHorasTrabalhadasFase(fase);			
  				}
  			  
  			  //embaralhando todas as horas da fase corrente a partir do índice randômico gerado
  			  horasFase.shuffle();
  			  this.elementos = this.elementos.map( (func, idx) => {
              novoFunc = func;
              novoFunc.setHorasTrabalhadasFase(fase, horasFase[idx]);
  			  });
			}
			
			

		} 
		
		//orientado a funcionário
		else {
		  
		  //pegando os funcionários a partir do índice gerado aleatóriamente
			for(let i = idxFuncionarioAleatorio; idxFuncionarioAleatorio <= funcionarios.length; i++ ){
  				
  				//array das horas da fase corrente
  			   horasFuncionario = [];
  
  				for(let j=0; j < fases.length ; j++){
  				  
  	        //coletando a string da fase corrente
    				let fase = fases[j],
  				  horasFuncionario[j] = funcionarios[i].getHorasTrabalhadasFase(fase);			
  				}
  			  
  			  //embaralhando todas as horas da fase corrente a partir do índice randômico gerado
  			  horasFuncionario.shuffle();
  			  
  			  this.elementos = this.elementos.map( (func, idx) => {
              novoFunc = func;
              novoFunc.setHorasTrabalhadasFase();
  			  });
			}
			
		}

	}*/


}

module.exports = Populacao;