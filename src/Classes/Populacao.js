"use strict";

class Populacao {

	construct(){
		this.elementos = [];	
	}

	setElementos(elementos){
		this.elementos = elementos;
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