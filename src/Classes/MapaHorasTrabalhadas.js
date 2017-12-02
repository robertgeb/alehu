"use strict";

import GeradorNumeroAleatorio from './GeradorNumeroAleatorio.js';

/*
* Classe que guarda as informações de horas a serem trabalhadas por um funcionário
* Os valores são indexados pelo nome da fase.
*
* Criador : Polegar.
*/

class MapaHorasTrabalhadas {

	
	/*
	* recebe um array de objetos da classe Fase e
	* preenche o mapa com as informações das fases
	* com todas as horas zeradas.
	*/
	constructor(fases){
		
		this.mapa = {};
	
		for(let i=0; i<fases.length; i++)
			this.mapa[fases[i].getNome()] = 0;

	}

	//retorna as horas a serem trabalhadas em determinada fase
	getHorasByFase(fase){
		return this.mapa[fase];
	}

	//seta as horas em determinada fase
	setHorasByFase(fase, horas){
		this.mapa[fase] = horas;		
	}


	//retorna o valor de uma fase aleatória
	//Se não 
	getHoraAleatoria(){
		let count = 0;

		for(idx in this.mapa){
			if(count == indiceAleatorio)
				return this.mapa[idx];
				
			count++;
		}
		
		throw "Erro ao pegar hora aleatória";
	}

	//retorna o valor de uma fase aleatória
	//Se não 
	getHoraAleatoriaDaFase(fase){
		throw "Erro ao pegar hora aleatória";
	}

	getNomeFases(){
		return this.mapa.keys();
	}

	/*retorna o a soma de todas as horas trabalhadas*/
	getSomaHoras(){
		let arr_horas = [];
		for(let fase in this.mapa)
			arr_horas.push(this.mapa[fase]);

		return arr_horas.reduce( (total, hora) => { return total + hora; });
	}


	/*
	*
	* Preenche o mapa com as informações de um array associativo (Objeto javascript)
	* Ex.: {"Implantação": 10, "Implementação" : 20}
	*/
	fillFromArray(fases){

		/*
		* Para cada fase que já havia sido inicializada no mapa
		* busca pelo seu nome dentro do array passado e seta as suas horas;
		* Ex.: {"Implantação": 10, "Implementação" : 20}
		* Ex2.: {new Fase("Implementacao", 20), new Fase("Implantacao", 50)}
		*
		* Obs.: Caso o argumento passado seja de qualquer outro tipo que não tenha o método
		* 		getNome(), uma exceção será lançada (não testei mas acho que vai :D ). 
		*/
		for(idx in this.mapa){
			if(fases[idx] === undefined)
				continue;

			/* 
			 * Caso venha um array de objectos da classe Fase
			 * utiliza o método getNome() para pegar o nome da fase.
			 */
			if(fases[idx] instanceof Object)
				this.mapa[idx] = fases.getNome();
			else
				this.mapa[idx] = fases[idx];
		}

	}

}

module.exports = MapaHorasTrabalhadas;