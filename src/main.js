"use strict";

import Funcionario from './Classes/Funcionario.js';
import Produtividade from './Classes/Produtividade.js';
import Fase from './Classes/Fase.js';
import HorasTrabalhadas from './Classes/HorasTrabalhadas.js';

// -------------------------------------- <DEFINIÇÂO MANUAL DE VARIÁVEIS> --------------------------------------
let qtdFuncionarios = 5;
let funcionarios = [];

let fases = [new Fase("Levantamento", 60), 
			 new Fase("Implementação", 200), 
			 new Fase("Teste", 100), 
			 new Fase("Implantação", 40)
			];

let produtividades = [[], [], [], [], []];

//produtividades[indiceFuncionario][indiceFase]
produtividades[0][0] = new Produtividade(fases[0], 20);
produtividades[1][0] = new Produtividade(fases[0], 60);
produtividades[2][0] = new Produtividade(fases[0], 40);
produtividades[3][0] = new Produtividade(fases[0], 30);
produtividades[4][0] = new Produtividade(fases[0], 130);
produtividades[0][1] = new Produtividade(fases[1], 10);
produtividades[1][1] = new Produtividade(fases[1], 40);
produtividades[2][1] = new Produtividade(fases[1], 10);
produtividades[3][1] = new Produtividade(fases[1], 80);
produtividades[4][1] = new Produtividade(fases[1], 20);
produtividades[0][2] = new Produtividade(fases[2], 60);
produtividades[1][2] = new Produtividade(fases[2], 30);
produtividades[2][2] = new Produtividade(fases[2], 30);
produtividades[3][2] = new Produtividade(fases[2], 50);
produtividades[4][2] = new Produtividade(fases[2], 70);
produtividades[0][3] = new Produtividade(fases[3], 50);
produtividades[1][3] = new Produtividade(fases[3], 30);
produtividades[2][3] = new Produtividade(fases[3], 20);
produtividades[3][3] = new Produtividade(fases[3], 30);
produtividades[4][3] = new Produtividade(fases[3], 10);

let disponibilidadesHoras = [];

//disponibilidadesHoras[indiceFuncionario]
disponibilidadesHoras[0] = 100;
disponibilidadesHoras[1] = 50;
disponibilidadesHoras[2] = 150;
disponibilidadesHoras[3] = 120;
disponibilidadesHoras[4] = 75;

let custosHora = [];

//custosHora[indiceFuncionario]
custosHora[0] = 30;
custosHora[1] = 60;
custosHora[2] = 55;
custosHora[3] = 40;
custosHora[4] = 80;

for(let i=0 ; i<qtdFuncionarios ; i++){

	funcionarios[i] = new Funcionario("Funcionario"+i, produtividades[i],disponibilidadesHoras[i],custosHora[i]);
}

// -------------------------------------- </DEFINIÇÂO MANUAL DE VARIÁVEIS> --------------------------------------


for(let i=0 ; i<qtdFuncionarios ; i++){

	//horas trabalhadas por cada funcionário em cada etapa do projeto (array temporário)
	let horasTrabalhadasTemp = [];

	for(let j=0 ; j<fases.length ; j++){	
		horasTrabalhadasTemp[j] = Math.floor(Math.random() * 50);
	}

	funcionarios[i].setHorasTrabalhadas(horasTrabalhadasTemp);

}

	console.log(funcionarios[0].getHorasTrabalhadas());

//let classe = new Classe("foda-se");
//console.log(classe.getNome());

let bContinua = true;

while(bContinua){


break;
}