"use strict";

/*
* Classe que guarda informações gerais do projeto
*
* Criador : Polegar
*/
import GeradorNumeroAleatorio from './GeradorNumeroAleatorio.js';

class Projeto {

	constructor(){
		this.fases = [];
		this.funcionarios = [];
		this.orcamento_limite = 0;
	}

	setFases(fases){
		this.fases = fases;
	}

	setOrcamentoLimite(limite){
		this.orcamento_limite = limite; 
	}

	getOrcamentoLimite(){
		return this.orcamento_limite;
	}

	getFases(){
		return this.fases;
	}

	setFuncionarios(func){
		this.funcionarios = func;
	}

	getFuncionarios(){
		return this.funcionarios;
	}

	getHoraAleatoriaFase(fase){
		if(this.functionarios.length == 0)
			return null;

		let horasFase = [];

		horasFase = this.functionarios.map( (funcionario) => {
			return functionario.getHoraFase(fase);
		});

		let numAleatorio = GeradorNumeroAleatorio.gerar(0, horasFase.length-1);

		return horasFase[numAleatorio];
	}

	printHorasTrabalhadas(){
		let tabela = "------------------ Horas Trabalhadas ---------------------\n",
		    linhas_fases = [],
		    horas_fases = {},
		    fases_offset = 0,
		    column_size = 10;

		for(let fase in this.fases){
			let nome_fase = this.fases[fase].getNome();
			if(nome_fase.length > fases_offset)
				fases_offset = nome_fase.length;

			horas_fases[this.fases[fase].getNome()] = [];
		}

		tabela += Array(fases_offset+1).join(" ");

		for(let idx_func in this.funcionarios){
			let funcionario = this.funcionarios[idx_func],
				offsets_len = Math.ceil((column_size - idx_func.toString().length) / 2),
				offsets = Array(offsets_len).join(" ");

			tabela += "|".concat((offsets / 2 == 0 ? offsets : offsets+1), "F", idx_func, offsets);
			
			for(let fase in horas_fases){
				horas_fases[fase].push( funcionario.getMapaHorasTrabalhadas().getHorasByFase(fase) );
			}

		}

		tabela += "\n";

		for(let fase in horas_fases){
			let offset_len = fases_offset - fase.length,
				linha_fase = fase;

			if(offset_len > 0){
				linha_fase = fase.concat(Array(offset_len+1).join(" "));
			}

			for(let i=0; i<horas_fases[fase].length; i++){

				let hora_fase = horas_fases[fase][i],
					offsets_len = Math.ceil((column_size - hora_fase.toString().length) / 2),
					offset_left = (offsets_len % 2) == 0 ? Array(offsets_len+1).join(" ") : Array(offsets_len+1).join(" "),
					offset_right = (offsets_len % 2) == 0 ? Array(offsets_len+1).join(" ") : Array(offsets_len).join(" ");

				linha_fase += "|".concat(offset_left, hora_fase, offset_right);
			}

			tabela += linha_fase.concat("\n");
		}

		console.log(tabela);
	}

	getOrcamento(){

		let orcamento = this.funcionarios.reduce( (total, func) => {
							return total + func.getCusto();
						}, 0);
		
		return orcamento;

	}

	orcamentoDentroDoLimite(){
		return this.orcamento_limite >= this.getOrcamento();
	}
}

module.exports = Projeto;