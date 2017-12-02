"use strict";

import GeradorNumeroAleatorio from './GeradorNumeroAleatorio.js';

/*
* Classe que guarda os índices de produtividade de um funcionário
* Os valores são indexados pelo nome da fase.
*
* Criador: Polegar.
*/

class MapaProdutividade{

	/*
	* recebe um array de objetos da classe Fase e
	* preenche o mapa com as informações das fases
	* com todas os índices de produtividade zerados.
	*/
	constructor(fases){
		this.mapa = {};
	
		for(let i=0; i<fases.length; i++)
			this.mapa[fases[i].getNome()] = 0;

	}

	//retorna a produtividade em uma determinada fase
	getProdByFase(fase){
		return this.mapa[fase];
	}

	//seta a produtividade em uma fase
	setProdByFase(fase, produtividade){
		this.mapa[fase] = produtividade;
	}

	/*
	*
	* Preenche o mapa com as informações de um array associativo (Objeto javascript)
	* Ou com um array de objetos da classe Fase
	*
	* Ex.: {"Implantação": 10, "Implementação" : 20}
	* Ex2.: {new Fase("Implementacao", 20), new Fase("Implantacao", 50)}
	*
	* Obs.: Caso o argumento passado seja de qualquer outro tipo que não tenha o método
	* 		getNome(), uma exceção será lançada (não testei mas acho que vai :D ). 
	*/
	fillFromArray(fases){
		/*
		* Para cada fase que já havia sido inicializada no mapa
		* busca pelo seu nome dentro do array passado e seta as suas horas;
		*
		* -> Obs.: Caso esteja presente no array alguma fase que não tenha  
		*		   Sido inicializada no mapa (via construtor) ela será ignorada
		*/
		for(idx in this.mapas){
			if(fases[idx] === undefined)
				continue;

			/* Caso venha um array de objectos da classe Fase
			 * utiliza o método getNome() para pegar o nome da fase.
			 */
			if(fases[idx] instanceof Object)
				this.mapa[idx] = fases.getNome();
			else
				this.mapa[idx] = fases[idx];
		}

	}
}

module.exports = MapaProdutividade;