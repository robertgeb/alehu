"use strict";

import GeradorNumeroAleatorio from './GeradorNumeroAleatorio.js';
import Populacao from './Populacao.js';

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
			fases = projeto.getFases();

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
		
		let populacao = new Populacao;
		populacao.setElementos(funcionarios);

		return populacao;
	}




	/*
	* Realiza o crossover dos elementos
	*/
	crossover(){
		
		/*
		pega os horários de uma fase
		quais pares vao fazer crossover
		gera um número randômico para cada par, sendo no máximo o maior valor, e no mínimo 1
		soma o número randômico ao menor horário (entre os dois)
		subtrai o número randômico do maior horário (entre os dois)
		enquanto (um dos dois valores resultantes for < 0 ou a soma de horas com esse número resultante > limite de horas de cada funcionário)
			gera outro número randômico
		*/


		let funcionarios = this.elementos,
		    fases = funcionarios[0].getMapaHorasTrabalhadas().getNomeFases(),		//REVER ISSO AQUI, DO FUNCIONÁRIO 0
		    faseOuFuncionario = GeradorNumeroAleatorio.gerar(0,1),
		 	idxFaseAleatoria = GeradorNumeroAleatorio.gerar(0, fases.length-1),
		 	idxFuncionarioAleatorio = GeradorNumeroAleatorio.gerar(0, funcionarios.length-1);



		//deve-se ter um número par de funcionarios. Se não tiver, vai sobrar um (selecionado randômicamente)
		if (funcionarios.length % 2 != 0) {

			let idxFuncionarioParaTirar = GeradorNumeroAleatorio.gerar(0, funcionarios.length-1);

			//remove um elemento randômico (não vai fazer crosover com ninguém)
			funcionarios.splice(idxFuncionarioParaTirar, 1);

		} 

		//array de pares que sofrerão crossover
		let pares;

	    var funcionariosTemp1 = funcionarios.slice(), // copia o array de fases
	        funcionariosTemp2 = funcionarios.slice(); // copia o array de fases de novo

	    funcionariosTemp1.sort(function() { return 0.5 - Math.random();}); // mistura arrays
	    funcionariosTemp2.sort(function() { return 0.5 - Math.random();});

	    let cont = 0;

	    while (fasesTemp1.length) {
	        var funcionario1 = funcionariosTemp1.pop(), //coleta o ultimo valor de functionariosTemp1
	            funcionario2 = funcionariosTemp2[0] == funcionario1 ? funcionariosTemp2.pop() : funcionariosTemp2.shift();
	            //        ^^ se o primeiro valor é o mesmo do funcionario1
	            //           pega o ultimo valor, se não, pega o primeiro

        	pares[cont][0] = funcionario1;
        	pares[cont][1] = funcionario2;

        	cont++;

	    }
 		

	    //o crossover vai ser implementado em pares de funcionários, em apenas uma fase
		let faseParaCrossover = fases[idxFaseAleatoria];


	    //fazendo o crossover de fato
	    for(let i = 0; i < pares.length; i++ ){

	    	let funcionario1 = pares[i][0];
	    	let funcionario2 = pares[i][1];

	    	let mapaHorasFunc1 = funcionario1.getMapaHorasTrabalhadas();
	    	let mapaHorasFunc2 = funcionario2.getMapaHorasTrabalhadas();

	    	//definindo operação para o funcionário 1 (0 subtração, 1 soma)
	    	//obs.: a operação para o funcionário 2 sempre será a inversa
	    	let operacaoFunc1 = GeradorNumeroAleatorio.gerar(0, 1);

	    	//hora do funcionario1, na etapa "teste", por exemplo
	    	let horaFuncFase1 = mapaHorasFunc1.getHorasByFase(faseParaCrossover);
	    	//hora do funcionario2, na etapa "teste", por exemplo
	    	let horaFuncFase2 = mapaHorasFunc2.getHorasByFase(faseParaCrossover);

	    	//restrição na geração de horas randômicas 
	    	let horasTeto;

			//se for subtração
	    	if(operacaoFunc1 == 0){

    			//horas teto sempre deverão ser no máximo a hora que tá subtraindo, para não dar menor de 0
    			horasTeto = horaFuncFase1;

				//a soma das horas teto com as horas do funcionário destino deve ser sempre menor que a restrição de horas do mesmo
    			let disponibilidadeHorasFunc2 = funcionario2.getDisponibilidadeHoras();

    			let horasAlocadasFunc2 = 0;

    			//calculando as horas alocadas do funcionário
    			if(let j=0 ; j<fases.length ; j++){
    				horasAlocadasFunc2 += mapaHorasFunc2.getHorasByFase(fases[j]);
    			}

    			//disponibilidade de horas do funcionário 2 = horas disponíveis - horas alocadas
    			let horasDisponiveis = disponibilidadeHorasFunc2 - horasAlocadasFunc2;

    			//horasTeto deve sempre ser menor que a restrição mais forte
    			if(horasDisponiveis < horasTeto){
    				horasTeto = horasDisponiveis;
    			}

	    	} 

	    	//operação de soma
	    	else {
				
    			//horas teto sempre deverão ser no máximo a hora que tá subtraindo, para não dar menor de 0
    			horasTeto = horaFuncFase2;

				//a soma das horas teto com as horas do funcionário destino deve ser sempre menor que a restrição de horas do mesmo
    			let disponibilidadeHorasFunc1 = funcionario1.getDisponibilidadeHoras();

    			let horasAlocadasFunc1 = 0;

    			//calculando as horas alocadas do funcionário
    			if(let j=0 ; j<fases.length ; j++){
    				horasAlocadasFunc1 += mapaHorasFunc1.getHorasByFase(fases[j]);
    			}

    			//disponibilidade de horas do funcionário 2 = horas disponíveis - horas alocadas
    			let horasDisponiveis = disponibilidadeHorasFunc1 - horasAlocadasFunc1;

    			//horasTeto deve sempre ser menor que a restrição mais forte
    			if(horasDisponiveis < horasTeto){
    				horasTeto = horasDisponiveis;
    			}

	    	}

	    	//número randômico de horas para fazer o subtrair e somar do número de horas do funcionário 
    		let horas = GeradorNumeroAleatorio.gerar(0, horasTeto);

    		//se for subtração
	    	if(operacaoFunc1 == 0){
	    		let horaAtualFunc1 = funcionario1.getMapaHorasTrabalhadas().getHorasByFase(faseParaCrossover);
	    		let horaAtualizadaFunc1 = horaAtualFunc1 - horas;
	    		let horaAtualFunc2 = funcionario2.getMapaHorasTrabalhadas().getHorasByFase(faseParaCrossover);
	    		let horaAtualizadaFunc2 = horaAtualFunc2 + horas;

	    		funcionario1.getMapaHorasTrabalhadas().setHorasByFase(faseParaCrossover, horaAtualizadaFunc1);
	    		funcionario2.getMapaHorasTrabalhadas().setHorasByFase(faseParaCrossover, horaAtualizadaFunc2);
	    	} else {
    			let horaAtualFunc1 = funcionario1.getMapaHorasTrabalhadas().getHorasByFase(faseParaCrossover);
	    		let horaAtualizadaFunc1 = horaAtualFunc1 + horas;
	    		let horaAtualFunc2 = funcionario2.getMapaHorasTrabalhadas().getHorasByFase(faseParaCrossover);
	    		let horaAtualizadaFunc2 = horaAtualFunc2 - horas;

	    		funcionario1.getMapaHorasTrabalhadas().setHorasByFase(faseParaCrossover, horaAtualizadaFunc1);
	    		funcionario2.getMapaHorasTrabalhadas().setHorasByFase(faseParaCrossover, horaAtualizadaFunc2);
	    	}



		} 
		
		//orientado a funcionário
		else {

			//para implementar		

	  	}

	}
		

}


module.exports = AlgoritmoGenetico;