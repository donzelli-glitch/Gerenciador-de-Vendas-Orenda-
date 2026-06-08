/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { dbSim } from '../dbSim';
import { gasCode } from '../assets/gasCode';
import { Copy, Check, Terminal, Database, FileText, Settings, Play, ArrowRight } from 'lucide-react';

export default function DeveloperPanel() {
  const [activeSubTab, setActiveSubTab] = useState<'deploy' | 'code' | 'sheets'>('deploy');
  const [activeCodeFile, setActiveCodeFile] = useState<'Code.gs' | 'Index.html' | 'Style.html' | 'Script.html'>('Code.gs');
  const [activeSheetTab, setActiveSheetTab] = useState<string>('VENDAS');
  const [copied, setCopied] = useState<boolean>(false);

  // States loaded from live database
  const [configs, setConfigs] = useState(() => dbSim.getConfigs());
  const [linhas, setLinhas] = useState(() => dbSim.getLinhas());
  const [produtos, setProdutos] = useState(() => dbSim.getProdutos());
  const [vendedores, setVendedores] = useState(() => dbSim.getVendedores());
  const [vendas, setVendas] = useState(() => dbSim.getVendas());
  const [pagamentos, setPagamentos] = useState(() => dbSim.getPagamentos());
  const [estoque, setEstoque] = useState(() => dbSim.getEstoque());
  const [metas, setMetas] = useState(() => dbSim.getMetas());
  const [logs, setLogs] = useState(() => dbSim.getLogs());

  const handleRefreshSheets = () => {
    setConfigs(dbSim.getConfigs());
    setLinhas(dbSim.getLinhas());
    setProdutos(dbSim.getProdutos());
    setVendedores(dbSim.getVendedores());
    setVendas(dbSim.getVendas());
    setPagamentos(dbSim.getPagamentos());
    setEstoque(dbSim.getEstoque());
    setMetas(dbSim.getMetas());
    setLogs(dbSim.getLogs());
  };

  const currentCodeMap = {
    'Code.gs': gasCode.codeGS,
    'Index.html': gasCode.indexHTML,
    'Style.html': gasCode.styleHTML,
    'Script.html': gasCode.scriptHTML
  };

  const handleCopyCode = () => {
    const textToCopy = currentCodeMap[activeCodeFile];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetDatabase = () => {
    if (confirm("Tem certeza que deseja limpar e redefinir o banco de dados simulado para os valores padrões? Isso apagará novas vendas gravadas localmente nesta sessão.")) {
      dbSim.recriarBancoZerado();
      handleRefreshSheets();
      alert("Banco de dados local do simulador redefinido com sucesso aos padrões de fábrica!");
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen border-t-2 border-amber-600/50">
      {/* Dev Header */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 py-6 px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs tracking-wider uppercase mb-1">
            <Terminal size={14} className="animate-pulse" />
            <span>Painel de Engenharia & Integração GAS</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">CÓDIGOS GOOGLE APPS SCRIPT</h2>
          <p className="text-xs text-zinc-400">
            Copie o código abaixo e siga as instruções para ter o sistema rodando na sua própria conta Google real integrada à sua planilha.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('deploy')}
            className={`px-4 py-2 text-xs font-semibold rounded transition flex items-center space-x-1.5 ${
              activeSubTab === 'deploy'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Play size={12} />
            <span>Instruções de Implantação</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('code');
              setActiveCodeFile('Code.gs');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded transition flex items-center space-x-1.5 ${
              activeSubTab === 'code'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <FileText size={12} />
            <span>Código-Fonte (.gs / .html)</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('sheets');
              handleRefreshSheets();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded transition flex items-center space-x-1.5 ${
              activeSubTab === 'sheets'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Database size={12} />
            <span>Google Sheets (Simulado)</span>
          </button>
        </div>
      </div>

      {/* Main Dev Container */}
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* TAB 1: HOW TO DEPLOY STEP-BY-STEP */}
        {activeSubTab === 'deploy' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-5 bg-zinc-900 border border-amber-500/10 rounded-xl flex items-start space-x-3">
              <span className="text-2xl">💡</span>
              <div className="space-y-1">
                <h4 className="font-semibold text-white">Como este sistema funciona?</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Esta aplicação roda em duas partes: o frontend interativo (feita em HTML, CSS e JS) e o backend (Google Apps Script).
                  Quando você executa o setup e publica o código, o Google gera um <b>URL oficial de Web App</b>.
                  Este endereço atua como o sistema comercial completo da <b>Orenda</b>. Todas as vendas efetuadas pelos vendedores caem em segundos, com som, diretamente no Google Sheets do administrador!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Steps List */}
              <div className="space-y-4">
                <h3 className="font-bold text-white text-lg border-b border-zinc-800 pb-2">Etapas de Configuração</h3>
                <div className="space-y-3">
                  {gasCode.getInstructions().map((inst, index) => (
                    <div key={index} className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-lg flex space-x-3">
                      <div className="h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/30 font-bold font-mono text-xs text-amber-500 flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm">{inst.title}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{inst.step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips & Database Status bar */}
              <div className="space-y-6">
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
                  <h3 className="font-bold text-white text-sm">Controle de Testes do Simulador</h3>
                  <p className="text-xs text-zinc-400">
                    Neste iframe do Google AI Studio, a base de dados simula com perfeição as tabelas do Google Sheets em tempo real utilizando o <b>localStorage</b> do seu navegador. 
                  </p>
                  <div className="space-y-2 font-mono text-xs text-zinc-500">
                    <div className="flex justify-between">
                      <span>Total Linhas Ativas:</span>
                      <span className="text-white font-semibold">6</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Produtos Cadastrados:</span>
                      <span className="text-white font-semibold">{produtos.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vendedores no Sistema:</span>
                      <span className="text-white font-semibold">{vendedores.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vendas Efetuadas localmente:</span>
                      <span className="text-emerald-500 font-bold">{vendas.length}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setActiveSubTab('sheets')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-xs rounded transition flex items-center justify-center space-x-1"
                    >
                      <span>📊 Visualizar no Excel/Sheets Simulado</span>
                      <ArrowRight size={12} />
                    </button>
                    <button
                      onClick={handleResetDatabase}
                      className="w-full py-2 bg-zinc-950 hover:bg-red-950 border border-zinc-850 hover:border-red-900 font-semibold text-red-500 text-xs rounded transition"
                    >
                      Resetar Banco de Dados do Simulador
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900/40 p-5 rounded-lg border border-zinc-900 space-y-3">
                  <h4 className="font-semibold text-white text-xs">🔒 Permissões Importantes</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Durante a etapa 4, o popup de autorização do Google é <b>padrão e necessário</b> para que o Apps Script consiga gravar linhas, ler dados e registrar emails na sua própria planilha do Sheets. O aviso "Não seguro" aparece apenas porque o script é privado e está sendo criado por você na sua conta pessoal. Fique tranquilo, o código é 100% limpo de terceiros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTUAL CODE BLOCKS TO COPY */}
        {activeSubTab === 'code' && (
          <div className="space-y-4 animate-fade-in">
            {/* Choose code file nested buttons */}
            <div className="flex flex-wrap border-b border-zinc-800 pb-2">
              {(['Code.gs', 'Index.html', 'Style.html', 'Script.html'] as const).map((file) => (
                <button
                  key={file}
                  onClick={() => {
                    setActiveCodeFile(file);
                    setCopied(false);
                  }}
                  className={`py-3 px-6 text-xs font-mono font-semibold relative transition ${
                    activeCodeFile === file
                      ? 'text-amber-500 border-b-2 border-amber-500'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            {/* Code and Action Column */}
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-zinc-900 p-3 rounded-t-lg border-x border-t border-zinc-800">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs font-mono text-zinc-500 font-bold ml-2">orenda/{activeCodeFile}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-1.5 flex items-center space-x-1 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded text-xs font-semibold text-zinc-300 transition"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span className="text-emerald-500">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              {/* Large scrollable pre code panel */}
              <div className="relative">
                <pre className="p-6 bg-zinc-900 border-x border-b border-zinc-800 rounded-b-lg font-mono text-xs text-zinc-300 overflow-x-auto max-h-[500px] leading-relaxed selection:bg-amber-500 selection:text-zinc-950 scrollbar-thin">
                  <code>{currentCodeMap[activeCodeFile]}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SIMULATED LIVE SPREADSHEETS */}
        {activeSubTab === 'sheets' && (
          <div className="space-y-6 animate-fade-in">
            {/* Sheet Sub tab controller */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                {['VENDAS', 'PRODUTOS', 'VENDEDORES', 'LINHAS', 'ESTOQUE', 'CONFIGURACOES', 'LOGS'].map((sheetName) => (
                  <button
                    key={sheetName}
                    onClick={() => setActiveSheetTab(sheetName)}
                    className={`px-3 py-1.5 rounded text-xs font-bold font-mono transition ${
                      activeSheetTab === sheetName
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                    }`}
                  >
                    📊 {sheetName}
                  </button>
                ))}
              </div>
              <button
                onClick={handleRefreshSheets}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-zinc-300 rounded text-xs transition"
              >
                🔄 Sincronizar Abas
              </button>
            </div>

            {/* Sheet View Matrix Grid */}
            <div className="bg-zinc-900 border border-emerald-800/20 rounded-xl overflow-hidden gold-glow">
              <div className="bg-zinc-950 p-3 border-b border-emerald-950/40 flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">📊 orenda_vendas_db.xlsx &gt; <b className="text-emerald-500">{activeSheetTab}</b></span>
                <span className="text-[10px] text-zinc-500 font-mono">Linhas gravadas: {
                  activeSheetTab === 'VENDAS' ? vendas.length :
                  activeSheetTab === 'PRODUTOS' ? produtos.length :
                  activeSheetTab === 'VENDEDORES' ? vendedores.length :
                  activeSheetTab === 'LINHAS' ? linhas.length :
                  activeSheetTab === 'ESTOQUE' ? estoque.length :
                  activeSheetTab === 'CONFIGURACOES' ? configs.length :
                  logs.length
                }</span>
              </div>

              <div className="overflow-x-auto max-h-[400px]">
                {activeSheetTab === 'VENDAS' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-zinc-950 font-bold border-b border-zinc-800 text-zinc-400">
                        <th className="p-3">ID_VENDA</th>
                        <th className="p-3">DATA_HORA</th>
                        <th className="p-3">ID_VENDEDOR</th>
                        <th className="p-3">NOME_VENDEDOR</th>
                        <th className="p-3">PRODUTO</th>
                        <th className="p-3">QTD</th>
                        <th className="p-3">UNITARIO</th>
                        <th className="p-3">BRUTO</th>
                        <th className="p-3">PAGAMENTO</th>
                        <th className="p-3">TAXA %</th>
                        <th className="p-3">C. COMISSAO</th>
                        <th className="p-3">VALOR LIQUIDO</th>
                        <th className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300 bg-zinc-900/40">
                      {vendas.map((r, i) => (
                        <tr key={i} className="hover:bg-zinc-850/50">
                          <td className="p-3 text-zinc-500 font-bold">{r.ID_VENDA}</td>
                          <td className="p-3 whitespace-nowrap">{r.DATA_HORA}</td>
                          <td className="p-3">{r.ID_VENDEDOR}</td>
                          <td className="p-3 font-semibold text-white">{r.NOME_VENDEDOR}</td>
                          <td className="p-3 text-zinc-200 whitespace-nowrap">{r.NOME_PRODUTO}</td>
                          <td className="p-3 text-center">{r.QUANTIDADE}</td>
                          <td className="p-3 text-zinc-400">R$ {parseFloat(r.PRECO_UNITARIO as any || 0).toFixed(2)}</td>
                          <td className="p-3 font-bold text-white">R$ {parseFloat(r.VALOR_BRUTO as any || 0).toFixed(2)}</td>
                          <td className="p-3 text-[10px] uppercase text-zinc-400 font-semibold">{r.FORMA_PAGAMENTO}</td>
                          <td className="p-3 text-red-400">{r.TAXA_PERCENTUAL}%</td>
                          <td className="p-3 text-amber-500 font-semibold">R$ {parseFloat(r.VALOR_COMISSAO as any || 0).toFixed(2)}</td>
                          <td className="p-3 text-emerald-450 font-bold">R$ {parseFloat(r.VALOR_LIQUIDO as any || 0).toFixed(2)}</td>
                          <td className="p-3">
                            <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-500 border border-emerald-800/40">{r.STATUS}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeSheetTab === 'PRODUTOS' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-zinc-950 font-bold border-b border-zinc-800 text-zinc-400">
                        <th className="p-3">ID_PRODUTO</th>
                        <th className="p-3">LINHA</th>
                        <th className="p-3">NOME_PRODUTO</th>
                        <th className="p-3">CATEGORIA</th>
                        <th className="p-3">PRECO_VENDA</th>
                        <th className="p-3">CUSTO</th>
                        <th className="p-3">COMISS_PERC</th>
                        <th className="p-3">ESTOQUE</th>
                        <th className="p-3">MINIMO</th>
                        <th className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300 bg-zinc-900/40">
                      {produtos.map((r, i) => (
                        <tr key={i} className="hover:bg-zinc-850/50">
                          <td className="p-3 text-zinc-500 font-bold">{r.ID_PRODUTO}</td>
                          <td className="p-3 text-zinc-400">{r.NOME_LINHA}</td>
                          <td className="p-3 text-white font-bold">{r.NOME_PRODUTO}</td>
                          <td className="p-3 uppercase text-zinc-500">{r.CATEGORIA}</td>
                          <td className="p-3 text-white font-semibold">R$ {r.PRECO_VENDA.toFixed(2)}</td>
                          <td className="p-3 text-zinc-500">R$ {r.CUSTO.toFixed(2)}</td>
                          <td className="p-3 text-amber-500">{r.COMISSAO_PERCENTUAL}%</td>
                          <td className={`p-3 font-bold ${r.ESTOQUE <= r.ESTOQUE_MINIMO ? 'text-amber-500' : 'text-zinc-200'}`}>{r.ESTOQUE}</td>
                          <td className="p-3 text-zinc-400">{r.ESTOQUE_MINIMO}</td>
                          <td className="p-3">
                            <span className={`px-1 py-0.5 rounded text-[9px] font-bold border ${r.STATUS === 'ATIVO' ? 'bg-emerald-950 text-emerald-500 border-emerald-900/30' : 'bg-red-950 text-red-500 border-red-900/30'}`}>{r.STATUS}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeSheetTab === 'VENDEDORES' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-zinc-950 font-bold border-b border-zinc-800 text-zinc-400">
                        <th className="p-3">ID_VENDEDOR</th>
                        <th className="p-3">DATA_CADASTRO</th>
                        <th className="p-3">NOME</th>
                        <th className="p-3">WHATSAPP</th>
                        <th className="p-3">EMAIL</th>
                        <th className="p-3">PIX</th>
                        <th className="p-3">SENHA</th>
                        <th className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300 bg-zinc-900/40">
                      {vendedores.map((r, i) => (
                        <tr key={i} className="hover:bg-zinc-850/50">
                          <td className="p-3 text-zinc-500 font-bold">{r.ID_VENDEDOR}</td>
                          <td className="p-3 whitespace-nowrap">{r.DATA_CADASTRO}</td>
                          <td className="p-3 font-bold text-white">{r.NOME}</td>
                          <td className="p-3">{r.WHATSAPP}</td>
                          <td className="p-3 text-zinc-400">{r.EMAIL}</td>
                          <td className="p-3 font-bold">{r.PIX}</td>
                          <td className="p-3 text-zinc-650">***</td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.5 border font-bold text-[9px] rounded ${
                              r.STATUS === 'APROVADO' ? 'bg-emerald-950 text-emerald-500 border-emerald-800/40' :
                              r.STATUS === 'PENDENTE' ? 'bg-amber-950 text-amber-500 border-amber-800/40 animate-pulse' :
                              'bg-red-950 text-red-550 border-red-800/40'
                            }`}>{r.STATUS}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeSheetTab === 'LINHAS' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-zinc-950 font-bold border-b border-zinc-800 text-zinc-400">
                        <th className="p-3">ID_LINHA</th>
                        <th className="p-3">NOME_LINHA</th>
                        <th className="p-3">DESCRICAO</th>
                        <th className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300 bg-zinc-900/40">
                      {linhas.map((r, i) => (
                        <tr key={i} className="hover:bg-zinc-850/50">
                          <td className="p-3 text-zinc-500 font-bold">{r.ID_LINHA}</td>
                          <td className="p-3 text-white font-bold">{r.NOME_LINHA}</td>
                          <td className="p-3 text-zinc-400">{r.DESCRICAO}</td>
                          <td className="p-3">
                            <span className="px-1.5 py-0.5 border font-bold text-[9px] rounded bg-emerald-950 text-emerald-500 border-emerald-900/30">{r.STATUS}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeSheetTab === 'ESTOQUE' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-zinc-950 font-bold border-b border-zinc-800 text-zinc-400">
                        <th className="p-3">ID_MOV</th>
                        <th className="p-3">DATA</th>
                        <th className="p-3">PRODUTO</th>
                        <th className="p-3">MOVIMENTO</th>
                        <th className="p-3">ENTRADA</th>
                        <th className="p-3">SAIDA</th>
                        <th className="p-3">SALDO_FIN</th>
                        <th className="p-3">RESPONSAVEL</th>
                        <th className="p-3">OBSERVACOES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300 bg-zinc-900/40">
                      {estoque.map((r, i) => (
                        <tr key={i} className="hover:bg-zinc-850/50">
                          <td className="p-3 text-zinc-500">{r.ID_MOVIMENTO}</td>
                          <td className="p-3 text-[10px] whitespace-nowrap">{r.DATA_HORA}</td>
                          <td className="p-3 font-semibold text-zinc-200">{r.NOME_PRODUTO}</td>
                          <td className="p-3 font-semibold">
                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${r.TIPO_MOVIMENTO === 'ENTRADA' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>{r.TIPO_MOVIMENTO}</span>
                          </td>
                          <td className="p-3 text-emerald-455 text-center font-bold">+{r.ENTRADA}</td>
                          <td className="p-3 text-red-455 text-center font-bold">-{r.SAIDA}</td>
                          <td className="p-3 text-white font-bold">{r.SALDO}</td>
                          <td className="p-3 text-zinc-400">{r.RESPONSAVEL}</td>
                          <td className="p-3 text-[10px] text-zinc-500 max-w-xs truncate">{r.OBSERVACAO}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeSheetTab === 'CONFIGURACOES' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-zinc-950 font-bold border-b border-zinc-800 text-zinc-400">
                        <th className="p-3">ID_CONFIG</th>
                        <th className="p-3">CHAVE</th>
                        <th className="p-3">VALOR</th>
                        <th className="p-3">DESCRICAO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300 bg-zinc-900/40">
                      {configs.map((r, i) => (
                        <tr key={i} className="hover:bg-zinc-850/50">
                          <td className="p-3 text-zinc-500 font-semibold">{r.ID_CONFIG}</td>
                          <td className="p-3 text-amber-500 font-bold">{r.CHAVE}</td>
                          <td className="p-3 text-white font-bold">{r.VALOR}</td>
                          <td className="p-3 text-zinc-405 leading-normal">{r.DESCRICAO}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeSheetTab === 'LOGS' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-zinc-950 font-bold border-b border-zinc-800 text-zinc-400">
                        <th className="p-3">DATA_HORA</th>
                        <th className="p-3">USUARIO</th>
                        <th className="p-3">TIPO</th>
                        <th className="p-3">ACAO_OPERADA</th>
                        <th className="p-3">DETALHES_DO_LOG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300 bg-zinc-900/40">
                      {logs.map((r, i) => {
                        let tClass = 'text-zinc-500';
                        if (r.TIPO_USUARIO === 'ADMIN') tClass = 'text-red-400';
                        if (r.TIPO_USUARIO === 'VENDEDOR') tClass = 'text-amber-500';

                        return (
                          <tr key={i} className="hover:bg-zinc-850/50">
                            <td className="p-3 whitespace-nowrap text-zinc-500 font-semibold text-[10px]">{r.DATA_HORA}</td>
                            <td className="p-3 font-semibold text-white whitespace-nowrap">{r.USUARIO}</td>
                            <td className={`p-3 font-semibold text-[10px] uppercase font-mono ${tClass}`}>{r.TIPO_USUARIO}</td>
                            <td className="p-3 font-bold text-zinc-300 whitespace-nowrap">{r.ACAO}</td>
                            <td className="p-3 text-[10px] text-zinc-400 leading-normal">{r.DETALHES}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-zinc-500">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <p>Simulador Ativo: Operações salvas, produtos re-estoque e vendas geradas atualizam esta planilha instantaneamente.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
