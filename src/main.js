"use strict";

import Funcionario from './Classes/Funcionario.js';
import Produtividade from './Classes/Produtividade.js';
import Fase from './Classes/Fase.js';
import MapaHorasTrabalhadas from './Classes/MapaHorasTrabalhadas.js';
import MapaProdutividade from './Classes/MapaProdutividade.js';
import Projeto from './Classes/Projeto.js';
import AlgoritmoGenetico from './Classes/AlgoritmoGenetico.js';

// -------------------------------------- <DEFINIÇÂO MANUAL DE VARIÁVEIS> --------------------------------------
let qtdFuncionarios = 5;
let funcionarios = [];

let fases = [new Fase("Levantamento", 60), 
			 new Fase("Implementação", 200), 
			 new Fase("Teste", 100), 
			 new Fase("Implantação", 40)
			];

let produtividades = [[], [], [], [], []];

//produtividades[indiceFuncionario][Array de indices produtividade]
produtividades[0] = {"Levantamento" : 20, "Implementação": 10, "Teste": 60, "Implantação": 50};
produtividades[1] = {"Levantamento" : 60, "Implementação": 40, "Teste": 30, "Implantação": 30};
produtividades[2] = {"Levantamento" : 40, "Implementação": 10, "Teste": 30, "Implantação": 20};
produtividades[3] = {"Levantamento" : 30, "Implementação": 80, "Teste": 50, "Implantação": 30};
produtividades[4] = {"Levantamento" : 130, "Implementação": 20, "Teste": 70, "Implantação": 10};


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


// -------------------------------------- </DEFINIÇÂO MANUAL DE VARIÁVEIS> --------------------------------------


for(let i=0 ; i<qtdFuncionarios ; i++){
	let funcionario = new Funcionario(),
		mapa_prod = new MapaProdutividade(fases);
		
	mapa_prod.fillFromArray(produtividades[i]);

	funcionario.setNome("Funcionario"+i);
	funcionario.setMapaProdutividade(mapa_prod);
	funcionario.setDisponibilidadeHoras(disponibilidadesHoras[i]);
	funcionario.setCustoHora(custosHora[i]);
	funcionario.setMapaHorasTrabalhadas(new MapaHorasTrabalhadas(fases));

	funcionarios[i] = funcionario;
}

let projeto = new Projeto();

projeto.setFases(fases);
projeto.setFuncionarios(funcionarios);

let ga = new AlgoritmoGenetico(),
	popAleatoria = ga.gerarPopulacaoAleatoria(projeto);

ga.setPopulacaoInicial(popAleatoria);
