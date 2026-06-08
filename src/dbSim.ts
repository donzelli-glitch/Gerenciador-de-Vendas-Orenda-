/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ConfigRow,
  LinhaRow,
  ProdutoRow,
  VendedorRow,
  VendaRow,
  PagamentoRow,
  EstoqueRow,
  MetaRow,
  LogRow
} from './types';

// Constants for LocalStorage Keys
const KEYS = {
  CONFIGURACOES: 'orenda_sheet_configuracoes',
  LINHAS: 'orenda_sheet_linhas',
  PRODUTOS: 'orenda_sheet_produtos',
  VENDEDORES: 'orenda_sheet_vendedores',
  VENDAS: 'orenda_sheet_vendas',
  PAGAMENTOS: 'orenda_sheet_pagamentos',
  ESTOQUE: 'orenda_sheet_estoque',
  METAS: 'orenda_sheet_metas',
  LOGS: 'orenda_sheet_logs',
};

// Seeding Initial Data
const SEED_LINHAS: LinhaRow[] = [
  { ID_LINHA: 'L1', DATA_CADASTRO: '2026-06-01 10:00:00', NOME_LINHA: 'Orenda Performance', DESCRICAO: 'Suplementos esportivos de alta performance', STATUS: 'ATIVO' },
  { ID_LINHA: 'L2', DATA_CADASTRO: '2026-06-01 10:05:00', NOME_LINHA: 'Orenda Essentials', DESCRICAO: 'Vitaminas e minerais bioativos essenciais', STATUS: 'ATIVO' },
  { ID_LINHA: 'L3', DATA_CADASTRO: '2026-06-01 10:10:00', NOME_LINHA: 'Orenda Care', DESCRICAO: 'Cosméticos biotecnológicos e dermocosméticos', STATUS: 'ATIVO' },
  { ID_LINHA: 'L4', DATA_CADASTRO: '2026-06-01 10:15:00', NOME_LINHA: 'Orenda Biotech', DESCRICAO: 'Inovações nutricionais com selos internacionais', STATUS: 'ATIVO' },
  { ID_LINHA: 'L5', DATA_CADASTRO: '2026-06-01 10:20:00', NOME_LINHA: 'Manipulados', DESCRICAO: 'Fórmulas magistrais de alta precisão', STATUS: 'ATIVO' },
  { ID_LINHA: 'L6', DATA_CADASTRO: '2026-06-01 10:25:00', NOME_LINHA: 'Terceirização Industrial', DESCRICAO: 'Desenvolvimento e fabricação sob demanda', STATUS: 'ATIVO' },
];

const SEED_PRODUTOS: ProdutoRow[] = [
  {
    ID_PRODUTO: 'P1',
    DATA_CADASTRO: '2026-06-01 11:00:00',
    ID_LINHA: 'L1',
    NOME_LINHA: 'Orenda Performance',
    NOME_PRODUTO: 'Whey Protein Isolado (900g)',
    CATEGORIA: 'Proteínas',
    DESCRICAO: 'Whey protein isolado premium com 26g de proteína de rápida absorção, sem lactose e sem glúten.',
    PRECO_VENDA: 249.90,
    PRECO_ATACADO: 199.90,
    CUSTO: 130.00,
    COMISSAO_PERCENTUAL: 10,
    COMISSAO_ATACADO_PERCENTUAL: 5,
    ESTOQUE: 45,
    ESTOQUE_MINIMO: 10,
    STATUS: 'ATIVO',
    OBSERVACAO: 'Lote inicial aprovado pela ANVISA'
  },
  {
    ID_PRODUTO: 'P2',
    DATA_CADASTRO: '2026-06-01 11:05:00',
    ID_LINHA: 'L1',
    NOME_LINHA: 'Orenda Performance',
    NOME_PRODUTO: 'Termogênico Fire Burning (60 caps)',
    CATEGORIA: 'Termogênicos',
    DESCRICAO: 'Queimador de gordura ultra concentrado com cafeína amarga, L-carnitina e extrato de chá verde.',
    PRECO_VENDA: 139.90,
    PRECO_ATACADO: 109.90,
    CUSTO: 65.00,
    COMISSAO_PERCENTUAL: 12,
    COMISSAO_ATACADO_PERCENTUAL: 6,
    ESTOQUE: 8, // Low Stock! (Minimum is 12)
    ESTOQUE_MINIMO: 12,
    STATUS: 'ATIVO',
    OBSERVACAO: 'Produto altamente procurado no inverno'
  },
  {
    ID_PRODUTO: 'P3',
    DATA_CADASTRO: '2026-06-01 11:10:00',
    ID_LINHA: 'L2',
    NOME_LINHA: 'Orenda Essentials',
    NOME_PRODUTO: 'Vitamina C + Zinco Forte',
    CATEGORIA: 'Imunidade',
    DESCRICAO: 'Suporte imunológico potente com liberação prolongada de Vitamina C e Zinco quelato de alta biodisponibilidade.',
    PRECO_VENDA: 69.90,
    PRECO_ATACADO: 49.90,
    CUSTO: 28.00,
    COMISSAO_PERCENTUAL: 8,
    COMISSAO_ATACADO_PERCENTUAL: 4,
    ESTOQUE: 120,
    ESTOQUE_MINIMO: 15,
    STATUS: 'ATIVO',
    OBSERVACAO: 'Garantia de 3 meses de prateleira'
  },
  {
    ID_PRODUTO: 'P4',
    DATA_CADASTRO: '2026-06-01 11:15:00',
    ID_LINHA: 'L2',
    NOME_LINHA: 'Orenda Essentials',
    NOME_PRODUTO: 'Ômega 3 Premium EPA/DHA',
    CATEGORIA: 'Saúde Geral',
    DESCRICAO: 'Óleo de peixe importado super purificado livre de metais pesados com alto teor de EPA e DHA.',
    PRECO_VENDA: 119.90,
    PRECO_ATACADO: 89.90,
    CUSTO: 50.00,
    COMISSAO_PERCENTUAL: 10,
    COMISSAO_ATACADO_PERCENTUAL: 5,
    ESTOQUE: 22,
    ESTOQUE_MINIMO: 10,
    STATUS: 'ATIVO',
    OBSERVACAO: 'Lote importado do Canadá'
  },
  {
    ID_PRODUTO: 'P5',
    DATA_CADASTRO: '2026-06-01 11:20:00',
    ID_LINHA: 'L3',
    NOME_LINHA: 'Orenda Care',
    NOME_PRODUTO: 'Sérum Facial Retinol Concentrado',
    CATEGORIA: 'Skincare',
    DESCRICAO: 'Tratamento noturno anti-sinais profundo com Retinol puro, Ácido Hialurônico e Niacinamida calmante.',
    PRECO_VENDA: 189.90,
    PRECO_ATACADO: 149.90,
    CUSTO: 85.00,
    COMISSAO_PERCENTUAL: 15,
    COMISSAO_ATACADO_PERCENTUAL: 7.5,
    ESTOQUE: 4, // Low Stock! (Minimum is 5)
    ESTOQUE_MINIMO: 5,
    STATUS: 'ATIVO',
    OBSERVACAO: 'Fórmula exclusiva hipoalergênica'
  },
  {
    ID_PRODUTO: 'P6',
    DATA_CADASTRO: '2026-06-01 11:25:00',
    ID_LINHA: 'L4',
    NOME_LINHA: 'Orenda Biotech',
    NOME_PRODUTO: 'Coenzima Q10 Lipossomal',
    CATEGORIA: 'Suplementação',
    DESCRICAO: 'Coenzima Q10 de altíssima biodisponibilidade que auxilia na geração de energia celular e saúde mitocondrial.',
    PRECO_VENDA: 169.90,
    PRECO_ATACADO: 129.90,
    CUSTO: 75.00,
    COMISSAO_PERCENTUAL: 12,
    COMISSAO_ATACADO_PERCENTUAL: 6,
    ESTOQUE: 40,
    ESTOQUE_MINIMO: 8,
    STATUS: 'ATIVO',
    OBSERVACAO: 'Matéria prima inovadora'
  },
  {
    ID_PRODUTO: 'P7',
    DATA_CADASTRO: '2026-06-01 11:30:00',
    ID_LINHA: 'L5',
    NOME_LINHA: 'Manipulados',
    NOME_PRODUTO: 'Fórmula Calmant L-Theanine',
    CATEGORIA: 'Suplementos',
    DESCRICAO: 'Auxilia no combate à ansiedade e modulação do estresse diário de forma natural.',
    PRECO_VENDA: 94.95,
    PRECO_ATACADO: 74.90,
    CUSTO: 40.00,
    COMISSAO_PERCENTUAL: 12,
    COMISSAO_ATACADO_PERCENTUAL: 6,
    ESTOQUE: 0, // Out of Stock!
    ESTOQUE_MINIMO: 5,
    STATUS: 'ATIVO',
    OBSERVACAO: 'Sob demanda de prescrição médica'
  },
  {
    ID_PRODUTO: 'P8',
    DATA_CADASTRO: '2026-06-01 11:35:00',
    ID_LINHA: 'L6',
    NOME_LINHA: 'Terceirização Industrial',
    NOME_PRODUTO: 'Lote Cosmético Licenciado',
    CATEGORIA: 'Industrial',
    DESCRICAO: 'Desenvolvimento, envelopamento, rotulagem e envase de lote piloto cosmético.',
    PRECO_VENDA: 12500.00,
    PRECO_ATACADO: 10500.00,
    CUSTO: 7500.00,
    COMISSAO_PERCENTUAL: 5,
    COMISSAO_ATACADO_PERCENTUAL: 2.5,
    ESTOQUE: 2,
    ESTOQUE_MINIMO: 1,
    STATUS: 'ATIVO',
    OBSERVACAO: 'Contratos fechados via comercial direto'
  }
];

const SEED_CONFIG: ConfigRow[] = [
  { ID_CONFIG: 'C1', CHAVE: 'TAXA_PIX', VALOR: '0.5', DESCRICAO: 'Percentual de taxa para pagamento por Pix' },
  { ID_CONFIG: 'C2', CHAVE: 'TAXA_DINHEIRO', VALOR: '0.0', DESCRICAO: 'Percentual de taxa para pagamento em Dinheiro' },
  { ID_CONFIG: 'C3', CHAVE: 'TAXA_CREDITO', VALOR: '3.99', DESCRICAO: 'Percentual de taxa para pagamento no Cartão de crédito' },
  { ID_CONFIG: 'C4', CHAVE: 'TAXA_DEBITO', VALOR: '1.99', DESCRICAO: 'Percentual de taxa para pagamento no Cartão de débito' },
  { ID_CONFIG: 'C5', CHAVE: 'TAXA_LINK', VALOR: '4.99', DESCRICAO: 'Percentual de taxa para pagamento via Link de pagamento' },
  { ID_CONFIG: 'C6', CHAVE: 'TAXA_BOLETO', VALOR: '2.50', DESCRICAO: 'Percentual de taxa para pagamento via Boleto' },
  { ID_CONFIG: 'C7', CHAVE: 'ADMIN_SENHA', VALOR: 'orenda2026', DESCRICAO: 'Senha mestra para o painel de administrador' },
  { ID_CONFIG: 'C8', CHAVE: 'ADMIN_USER', VALOR: 'admin@orenda.com.br', DESCRICAO: 'E-mail do administrador' },
  { ID_CONFIG: 'C9', CHAVE: 'EMPRESA_NOME', VALOR: 'Orenda Group', DESCRICAO: 'Nome principal da empresa' },
];

const SEED_VENDEDORES: VendedorRow[] = [
  {
    ID_VENDEDOR: 'V1',
    DATA_CADASTRO: '2026-06-01 12:00:00',
    NOME: 'Ana Becker',
    WHATSAPP: '11988887766',
    EMAIL: 'ana@orenda.com.br',
    PIX: 'ana@pix.com',
    SENHA: 'vendedor123',
    STATUS: 'APROVADO'
  },
  {
    ID_VENDEDOR: 'V2',
    DATA_CADASTRO: '2026-06-02 14:30:00',
    NOME: 'Bruno Lima',
    WHATSAPP: '21977776655',
    EMAIL: 'bruno@orenda.com.br',
    PIX: '21977776655',
    SENHA: 'vendedor123',
    STATUS: 'PENDENTE'
  },
  {
    ID_VENDEDOR: 'V3',
    DATA_CADASTRO: '2026-06-03 09:15:00',
    NOME: 'Carlos Souza',
    WHATSAPP: '31966665544',
    EMAIL: 'carlos@orenda.com.br',
    PIX: 'carlos@gmail.com',
    SENHA: 'vendedor123',
    STATUS: 'BLOQUEADO'
  }
];

const SEED_VENDAS: VendaRow[] = [
  {
    ID_VENDA: 'VD1',
    DATA_HORA: '2026-06-02 15:00:00',
    ID_VENDEDOR: 'V1',
    NOME_VENDEDOR: 'Ana Becker',
    ID_LINHA: 'L1',
    NOME_LINHA: 'Orenda Performance',
    ID_PRODUTO: 'P1',
    NOME_PRODUTO: 'Whey Protein Isolado (900g)',
    QUANTIDADE: 2,
    PRECO_UNITARIO: 249.90,
    VALOR_BRUTO: 499.80,
    FORMA_PAGAMENTO: 'Pix',
    TAXA_PERCENTUAL: 0.5,
    VALOR_TAXA: 2.50,
    COMISSAO_PERCENTUAL: 10,
    VALOR_COMISSAO: 49.98,
    VALOR_LIQUIDO: 447.32,
    STATUS: 'APROVADO',
    OBSERVACAO: 'Cliente assíduo'
  },
  {
    ID_VENDA: 'VD2',
    DATA_HORA: '2026-06-04 11:22:00',
    ID_VENDEDOR: 'V1',
    NOME_VENDEDOR: 'Ana Becker',
    ID_LINHA: 'L2',
    NOME_LINHA: 'Orenda Essentials',
    ID_PRODUTO: 'P3',
    NOME_PRODUTO: 'Vitamina C + Zinco Forte',
    QUANTIDADE: 5,
    PRECO_UNITARIO: 69.90,
    VALOR_BRUTO: 349.50,
    FORMA_PAGAMENTO: 'Cartão de crédito',
    TAXA_PERCENTUAL: 3.99,
    VALOR_TAXA: 13.95,
    COMISSAO_PERCENTUAL: 8,
    VALOR_COMISSAO: 27.96,
    VALOR_LIQUIDO: 307.59,
    STATUS: 'APROVADO',
    OBSERVACAO: 'Venda parcelada em 2x'
  },
  {
    ID_VENDA: 'VD3',
    DATA_HORA: '2026-06-05 16:45:00',
    ID_VENDEDOR: 'V1',
    NOME_VENDEDOR: 'Ana Becker',
    ID_LINHA: 'L3',
    NOME_LINHA: 'Orenda Care',
    ID_PRODUTO: 'P5',
    NOME_PRODUTO: 'Sérum Facial Retinol Concentrado',
    QUANTIDADE: 1,
    PRECO_UNITARIO: 189.90,
    VALOR_BRUTO: 189.90,
    FORMA_PAGAMENTO: 'Link de pagamento',
    TAXA_PERCENTUAL: 4.99,
    VALOR_TAXA: 9.48,
    COMISSAO_PERCENTUAL: 15,
    VALOR_COMISSAO: 28.49,
    VALOR_LIQUIDO: 151.93,
    STATUS: 'APROVADO',
    OBSERVACAO: 'Enviado link via direct Instagram'
  }
];

const SEED_MOVIMENTO_ESTOQUE: EstoqueRow[] = [
  { ID_MOVIMENTO: 'M1', DATA_HORA: '2026-06-01 11:00:00', ID_PRODUTO: 'P1', NOME_PRODUTO: 'Whey Protein Isolado (900g)', TIPO_MOVIMENTO: 'ENTRADA', ENTRADA: 47, SAIDA: 0, SALDO: 47, RESPONSAVEL: 'Ajuste do Sistema', OBSERVACAO: 'Inventário Inicial da Linha' },
  { ID_MOVIMENTO: 'M2', DATA_HORA: '2026-06-02 15:00:00', ID_PRODUTO: 'P1', NOME_PRODUTO: 'Whey Protein Isolado (900g)', TIPO_MOVIMENTO: 'SAIDA', ENTRADA: 0, SAIDA: 2, SALDO: 45, RESPONSAVEL: 'Ana Becker', OBSERVACAO: 'Venda VD1' },
  { ID_MOVIMENTO: 'M3', DATA_HORA: '2026-06-01 11:10:00', ID_PRODUTO: 'P3', NOME_PRODUTO: 'Vitamina C + Zinco Forte', TIPO_MOVIMENTO: 'ENTRADA', ENTRADA: 125, SAIDA: 0, SALDO: 125, RESPONSAVEL: 'Ajuste do Sistema', OBSERVACAO: 'Cadastro do Produto' },
  { ID_MOVIMENTO: 'M4', DATA_HORA: '2026-06-04 11:22:00', ID_PRODUTO: 'P3', NOME_PRODUTO: 'Vitamina C + Zinco Forte', TIPO_MOVIMENTO: 'SAIDA', ENTRADA: 0, SAIDA: 5, SALDO: 120, RESPONSAVEL: 'Ana Becker', OBSERVACAO: 'Venda VD2' },
  { ID_MOVIMENTO: 'M5', DATA_HORA: '2026-06-01 11:20:00', ID_PRODUTO: 'P5', NOME_PRODUTO: 'Sérum Facial Retinol Concentrado', TIPO_MOVIMENTO: 'ENTRADA', ENTRADA: 5, SAIDA: 0, SALDO: 5, RESPONSAVEL: 'Ajuste do Sistema', OBSERVACAO: 'Estoque inicial' },
  { ID_MOVIMENTO: 'M6', DATA_HORA: '2026-06-05 16:45:00', ID_PRODUTO: 'P5', NOME_PRODUTO: 'Sérum Facial Retinol Concentrado', TIPO_MOVIMENTO: 'SAIDA', ENTRADA: 0, SAIDA: 1, SALDO: 4, RESPONSAVEL: 'Ana Becker', OBSERVACAO: 'Venda VD3' },
];

const SEED_METAS: MetaRow[] = [
  { ID_META: 'MT1', DATA_CADASTRO: '2026-06-01 10:00:00', ID_LINHA: 'L1', NOME_LINHA: 'Orenda Performance', META_MENSAL_VALOR: 20000, META_MENSAL_QUANTIDADE: 100, DATA_INICIO: '2026-06-01', DATA_FIM: '2026-06-30', STATUS: 'ATIVO' },
  { ID_META: 'MT2', DATA_CADASTRO: '2026-06-01 10:00:00', ID_LINHA: 'L2', NOME_LINHA: 'Orenda Essentials', META_MENSAL_VALOR: 10000, META_MENSAL_QUANTIDADE: 150, DATA_INICIO: '2026-06-01', DATA_FIM: '2026-06-30', STATUS: 'ATIVO' },
];

const SEED_LOGS: LogRow[] = [
  { DATA_HORA: '2026-06-01 10:00:00', USUARIO: 'Sistema', TIPO_USUARIO: 'SISTEMA', ACAO: 'Inicialização', DETALHES: 'Base de dados inicializada com sucesso.' },
  { DATA_HORA: '2026-06-01 12:00:00', USUARIO: 'admin@orenda.com.br', TIPO_USUARIO: 'ADMIN', ACAO: 'Aprovação Vendedor', DETALHES: 'Vendedor Ana Becker aprovado no sistema.' },
];

// Load helper
function getTable<T>(key: string, defaultValue: T[]): T[] {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data) as T[];
}

function saveTable<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const dbSim = {
  getConfigs: () => getTable<ConfigRow>(KEYS.CONFIGURACOES, SEED_CONFIG),
  saveConfigs: (data: ConfigRow[]) => saveTable<ConfigRow>(KEYS.CONFIGURACOES, data),

  getLinhas: () => getTable<LinhaRow>(KEYS.LINHAS, SEED_LINHAS),
  saveLinhas: (data: LinhaRow[]) => saveTable<LinhaRow>(KEYS.LINHAS, data),

  getProdutos: () => getTable<ProdutoRow>(KEYS.PRODUTOS, SEED_PRODUTOS),
  saveProdutos: (data: ProdutoRow[]) => saveTable<ProdutoRow>(KEYS.PRODUTOS, data),

  getVendedores: () => getTable<VendedorRow>(KEYS.VENDEDORES, SEED_VENDEDORES),
  saveVendedores: (data: VendedorRow[]) => saveTable<VendedorRow>(KEYS.VENDEDORES, data),

  getVendas: () => getTable<VendaRow>(KEYS.VENDAS, SEED_VENDAS),
  saveVendas: (data: VendaRow[]) => saveTable<VendaRow>(KEYS.VENDAS, data),

  getPagamentos: () => getTable<PagamentoRow>(KEYS.PAGAMENTOS, []),
  savePagamentos: (data: PagamentoRow[]) => saveTable<PagamentoRow>(KEYS.PAGAMENTOS, data),

  getEstoque: () => getTable<EstoqueRow>(KEYS.ESTOQUE, SEED_MOVIMENTO_ESTOQUE),
  saveEstoque: (data: EstoqueRow[]) => saveTable<EstoqueRow>(KEYS.ESTOQUE, data),

  getMetas: () => getTable<MetaRow>(KEYS.METAS, SEED_METAS),
  saveMetas: (data: MetaRow[]) => saveTable<MetaRow>(KEYS.METAS, data),

  getLogs: () => getTable<LogRow>(KEYS.LOGS, SEED_LOGS),
  saveLogs: (data: LogRow[]) => saveTable<LogRow>(KEYS.LOGS, data),

  nowStr: () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  },

  addLog: (usuario: string, tipo: 'ADMIN' | 'VENDEDOR' | 'SISTEMA', acao: string, detalhes: string) => {
    const logs = dbSim.getLogs();
    const newLog: LogRow = {
      DATA_HORA: dbSim.nowStr(),
      USUARIO: usuario,
      TIPO_USUARIO: tipo,
      ACAO: acao,
      DETALHES: detalhes
    };
    logs.unshift(newLog); // Put newest logs first
    dbSim.saveLogs(logs);
  },

  // Dynamic actions
  loginAdmin: (email: string, senhaStr: string): boolean => {
    const configs = dbSim.getConfigs();
    const configUser = configs.find(c => c.CHAVE === 'ADMIN_USER')?.VALOR || 'admin@orenda.com.br';
    const configSenha = configs.find(c => c.CHAVE === 'ADMIN_SENHA')?.VALOR || 'orenda2026';
    if (email.toLowerCase().trim() === configUser.toLowerCase().trim() && senhaStr === configSenha) {
      dbSim.addLog(email, 'ADMIN', 'Login Administrador', 'Sucesso no login.');
      return true;
    }
    dbSim.addLog(email || 'Desconhecido', 'ADMIN', 'Falha Login Administrador', `Tentativa frustrada com e-mail ${email}.`);
    return false;
  },

  loginVendedor: (email: string, senhaStr: string): VendedorRow | { error: string } => {
    const vendedores = dbSim.getVendedores();
    const user = vendedores.find(v => v.EMAIL.toLowerCase().trim() === email.toLowerCase().trim());
    
    if (!user) {
      dbSim.addLog(email, 'VENDEDOR', 'Falha Login', 'E-mail não encontrado.');
      return { error: 'E-mail não cadastrado.' };
    }
    if (user.SENHA !== senhaStr) {
      dbSim.addLog(email, 'VENDEDOR', 'Falha Login', `Senha incorreta para o vendedor ${user.NOME}.`);
      return { error: 'Senha incorreta.' };
    }
    if (user.STATUS === 'PENDENTE') {
      dbSim.addLog(email, 'VENDEDOR', 'Bloqueio Login', `Avisado de status PENDENTE.`);
      return { error: 'Seu cadastro está pendente de aprovação pelo administrador.' };
    }
    if (user.STATUS === 'BLOQUEADO' || user.STATUS === 'REJEITADO') {
      dbSim.addLog(email, 'VENDEDOR', 'Bloqueio Login', `Avisado de status BLOQUEADO.`);
      return { error: 'Seu acesso foi bloqueado ou rejeitado pelo administrador.' };
    }

    dbSim.addLog(user.NOME, 'VENDEDOR', 'Login Vendedor', `Sessão iniciada com sucesso por ${user.NOME}.`);
    return user;
  },

  cadastrarVendedor: (nome: string, whatsapp: string, email: string, pix: string, senhaStr: string): { success: boolean; error?: string } => {
    const vendedores = dbSim.getVendedores();
    const jaExiste = vendedores.some(v => v.EMAIL.toLowerCase().trim() === email.toLowerCase().trim());
    if (jaExiste) {
      return { success: false, error: 'E-mail já está em uso.' };
    }

    const newId = `V${vendedores.length + 1}_${Date.now().toString().slice(-4)}`;
    const novo: VendedorRow = {
      ID_VENDEDOR: newId,
      DATA_CADASTRO: dbSim.nowStr(),
      NOME: nome,
      WHATSAPP: whatsapp,
      EMAIL: email,
      PIX: pix,
      SENHA: senhaStr,
      STATUS: 'PENDENTE'
    };

    vendedores.push(novo);
    dbSim.saveVendedores(vendedores);
    dbSim.addLog(nome, 'VENDEDOR', 'Cadastro Vendedor', `Nova solicitação criada sob ID ${newId}.`);
    return { success: true };
  },

  aprovarVendedor: (id: string, adminUser: string) => {
    const vendedores = dbSim.getVendedores();
    const index = vendedores.findIndex(v => v.ID_VENDEDOR === id);
    if (index !== -1) {
      vendedores[index].STATUS = 'APROVADO';
      dbSim.saveVendedores(vendedores);
      dbSim.addLog(adminUser, 'ADMIN', 'Aprovar Vendedor', `Aprovou o acesso de ${vendedores[index].NOME} (${id}).`);
    }
  },

  bloquearVendedor: (id: string, adminUser: string) => {
    const vendedores = dbSim.getVendedores();
    const index = vendedores.findIndex(v => v.ID_VENDEDOR === id);
    if (index !== -1) {
      vendedores[index].STATUS = 'BLOQUEADO';
      dbSim.saveVendedores(vendedores);
      dbSim.addLog(adminUser, 'ADMIN', 'Bloquear Vendedor', `Bloqueou o acesso de ${vendedores[index].NOME} (${id}).`);
    }
  },

  registrarVenda: (
    vendedor: VendedorRow,
    linhaId: string,
    produtoId: string,
    quantidade: number,
    formaPagamento: string,
    observacao: string,
    tipoVenda: 'VAREJO' | 'ATACADO' = 'VAREJO',
    precoCustomizado?: number
  ): { success: boolean; error?: string; venda?: VendaRow } => {
    // Validations
    if (quantidade <= 0) return { success: false, error: 'A quantidade deve ser maior que zero.' };

    const linhas = dbSim.getLinhas();
    const linha = linhas.find(l => l.ID_LINHA === linhaId);
    if (!linha || linha.STATUS !== 'ATIVO') {
      return { success: false, error: 'Linha de produtos inativa ou inválida.' };
    }

    const produtos = dbSim.getProdutos();
    const prodIndex = produtos.findIndex(p => p.ID_PRODUTO === produtoId);
    if (prodIndex === -1) return { success: false, error: 'Produto não encontrado.' };
    const prod = produtos[prodIndex];

    if (prod.STATUS !== 'ATIVO') return { success: false, error: 'Este produto está inativo.' };
    if (prod.ID_LINHA !== linhaId) return { success: false, error: 'Este produto não pertence à linha selecionada.' };
    if (prod.ESTOQUE < quantidade) {
      return { success: false, error: `Estoque insuficiente. Disponível: ${prod.ESTOQUE} unidades.` };
    }

    // Get Payment Tax from CONFIGURACOES
    const configs = dbSim.getConfigs();
    let keyTaxa = 'TAXA_PIX';
    if (formaPagamento === 'Dinheiro') keyTaxa = 'TAXA_DINHEIRO';
    else if (formaPagamento === 'Cartão de crédito') keyTaxa = 'TAXA_CREDITO';
    else if (formaPagamento === 'Cartão de débito') keyTaxa = 'TAXA_DEBITO';
    else if (formaPagamento === 'Link de pagamento') keyTaxa = 'TAXA_LINK';
    else if (formaPagamento === 'Boleto') keyTaxa = 'TAXA_BOLETO';

    const taxaPercentual = parseFloat(configs.find(c => c.CHAVE === keyTaxa)?.VALOR || '0');

    // Calculations
    const precoUnitario = (tipoVenda === 'ATACADO' && precoCustomizado !== undefined && precoCustomizado >= 0) 
      ? precoCustomizado 
      : prod.PRECO_VENDA;

    const valor_bruto = precoUnitario * quantidade;
    const valor_taxa = Number(((valor_bruto * taxaPercentual) / 100).toFixed(2));
    
    // Choose appropriate commission rate: wholesale or retail
    const comissaoPercent = (tipoVenda === 'ATACADO' && prod.COMISSAO_ATACADO_PERCENTUAL !== undefined)
      ? prod.COMISSAO_ATACADO_PERCENTUAL
      : prod.COMISSAO_PERCENTUAL;

    const valor_comissao = Number(((valor_bruto * comissaoPercent) / 100).toFixed(2));
    const valor_liquido = Number((valor_bruto - valor_taxa - valor_comissao).toFixed(2));

    // Register sale
    const vendas = dbSim.getVendas();
    const idVenda = `VD${vendas.length + 1}_${Date.now().toString().slice(-4)}`;
    
    const novaVenda: VendaRow = {
      ID_VENDA: idVenda,
      DATA_HORA: dbSim.nowStr(),
      ID_VENDEDOR: vendedor.ID_VENDEDOR,
      NOME_VENDEDOR: vendedor.NOME,
      ID_LINHA: linha.ID_LINHA,
      NOME_LINHA: linha.NOME_LINHA,
      ID_PRODUTO: prod.ID_PRODUTO,
      NOME_PRODUTO: prod.NOME_PRODUTO,
      QUANTIDADE: quantidade,
      PRECO_UNITARIO: precoUnitario,
      VALOR_BRUTO: valor_bruto,
      FORMA_PAGAMENTO: formaPagamento,
      TAXA_PERCENTUAL: taxaPercentual,
      VALOR_TAXA: valor_taxa,
      COMISSAO_PERCENTUAL: comissaoPercent,
      VALOR_COMISSAO: valor_comissao,
      VALOR_LIQUIDO: valor_liquido,
      STATUS: 'APROVADO',
      OBSERVACAO: observacao,
      TIPO_VENDA: tipoVenda
    };

    vendas.push(novaVenda);
    dbSim.saveVendas(vendas);

    // Update stock in products
    const saldoAntigo = prod.ESTOQUE;
    const saldoNovo = saldoAntigo - quantidade;
    prod.ESTOQUE = saldoNovo;
    dbSim.saveProdutos(produtos);

    // Register stock movement
    const estoques = dbSim.getEstoque();
    const idMovimento = `M${estoques.length + 1}_${Date.now().toString().slice(-4)}`;
    const novoMovimento: EstoqueRow = {
      ID_MOVIMENTO: idMovimento,
      DATA_HORA: dbSim.nowStr(),
      ID_PRODUTO: prod.ID_PRODUTO,
      NOME_PRODUTO: prod.NOME_PRODUTO,
      TIPO_MOVIMENTO: 'SAIDA',
      ENTRADA: 0,
      SAIDA: quantidade,
      SALDO: saldoNovo,
      RESPONSAVEL: vendedor.NOME,
      OBSERVACAO: `Venda ${idVenda} (${tipoVenda === 'ATACADO' ? 'Atacado' : 'Varejo'})`
    };
    estoques.unshift(novoMovimento);
    dbSim.saveEstoque(estoques);

    // Log the sale
    dbSim.addLog(vendedor.NOME, 'VENDEDOR', 'Registro Venda', `Confirmada venda ${idVenda} (${tipoVenda}) no valor de R$ ${valor_bruto.toFixed(2)}.`);

    return { success: true, venda: novaVenda };
  },

  recriarBancoZerado: () => {
    localStorage.removeItem(KEYS.CONFIGURACOES);
    localStorage.removeItem(KEYS.LINHAS);
    localStorage.removeItem(KEYS.PRODUTOS);
    localStorage.removeItem(KEYS.VENDEDORES);
    localStorage.removeItem(KEYS.VENDAS);
    localStorage.removeItem(KEYS.PAGAMENTOS);
    localStorage.removeItem(KEYS.ESTOQUE);
    localStorage.removeItem(KEYS.METAS);
    localStorage.removeItem(KEYS.LOGS);
    
    // Trigger seeds on next loads
    dbSim.getConfigs();
    dbSim.getLinhas();
    dbSim.getProdutos();
    dbSim.getVendedores();
    dbSim.getVendas();
    dbSim.getEstoque();
    dbSim.getMetas();
    dbSim.getLogs();

    dbSim.addLog('Sistema', 'SISTEMA', 'Reset Completo', 'Planilhas re-inicializados aos padrões de fábrica.');
  }
};
