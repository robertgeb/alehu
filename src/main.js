"use strict";

const util = require('util');
var readline = require('readline');
const sheet2Json = require('node-excel-to-json');

import Funcionario from './Classes/Funcionario.js';
import Produtividade from './Classes/Produtividade.js';
import Fase from './Classes/Fase.js';
import MapaHorasTrabalhadas from './Classes/MapaHorasTrabalhadas.js';
import MapaProdutividade from './Classes/MapaProdutividade.js';
import Projeto from './Classes/Projeto.js';
import AlgoritmoGenetico from './Classes/AlgoritmoGenetico.js';


process.stdout.write("Abrindo planilha...")
readline.cursorTo(process.stdout, 0);
// Carregando dados da planilha
sheet2Json('/home/robert/Projects/alehu/planilha.ods', function(err, data) {
	if(err){	// Checando erros ao abrir ou parsear arquivo
		console.log("Falha ao abrir arquivo");
		process.exit();
	}

	var projeto = null;
	var funcionarios = [];
	var fases = [];
	var orcamento = data.Projeto[0]["Orçamento"];
	var algoritmoGenetico = null;
	var popAleatoria = null;
	var geracao = 0;
	var fitness = 0;

	// Validando planilha
	if(!data.Fases || !data.Funcionarios)
	{
		console.log("Tabela de Fases ou de Funcionario não encontrada na planilha");
		process.exit();
	}
	process.stdout.write("Carregando dados...")
	readline.cursorTo(process.stdout, 0);
	// Carregando componentes
	fases = createFases(data.Fases);
	funcionarios = createFuncionarios(data.Funcionarios, fases);
	
	// Criando projeto
	projeto = new Projeto(fases, funcionarios, orcamento);
	
	// Imprimindo informações iniciais
	process.stdout.write("Iniciando Algoritmo Genético...")
    readline.cursorTo(process.stdout, 0);
	printProjeto(projeto);

	//Iniciando algoritmo genético
	algoritmoGenetico = new AlgoritmoGenetico(projeto);
	let geracoesEstagnadas = 0;

	while(1) {
		algoritmoGenetico.run();
		projeto = algoritmoGenetico.populacao.selecionarMelhor(projeto, (estagnada) => {
			if(estagnada)
				geracoesEstagnadas++
			else{
				geracoesEstagnadas = 0;
				process.stdout.write("Geração "+ ++geracao +"...");
				readline.cursorTo(process.stdout, 0);
				printProjeto(projeto);
				process.stdout.write("\n");
			}
		});
		process.stdout.write("Geração "+ ++geracao +"...")
		readline.cursorTo(process.stdout, 0);
		printProjeto(projeto);
		readline.moveCursor(process.stdout, 0, -8);
		if(geracoesEstagnadas > 5)
			break;
	}

});

function createFases(data) {
	let fases = [];
	data.forEach(f => {
		if(!f.Nome || !f.Custo)
			return;
		let fase = new Fase(f.Nome, f.Custo);
		fases.push(fase);
	});
	return fases;
}

function createFuncionarios(data, fases){
	let funcionarios = [];
	data.forEach(f => {
		if(!f.Nome)
			return;
		let funcionario = new Funcionario(),
			mapaProdutividade = new MapaProdutividade(fases);
		
		fases.forEach(fase => {
			mapaProdutividade.setProdByFase(fase.nome, f[fase.nome]);
		});
		
		funcionario.setNome(f.Nome);
		funcionario.setMapaProdutividade(mapaProdutividade);
		funcionario.setCustoHora(f.Custo);
		funcionario.setMapaHorasTrabalhadas(new MapaHorasTrabalhadas(fases));

		funcionarios.push(funcionario);
	});
	return funcionarios;
}

function printProjeto(projeto)
{
	process.stdout.write("\n");
	projeto.printHorasTrabalhadas();
	process.stdout.write("Orcamento: " + projeto.getOrcamento());
	readline.cursorTo(process.stdout, 0);
	// readline.moveCursor(process.stdout, 0, -8);
}



