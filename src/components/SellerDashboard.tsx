/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { dbSim } from '../dbSim';
import { VendedorRow, LinhaRow, ProdutoRow, VendaRow } from '../types';
import { 
  ShoppingBag, ClipboardCheck, MessageSquare, Copy, Check, DollarSign,
  Briefcase, TrendingUp, Filter, AlertCircle, FileText, User, LogOut
} from 'lucide-react';

interface SellerDashboardProps {
  vendedor: VendedorRow;
  onLogout: () => void;
}

export default function SellerDashboard({ vendedor, onLogout }: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'venda' | 'historico' | 'catalogo'>('venda');

  // Database local loaded states
  const [linhas, setLinhas] = useState<LinhaRow[]>([]);
  const [allProdutos, setAllProdutos] = useState<ProdutoRow[]>([]);
  const [minhasVendas, setMinhasVendas] = useState<VendaRow[]>([]);
  
  // Sale input fields
  const [selectedLinhaId, setSelectedLinhaId] = useState('');
  const [filteredProdutos, setFilteredProdutos] = useState<ProdutoRow[]>([]);
  const [selectedProdutoId, setSelectedProdutoId] = useState('');
  const [selectedProduto, setSelectedProduto] = useState<ProdutoRow | null>(null);
  
  const [vdaQtd, setVdaQtd] = useState(1);
  const [vdaPagamento, setVdaPagamento] = useState('Pix');
  const [vdaObservacao, setVdaObservacao] = useState('');
  const [vdaTipo, setVdaTipo] = useState<'VAREJO' | 'ATACADO'>('VAREJO');
  const [vdaPrecoCustomizado, setVdaPrecoCustomizado] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'sucesso' | 'erro'; text: string } | null>(null);

  // Catalog tab states
  const [catLinhaFilter, setCatLinhaFilter] = useState('');
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  // Loading core seller session criteria
  const loadSellerData = () => {
    const activeLinhas = dbSim.getLinhas().filter(l => l.STATUS === 'ATIVO');
    const products = dbSim.getProdutos();
    const sales = dbSim.getVendas().filter(v => v.ID_VENDEDOR === vendedor.ID_VENDEDOR);
    
    setLinhas(activeLinhas);
    setAllProdutos(products);
    setMinhasVendas(sales);
  };

  useEffect(() => {
    loadSellerData();
  }, [vendedor]);

  // Hook product filtering triggers when Line is selected
  useEffect(() => {
    if (selectedLinhaId) {
      const filtered = allProdutos.filter(
        p => p.ID_LINHA === selectedLinhaId && p.STATUS === 'ATIVO'
      );
      setFilteredProdutos(filtered);
      setSelectedProdutoId('');
      setSelectedProduto(null);
    } else {
      setFilteredProdutos([]);
      setSelectedProdutoId('');
      setSelectedProduto(null);
    }
  }, [selectedLinhaId, allProdutos]);

  // Load individual product price parameters
  useEffect(() => {
    if (selectedProdutoId) {
      const prod = filteredProdutos.find(p => p.ID_PRODUTO === selectedProdutoId) || null;
      setSelectedProduto(prod);
      if (prod) {
        if (vdaTipo === 'ATACADO') {
          // If the product has a custom wholesale price set in metadata, use it, otherwise default to 80% of retail price
          const priceAtacado = prod.PRECO_ATACADO !== undefined ? prod.PRECO_ATACADO : prod.PRECO_VENDA * 0.8;
          setVdaPrecoCustomizado(priceAtacado.toString());
        } else {
          setVdaPrecoCustomizado(prod.PRECO_VENDA.toString());
        }
      }
    } else {
      setSelectedProduto(null);
      setVdaPrecoCustomizado('');
    }
  }, [selectedProdutoId, filteredProdutos, vdaTipo]);

  // ---------------------------------------------------------------------------
  // Metrics calculating
  // ---------------------------------------------------------------------------
  const totalVendido = minhasVendas
    .filter(v => v.STATUS === 'APROVADO')
    .reduce((acc, v) => acc + v.VALOR_BRUTO, 0);

  const comissaoAcumulada = minhasVendas
    .filter(v => v.STATUS === 'APROVADO')
    .reduce((acc, v) => acc + v.VALOR_COMISSAO, 0);

  const qtdVendas = minhasVendas.filter(v => v.STATUS === 'APROVADO').length;

  // ---------------------------------------------------------------------------
  // Registering Sale Action
  // ---------------------------------------------------------------------------
  const handleLancarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    if (!selectedLinhaId) return setFeedbackMsg({ type: 'erro', text: 'Por favor, selecione uma Linha Comercial.' });
    if (!selectedProdutoId) return setFeedbackMsg({ type: 'erro', text: 'Por favor, escolha um Produto.' });
    if (!selectedProduto) return setFeedbackMsg({ type: 'erro', text: 'Produto inválido.' });
    if (vdaQtd <= 0) return setFeedbackMsg({ type: 'erro', text: 'Quantidade mínima de venda é 1 item.' });
    if (selectedProduto.ESTOQUE < vdaQtd) {
      return setFeedbackMsg({ 
        type: 'erro', 
        text: `Estoque insuficiente! Temos somente ${selectedProduto.ESTOQUE} unidades disponíveis en prateleira.` 
      });
    }

    const customPriceNum = vdaTipo === 'ATACADO' ? parseFloat(vdaPrecoCustomizado) : undefined;
    if (vdaTipo === 'ATACADO') {
      if (vdaPrecoCustomizado === '' || isNaN(customPriceNum!) || customPriceNum! < 0) {
        return setFeedbackMsg({ type: 'erro', text: 'Por favor, insira um preço de atacado válido.' });
      }
    }

    // Call simulated core database sale executor
    const res = dbSim.registrarVenda(
      vendedor, 
      selectedLinhaId, 
      selectedProdutoId, 
      vdaQtd, 
      vdaPagamento, 
      vdaObservacao,
      vdaTipo,
      customPriceNum
    );
    
    if (res.success) {
      setFeedbackMsg({ type: 'sucesso', text: 'Espetacular! Venda consolidada com sucesso e gravada na planilha Sheets.' });
      
      // Clean inputs
      setSelectedLinhaId('');
      setSelectedProdutoId('');
      setVdaQtd(1);
      setVdaObservacao('');
      setVdaTipo('VAREJO');
      setVdaPrecoCustomizado('');
      
      // reload live local sales history
      loadSellerData();
    } else {
      setFeedbackMsg({ type: 'erro', text: res.error || 'Falha inexplicada ao lançar venda no simulador.' });
    }
  };

  // ---------------------------------------------------------------------------
  // WhatsApp Copier Format handler
  // ---------------------------------------------------------------------------
  const handleCopyTextForWhatsApp = (p: ProdutoRow) => {
    const text = `*${p.NOME_PRODUTO}* - Orenda Group\n_Catálogo oficial da linha ${p.NOME_LINHA}_\n\n*Descrição:* ${p.DESCRICAO}\n*Preço de lançamento:* R$ ${p.PRECO_VENDA.toFixed(2)}\n\n_Dúvidas ou fechamento de pedidos? Me mande uma mensagem por aqui!_`;
    
    navigator.clipboard.writeText(text);
    setCopiedSku(p.ID_PRODUTO);
    setTimeout(() => setCopiedSku(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Metrics Mini Bento Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center space-x-4 shadow shadow-zinc-950/40">
          <div className="p-3 bg-red-950/40 border border-red-900 text-red-500 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">Volume Total Vendido</p>
            <h4 className="text-xl font-bold text-white font-mono">R$ {totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
            <p className="text-[9px] text-zinc-500 mt-0.5">Operações de comissão ativa</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-805 p-5 rounded-2xl flex items-center space-x-4 shadow shadow-zinc-950/40">
          <div className="p-3 bg-amber-950/40 border border-amber-900 text-amber-500 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">Sua Comissão Acumulada</p>
            <h4 className="text-xl font-bold text-amber-500 font-mono">R$ {comissaoAcumulada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
            <p className="text-[9px] text-zinc-500 mt-0.5">Soma creditada para PIX: {vendedor.PIX}</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center space-x-4 shadow shadow-zinc-950/40 md:col-span-2 lg:col-span-1">
          <div className="p-3 bg-zinc-950 border border-zinc-850 text-zinc-400 rounded-lg">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 font-bold">Vendas Faturadas</p>
            <h4 className="text-xl font-bold text-white leading-tight">{qtdVendas} lançamentos</h4>
            <p className="text-[9px] text-emerald-500">Aprovadas e seguras no Sheets</p>
          </div>
        </div>
      </div>

      {/* Internal Routing Tab Selector for Vendor */}
      <div className="flex bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 self-start w-fit">
        <button
          onClick={() => {
            setActiveTab('venda');
            setFeedbackMsg(null);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'venda'
              ? 'bg-cobalt-600 text-white shadow font-extrabold biotech-glow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Briefcase size={12} />
          <span>Lançar Venda</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('historico');
            setFeedbackMsg(null);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'historico'
              ? 'bg-cobalt-600 text-white shadow font-extrabold biotech-glow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FileText size={12} />
          <span>Meu Histórico de Vendas</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('catalogo');
            setFeedbackMsg(null);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'catalogo'
              ? 'bg-cobalt-600 text-white shadow font-extrabold biotech-glow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShoppingBag size={12} />
          <span>Catálogo & Whatsapp Copier</span>
        </button>
      </div>

      {/* TAB SUBSECTIONS */}
      {/* 1. SELLER LAUNCH SELL SCREEN */}
      {activeTab === 'venda' && (
        <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6 biotech-glow">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Criação de Ocorrência de Venda</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Primeiro escolha de que linha o cliente está comprando, para que o sistema carregue os produtos certificados.
            </p>
          </div>

          <form onSubmit={handleLancarVenda} className="space-y-4 font-sans text-xs font-semibold">
            {/* Linha dropdown */}
            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold block">1. Selecione a Linha de Produtos</label>
              <select
                required value={selectedLinhaId} onChange={(e) => setSelectedLinhaId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-950"
              >
                <option value="">-- Clique para escolher a Linha Comercial --</option>
                {linhas.map((l, i) => (
                  <option key={i} value={l.ID_LINHA}>{l.NOME_LINHA}</option>
                ))}
              </select>
            </div>

            {/* Produto dropdown (depends on Line) */}
            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold block">2. Escolha o Produto Correspondente</label>
              <select
                required disabled={!selectedLinhaId} value={selectedProdutoId} 
                onChange={(e) => setSelectedProdutoId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-sm text-zinc-250 focus:outline-none disabled:opacity-50"
              >
                {!selectedLinhaId ? (
                  <option value="">Aguardando seleção de Linha no campo anterior...</option>
                ) : filteredProdutos.length === 0 ? (
                  <option value="">Nenhum produto ativo encontrado nesta linha.</option>
                ) : (
                  <>
                    <option value="">-- Selecione o Produto --</option>
                    {filteredProdutos.map((p, i) => {
                      const semEstoque = p.ESTOQUE <= 0;
                      return (
                        <option key={i} value={p.ID_PRODUTO} disabled={semEstoque}>
                          {p.NOME_PRODUTO} {semEstoque ? ' [SEM ESTOQUE]' : ` (Estoque: ${p.ESTOQUE} un)`}
                        </option>
                      );
                    })}
                  </>
                )}
              </select>
            </div>

            {/* Tipo de Venda & Custom pricing option */}
            <div className="space-y-2 pt-1 border-t border-zinc-800/40">
              <label className="text-zinc-400 font-semibold block">3. Tipo de Venda</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVdaTipo('VAREJO');
                    if (selectedProduto) {
                      setVdaPrecoCustomizado(selectedProduto.PRECO_VENDA.toString());
                    }
                  }}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition text-center ${
                    vdaTipo === 'VAREJO'
                      ? 'bg-cobalt-600/10 border-cobalt-500/50 text-cobalt-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-350'
                  }`}
                >
                  Varejo (Catálogo)
                </button>
                <button
                  type="button"
                  onClick={() => setVdaTipo('ATACADO')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition text-center ${
                    vdaTipo === 'ATACADO'
                      ? 'bg-cobalt-600/10 border-cobalt-500/50 text-cobalt-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-350'
                  }`}
                >
                  🚀 Atacado (Customizável)
                </button>
              </div>
            </div>

            {vdaTipo === 'ATACADO' && selectedProduto && (
              <div className="space-y-1 animate-fade-in bg-cobalt-950/15 border border-cobalt-900/20 p-3 rounded-xl">
                <label className="text-cobalt-400 font-semibold block">Preço Unitário Praticado (Atacado)</label>
                <input
                  type="number" step="0.01" min="0" required
                  value={vdaPrecoCustomizado}
                  onChange={(e) => setVdaPrecoCustomizado(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-cobalt-500 rounded p-2 text-sm text-white font-mono font-bold"
                  placeholder="Defina o preço negociado..."
                />
                <p className="text-[10px] text-zinc-500">O preço padrão de varejo é R$ {selectedProduto.PRECO_VENDA.toFixed(2)}</p>
              </div>
            )}

            {/* Simulated Live preview computed card if product loaded */}
            {selectedProduto && (() => {
              const currentComissaoPercent = (vdaTipo === 'ATACADO' && selectedProduto.COMISSAO_ATACADO_PERCENTUAL !== undefined)
                ? selectedProduto.COMISSAO_ATACADO_PERCENTUAL
                : selectedProduto.COMISSAO_PERCENTUAL;
              const precoUnitario = vdaTipo === 'ATACADO' ? (parseFloat(vdaPrecoCustomizado) || 0) : selectedProduto.PRECO_VENDA;
              const comissaoUnidade = (precoUnitario * currentComissaoPercent) / 100;
              const valorBrutoTotal = precoUnitario * vdaQtd;
              const valorComissaoTotal = comissaoUnidade * vdaQtd;

              return (
                <>
                  <div className="grid grid-cols-2 gap-4 bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-550 uppercase">Preço Unitário</p>
                      <p className="text-sm font-bold text-white font-mono">
                        R$ {precoUnitario.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-amber-500 uppercase">Comissão Estimada por Unidade ({currentComissaoPercent}%)</p>
                      <p className="text-sm font-bold text-amber-500 font-mono">
                        R$ {comissaoUnidade.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Computed Gross amount & total commission metrics box before hit submit */}
                  <div className="p-3 bg-cobalt-950/20 border border-cobalt-900/30 rounded-lg text-[11px] font-mono leading-relaxed space-y-1 text-zinc-400">
                    <div className="flex justify-between">
                      <span>Valor Bruto Total:</span>
                      <span className="text-white font-bold">R$ {valorBrutoTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sua Comissão Acumulada:</span>
                      <span className="text-amber-500 font-bold">R$ {valorComissaoTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Quantity and Form payment */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">Quantidade Comprada</label>
                <input
                  type="number" min="1" required value={vdaQtd} 
                  onChange={(e) => setVdaQtd(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-zinc-100 text-center font-bold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold font-sans">Forma de Pagamento</label>
                <select
                  required value={vdaPagamento} onChange={(e) => setVdaPagamento(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-zinc-200"
                >
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de crédito">Cartão de Crédito</option>
                  <option value="Cartão de débito">Cartão de Débito</option>
                  <option value="Link de pagamento">Link de Pagamento</option>
                  <option value="Boleto">Boleto</option>
                </select>
              </div>
            </div>

            {/* Observação / delivery */}
            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold block">Notas Especiais de Controle/Comercial</label>
              <textarea
                value={vdaObservacao} onChange={(e) => setVdaObservacao(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 h-16 text-zinc-350 text-xs"
                placeholder="ex: Cliente vai buscar na loja, ou endereço de entrega..."
              />
            </div>

            {feedbackMsg && (
              <div className={`p-4 rounded-lg flex space-x-2 text-xs font-medium leading-relaxed border ${
                feedbackMsg.type === 'sucesso' 
                  ? 'bg-emerald-950/40 border-emerald-900 text-emerald-450' 
                  : 'bg-rose-950/40 border-rose-900 text-rose-455'
              }`}>
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-cobalt-600 hover:bg-cobalt-500 text-white font-semibold text-xs tracking-wider uppercase transition rounded-xl active:scale-97 hover:shadow-lg hover:shadow-cobalt-600/10"
            >
              Registrar Venda & Descontar Estoque
            </button>
          </form>
        </div>
      )}

      {/* 2. MEU HISTORICO SCREEN (Seller sees ONLY their own sales) */}
      {activeTab === 'historico' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-white">Relatório Pessoal de Vendas</h3>
            <p className="text-xs text-zinc-450">Tabela de lançamentos efetuados por você e sincronizados em tempo real no Sheets do administrador</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-805 text-zinc-500 font-mono uppercase text-[9px]">
                    <th className="p-4">CÓD V_S</th>
                    <th className="p-4">DATA & HORA</th>
                    <th className="p-4">LINHA COMERCIAL</th>
                    <th className="p-4">PRODUTO FATURADO</th>
                    <th className="p-4 text-center">QTD</th>
                    <th className="p-4 text-right">VALOR BRUTO</th>
                    <th className="p-4">FORMA PAGAMENTO</th>
                    <th className="p-3 text-amber-500">COMISSÃO %</th>
                    <th className="p-4 text-right text-amber-500 font-mono">Sua comissão</th>
                    <th className="p-4">STATUS REVISÃO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300">
                  {minhasVendas.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-zinc-550 italic font-medium">
                        Você ainda não lançou vendas com esta conta comercial. Use a aba "Lançar Venda" para começar!
                      </td>
                    </tr>
                  ) : (
                    minhasVendas.slice().reverse().map((mv, i) => (
                      <tr key={i} className="hover:bg-zinc-850/50">
                        <td className="p-4 font-mono text-zinc-500 font-semibold">{mv.ID_VENDA}</td>
                        <td className="p-4 text-zinc-500 font-mono whitespace-nowrap">{mv.DATA_HORA}</td>
                        <td className="p-4 font-bold text-zinc-400">{mv.NOME_LINHA}</td>
                        <td className="p-4 font-bold text-white text-sm">{mv.NOME_PRODUTO}</td>
                        <td className="p-4 text-center font-bold">{mv.QUANTIDADE}</td>
                        <td className="p-4 font-bold font-mono text-right text-zinc-150">R$ {mv.VALOR_BRUTO.toFixed(2)}</td>
                        <td className="p-4 uppercase text-zinc-450 font-semibold tracking-wide">{mv.FORMA_PAGAMENTO}</td>
                        <td className="p-3 text-amber-500 font-bold font-mono text-center">{mv.COMISSAO_PERCENTUAL}%</td>
                        <td className="p-4 font-bold font-mono text-right text-amber-500">R$ {mv.VALOR_COMISSAO.toFixed(2)}</td>
                        <td className="p-4">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-950 text-emerald-500 border border-emerald-900/40">
                            {mv.STATUS}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATÁLOGO COM COPIAR PARA WHATSAPP */}
      {activeTab === 'catalogo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header query with Line Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div>
              <h3 className="font-bold text-sm text-white">Catálogo de Negociação</h3>
              <p className="text-xs text-zinc-400">Copie textos de atração prontos com formatação em negrito para despachar aos clientes no WhatsApp</p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Filter size={13} className="text-zinc-500" />
              <select
                value={catLinhaFilter} onChange={(e) => setCatLinhaFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-300 font-semibold"
              >
                <option value="">-- Ver todas as Linhas --</option>
                {linhas.map((l, i) => <option key={i} value={l.ID_LINHA}>{l.NOME_LINHA}</option>)}
              </select>
            </div>
          </div>

          {/* Cards Bento Grid Catalog */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProdutos
              .filter(p => {
                if (p.STATUS !== 'ATIVO') return false;
                if (catLinhaFilter && p.ID_LINHA !== catLinhaFilter) return false;
                return true;
              })
              .map((p, i) => {
                const isCopied = copiedSku === p.ID_PRODUTO;
                const isOutOfStock = p.ESTOQUE <= 0;
                
                return (
                  <div 
                    key={i} 
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    {/* Beautiful Premium gradient banner representing the Line segment */}
                    <div className="h-28 bg-gradient-to-br from-zinc-950 via-zinc-900 to-red-950/20 p-5 flex flex-col justify-between border-b border-zinc-800">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold tracking-wider text-amber-500 uppercase">
                          {p.CATEGORIA}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold border ${isOutOfStock ? 'bg-zinc-950 text-red-500 border-red-900/40' : 'bg-zinc-950 text-emerald-400 border-emerald-900/40'}`}>
                          {isOutOfStock ? 'SEM ESTOQUE' : `ESTOQUE: ${p.ESTOQUE} un`}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white tracking-tight">{p.NOME_PRODUTO}</h4>
                        <p className="text-[10px] text-zinc-500 font-semibold italic">{p.NOME_LINHA}</p>
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                        {p.DESCRICAO || 'Nenhuma descrição técnica providenciada para este SKU.'}
                      </p>

                      <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] uppercase font-mono text-zinc-500">Valor Sugerido</span>
                          <span className="text-lg font-black text-white font-mono">
                            R$ {p.PRECO_VENDA.toFixed(2)}
                          </span>
                        </div>

                        {/* Button copy formatting WhatsApp */}
                        <button
                          onClick={() => handleCopyTextForWhatsApp(p)}
                          className={`w-full py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-xs font-bold transition border ${
                            isCopied 
                              ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400' 
                              : 'bg-zinc-950 hover:bg-zinc-850 border-zinc-800 text-zinc-305'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} />
                              <span>Texto estruturado copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copiar Pitch para WhatsApp</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

    </div>
  );
}
