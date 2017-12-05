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
		* Por padrão 0, podendo ser alterado via método setMinNumHorasAleatorio()
		*/
		this.minNumHorasAleatorio = 0;
		/* 
		* Número de "peças jogadas na roleta" (significa o número de elementos que serão cruzados)
		*/
		this.numElementosASeremCruzados = 2;

		/*
		* População inicial
		*/
		this.populacaoInicial = [];

		/*
		* Fitnesses de todas as amostras
		*/
		this.fitnesses = [];


		/*
		* População atual
		*/
		this.populacaoAtual = [];
	}

	setFitnesses(fitnesses){
		this.fitnesses = fitnesses;
	}

	getFitnesses(){
		return this.fitnesses;
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

		*/
		for(let j=0 ; j<fases.length ; j++){				

			//limite de horas total para a fase (limite da soma das horas de todos os funcionários para essa fase)
			let hrsLimiteFase = fases[j].getDuracao();

			/*
			* Para cada funcionário gera um número de horas aleatórias
			*/
			for(let i=0 ; i<funcionarios.length ; i++){

				let hrAleatoria;

				//o último funcionário fica com o restante das horas. Os primeiros são randômicos
				if(i != funcionarios.length-1){
					hrAleatoria = GeradorNumeroAleatorio.gerar(this.minNumHorasAleatorio, 
														   hrsLimiteFase);
				} else {
					hrAleatoria = hrsLimiteFase;
				}

				//limite decrementa, pois o funcionário corrente já alocou uma porcentagem do tempo dessa etapa
				hrsLimiteFase -= hrAleatoria; 

				let funcionario = funcionarios[i];
				
				funcionario.getMapaHorasTrabalhadas().setHorasByFase(fases[j].getNome(), hrAleatoria);

				funcionarios[i] = funcionario;

			}

		}
		
		let populacao = new Populacao;
		populacao.setElementos(funcionarios);

		return populacao;
	}

	/**
	* Monta roleta baseando-se nos fitnesses da classe
	*/
	getRoleta(){
		let fitnesses = this.fitnesses;
		let roleta = [];

		let somaFitnesses = 0;

		//somar fitnesses e saber qual o valor de 100% da roleta
		for(let j=0 ; j<fitnesses.length ; j++){
			somaFitnesses += fitnesses[j];
		}

		//calculando porcentagem de cada roleta
		for(let j=0 ; j<fitnesses.length ; j++){

			//porcentagem corrente desse fitness na roleta inteira
			let porcentagemCorrente = (100*fitnesses[j])/somaFitnesses;

			if(j != 0){
				roleta[j] = roleta[j-1] + porcentagemCorrente;
			} else {
				roleta[j] = porcentagemCorrente;
			}

		}

		roleta.sort(function(a,b) { return a - b;});

		return roleta;

	}


	/**
	*	Loop de mutação padrão em um algoritmo genético
	*/
	mutar(projetos, orcamento_limite){

		this.crossover();

	}


	/**
	*	avalia fitness de população, que é a soma dos produtos das horas trabalhadas pela produtividade de todos os funcionários
	*
	*/
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

		//array que terá como valor a porcentagem de cada fitness sobre o total
		let roleta = this.getRoleta();

		//de acordo com os números sorteados, cadeias serão selecionadas para ser feito o crossover.
		let cadeiasSorteadas = [];

		for(let i=0 ; i<this.numElementosASeremCruzados ; i++){
			let numeroAleatorio = GeradorNumeroAleatorio.gerar(0,100);			

			for(let j=0 ; j<roleta.length ; j++){

				//se a cadeia for a maior, seta a cadeia sorteada e dá break (imediatamente maior)
				if(roleta[j] > numeroAleatorio){
					cadeiasSorteadas[i] = j;
					break;
				}

			}

		}

		//mudando números repetidos
		for(let i=0 ; i<this.numElementosASeremCruzados ; i++){
			let primeiraCadeia = cadeiasSorteadas[i];
			i++;
			let segundaCadeia = cadeiasSorteadas[i];

			//se tiverem cadeias repetidas para o crossover, muda
			if(primeiraCadeia == segundaCadeia){

				//se tiver no limite superior, decrementa
				if(primeiraCadeia == roleta.length-1){
					cadeiasSorteadas[i-1]--; 
				} 
				//do contrário, incrementa
				else {
					cadeiasSorteadas[i-1]++; 
				}
			}

			console.log("Cadeias Sorteadas: "+cadeiasSorteadas);

		}

		return;


		let funcionarios = this.elementos,
		    fases = funcionarios[0].getMapaHorasTrabalhadas().getNomeFases(),		
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
    			for(let j=0 ; j<fases.length ; j++){
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
    			for(let j=0 ; j<fases.length ; j++){
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

	}
		

}


module.exports = AlgoritmoGenetico;