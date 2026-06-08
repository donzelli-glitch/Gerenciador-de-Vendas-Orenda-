/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { dbSim } from '../dbSim';
import { LinhaRow, ProdutoRow, VendedorRow, VendaRow, ConfigRow } from '../types';
import { 
  DollarSign, Percent, ArrowUpRight, TrendingUp, AlertTriangle, List, 
  ShoppingBag, ClipboardList, Settings, UserCheck, ShieldAlert, BarChart2,
  Calendar, RotateCcw, Share2, Plus, Edit2, CheckCircle, XCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  adminEmail: string;
}

export default function AdminDashboard({ onLogout, adminEmail }: AdminDashboardProps) {
  const [activeMenu, setActiveMenu] = useState<'overview' | 'linhas' | 'produtos' | 'vendedores' | 'taxas' | 'relatorios'>('overview');

  // Database States
  const [linhas, setLinhas] = useState<LinhaRow[]>(() => dbSim.getLinhas());
  const [produtos, setProdutos] = useState<ProdutoRow[]>(() => dbSim.getProdutos());
  const [vendedores, setVendedores] = useState<VendedorRow[]>(() => dbSim.getVendedores());
  const [vendas, setVendas] = useState<VendaRow[]>(() => dbSim.getVendas());
  const [configs, setConfigs] = useState<ConfigRow[]>(() => dbSim.getConfigs());

  // Input states for lines (creation/editing)
  const [isLinhaModalOpen, setIsLinhaModalOpen] = useState(false);
  const [editingLinha, setEditingLinha] = useState<Partial<LinhaRow> | null>(null);
  const [linhaNome, setLinhaNome] = useState('');
  const [linhaDesc, setLinhaDesc] = useState('');
  const [linhaStatus, setLinhaStatus] = useState<'ATIVO' | 'INATIVO'>('ATIVO');

  // Input states for products (creation/editing)
  const [isProdutoModalOpen, setIsProdutoModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Partial<ProdutoRow> | null>(null);
  const [prodLinhaId, setProdLinhaId] = useState('');
  const [prodNome, setProdNome] = useState('');
  const [prodCategoria, setProdCategoria] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPreco, setProdPreco] = useState(0);
  const [prodPrecoAtacado, setProdPrecoAtacado] = useState(0);
  const [prodCusto, setProdCusto] = useState(0);
  const [prodComissao, setProdComissao] = useState(10);
  const [prodComissaoAtacado, setProdComissaoAtacado] = useState(5);
  const [prodEstoque, setProdEstoque] = useState(10);
  const [prodEstoqueMin, setProdEstoqueMin] = useState(5);
  const [prodStatus, setProdStatus] = useState<'ATIVO' | 'INATIVO'>('ATIVO');
  const [prodObs, setProdObs] = useState('');

  // Input states for rates
  const [ratePix, setRatePix] = useState(() => configs.find(c => c.CHAVE === 'TAXA_PIX')?.VALOR || '0.5');
  const [rateDinheiro, setRateDinheiro] = useState(() => configs.find(c => c.CHAVE === 'TAXA_DINHEIRO')?.VALOR || '0');
  const [rateCredito, setRateCredito] = useState(() => configs.find(c => c.CHAVE === 'TAXA_CREDITO')?.VALOR || '3.99');
  const [rateDebito, setRateDebito] = useState(() => configs.find(c => c.CHAVE === 'TAXA_DEBITO')?.VALOR || '1.99');
  const [rateLink, setRateLink] = useState(() => configs.find(c => c.CHAVE === 'TAXA_LINK')?.VALOR || '4.99');
  const [rateBoleto, setRateBoleto] = useState(() => configs.find(c => c.CHAVE === 'TAXA_BOLETO')?.VALOR || '2.50');

  // Filters for reports
  const [repDateInicio, setRepDateInicio] = useState('2026-06-01');
  const [repDateFim, setRepDateFim] = useState('2026-06-30');
  const [repVendedorFilter, setRepVendedorFilter] = useState('');
  const [repLinhaFilter, setRepLinhaFilter] = useState('');

  const refreshLocalState = () => {
    setLinhas(dbSim.getLinhas());
    setProdutos(dbSim.getProdutos());
    setVendedores(dbSim.getVendedores());
    setVendas(dbSim.getVendas());
    setConfigs(dbSim.getConfigs());
  };

  // ---------------------------------------------------------------------------
  // Calculations
  // ---------------------------------------------------------------------------
  const totalVendasCount = vendas.length;
  
  // Total Gross revenue
  const faturamentoDoMes = vendas
    .filter(v => v.STATUS === 'APROVADO')
    .reduce((acc, v) => acc + v.VALOR_BRUTO, 0);

  // Today faturamento (simulated using time current 2026-06-08 check)
  const faturamentoDoDia = vendas
    .filter(v => v.STATUS === 'APROVADO' && v.DATA_HORA.startsWith('2026-06-08'))
    .reduce((acc, v) => acc + v.VALOR_BRUTO, 0);

  // Rest values
  const totalTaxas = vendas
    .filter(v => v.STATUS === 'APROVADO')
    .reduce((acc, v) => acc + v.VALOR_TAXA, 0);

  const totalComissoes = vendas
    .filter(v => v.STATUS === 'APROVADO')
    .reduce((acc, v) => acc + v.VALOR_COMISSAO, 0);

  const valorLiquido = faturamentoDoMes - totalTaxas - totalComissoes;

  // Lucro estimado = valor_liquido - custo_total
  const custoTotal = vendas
    .filter(v => v.STATUS === 'APROVADO')
    .reduce((acc, v) => {
      const prod = produtos.find(p => p.ID_PRODUTO === v.ID_PRODUTO);
      const custoProd = prod ? prod.CUSTO : 0;
      return acc + (custoProd * v.QUANTIDADE);
    }, 0);

  const lucroEstimado = valorLiquido - custoTotal;
  const ticketMedio = totalVendasCount > 0 ? faturamentoDoMes / totalVendasCount : 0;

  // Alerts on lower items
  const produtosEstoqueBaixoCount = produtos.filter(p => p.STATUS === 'ATIVO' && p.ESTOQUE <= p.ESTOQUE_MINIMO).length;

  // ---------------------------------------------------------------------------
  // LINE ACTIONS
  // ---------------------------------------------------------------------------
  const handleOpenLinhaModal = (linha: Partial<LinhaRow> | null = null) => {
    if (linha) {
      setEditingLinha(linha);
      setLinhaNome(linha.NOME_LINHA || '');
      setLinhaDesc(linha.DESCRICAO || '');
      setLinhaStatus(linha.STATUS || 'ATIVO');
    } else {
      setEditingLinha(null);
      setLinhaNome('');
      setLinhaDesc('');
      setLinhaStatus('ATIVO');
    }
    setIsLinhaModalOpen(true);
  };

  const handleSaveLinha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linhaNome.trim()) return alert("Nome da linha obrigatório");

    const activeLines = dbSim.getLinhas();
    if (editingLinha && editingLinha.ID_LINHA) {
      // Edit mode
      const updated = activeLines.map(l => {
        if (l.ID_LINHA === editingLinha.ID_LINHA) {
          return {
            ...l,
            NOME_LINHA: linhaNome,
            DESCRICAO: linhaDesc,
            STATUS: linhaStatus
          };
        }
        return l;
      });
      dbSim.saveLinhas(updated);
      dbSim.addLog(adminEmail, 'ADMIN', 'Atualização de Linha', `Sucesso ao editar a linha comercial: ${linhaNome} (${editingLinha.ID_LINHA})`);
    } else {
      // Create mode
      const newId = `L${activeLines.length + 1}`;
      const nova: LinhaRow = {
        ID_LINHA: newId,
        DATA_CADASTRO: dbSim.nowStr(),
        NOME_LINHA: linhaNome,
        DESCRICAO: linhaDesc,
        STATUS: linhaStatus
      };
      activeLines.push(nova);
      dbSim.saveLinhas(activeLines);
      dbSim.addLog(adminEmail, 'ADMIN', 'Criação de Linha', `Criou nova linha sob nome ${linhaNome} (${newId})`);
    }

    setIsLinhaModalOpen(false);
    refreshLocalState();
  };

  const handleToggleLinhaStatus = (id: string) => {
    const activeLines = dbSim.getLinhas();
    const updated = activeLines.map(l => {
      if (l.ID_LINHA === id) {
        const nextStatus = l.STATUS === 'ATIVO' ? 'INATIVO' : 'ATIVO';
        dbSim.addLog(adminEmail, 'ADMIN', 'Alteração Status Linha', `Linha ${l.NOME_LINHA} alterada de ${l.STATUS} para ${nextStatus}`);
        return { ...l, STATUS: nextStatus as any };
      }
      return l;
    });
    dbSim.saveLinhas(updated);
    refreshLocalState();
  };

  // ---------------------------------------------------------------------------
  // PRODUCT ACTIONS
  // ---------------------------------------------------------------------------
  const handleOpenProdutoModal = (prod: Partial<ProdutoRow> | null = null) => {
    if (prod) {
      setEditingProduto(prod);
      setProdLinhaId(prod.ID_LINHA || '');
      setProdNome(prod.NOME_PRODUTO || '');
      setProdCategoria(prod.CATEGORIA || '');
      setProdDesc(prod.DESCRICAO || '');
      setProdPreco(prod.PRECO_VENDA || 0);
      setProdPrecoAtacado(prod.PRECO_ATACADO || Number((prod.PRECO_VENDA ? prod.PRECO_VENDA * 0.8 : 0).toFixed(2)));
      setProdCusto(prod.CUSTO || 0);
      setProdComissao(prod.COMISSAO_PERCENTUAL || 10);
      setProdComissaoAtacado(prod.COMISSAO_ATACADO_PERCENTUAL || 5);
      setProdEstoque(prod.ESTOQUE || 0);
      setProdEstoqueMin(prod.ESTOQUE_MINIMO || 5);
      setProdStatus(prod.STATUS || 'ATIVO');
      setProdObs(prod.OBSERVACAO || '');
    } else {
      setEditingProduto(null);
      setProdLinhaId(linhas[0]?.ID_LINHA || '');
      setProdNome('');
      setProdCategoria('');
      setProdDesc('');
      setProdPreco(0);
      setProdPrecoAtacado(0);
      setProdCusto(0);
      setProdComissao(10);
      setProdComissaoAtacado(5);
      setProdEstoque(15);
      setProdEstoqueMin(5);
      setProdStatus('ATIVO');
      setProdObs('');
    }
    setIsProdutoModalOpen(true);
  };

  const handleSaveProduto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNome.trim()) return alert("Nome do produto obrigatório");
    if (!prodLinhaId) return alert("Selecione uma linha comercial");
    
    // Numeric rules safety
    if (prodPreco < 0 || prodPrecoAtacado < 0 || prodCusto < 0 || prodComissao < 0 || prodComissaoAtacado < 0 || prodEstoque < 0 || prodEstoqueMin < 0) {
      return alert("Não são permitidos valores fiscais, de comissões ou de inventário negativos!");
    }

    const activeProds = dbSim.getProdutos();
    const targetLinha = linhas.find(l => l.ID_LINHA === prodLinhaId);
    const nomeLinhaCur = targetLinha ? targetLinha.NOME_LINHA : 'Indefinido';

    if (editingProduto && editingProduto.ID_PRODUTO) {
      // Edit
      const origProd = activeProds.find(p => p.ID_PRODUTO === editingProduto.ID_PRODUTO);
      const updated = activeProds.map(p => {
        if (p.ID_PRODUTO === editingProduto.ID_PRODUTO) {
          // If stock differs, log movement
          if (origProd && origProd.ESTOQUE !== prodEstoque) {
            const diff = prodEstoque - origProd.ESTOQUE;
            const estoqueLog = dbSim.getEstoque();
            estoqueLog.unshift({
              ID_MOVIMENTO: `M${estoqueLog.length + 1}_${Date.now().toString().slice(-3)}`,
              DATA_HORA: dbSim.nowStr(),
              ID_PRODUTO: p.ID_PRODUTO,
              NOME_PRODUTO: prodNome,
              TIPO_MOVIMENTO: diff > 0 ? 'ENTRADA' : 'SAIDA',
              ENTRADA: diff > 0 ? diff : 0,
              SAIDA: diff < 0 ? Math.abs(diff) : 0,
              SALDO: prodEstoque,
              RESPONSAVEL: 'Administrador (Painel)',
              OBSERVACAO: 'Ajuste manual de estoque no cadastro'
            });
            dbSim.saveEstoque(estoqueLog);
          }
          return {
            ...p,
            ID_LINHA: prodLinhaId,
            NOME_LINHA: nomeLinhaCur,
            NOME_PRODUTO: prodNome,
            CATEGORIA: prodCategoria,
            DESCRICAO: prodDesc,
            PRECO_VENDA: Number(prodPreco),
            PRECO_ATACADO: Number(prodPrecoAtacado),
            CUSTO: Number(prodCusto),
            COMISSAO_PERCENTUAL: Number(prodComissao),
            COMISSAO_ATACADO_PERCENTUAL: Number(prodComissaoAtacado),
            ESTOQUE: Number(prodEstoque),
            ESTOQUE_MINIMO: Number(prodEstoqueMin),
            STATUS: prodStatus,
            OBSERVACAO: prodObs
          };
        }
        return p;
      });
      dbSim.saveProdutos(updated);
      dbSim.addLog(adminEmail, 'ADMIN', 'Produto Editado', `Modificou produto ${prodNome} SKU ID ${editingProduto.ID_PRODUTO}`);
    } else {
      // Create
      const newSku = `P${activeProds.length + 1}_${Date.now().toString().slice(-4)}`;
      const novo: ProdutoRow = {
        ID_PRODUTO: newSku,
        DATA_CADASTRO: dbSim.nowStr(),
        ID_LINHA: prodLinhaId,
        NOME_LINHA: nomeLinhaCur,
        NOME_PRODUTO: prodNome,
        CATEGORIA: prodCategoria,
        DESCRICAO: prodDesc,
        PRECO_VENDA: Number(prodPreco),
        PRECO_ATACADO: Number(prodPrecoAtacado),
        CUSTO: Number(prodCusto),
        COMISSAO_PERCENTUAL: Number(prodComissao),
        COMISSAO_ATACADO_PERCENTUAL: Number(prodComissaoAtacado),
        ESTOQUE: Number(prodEstoque),
        ESTOQUE_MINIMO: Number(prodEstoqueMin),
        STATUS: prodStatus,
        OBSERVACAO: prodObs
      };
      activeProds.push(novo);
      dbSim.saveProdutos(activeProds);

      // Ledger movement tracking
      const estoqueLog = dbSim.getEstoque();
      estoqueLog.unshift({
        ID_MOVIMENTO: `M${estoqueLog.length + 1}_${Date.now().toString().slice(-3)}`,
        DATA_HORA: dbSim.nowStr(),
        ID_PRODUTO: newSku,
        NOME_PRODUTO: prodNome,
        TIPO_MOVIMENTO: 'ENTRADA',
        ENTRADA: Number(prodEstoque),
        SAIDA: 0,
        SALDO: Number(prodEstoque),
        RESPONSAVEL: 'Administrador (Cadastro)',
        OBSERVACAO: 'Inventário de inclusão inicial'
      });
      dbSim.saveEstoque(estoqueLog);

      dbSim.addLog(adminEmail, 'ADMIN', 'Produto Criado', `Criou novo produto SKU ${newSku} (${prodNome})`);
    }

    setIsProdutoModalOpen(false);
    refreshLocalState();
  };

  const handleToggleProdutoStatus = (id: string) => {
    const activeProds = dbSim.getProdutos();
    const updated = activeProds.map(p => {
      if (p.ID_PRODUTO === id) {
        const nextStatus = p.STATUS === 'ATIVO' ? 'INATIVO' : 'ATIVO';
        dbSim.addLog(adminEmail, 'ADMIN', 'Status Produto', `Alterou produto ${p.NOME_PRODUTO} para status ${nextStatus}`);
        return { ...p, STATUS: nextStatus as any };
      }
      return p;
    });
    dbSim.saveProdutos(updated);
    refreshLocalState();
  };

  // ---------------------------------------------------------------------------
  // RATES ACTION
  // ---------------------------------------------------------------------------
  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    const pPix = parseFloat(ratePix);
    const pMoney = parseFloat(rateDinheiro);
    const pCred = parseFloat(rateCredito);
    const pDeb = parseFloat(rateDebito);
    const pLink = parseFloat(rateLink);
    const pBol = parseFloat(rateBoleto);

    if (pPix < 0 || pMoney < 0 || pCred < 0 || pDeb < 0 || pLink < 0 || pBol < 0) {
      return alert("As taxas financeiras não podem ser negativas.");
    }

    const currentConfigs = dbSim.getConfigs();
    const keysMap: Record<string, string> = {
      'TAXA_PIX': ratePix,
      'TAXA_DINHEIRO': rateDinheiro,
      'TAXA_CREDITO': rateCredito,
      'TAXA_DEBITO': rateDebito,
      'TAXA_LINK': rateLink,
      'TAXA_BOLETO': rateBoleto
    };

    const updated = currentConfigs.map(c => {
      if (keysMap[c.CHAVE] !== undefined) {
        return { ...c, VALOR: keysMap[c.CHAVE] };
      }
      return c;
    });

    dbSim.saveConfigs(updated);
    dbSim.addLog(adminEmail, 'ADMIN', 'Configurações de Taxas', 'Atualizou as taxas de tarifas de cobrança em lote.');
    alert("Taxas aplicadas e atualizadas no simulador de banco de dados do Sheets!");
    refreshLocalState();
  };

  // ---------------------------------------------------------------------------
  // SELLER CONTROLS
  // ---------------------------------------------------------------------------
  const handleSetSellerStatus = (id: string, nextStatus: 'APROVADO' | 'BLOQUEADO') => {
    if (nextStatus === 'APROVADO') {
      dbSim.aprovarVendedor(id, adminEmail);
    } else {
      dbSim.bloquearVendedor(id, adminEmail);
    }
    refreshLocalState();
  };

  // ---------------------------------------------------------------------------
  // CUSTOM ANALYTICS VISUALIZATIONS GENERATORS
  // ---------------------------------------------------------------------------
  // Vendas por Linha
  const vendasPorLinha = linhas.map(l => {
    const totalLinhaBruto = vendas
      .filter(v => v.ID_LINHA === l.ID_LINHA && v.STATUS === 'APROVADO')
      .reduce((acc, v) => acc + v.VALOR_BRUTO, 0);
    return { name: l.NOME_LINHA, value: totalLinhaBruto };
  }).filter(item => item.value > 0);

  // Vendas por Vendedor
  const rankingVendedores = vendedores.map(v => {
    const totalVend = vendas
      .filter(vd => vd.ID_VENDEDOR === v.ID_VENDEDOR && vd.STATUS === 'APROVADO')
      .reduce((acc, vd) => acc + vd.VALOR_BRUTO, 0);
    return { name: v.NOME, value: totalVend, whatsapp: v.WHATSAPP };
  }).sort((a,b) => b.value - a.value);

  // Produtos mais vendidos
  const produtosRanking = produtos.map(p => {
    const totalQtd = vendas
      .filter(vd => vd.ID_PRODUTO === p.ID_PRODUTO && vd.STATUS === 'APROVADO')
      .reduce((acc, vd) => acc + vd.QUANTIDADE, 0);
    return { name: p.NOME_PRODUTO, totalQtd, linha: p.NOME_LINHA };
  }).filter(pr => pr.totalQtd > 0).sort((a,b) => b.totalQtd - a.totalQtd);


  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-66px)] animate-fade-in">
      {/* Dynamic Drawer Menu */}
      <aside className="w-full lg:w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 px-1">
            <span className="p-1 px-2 rounded-md bg-cobalt-600/10 border border-cobalt-500/20 text-xs font-black text-cobalt-450 font-mono tracking-widest uppercase">
              ADMIN
            </span>
            <span className="text-xs text-zinc-500 font-mono">Controle Completo</span>
          </div>

          <nav className="space-y-1 text-sm font-medium">
            <button
              onClick={() => setActiveMenu('overview')}
              className={`w-full py-2.5 px-3 rounded-lg flex items-center space-x-3 transition ${
                activeMenu === 'overview'
                  ? 'bg-cobalt-600 text-white font-bold biotech-glow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <BarChart2 size={16} />
              <span>Painel Geral & Gráficos</span>
            </button>
            <button
              onClick={() => setActiveMenu('linhas')}
              className={`w-full py-2.5 px-3 rounded-lg flex items-center space-x-3 transition ${
                activeMenu === 'linhas'
                  ? 'bg-cobalt-600 text-white font-bold biotech-glow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <List size={16} />
              <span>Gestão de Linhas</span>
            </button>
            <button
              onClick={() => setActiveMenu('produtos')}
              className={`w-full py-2.5 px-3 rounded-lg flex items-center space-x-3 transition ${
                activeMenu === 'produtos'
                  ? 'bg-cobalt-600 text-white font-bold biotech-glow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <ShoppingBag size={16} />
              <span>Gestão de Produtos</span>
            </button>
            <button
              onClick={() => setActiveMenu('vendedores')}
              className={`w-full py-2.5 px-3 rounded-lg flex items-center space-x-3 transition relative ${
                activeMenu === 'vendedores'
                  ? 'bg-cobalt-600 text-white font-bold biotech-glow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <UserCheck size={16} />
              <span>Gestão de Vendedores</span>
              {vendedores.some(v => v.STATUS === 'PENDENTE') && (
                <span className="absolute right-3 top-2.5 h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => setActiveMenu('taxas')}
              className={`w-full py-2.5 px-3 rounded-lg flex items-center space-x-3 transition ${
                activeMenu === 'taxas'
                  ? 'bg-cobalt-600 text-white font-bold biotech-glow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <Settings size={16} />
              <span>Editar Taxas Financeiras</span>
            </button>
            <button
              onClick={() => setActiveMenu('relatorios')}
              className={`w-full py-2.5 px-3 rounded-lg flex items-center space-x-3 transition ${
                activeMenu === 'relatorios'
                  ? 'bg-cobalt-600 text-white font-bold biotech-glow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <ClipboardList size={16} />
              <span>Relatório de Auditoria</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800/80 space-y-3">
          <div className="bg-zinc-950 p-3 rounded border border-zinc-850 text-wrap leading-relaxed text-[10px] font-mono text-zinc-500">
            <p className="text-white font-semibold">User: {adminEmail}</p>
            <p>Sessão Segura ativa localmente.</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2 bg-zinc-950 text-xs font-semibold text-red-500 border border-zinc-800 hover:border-red-900 rounded-lg hover:bg-red-950/20 transition active:scale-98"
          >
            Sair do Painel Admin
          </button>
        </div>
      </aside>

      {/* Main Panel Frame View */}
      <main className="flex-grow p-6 lg:p-8 space-y-6">
        
        {/* OVERVIEW COMPONENT */}
        {activeMenu === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">COCKPIT DE COMISSÕES</h2>
                <p className="text-zinc-400 text-xs mt-1">Visão geral sobre tarifas de pagamento, faturamentos, margens e status de estoque</p>
              </div>
              <p className="text-xs font-mono text-zinc-500">Última atualização: {dbSim.nowStr()}</p>
            </div>

            {/* Quick Metrics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1 flex flex-col justify-between">
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Faturamento do Dia</p>
                <h4 className="text-xl font-bold text-emerald-500 font-mono">R$ {faturamentoDoDia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                <p className="text-[9px] text-zinc-650">De {dbSim.nowStr().split(' ')[0]}</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1 flex flex-col justify-between">
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Faturamento Acumulado</p>
                <h4 className="text-xl font-bold text-white font-mono">R$ {faturamentoDoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                <p className="text-[9px] text-zinc-650">Lançamentos ativos</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1 flex flex-col justify-between">
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Comissão Devida</p>
                <h4 className="text-xl font-bold text-amber-500 font-mono">R$ {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                <p className="text-[9px] text-zinc-650">Consignados ao time</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1 flex flex-col justify-between">
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Tarifas Retidas</p>
                <h4 className="text-xl font-bold text-red-500 font-mono">R$ {totalTaxas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                <p className="text-[9px] text-zinc-650">Cobranças operacionais</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1 flex flex-col justify-between col-span-2 md:col-span-1">
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Líquido de Vendas</p>
                <h4 className="text-xl font-bold text-zinc-100 font-mono">R$ {valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                <p className="text-[9px] text-emerald-500/85">Lucro Est. Margem: R$ {lucroEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Quick mini-cards for ticket & low stock alert popup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-mono uppercase text-zinc-500">Total de Vendas</p>
                  <p className="text-2xl font-bold text-zinc-100">{totalVendasCount} lançamentos</p>
                </div>
                <TrendingUp className="text-zinc-650" size={36} />
              </div>

              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-mono uppercase text-zinc-500">Ticket Médio</p>
                  <p className="text-2xl font-bold text-emerald-500 font-mono">R$ {ticketMedio.toFixed(2)}</p>
                </div>
                <DollarSign className="text-zinc-650" size={36} />
              </div>

              <div className={`p-4 rounded-xl border transition ${
                produtosEstoqueBaixoCount > 0 
                  ? 'bg-amber-950/20 border-amber-800 text-amber-500' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              } flex items-center justify-between`}>
                <div>
                  <p className="text-[9px] font-mono uppercase">Produtos com Estoque Baixo</p>
                  <p className={`text-2xl font-bold ${produtosEstoqueBaixoCount > 0 ? 'text-amber-500' : 'text-zinc-300'}`}>
                    {produtosEstoqueBaixoCount} SKU
                  </p>
                </div>
                <AlertTriangle className={produtosEstoqueBaixoCount > 0 ? 'text-amber-500' : 'text-zinc-650'} size={36} />
              </div>
            </div>

            {/* Interactive Custom SVG/Grid Bar Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Sales volume per category or segment line */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                  <BarChart2 size={16} className="text-red-500" />
                  <span>Participação de Faturamento por Linha (R$)</span>
                </h3>
                <div className="space-y-3">
                  {vendasPorLinha.length === 0 ? (
                    <p className="text-xs text-zinc-500">Nenhum faturamento registrado para gerar gráficos.</p>
                  ) : (
                    vendasPorLinha.map((v, i) => {
                      const percentage = Math.round((v.value / faturamentoDoMes) * 100) || 0;
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-400 font-semibold">{v.name}</span>
                            <span className="text-zinc-150 font-bold font-mono">R$ {v.value.toFixed(2)} ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                            <div 
                              className="h-full bg-gradient-to-r from-red-850 to-amber-500 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chart 2: Top salespersons commission and sales */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                  <UserCheck size={16} className="text-amber-500" />
                  <span>Ranking de Faturamento dos Vendedores (R$)</span>
                </h3>
                <div className="space-y-3">
                  {rankingVendedores.length === 0 ? (
                    <p className="text-xs text-zinc-500">Dentre os vendedores autorizados, nenhum faturamento foi lançado.</p>
                  ) : (
                    rankingVendedores.slice(0, 5).map((r, i) => {
                      const maxVal = Math.max(...rankingVendedores.map(rv => rv.value)) || 1;
                      const percentage = Math.round((r.value / maxVal) * 100) || 0;
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-300 font-bold">#{i+1} {r.name}</span>
                            <span className="text-emerald-450 font-mono font-bold">R$ {r.value.toFixed(2)}</span>
                          </div>
                          <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Bottom table summaries */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Dynamic Alerts Low Stock box */}
              <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2 text-amber-550">
                    <AlertTriangle size={15} />
                    <span>Estoque Crítico / Necessita Reposição</span>
                  </h3>
                  <span className="bg-amber-950 text-amber-500 border border-amber-900 text-[10px] px-2 py-0.5 rounded font-mono font-bold font-black uppercase">
                    {produtosEstoqueBaixoCount} alertas
                  </span>
                </div>

                <div className="divide-y divide-zinc-850">
                  {produtos.filter(p => p.STATUS === 'ATIVO' && p.ESTOQUE <= p.ESTOQUE_MINIMO).length === 0 ? (
                    <p className="text-xs text-zinc-550 py-4 text-center">Nenhum produto está abaixo do limite de estoque mínimo.</p>
                  ) : (
                    produtos.filter(p => p.STATUS === 'ATIVO' && p.ESTOQUE <= p.ESTOQUE_MINIMO).map((p, i) => (
                      <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <p className="text-white font-bold">{p.NOME_PRODUTO}</p>
                          <p className="text-[10px] text-zinc-500 font-mono tracking-wider">{p.NOME_LINHA}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-rose-500 font-bold font-mono">Saldo: {p.ESTOQUE} un</p>
                          <p className="text-[10px] text-zinc-500">Mínimo: {p.ESTOQUE_MINIMO} un</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-4">
                <h3 className="font-bold text-sm text-blue-450 flex items-center space-x-2">
                  <ShoppingBag size={15} />
                  <span>Produtos Mais Vendidos (Volume de Saídas)</span>
                </h3>

                <div className="divide-y divide-zinc-850">
                  {produtosRanking.length === 0 ? (
                    <p className="text-xs text-zinc-550 py-4 text-center">Nenhum produto teve comissão disparada por vendas no histórico.</p>
                  ) : (
                    produtosRanking.slice(0, 5).map((pr, i) => (
                      <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <p className="text-white font-bold">{pr.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{pr.linha}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-850 text-emerald-400 font-bold font-mono">
                          {pr.totalQtd} un vendidas
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MANAGE LINHAS COMPONENT */}
        {activeMenu === 'linhas' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Linhas de Negócios Orenda</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Defina as as ramificações de comissão permitidas para seleção dos seus corretores</p>
              </div>
              <button
                onClick={() => handleOpenLinhaModal()}
                className="py-2.5 px-4 rounded-lg bg-cobalt-600 hover:bg-cobalt-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition hover:shadow-lg hover:shadow-cobalt-600/20"
              >
                <Plus size={14} />
                <span>+ Criar Linha</span>
              </button>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-zinc-850 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800 font-mono uppercase text-[9px] text-zinc-500 tracking-wider">
                      <th className="p-4">CÓDIGO</th>
                      <th className="p-4">DATA CADASTRO</th>
                      <th className="p-4">NOME COMERCIAL</th>
                      <th className="p-4">DESCRIÇÃO</th>
                      <th className="p-4">REGRAS DE STATUS</th>
                      <th className="p-4 text-center">ALTERNAR STATUS</th>
                      <th className="p-4 text-right">AÇÃO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 text-zinc-300">
                    {linhas.map((l, i) => (
                      <tr key={i} className="hover:bg-zinc-850/50">
                        <td className="p-4 font-mono font-bold text-zinc-500">{l.ID_LINHA}</td>
                        <td className="p-4 text-zinc-500 font-mono">{l.DATA_CADASTRO.split(' ')[0]}</td>
                        <td className="p-4 font-bold text-white text-sm">{l.NOME_LINHA}</td>
                        <td className="p-4 text-zinc-405 max-w-xs truncate">{l.DESCRICAO || 'Nenhuma descrição providenciada.'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${l.STATUS === 'ATIVO' ? 'bg-emerald-950/45 text-emerald-400 border-emerald-900/60' : 'bg-red-950/45 text-red-500 border-red-900/60'}`}>
                            {l.STATUS}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleLinhaStatus(l.ID_LINHA)}
                            className={`px-3 py-1 rounded text-[10px] font-semibold transition ${
                              l.STATUS === 'ATIVO'
                                ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-900/40'
                                : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-900/40'
                            }`}
                          >
                            {l.STATUS === 'ATIVO' ? 'Desativar Line' : 'Ativar Line'}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenLinhaModal(l)}
                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded border border-zinc-800 text-zinc-300"
                          >
                            <Edit2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MANAGE PRODUTOS COMPONENT */}
        {activeMenu === 'produtos' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Catálogo de Produtos Orenda</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Associe produtos às linhas correspondentes com detalhe de preços e estoque</p>
              </div>
              <button
                onClick={() => handleOpenProdutoModal()}
                className="py-2.5 px-4 rounded-lg bg-cobalt-600 hover:bg-cobalt-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition hover:shadow-lg hover:shadow-cobalt-600/10"
              >
                <Plus size={14} />
                <span>+ Cadastrar Produto</span>
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800 font-mono uppercase text-[9px] text-zinc-500 tracking-wider">
                      <th className="p-4">SKU/CÓDIGO</th>
                      <th className="p-4">ACACIA LINHA COMERCIAL</th>
                      <th className="p-4">DADOS DE PRODUTO</th>
                      <th className="p-4 text-right animate-pulse-subtle">PREÇOS (VAR / ATAC)</th>
                      <th className="p-4 text-right">CUSTO</th>
                      <th className="p-4 text-center text-amber-500">COMISSÕES (VAR / ATAC)</th>
                      <th className="p-4">SALDO / MÍNIMO</th>
                      <th className="p-4">REGULAÇÕES</th>
                      <th className="p-4 text-right">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 text-zinc-350">
                    {produtos.map((p, i) => (
                      <tr key={i} className="hover:bg-zinc-850/50">
                        <td className="p-4 font-mono text-zinc-450 font-bold">{p.ID_PRODUTO}</td>
                        <td className="p-4 font-bold text-zinc-400">{p.NOME_LINHA}</td>
                        <td className="p-4">
                          <p className="font-bold text-white text-sm">{p.NOME_PRODUTO}</p>
                          <p className="text-[10px] uppercase text-zinc-500">{p.CATEGORIA}</p>
                        </td>
                        <td className="p-4 text-right font-mono">
                          <span className="text-white font-bold block text-sm">R$ {parseFloat(p.PRECO_VENDA as any || 0).toFixed(2)} <span className="text-[9px] text-zinc-550 lowercase font-sans">varejo</span></span>
                          <span className="text-cobalt-400 font-bold block text-xs">R$ {parseFloat((p.PRECO_ATACADO !== undefined ? p.PRECO_ATACADO : p.PRECO_VENDA * 0.8) as any).toFixed(2)} <span className="text-[9px] text-zinc-550 lowercase font-sans">atacado</span></span>
                        </td>
                        <td className="p-4 text-zinc-500 font-mono text-right text-xs">R$ {parseFloat(p.CUSTO as any || 0).toFixed(2)}</td>
                        <td className="p-4 text-center font-mono">
                          <span className="text-amber-500 font-bold block text-xs">{p.COMISSAO_PERCENTUAL}% <span className="text-[9px] text-zinc-500 font-mono uppercase">Var</span></span>
                          <span className="text-cobalt-400 font-bold block text-[10px]">{p.COMISSAO_ATACADO_PERCENTUAL ?? 5}% <span className="text-[9px] text-zinc-500 font-mono uppercase">Atac</span></span>
                        </td>
                        <td className={`p-4 font-bold font-mono ${p.ESTOQUE <= p.ESTOQUE_MINIMO ? 'text-amber-500' : 'text-zinc-200'}`}>
                          {p.ESTOQUE} / {p.ESTOQUE_MINIMO} un
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleProdutoStatus(p.ID_PRODUTO)}
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition ${
                              p.STATUS === 'ATIVO'
                                ? 'bg-emerald-950 text-emerald-450 border-emerald-900/50 hover:bg-rose-950/40 hover:text-rose-450'
                                : 'bg-rose-950 text-rose-450 border-rose-900/50 hover:bg-emerald-950/40 hover:text-emerald-450'
                            }`}
                          >
                            {p.STATUS}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenProdutoModal(p)}
                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-70 transition border border-zinc- structure text-zinc-300 font-semibold"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* GESTÃO DE VENDEDORES COMPONENT */}
        {activeMenu === 'vendedores' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Gerenciamento de Afiliados e Vendedores</h2>
              <p className="text-xs text-zinc-450 mt-1">Aprove ou bloqueie credenciados novos na Orenda e audite as suas folhas de comissões acumuladas</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800 font-mono uppercase text-[9px] text-zinc-500 tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">DATA DE ENTRADA</th>
                      <th className="p-4">NOME COMPLETO</th>
                      <th className="p-4">CONTACTO & WHATSAPP</th>
                      <th className="p-4">CHAVE PIX DECLARADA</th>
                      <th className="p-4 font-mono text-right">FUT. BRUTO ATRIBUÍDO</th>
                      <th className="p-4 font-mono text-right">COMISSÃO RECEBIDA</th>
                      <th className="p-4">STATUS REVISÃO</th>
                      <th className="p-4 text-right">MUDAR STATUS DE CADASTRO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 text-zinc-350">
                    {vendedores.map((v, i) => {
                      const sellerVendas = vendas.filter(vd => vd.ID_VENDEDOR === v.ID_VENDEDOR && vd.STATUS === 'APROVADO');
                      const sumBruto = sellerVendas.reduce((acc, sale) => acc + sale.VALOR_BRUTO, 0);
                      const sumComis = sellerVendas.reduce((acc, sale) => acc + sale.VALOR_COMISSAO, 0);

                      let labelClass = 'bg-zinc-950 text-zinc-550 border-zinc-800';
                      if (v.STATUS === 'APROVADO') labelClass = 'bg-emerald-950/60 text-emerald-450 border-emerald-900/40';
                      else if (v.STATUS === 'PENDENTE') labelClass = 'bg-amber-950/60 text-amber-500 border-amber-900/40 animate-pulse';
                      else if (v.STATUS === 'BLOQUEADO') labelClass = 'bg-red-950/60 text-red-450 border-red-900/40';

                      return (
                        <tr key={i} className="hover:bg-zinc-850/50">
                          <td className="p-4 font-mono font-bold text-zinc-500">{v.ID_VENDEDOR}</td>
                          <td className="p-4 font-mono text-zinc-500">{v.DATA_CADASTRO.split(' ')[0]}</td>
                          <td className="p-4">
                            <p className="font-bold text-white text-sm">{v.NOME}</p>
                            <span className="text-[9px] text-zinc-500 font-mono uppercase">{v.EMAIL}</span>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <a href={`https://wa.me/${v.WHATSAPP}`} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">
                              📞 {v.WHATSAPP}
                            </a>
                          </td>
                          <td className="p-4 font-mono font-medium text-zinc-300">{v.PIX}</td>
                          <td className="p-4 text-right font-mono font-bold text-white">R$ {sumBruto.toFixed(2)}</td>
                          <td className="p-4 text-right font-mono font-bold text-emerald-400">R$ {sumComis.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-[9px] border font-black uppercase rounded ${labelClass}`}>
                              {v.STATUS}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            {v.STATUS !== 'APROVADO' && (
                              <button
                                onClick={() => handleSetSellerStatus(v.ID_VENDEDOR, 'APROVADO')}
                                className="px-3 py-1 bg-emerald-900 hover:bg-emerald-800 text-white rounded text-[10px] font-black"
                              >
                                Aprovar Acesso
                              </button>
                            )}
                            {v.STATUS !== 'BLOQUEADO' && (
                              <button
                                onClick={() => handleSetSellerStatus(v.ID_VENDEDOR, 'BLOQUEADO')}
                                className="px-3 py-1 bg-zinc-950 hover:bg-red-950 text-red-500 border border-zinc-850 hover:border-red-900 rounded text-[10px] font-semibold"
                              >
                                Bloquear
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SETUP TAXAS COMPONENT */}
        {activeMenu === 'taxas' && (
          <div className="space-y-6 max-w-xl mx-auto animate-fade-in">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6 crimson-glow">
              <div>
                <h3 className="text-xl font-bold text-white">Configuração de Taxas por Meios de Recebimento</h3>
                <p className="text-xs text-zinc-400 mt-1">Este controle dita o desconto do "Valor Liquido" das vendas de acordo com o portal usado pelo vendedor no ato da venda.</p>
              </div>

              <form onSubmit={handleSaveRates} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Tarifa Pix (%)</label>
                    <input 
                      type="number" step="0.01" 
                      value={ratePix} onChange={(e) => setRatePix(e.target.value)}
                      required className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white font-mono text-center font-bold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Tarifa Dinheiro (%)</label>
                    <input 
                      type="number" step="0.01"
                      value={rateDinheiro} onChange={(e) => setRateDinheiro(e.target.value)}
                      required className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white font-mono text-center font-bold" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Tarifa Cartão de Crédito (%)</label>
                    <input 
                      type="number" step="0.01"
                      value={rateCredito} onChange={(e) => setRateCredito(e.target.value)}
                      required className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white font-mono text-center font-bold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Tarifa Cartão de Débito (%)</label>
                    <input 
                      type="number" step="0.01"
                      value={rateDebito} onChange={(e) => setRateDebito(e.target.value)}
                      required className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white font-mono text-center font-bold" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Tarifa Link de Pagamento (%)</label>
                    <input 
                      type="number" step="0.01"
                      value={rateLink} onChange={(e) => setRateLink(e.target.value)}
                      required className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white font-mono text-center font-bold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Tarifa Boleto (%)</label>
                    <input 
                      type="number" step="0.01"
                      value={rateBoleto} onChange={(e) => setRateBoleto(e.target.value)}
                      required className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white font-mono text-center font-bold" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-cobalt-600 hover:bg-cobalt-500 text-white font-bold text-xs tracking-wider uppercase transition rounded-lg shadow-md active:scale-97 hover:shadow-cobalt-600/15"
                >
                  Salvar Novas Taxas de Cobrança
                </button>
              </form>
            </div>
          </div>
        )}

        {/* REPORT COMPONENT WITH FILTER AND EXPORT */}
        {activeMenu === 'relatorios' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4">
              <h3 className="font-bold text-white text-sm">Filtros de Auditoria de Vendas</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Data Início</label>
                  <input 
                    type="date" value={repDateInicio} 
                    onChange={(e) => setRepDateInicio(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-sans" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Data Fim</label>
                  <input 
                    type="date" value={repDateFim} 
                    onChange={(e) => setRepDateFim(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-sans" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Vendedor</label>
                  <select 
                    value={repVendedorFilter} onChange={(e) => setRepVendedorFilter(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200"
                  >
                    <option value="">-- Todos os Vendedores --</option>
                    {vendedores.map((v, i) => <option key={i} value={v.ID_VENDEDOR}>{v.NOME}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Linha de Produto</label>
                  <select 
                    value={repLinhaFilter} onChange={(e) => setRepLinhaFilter(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200"
                  >
                    <option value="">-- Todas as Linhas --</option>
                    {linhas.map((l, i) => <option key={i} value={l.ID_LINHA}>{l.NOME_LINHA}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* List and Action to Export */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="bg-zinc-950 p-4 border-b border-zinc-850 flex justify-between items-center">
                <span className="text-xs font-mono text-zinc-400 font-bold">REGISTROS DETALHADOS DE AUDITORIA</span>
                <button
                  onClick={() => alert("Relatório exportado para simulação de PDF com sucesso! Um aviso foi registrado na aba LOGS.")}
                  className="px-3 py-1.5 bg-cobalt-600 hover:bg-cobalt-500 text-white rounded font-bold text-[10px] transition"
                >
                  📥 Exportar Relatório PDF
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 uppercase font-mono text-[9px]">
                      <th className="p-4">DATA/HORA</th>
                      <th className="p-4">VENDEDOR</th>
                      <th className="p-4">LINHA</th>
                      <th className="p-4">SKU / PRODUTO</th>
                      <th className="p-4 text-center">QTD</th>
                      <th className="p-4 text-right">VALOR BRUTO</th>
                      <th className="p-4 text-right">TARIFAS</th>
                      <th className="p-4 text-right">COMISSÃO</th>
                      <th className="p-4 text-right">VALOR LÍQUIDO</th>
                      <th className="p-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 text-zinc-300">
                    {vendas
                      .filter(v => {
                        // date boundaries filter
                        const itemDateStr = v.DATA_HORA.split(' ')[0];
                        if (itemDateStr < repDateInicio || itemDateStr > repDateFim) return false;
                        if (repVendedorFilter && v.ID_VENDEDOR !== repVendedorFilter) return false;
                        if (repLinhaFilter && v.ID_LINHA !== repLinhaFilter) return false;
                        return true;
                      })
                      .map((v, i) => (
                        <tr key={i} className="hover:bg-zinc-850/30">
                          <td className="p-4 text-zinc-550 font-mono">{v.DATA_HORA}</td>
                          <td className="p-4 font-bold text-zinc-200">{v.NOME_VENDEDOR}</td>
                          <td className="p-4 text-zinc-500 font-semibold">{v.NOME_LINHA}</td>
                          <td className="p-4 font-bold text-white">{v.NOME_PRODUTO}</td>
                          <td className="p-4 text-center font-bold">{v.QUANTIDADE}</td>
                          <td className="p-4 text-right font-mono font-bold text-white">R$ {v.VALOR_BRUTO.toFixed(2)}</td>
                          <td className="p-4 text-right font-mono text-red-400">R$ {v.VALOR_TAXA.toFixed(2)}</td>
                          <td className="p-4 text-right font-mono text-amber-500 font-bold">R$ {v.VALOR_COMISSAO.toFixed(2)}</td>
                          <td className="p-4 text-right font-mono text-emerald-450 font-bold">R$ {v.VALOR_LIQUIDO.toFixed(2)}</td>
                          <td className="p-4">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-500 border border-emerald-900/40 text-[9px] font-bold">Approved</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: LINHAS CREATOR */}
      {isLinhaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {editingLinha ? 'Editar Regras de Linhas' : 'Adicionar Nova Linha Comercial'}
            </h3>
            
            <form onSubmit={handleSaveLinha} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-zinc-400">Nome Comercial da Linha</label>
                <input
                  type="text" required value={linhaNome} onChange={(e) => setLinhaNome(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-950"
                  placeholder="ex: Orenda Biotech"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Descrição Comercial Curta</label>
                <textarea
                  value={linhaDesc} onChange={(e) => setLinhaDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 h-20 text-zinc-200 text-sm focus:outline-none"
                  placeholder="Descreva que produtos caem sob esta linha..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block mb-1">Status Operativo</label>
                <div className="flex space-x-4 text-sm font-bold">
                  <label className="flex items-center space-x-2 text-zinc-300">
                    <input 
                      type="radio" name="linha_status" value="ATIVO" 
                      checked={linhaStatus === 'ATIVO'} onChange={() => setLinhaStatus('ATIVO')}
                    />
                    <span>Ativo</span>
                  </label>
                  <label className="flex items-center space-x-2 text-zinc-300">
                    <input 
                      type="radio" name="linha_status" value="INATIVO"
                      checked={linhaStatus === 'INATIVO'} onChange={() => setLinhaStatus('INATIVO')}
                    />
                    <span>Dispensado / Inativo</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button" onClick={() => setIsLinhaModalOpen(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded font-semibold text-zinc-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cobalt-600 hover:bg-cobalt-500 text-white rounded font-bold text-xs"
                >
                  Gravar Acordo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRODUTOS CREATOR/EDITOR */}
      {isProdutoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-xl my-8 space-y-6">
            <h3 className="text-xl font-bold text-white">
              {editingProduto ? 'Editar SKU Produto' : 'Cadastrar SKU no Portfólio'}
            </h3>

            <form onSubmit={handleSaveProduto} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400">Associação Comercial de Linha</label>
                  <select
                    value={prodLinhaId} onChange={(e) => setProdLinhaId(e.target.value)}
                    required className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200"
                  >
                    {linhas.map((l, i) => <option key={i} value={l.ID_LINHA}>{l.NOME_LINHA}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Nome do Produto</label>
                  <input
                    type="text" required value={prodNome} onChange={(e) => setProdNome(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded p-2 text-zinc-100 placeholder-zinc-700"
                    placeholder="Whey Protein Premium 900g"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-1">
                  <label className="text-zinc-400">Categoria do Produto</label>
                  <input
                    type="text" required value={prodCategoria} onChange={(e) => setProdCategoria(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 placeholder:text-zinc-700 text-xs"
                    placeholder="ex: Proteínas, Cosméticos"
                  />
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-amber-500 font-semibold block text-xs">Comissão Varejo (%)</label>
                  <input
                    type="number" step="0.5" required value={prodComissao} onChange={(e) => setProdComissao(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-amber-500 font-mono font-bold text-xs"
                  />
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-cobalt-400 font-semibold block text-xs">Comissão Atacado (%)</label>
                  <input
                    type="number" step="0.5" required value={prodComissaoAtacado} onChange={(e) => setProdComissaoAtacado(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-cobalt-400 font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold text-xs text-zinc-300">Preço Varejo (R$)</label>
                  <input
                    type="number" step="0.01" required value={prodPreco} onChange={(e) => setProdPreco(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold text-xs text-cobalt-400">Preço Atacado (R$)</label>
                  <input
                    type="number" step="0.01" required value={prodPrecoAtacado} onChange={(e) => setProdPrecoAtacado(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-cobalt-400 font-mono font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold text-xs text-zinc-400">Custo (R$)</label>
                  <input
                    type="number" step="0.01" required value={prodCusto} onChange={(e) => setProdCusto(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Saldo Atual em Prateleira (Qtd)</label>
                  <input
                    type="number" required value={prodEstoque} onChange={(e) => setProdEstoque(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-101 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Gatilho Alerta de Estoque Mínimo (Qtd)</label>
                  <input
                    type="number" required value={prodEstoqueMin} onChange={(e) => setProdEstoqueMin(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-rose-405 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-405">Descrição Completa para WhatsApp</label>
                <textarea
                  value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 h-16 text-zinc-250 font-sans"
                  placeholder="Esta cópia será clonada pelos vendedores para encaminhar fotos e fechar negócios no celular..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400">Observações adicionais de Administrador</label>
                  <input
                    type="text" value={prodObs} onChange={(e) => setProdObs(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-300"
                    placeholder="Lote de compra, fornecedor, validade..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block mb-1">Status de Disponibilidade</label>
                  <div className="flex space-x-4 pt-1">
                    <label className="flex items-center space-x-2 text-zinc-350">
                      <input 
                        type="radio" name="prod_status" value="ATIVO" 
                        checked={prodStatus === 'ATIVO'} onChange={() => setProdStatus('ATIVO')}
                      />
                      <span>Ativo (Vendedores vendem)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-zinc-350">
                      <input 
                        type="radio" name="prod_status" value="INATIVO"
                        checked={prodStatus === 'INATIVO'} onChange={() => setProdStatus('INATIVO')}
                      />
                      <span>Inativo (Bloqueado)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button" onClick={() => setIsProdutoModalOpen(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded font-semibold text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cobalt-600 hover:bg-cobalt-500 text-white rounded font-bold"
                >
                  Gravar SKU Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
