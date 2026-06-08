/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConfigRow {
  ID_CONFIG: string;
  CHAVE: string;
  VALOR: string;
  DESCRICAO: string;
}

export interface LinhaRow {
  ID_LINHA: string;
  DATA_CADASTRO: string;
  NOME_LINHA: string;
  DESCRICAO: string;
  STATUS: 'ATIVO' | 'INATIVO';
}

export interface ProdutoRow {
  ID_PRODUTO: string;
  DATA_CADASTRO: string;
  ID_LINHA: string;
  NOME_LINHA: string;
  NOME_PRODUTO: string;
  CATEGORIA: string;
  DESCRICAO: string;
  PRECO_VENDA: number;
  PRECO_ATACADO?: number;
  CUSTO: number;
  COMISSAO_PERCENTUAL: number;
  COMISSAO_ATACADO_PERCENTUAL?: number;
  ESTOQUE: number;
  ESTOQUE_MINIMO: number;
  STATUS: 'ATIVO' | 'INATIVO';
  OBSERVACAO: string;
}

export interface VendedorRow {
  ID_VENDEDOR: string;
  DATA_CADASTRO: string;
  NOME: string;
  WHATSAPP: string;
  EMAIL: string;
  PIX: string;
  SENHA: string;
  STATUS: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'BLOQUEADO';
}

export interface VendaRow {
  ID_VENDA: string;
  DATA_HORA: string;
  ID_VENDEDOR: string;
  NOME_VENDEDOR: string;
  ID_LINHA: string;
  NOME_LINHA: string;
  ID_PRODUTO: string;
  NOME_PRODUTO: string;
  QUANTIDADE: number;
  PRECO_UNITARIO: number;
  VALOR_BRUTO: number;
  FORMA_PAGAMENTO: string;
  TAXA_PERCENTUAL: number;
  VALOR_TAXA: number;
  COMISSAO_PERCENTUAL: number;
  VALOR_COMISSAO: number;
  VALOR_LIQUIDO: number;
  STATUS: 'APROVADO' | 'CANCELADO';
  OBSERVACAO: string;
  TIPO_VENDA?: 'VAREJO' | 'ATACADO';
}

export interface PagamentoRow {
  ID_PAGAMENTO: string;
  DATA: string;
  ID_VENDEDOR: string;
  NOME_VENDEDOR: string;
  VALOR_COMISSAO: number;
  STATUS: 'PENDENTE' | 'PAGO';
  OBSERVACAO: string;
}

export interface EstoqueRow {
  ID_MOVIMENTO: string;
  DATA_HORA: string;
  ID_PRODUTO: string;
  NOME_PRODUTO: string;
  TIPO_MOVIMENTO: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  ENTRADA: number;
  SAIDA: number;
  SALDO: number;
  RESPONSAVEL: string;
  OBSERVACAO: string;
}

export interface MetaRow {
  ID_META: string;
  DATA_CADASTRO: string;
  ID_LINHA: string;
  NOME_LINHA: string;
  META_MENSAL_VALOR: number;
  META_MENSAL_QUANTIDADE: number;
  DATA_INICIO: string;
  DATA_FIM: string;
  STATUS: 'ATIVO' | 'INATIVO';
}

export interface LogRow {
  DATA_HORA: string;
  USUARIO: string;
  TIPO_USUARIO: 'ADMIN' | 'VENDEDOR' | 'SISTEMA';
  ACAO: string;
  DETALHES: string;
}
