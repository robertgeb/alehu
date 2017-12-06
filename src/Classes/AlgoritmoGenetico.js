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

		this.crossover(projetos);

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
	crossover(projetos){
		
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

		//quantidade de fases
		let fases = projetos[0].getFases();

		//índice da fase que será trocada com a outra amostragem
		//Ex.: se tiverem 4 fases, e vier o número 2, as fases 2 e três serão trocadas
		let indiceFaseCrossover = GeradorNumeroAleatorio.gerar(0, fases.length);

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
			console.log("Índice da Fase para Crossover: "+indiceFaseCrossover);

		}

		//navegando nos pares de crossover
		for(let i=0 ; i<cadeiasSorteadas.length ; i++){

			let projeto1 = projetos[cadeiasSorteadas[i]];
			let projeto2 = projetos[cadeiasSorteadas[i+1]];

			console.log("asdasd "+cadeiasSorteadas[i]);

			//funcionários do projeto 1
			let funcionariosP1 = projeto1.getFuncionarios();

			//funcionários do projeto 2
			let funcionariosP2 = projeto2.getFuncionarios();

			//navegando no funcionário do projeto 1 (mesma quantidade de funcionários do projeto 2)
			for(let j=0 ; j<funcionariosP1.length ; j++){

				let funcionario1Temp = funcionariosP1[j];
				let funcionario2Temp = funcionariosP2[j];

				let mapaHorasFunc1 = funcionario1Temp.getMapaHorasTrabalhadas(); 
				let mapaHorasFunc2 = funcionario2Temp.getMapaHorasTrabalhadas(); 

				//navegando nas fases do projeto
				for(let l=0 ; l<fases.length ; l++){

					//se o l não for menor que o índice, não faz crossover
					if(!l < indiceFaseCrossover){

						let horasFaseFunc1 = mapaHorasFunc1.getHorasByFase(fases[l]);
						let horasFaseFunc2 = mapaHorasFunc2.getHorasByFase(fases[l]);

						mapaHorasFunc1.setHorasByFase(fases[l], horasFaseFunc2);			
						mapaHorasFunc2.setHorasByFase(fases[l], horasFaseFunc1);			

					}					

				}

				//atualizando o mapa de horas trabalhadas dos funcionários
				funcionario1Temp.setMapaHorasTrabalhadas(mapaHorasFunc1);
				funcionario2Temp.setMapaHorasTrabalhadas(mapaHorasFunc2);

				//atualizando os funcionários no array de funcionários de cada projeto
				funcionariosP1[j] = funcionario1Temp;
				funcionariosP2[j] = funcionario2Temp;

			}

			//atualizando funcionários nos projetos
			projeto1.setFuncionarios(funcionariosP1);
			projeto2.setFuncionarios(funcionariosP2);

			//atualizando array de projetos
			projetos[i] =  projeto1;
			projetos[i+1] =  projeto2;

			//pulando um índice, já que crossover são feitos de pares em pares
			i++;

		}

	}
		

}


module.exports = AlgoritmoGenetico;