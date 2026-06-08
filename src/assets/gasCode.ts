/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const gasCode = {
  getInstructions: () => [
    {
      title: "1. Criar planilha no Google Sheets",
      step: "Crie uma nova planilha vazia no seu Google Drive (ex: sheets.new). Nomeie como 'Orenda - Gestão de Vendas'."
    },
    {
      title: "2. Acessar o Editor de Scripts",
      step: "No menu superior da planilha, clique em 'Extensões' > 'Apps Script' (ou 'Extensions' > 'Apps Script'). Isso abrirá a interface do editor."
    },
    {
      title: "3. Criar os 4 Arquivos Necessários",
      step: "No menu lateral esquerdo do Apps Script, você verá um arquivo 'Código.gs'. Renomeie para 'Code.gs'. Copie todo o código correspondente nesta aba e salve. Depois, clique no botão azul '+' ao lado de 'Arquivos' para criar 3 novos arquivos do tipo 'HTML' com os nomes 'Index', 'Style' e 'Script' (o editor adicionará a extensão .html automaticamente, ficando Index.html, Style.html, Script.html). Remova o código gerado automaticamente em cada um deles, cole o conteúdo de cada aba deste painel e salve."
    },
    {
      title: "4. Executar setupInicial()",
      step: "No editor do 'Code.gs', selecione a função 'setupInicial' no dropdown de execução superior e clique no botão 'Executar'. Na primeira execução, o Google pedirá que você conceda permissões (clique em 'Revisar permissões', escolha sua conta Google, vá em 'Avançado' (Advanced) e clique em 'Ir para Orenda (Não seguro)' e permita o acesso). Isso criará as 9 abas formatadas e os dados de exemplo no seu Sheets!"
    },
    {
      title: "5. Publicar o Web App",
      step: "No canto superior direito, clique em 'Implantar' > 'Nova implantação' (Deploy > New deployment). Selecione o tipo 'Aplicativo da Web' (Web App). Insira uma descrição (ex: 'v1.0'), abaixo escolha 'Executar como: Eu' (Me/your email), e em 'Quem tem acesso' escolha 'Qualquer pessoa' (Anyone). Clique em 'Implantar'. Copie o link do 'URL do aplicativo da Web' gerado. Esse link é o seu sistema online dinâmico real pronto para ser enviado para os seus vendedores!"
    }
  ],

  codeGS: `/**
 * ORENDA SALES GROUP - GOOGLE APPS SCRIPT DATABASE INTEGRATOR
 * Developer: Senior Google Apps Script Specialist
 * Target: Google Sheets + Responsive Web App HTML WebService
 */

// Retorna a interface web do sistema
function doGet(e) {
  var template = HtmlService.createTemplateFromFile("Index");
  return template.evaluate()
    .setTitle("Orenda - Gestão de Vendas")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Inclui arquivos HTML secundários (CSS e JS) no Index.html
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * SETUP INICIAL: Cria as abas e cabeçalhos se não existirem
 * Executar uma vez no editor do Apps Script para preparar a planilha!
 */
function setupInicial() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var abas = {
    "CONFIGURACOES": ["ID_CONFIG", "CHAVE", "VALOR", "DESCRICAO"],
    "LINHAS": ["ID_LINHA", "DATA_CADASTRO", "NOME_LINHA", "DESCRICAO", "STATUS"],
    "PRODUTOS": ["ID_PRODUTO", "DATA_CADASTRO", "ID_LINHA", "NOME_LINHA", "NOME_PRODUTO", "CATEGORIA", "DESCRICAO", "PRECO_VENDA", "CUSTO", "COMISSAO_PERCENTUAL", "ESTOQUE", "ESTOQUE_MINIMO", "STATUS", "OBSERVACAO", "COMISSAO_ATACADO_PERCENTUAL", "PRECO_ATACADO"],
    "VENDEDORES": ["ID_VENDEDOR", "DATA_CADASTRO", "NOME", "WHATSAPP", "EMAIL", "PIX", "SENHA", "STATUS"],
    "VENDAS": ["ID_VENDA", "DATA_HORA", "ID_VENDEDOR", "NOME_VENDEDOR", "ID_LINHA", "NOME_LINHA", "ID_PRODUTO", "NOME_PRODUTO", "QUANTIDADE", "PRECO_UNITARIO", "VALOR_BRUTO", "FORMA_PAGAMENTO", "TAXA_PERCENTUAL", "VALOR_TAXA", "COMISSAO_PERCENTUAL", "VALOR_COMISSAO", "VALOR_LIQUIDO", "STATUS", "OBSERVACAO", "TIPO_VENDA"],
    "PAGAMENTOS": ["ID_PAGAMENTO", "DATA", "ID_VENDEDOR", "NOME_VENDEDOR", "VALOR_COMISSAO", "STATUS", "OBSERVACAO"],
    "ESTOQUE": ["ID_MOVIMENTO", "DATA_HORA", "ID_PRODUTO", "NOME_PRODUTO", "TIPO_MOVIMENTO", "ENTRADA", "SAIDA", "SALDO", "RESPONSAVEL", "OBSERVACAO"],
    "METAS": ["ID_META", "DATA_CADASTRO", "ID_LINHA", "NOME_LINHA", "META_MENSAL_VALOR", "META_MENSAL_QUANTIDADE", "DATA_INICIO", "DATA_FIM", "STATUS"],
    "LOGS": ["DATA_HORA", "USUARIO", "TIPO_USUARIO", "ACAO", "DETALHES"]
  };
  
  for (var nomeAba in abas) {
    var sheet = ss.getSheetByName(nomeAba);
    if (!sheet) {
      sheet = ss.insertSheet(nomeAba);
      sheet.appendRow(abas[nomeAba]);
      
      // Formata cabeçalho
      var headerRange = sheet.getRange(1, 1, 1, abas[nomeAba].length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#800016"); // Vermelho escuro elegante
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
  }
  
  // Semeia Linhas iniciais obrigatórias se estiver em branco
  var sheetLinhas = ss.getSheetByName("LINHAS");
  if (sheetLinhas.getLastRow() === 1) {
    var linhasIniciais = [
      ["L1", new Date(), "Orenda Performance", "Suplementos de Alta Performance", "ATIVO"],
      ["L2", new Date(), "Orenda Essentials", "Vitaminas e Minerais Essenciais Base", "ATIVO"],
      ["L3", new Date(), "Orenda Care", "Dermocosméticos Premium", "ATIVO"],
      ["L4", new Date(), "Orenda Biotech", "Nutracêuticos Biotecnológicos", "ATIVO"],
      ["L5", new Date(), "Manipulados", "Fórmulas personalizadas de alta precisão", "ATIVO"],
      ["L6", new Date(), "Terceirização Industrial", "Parceria e fabricação industrial em larga escala", "ATIVO"]
    ];
    linhasIniciais.forEach(function(r) { sheetLinhas.appendRow(r); });
  }
  
  // Semeia Configurações se estiver em branco
  var sheetConfig = ss.getSheetByName("CONFIGURACOES");
  if (sheetConfig.getLastRow() === 1) {
    var configsIniciais = [
      ["C1", "TAXA_PIX", "0.5", "Taxa Pix percentual"],
      ["C2", "TAXA_DINHEIRO", "0.0", "Taxa Dinheiro percentual"],
      ["C3", "TAXA_CREDITO", "3.99", "Taxa Cartão de Crédito percentual"],
      ["C4", "TAXA_DEBITO", "1.99", "Taxa Cartão de Débito percentual"],
      ["C5", "TAXA_LINK", "4.99", "Taxa Link de Pagamento percentual"],
      ["C6", "TAXA_BOLETO", "2.50", "Taxa Boleto percentual"],
      ["C7", "ADMIN_USER", "admin@orenda.com.br", "E-mail de acesso administrativo"],
      ["C8", "ADMIN_SENHA", "orenda2026", "Senha mestre do painel administrativo"]
    ];
    configsIniciais.forEach(function(r) { sheetConfig.appendRow(r); });
  }
  
  // Semeia alguns produtos padrão para testar
  var sheetProd = ss.getSheetByName("PRODUTOS");
  if (sheetProd.getLastRow() === 1) {
    var prodsIniciais = [
      ["P1", new Date(), "L1", "Orenda Performance", "Whey Protein Premium", "Proteínas", "Whey isolado premium 900g, alta digestão.", 249.90, 130.00, 10, 50, 10, "ATIVO", "Lote 01"],
      ["P2", new Date(), "L1", "Orenda Performance", "Termogênico Fire", "Energia", "Termogênico potente com cafeína natural.", 139.90, 60.00, 12, 5, 8, "ATIVO", "Estoque inicial baixo para alerta de estoque"],
      ["P3", new Date(), "L2", "Orenda Essentials", "Multivitamínico AZ", "Saúde", "Espectro ultracompleto de minerais quelatos, 90 caps.", 79.90, 35.00, 8, 120, 15, "ATIVO", "Lote importado"],
      ["P4", new Date(), "L3", "Orenda Care", "Sérum Facial Retinol", "Estética", "Sérum intensivo contra rugas e flacidez.", 189.90, 85.00, 15, 4, 5, "ATIVO", "Altamente demandado"]
    ];
    prodsIniciais.forEach(function(r) { sheetProd.appendRow(r); });
    
    // Registrar entrada inicial no estoque
    var sheetEstoque = ss.getSheetByName("ESTOQUE");
    prodsIniciais.forEach(function(p) {
      sheetEstoque.appendRow([
        "M" + Math.round(Math.random() * 10000),
        new Date(),
        p[0], // ID PROD
        p[4], // NOME PROD
        "ENTRADA",
        p[10], // ENTRADA (QTD)
        0,
        p[10], // SALDO
        "Sistema (Setup)",
        "Inventário inicial após criação"
      ]);
    });
  }

  // Semeia primeiro Vendedor para teste
  var sheetVend = ss.getSheetByName("VENDEDORES");
  if (sheetVend.getLastRow() === 1) {
    sheetVend.appendRow(["V1", new Date(), "Ana Becker", "11988887766", "ana@orenda.com.br", "ana@pix.com", "vendedor123", "APROVADO"]);
    sheetVend.appendRow(["V2", new Date(), "Bruno Lima", "21977776655", "bruno@orenda.com.br", "bruno@pix.com", "vendedor123", "PENDENTE"]);
  }

  registrarLog("Sistema", "SISTEMA", "Setup Inicial", "Banco de dados inicializado com sucesso.");
}

// LOGS LOGGER
function registrarLog(usuario, tipoUsuario, acao, detalhes) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("LOGS");
    sheet.appendRow([new Date(), usuario, tipoUsuario, acao, detalhes]);
  } catch(e) {
    Logger.log("Erro log: " + e.message);
  }
}

// CARREGADORES GENÉRICOS DE DADOS PARA O FRONTEND
function getColecao(nomeAba) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(nomeAba);
  if (!sheet) return [];
  
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  var headers = values[0];
  var items = [];
  
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = values[i][j];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      }
      obj[headers[j]] = val;
    }
    items.push(obj);
  }
  return items;
}

// LOGIN SERVICES
function executarLogin(email, senha, tipo) {
  email = email.toLowerCase().trim();
  
  if (tipo === "admin") {
    var configs = getColecao("CONFIGURACOES");
    var adminUser = configs.filter(function(c) { return c.CHAVE === "ADMIN_USER"; })[0]?.VALOR || "admin@orenda.com.br";
    var adminSenha = configs.filter(function(c) { return c.CHAVE === "ADMIN_SENHA"; })[0]?.VALOR || "orenda2026";
    
    if (email === adminUser.toLowerCase() && senha === adminSenha) {
      registrarLog(email, "ADMIN", "Login Sucedido", "Acesso concedido ao painel administrador.");
      return { success: true, user: { NOME: "Administrador Orenda", EMAIL: email, TIPO: "admin" } };
    }
    registrarLog(email, "ADMIN", "Falha Login", "Tentativa de login administrador incorreta.");
    return { success: false, error: "Usuário ou senha administrativa inválidos." };
  } else {
    var vendedores = getColecao("VENDEDORES");
    var vendedor = vendedores.filter(function(v) { return v.EMAIL.toLowerCase() === email; })[0];
    
    if (!vendedor) {
      return { success: false, error: "Este vendedor não está cadastrado." };
    }
    if (vendedor.SENHA !== senha) {
      return { success: false, error: "Senha incorreta." };
    }
    if (vendedor.STATUS === "PENDENTE") {
      return { success: false, error: "Seu cadastro está aguardando revisão e aprovação pelo administrador." };
    }
    if (vendedor.STATUS === "BLOQUEADO" || vendedor.STATUS === "REJEITADO") {
      return { success: false, error: "Seu acesso foi bloqueado pelo administrador da Orenda." };
    }
    
    registrarLog(vendedor.NOME, "VENDEDOR", "Login Sucedido", "Acesso concedido à área do vendedor.");
    return { success: true, user: vendedor };
  }
}

// CADASTRO VENDEDOR
function cadastrarVendedorGAS(nome, whatsapp, email, pix, senha) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("VENDEDORES");
  var emailLower = email.toLowerCase().trim();
  
  var vendedores = getColecao("VENDEDORES");
  for (var i = 0; i < vendedores.length; i++) {
    if (vendedores[i].EMAIL.toLowerCase() === emailLower) {
      return { success: false, error: "Este e-mail de vendedor já está em uso no sistema." };
    }
  }
  
  var id = "V" + (vendedores.length + 1) + "_" + Math.round(Math.random() * 1000);
  sheet.appendRow([id, new Date(), nome, whatsapp, emailLower, pix, senha, "PENDENTE"]);
  
  registrarLog(nome, "VENDEDOR", "Cadastro Solicitado", "Novo cadastro em análise no sistema: ID " + id);
  return { success: true };
}

// REGISTRO DE VENDA E DESCONTO DE ESTOQUE
function registrarVendaGAS(vendedorId, nomeVendedor, linhaId, produtoId, quantidade, formaPagamento, observacao, tipoVenda, precoCustomizado) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetProd = ss.getSheetByName("PRODUTOS");
  var sheetVendas = ss.getSheetByName("VENDAS");
  var sheetEstoque = ss.getSheetByName("ESTOQUE");
  var sheetLinhas = ss.getSheetByName("LINHAS");
  
  quantidade = parseInt(quantidade);
  if (quantidade <= 0) return { success: false, error: "A quantidade deve ser de no mínimo 1 item." };
  
  tipoVenda = tipoVenda || "VAREJO";
  precoCustomizado = parseFloat(precoCustomizado);
  
  // Encontrar e validar Linha
  var rowsLinha = sheetLinhas.getDataRange().getValues();
  var linhaRow = null;
  for (var l = 1; l < rowsLinha.length; l++) {
    if (rowsLinha[l][0] == linhaId) {
      if (rowsLinha[l][4] !== "ATIVO") {
        return { success: false, error: "Esta linha de produto foi inativada pelo administrador." };
      }
      linhaRow = rowsLinha[l];
      break;
    }
  }
  if (!linhaRow) return { success: false, error: "Linha selecionada inválida." };
  var nomeLinha = linhaRow[2];

  // Encontrar Produto
  var rowsProd = sheetProd.getDataRange().getValues();
  var pIndex = -1;
  for (var p = 1; p < rowsProd.length; p++) {
    if (rowsProd[p][0] == produtoId) {
      pIndex = p;
      break;
    }
  }
  if (pIndex === -1) return { success: false, error: "Produto não encontrado." };
  
  var prodData = rowsProd[pIndex];
  var nomeProduto = prodData[4];
  var statusProd = prodData[12];
  var estoqueAtual = parseInt(prodData[10]);
  var precoPadrao = parseFloat(prodData[7]);
  
  // Decide commission rate dynamically (fallback to default/retail if wholesale is not set)
  var comissaoPercent = parseFloat(prodData[9]);
  if (tipoVenda === "ATACADO" && prodData[14] !== undefined && prodData[14] !== "") {
    comissaoPercent = parseFloat(prodData[14]);
  }
  
  if (statusProd !== "ATIVO") return { success: false, error: "Este produto está inativo no momento." };
  if (estoqueAtual < quantidade) return { success: false, error: "Estoque insuficiente disponível. Saldo atual: " + estoqueAtual };
  
  // Define preco final de venda (suporta customizado no atacado)
  var precoUnitario = (tipoVenda === "ATACADO" && !isNaN(precoCustomizado) && precoCustomizado >= 0) ? precoCustomizado : precoPadrao;

  // Obter taxa
  var keyTaxa = "TAXA_PIX";
  if (formaPagamento === "Dinheiro") keyTaxa = "TAXA_DINHEIRO";
  else if (formaPagamento === "Cartão de crédito") keyTaxa = "TAXA_CREDITO";
  else if (formaPagamento === "Cartão de débito") keyTaxa = "TAXA_DEBITO";
  else if (formaPagamento === "Link de pagamento") keyTaxa = "TAXA_LINK";
  else if (formaPagamento === "Boleto") keyTaxa = "TAXA_BOLETO";
  
  var configs = getColecao("CONFIGURACOES");
  var taxaPercent = 0;
  for (var c = 0; c < configs.length; c++) {
    if (configs[c].CHAVE === keyTaxa) {
      taxaPercent = parseFloat(configs[c].VALOR);
      break;
    }
  }
  
  // Cálculos financeiros
  var valorBruto = precoUnitario * quantidade;
  var valorTaxa = (valorBruto * taxaPercent) / 100;
  var valorComissao = (valorBruto * comissaoPercent) / 100;
  var valorLiquido = valorBruto - valorTaxa - valorComissao;
  
  // Salva Venda
  var idVenda = "VD" + (sheetVendas.getLastRow() + Math.round(Math.random() * 1000));
  sheetVendas.appendRow([
    idVenda, 
    new Date(), 
    vendedorId, 
    nomeVendedor, 
    linhaId, 
    nomeLinha, 
    produtoId, 
    nomeProduto, 
    quantidade, 
    precoUnitario, 
    valorBruto, 
    formaPagamento, 
    taxaPercent, 
    valorTaxa, 
    comissaoPercent, 
    valorComissao, 
    valorLiquido, 
    "APROVADO", 
    observacao,
    tipoVenda
  ]);
  
  // Deduz estoque fisicamente na linha correspondente da tabela PRODUTOS
  var novoEstoque = estoqueAtual - quantidade;
  sheetProd.getRange(pIndex + 1, 11).setValue(novoEstoque); // Coluna estoque é 11 (K)
  
  // Registra Movimento de Estoque
  var idMovimento = "M" + Math.round(Math.random() * 10000);
  sheetEstoque.appendRow([
    idMovimento,
    new Date(),
    produtoId,
    nomeProduto,
    "SAIDA",
    0,
    quantidade,
    novoEstoque,
    nomeVendedor,
    "Venda Registrada ID: " + idVenda
  ]);
  
  registrarLog(nomeVendedor, "VENDEDOR", "Registo Venda", "Registrou venda ID " + idVenda + ". Faturamento Bruto: R$ " + valorBruto);
  return { success: true, idVenda: idVenda };
}

// ADICIONAR OU EDITAR PRODUTO (ADMIN)
function salvarProdutoGAS(prodData, adminEmail) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("PRODUTOS");
  var sheetEstoque = ss.getSheetByName("ESTOQUE");
  var rows = sheet.getDataRange().getValues();
  
  var preco = parseFloat(prodData.PRECO_VENDA);
  var precoAtacado = parseFloat(prodData.PRECO_ATACADO) || 0;
  var custo = parseFloat(prodData.CUSTO);
  var comissao = parseFloat(prodData.COMISSAO_PERCENTUAL);
  var comissaoAtacado = parseFloat(prodData.COMISSAO_ATACADO_PERCENTUAL) || 0;
  var estoque = parseInt(prodData.ESTOQUE);
  var estoqueMin = parseInt(prodData.ESTOQUE_MINIMO);
  
  if (preco < 0 || precoAtacado < 0 || custo < 0 || comissao < 0 || comissaoAtacado < 0 || estoque < 0 || estoqueMin < 0) {
    return { success: false, error: "Não são permitidos valores numéricos negativos." };
  }

  // Preencher nome da linha
  var linhas = getColecao("LINHAS");
  var linhaObj = linhas.filter(function(l) { return l.ID_LINHA === prodData.ID_LINHA; })[0];
  var nomeLinha = linhaObj ? linhaObj.NOME_LINHA : "";

  if (prodData.ID_PRODUTO) {
    // Modo Edição
    var pRow = -1;
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] == prodData.ID_PRODUTO) {
        pRow = i + 1;
        break;
      }
    }
    if (pRow !== -1) {
      var estoqueAnterior = parseInt(rows[pRow - 1][10]);
      
      sheet.getRange(pRow, 3).setValue(prodData.ID_LINHA);
      sheet.getRange(pRow, 4).setValue(nomeLinha);
      sheet.getRange(pRow, 5).setValue(prodData.NOME_PRODUTO);
      sheet.getRange(pRow, 6).setValue(prodData.CATEGORIA);
      sheet.getRange(pRow, 7).setValue(prodData.DESCRICAO);
      sheet.getRange(pRow, 8).setValue(preco);
      sheet.getRange(pRow, 9).setValue(custo);
      sheet.getRange(pRow, 10).setValue(comissao);
      sheet.getRange(pRow, 11).setValue(estoque);
      sheet.getRange(pRow, 12).setValue(estoqueMin);
      sheet.getRange(pRow, 13).setValue(prodData.STATUS);
      sheet.getRange(pRow, 14).setValue(prodData.OBSERVACAO);
      sheet.getRange(pRow, 15).setValue(comissaoAtacado);
      sheet.getRange(pRow, 16).setValue(precoAtacado);
      
      // Se alterou estoque manualmente pelo editor
      if (estoqueAnterior !== estoque) {
        var dif = estoque - estoqueAnterior;
        var mov = dif > 0 ? "ENTRADA" : "SAIDA";
        sheetEstoque.appendRow([
          "M" + Math.round(Math.random() * 10000),
          new Date(),
          prodData.ID_PRODUTO,
          prodData.NOME_PRODUTO,
          mov,
          dif > 0 ? dif : 0,
          dif < 0 ? Math.abs(dif) : 0,
          estoque,
          "Administrador",
          "Ajuste manual de estoque no painel"
        ]);
      }
      
      registrarLog(adminEmail, "ADMIN", "Produto Editado", "Edição do produto ID " + prodData.ID_PRODUTO);
      return { success: true };
    }
    return { success: false, error: "Produto original não foi localizado na tabela." };
  } else {
    // Novo Produto
    var idProd = "P" + (rows.length + Math.round(Math.random() * 100));
    sheet.appendRow([
      idProd,
      new Date(),
      prodData.ID_LINHA,
      nomeLinha,
      prodData.NOME_PRODUTO,
      prodData.CATEGORIA,
      prodData.DESCRICAO,
      preco,
      custo,
      comissao,
      estoque,
      estoqueMin,
      prodData.STATUS,
      prodData.OBSERVACAO,
      comissaoAtacado,
      precoAtacado
    ]);
    
    // Insere movimento
    sheetEstoque.appendRow([
      "M" + Math.round(Math.random() * 10000),
      new Date(),
      idProd,
      prodData.NOME_PRODUTO,
      "ENTRADA",
      estoque,
      0,
      estoque,
      "Administrador",
      "Estoque inicial de cadastro"
    ]);
    
    registrarLog(adminEmail, "ADMIN", "Produto Criado", "Criou novo produto ID " + idProd + " - " + prodData.NOME_PRODUTO);
    return { success: true };
  }
}

// ADICIONAR OU EDITAR ACORDOS DE LINHAS DE PRODUTOS
function salvarLinhaGAS(linhaData, adminEmail) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("LINHAS");
  var rows = sheet.getDataRange().getValues();

  if (linhaData.ID_LINHA) {
    var lRow = -1;
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] == linhaData.ID_LINHA) {
        lRow = i + 1;
        break;
      }
    }
    if (lRow !== -1) {
      sheet.getRange(lRow, 3).setValue(linhaData.NOME_LINHA);
      sheet.getRange(lRow, 4).setValue(linhaData.DESCRICAO);
      sheet.getRange(lRow, 5).setValue(linhaData.STATUS);
      
      registrarLog(adminEmail, "ADMIN", "Linha Editada", "Atualizou a linha " + linhaData.NOME_LINHA);
      return { success: true };
    }
  } else {
    var idLinha = "L" + (rows.length + 1);
    sheet.appendRow([idLinha, new Date(), linhaData.NOME_LINHA, linhaData.DESCRICAO, linhaData.STATUS]);
    
    registrarLog(adminEmail, "ADMIN", "Linha Criada", "Criou a linha " + linhaData.NOME_LINHA);
    return { success: true };
  }
}

// ATUALIZAR CONFIGURAÇÃO DE TAXAS EM LOTE
function salvarTaxasGAS(taxasList, adminEmail) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("CONFIGURACOES");
  var rows = sheet.getDataRange().getValues();
  
  for (var key in taxasList) {
    var rateVal = parseFloat(taxasList[key]);
    if (rateVal < 0) return { success: false, error: "Taxas não podem ter valores negativos." };
    
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][1] === key) {
        sheet.getRange(i + 1, 3).setValue(rateVal.toString());
        break;
      }
    }
  }
  
  registrarLog(adminEmail, "ADMIN", "Taxas Alteradas", "Atualização geral de taxas financeiras.");
  return { success: true };
}

// GERENCIAR VENDEDOR (APROVAR, BLOQUEAR, REJEITAR)
function setStatusVendedorGAS(vendedorId, novoStatus, adminEmail) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("VENDEDORES");
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] == vendedorId) {
      sheet.getRange(i + 1, 8).setValue(novoStatus); // 8 é STATUS (H)
      registrarLog(adminEmail, "ADMIN", "Status Vendedor", "Alterou status de " + rows[i][2] + " para " + novoStatus);
      return { success: true };
    }
  }
  return { success: false, error: "Vendedor não localizado." };
}

// FECHAR PAGAMENTO COMISSÃO PARCIAL OU INTEGRAL DO VENDEDOR
function registrarPagamentoGAS(vendedorId, nomeVendedor, valor, observacao, adminEmail) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("PAGAMENTOS");
  
  var idPag = "PAG" + Math.round(Math.random() * 10000);
  sheet.appendRow([
    idPag,
    new Date(),
    vendedorId,
    nomeVendedor,
    parseFloat(valor),
    "PAGO",
    observacao
  ]);
  
  registrarLog(adminEmail, "ADMIN", "Pagamento Efetuado", "Lançamento de R$ " + valor + " pago para " + nomeVendedor);
  return { success: true };
}
`,

  indexHTML: `<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Orenda - Gestão de Vendas</title>
    <!-- Tailwind CSS v3 via Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Lucide Icons para interface moderna -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <?!= include('Style'); ?>
  </head>
  <body class="bg-zinc-950 text-zinc-100 font-sans min-h-screen flex flex-col selection:bg-red-800 selection:text-white">
    
    <!-- APP CONTAINER -->
    <div id="app" class="flex-grow flex flex-col">
      <!-- Loader de Inicialização -->
      <div id="loader-inicial" class="flex-grow flex flex-col items-center justify-center p-6 space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-amber-500 border-zinc-700"></div>
        <p class="text-amber-500/80 font-mono text-sm tracking-wider animate-pulse">CARREGANDO ORENDA ENGINE...</p>
      </div>
    </div>

    <!-- NOTIFICAÇÕES (SISTEMA TOAST) -->
    <div id="toast-container" class="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full"></div>

    <?!= include('Script'); ?>
  </body>
</html>
`,

  styleHTML: `<style>
/* CSS EXTRA DE ESTILO PREMIUM - ORENDA EMBEDDED */
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

body {
  font-family: var(--font-sans);
}

.font-mono {
  font-family: var(--font-mono);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #09090b;
}
::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}

/* Gold Gradient Glow effects */
.gold-glow {
  box-shadow: 0 0 15px -3px rgba(245, 158, 11, 0.15);
}

.crimson-glow {
  box-shadow: 0 0 20px -5px rgba(128, 0, 22, 0.3);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Utilities for cards */
.orenda-card {
  background-color: #09090b;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
}

.input-field {
  background-color: #121214;
  border: 1px solid #27272a;
  color: #f4f4f5;
  border-radius: 6px;
  padding: 10px 14px;
  transition: all 0.2s;
}

.input-field:focus {
  border-color: #800016;
  outline: none;
  box-shadow: 0 0 0 2px rgba(128, 0, 22, 0.2);
}
</style>
`,

  scriptHTML: `<!-- JAVASCRIPT FRONTEND INTEGRADOR - GOOGLE SCRIPT EXECUTION -->
<script>
// State manager client
const state = {
  vendedores: [],
  linhas: [],
  produtos: [],
  vendas: [],
  pagamentos: [],
  configs: [],
  currentUser: null,
  userType: null // 'admin' ou 'vendedor'
};

// Carrega as dependências ao iniciar
document.addEventListener("DOMContentLoaded", function() {
  iniciarApp();
});

function iniciarApp() {
  verificarSessao();
}

function verificarSessao() {
  const user = localStorage.getItem("orenda_user");
  const type = localStorage.getItem("orenda_user_type");
  
  if (user && type) {
    state.currentUser = JSON.parse(user);
    state.userType = type;
    carregarDadosBase(function() {
      renderizarTelaPrincipal();
    });
  } else {
    state.currentUser = null;
    state.userType = null;
    renderizarPortalLogin();
  }
}

// Importa todas as abas essenciais via Apps Script
function carregarDadosBase(callback) {
  let carregados = 0;
  const abas = ["CONFIGURACOES", "LINHAS", "PRODUTOS", "VENDEDORES", "VENDAS", "PAGAMENTOS"];
  
  abas.forEach(function(aba) {
    google.script.run
      .withSuccessHandler(function(dados) {
        if (aba === "CONFIGURACOES") state.configs = dados;
        else if (aba === "LINHAS") state.linhas = dados;
        else if (aba === "PRODUTOS") state.produtos = dados;
        else if (aba === "VENDEDORES") state.vendedores = dados;
        else if (aba === "VENDAS") state.vendas = dados;
        else if (aba === "PAGAMENTOS") state.pagamentos = dados;
        
        carregados++;
        if (carregados === abas.length && callback) callback();
      })
      .withFailureHandler(function(err) {
        showToast("Erro ao carregar aba " + aba + ": " + err.message, "erro");
      })
      .getColecao(aba);
  });
}

// TOAST GLOBAL MESSAGING
function showToast(mensagem, tipo = "sucesso") {
  const container = document.getElementById("toast-container");
  const t = document.createElement("div");
  t.className = \`p-4 rounded-lg shadow-lg flex items-center space-x-3 text-sm animate-fade-in \` + 
    (tipo === "sucesso" ? "bg-zinc-900 border-l-4 border-emerald-500 text-zinc-100" : "bg-zinc-900 border-l-4 border-red-600 text-zinc-100");
  
  t.innerHTML = \`
    <span class="flex-shrink-0">\` + (tipo === "sucesso" ? "✅" : "❌") + \`</span>
    <div class="flex-grow">\` + mensagem + \`</div>
  \`;
  container.appendChild(t);
  
  setTimeout(() => {
    t.classList.add("opacity-0");
    setTimeout(() => t.remove(), 400);
  }, 4000);
}

// RENDERS PORTAL (LOGIN CHOOSE)
function renderizarPortalLogin() {
  const main = document.getElementById("app");
  main.innerHTML = \`
    <div class="flex-grow flex items-center justify-center p-6 bg-zinc-950">
      <div class="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-8 crimson-glow animate-fade-in">
        
        <div class="text-center space-y-3">
          <div class="inline-flex p-3 rounded-full bg-red-950/40 border border-red-900 text-red-500 mb-2">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-white">ORENDA</h1>
          <p class="text-xs font-mono tracking-widest text-amber-500/80 uppercase">Sales Group Integrator</p>
        </div>

        <div class="space-y-4">
          <button onclick="mostrarLogin('vendedor')" class="w-full py-3 px-4 rounded-lg bg-red-800 hover:bg-red-700 font-semibold transition text-white hover:shadow-lg active:scale-98">
            Área do Vendedor
          </button>
          
          <button onclick="mostrarLogin('admin')" class="w-full py-3 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold border border-zinc-700 transition active:scale-98">
            Painel do Administrador
          </button>
          
          <div class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-zinc-800"></div>
            <span class="flex-shrink mx-4 text-zinc-500 text-xs uppercase tracking-wider">Novo por aqui?</span>
            <div class="flex-grow border-t border-zinc-800"></div>
          </div>

          <button onclick="mostrarCadastroVendedor()" class="w-full py-2.5 px-4 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-500 font-medium hover:bg-amber-500/10 transition text-sm">
            Quero Me Cadastrar como Vendedor
          </button>
        </div>

        <p class="text-center text-[10px] text-zinc-600 font-mono">DATABASE DE SISTEMA INTEGRADA GOOGLE SHEETS v1.0</p>
      </div>
    </div>
  \`;
}

function mostrarLogin(tipo) {
  const main = document.getElementById("app");
  const subTitle = tipo === "admin" ? "Sessão Administrativa Mestra" : "Acesse seu painel pessoal de vendas";
  
  main.innerHTML = \`
    <div class="flex-grow flex items-center justify-center p-6 bg-zinc-950">
      <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 animate-fade-in">
        
        <button onclick="renderizarPortalLogin()" class="text-zinc-500 text-xs hover:text-white flex items-center space-x-1">
          <span>← Voltar</span>
        </button>

        <div class="space-y-1">
          <h2 class="text-xl font-bold text-white uppercase tracking-tight">\` + (tipo === "admin" ? "Admin" : "Vendedor") + \` Login</h2>
          <p class="text-xs text-zinc-400">\` + subTitle + \`</p>
        </div>

        <form id="form-login" onsubmit="realizarLogin(event, '\` + tipo + \`')" class="space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-zinc-400">E-mail</label>
            <input type="email" id="login-email" required class="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-800" placeholder="voce@orenda.com.br" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-zinc-400">Senha</label>
            <input type="password" id="login-senha" required class="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-800" placeholder="••••••••" />
          </div>

          <button type="submit" class="w-full py-3 bg-red-800 hover:bg-red-700 transition text-white font-semibold rounded-lg text-sm flex items-center justify-center space-x-2">
            <span>Acessar Painel</span>
          </button>
        </form>
      </div>
    </div>
  \`;
}

function realizarLogin(e, tipo) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;
  
  // Exibir spinner no botão
  const btn = e.target.querySelector("button");
  const oldHTML = btn.innerHTML;
  btn.innerHTML = '<span class="animate-spin text-white">⚙️</span> Autenticando...';
  btn.disabled = true;

  google.script.run
    .withSuccessHandler(function(res) {
      if (res.success) {
        localStorage.setItem("orenda_user", JSON.stringify(res.user));
        localStorage.setItem("orenda_user_type", tipo);
        state.currentUser = res.user;
        state.userType = tipo;
        
        showToast("Seja bem-vindo de volta! Carregando dados...");
        carregarDadosBase(function() {
          renderizarTelaPrincipal();
        });
      } else {
        showToast(res.error, "erro");
        btn.innerHTML = oldHTML;
        btn.disabled = false;
      }
    })
    .withFailureHandler(function(err) {
      showToast("Falha interna de conexão: " + err.message, "erro");
      btn.innerHTML = oldHTML;
      btn.disabled = false;
    })
    .executarLogin(email, senha, tipo);
}

// CADASTRO VENDEDOR UI
function mostrarCadastroVendedor() {
  const main = document.getElementById("app");
  main.innerHTML = \`
    <div class="flex-grow flex items-center justify-center p-6 bg-zinc-950">
      <div class="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 animate-fade-in">
        <button onclick="renderizarPortalLogin()" class="text-zinc-500 text-xs hover:text-white">← Voltar</button>
        
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Criar Conta de Vendedor</h2>
          <p class="text-xs text-zinc-400">Solicite acesso ao time comercial da Orenda</p>
        </div>

        <form id="form-cadastro" onsubmit="enviarCadastroVendedor(event)" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-zinc-400">Nome Completo</label>
              <input type="text" id="cad-nome" required class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-zinc-400">WhatsApp (Número)</label>
              <input type="text" id="cad-whatsapp" placeholder="ex: 11999998888" required class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-zinc-400">E-mail Profissional</label>
            <input type="email" id="cad-email" required class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-zinc-400">Chave PIX (Para receber comissões)</label>
            <input type="text" id="cad-pix" required class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white" placeholder="Celular, CPF ou E-mail" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-zinc-400">Crie sua Senha</label>
            <input type="password" id="cad-senha" required class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white" placeholder="Mínimo 6 caracteres" />
          </div>

          <button type="submit" class="w-full py-3 bg-amber-500 hover:bg-amber-600 transition text-zinc-950 font-bold rounded-lg text-sm">
            Enviar Solicitação de Cadastro
          </button>
        </form>
      </div>
    </div>
  \`;
}

function enviarCadastroVendedor(e) {
  e.preventDefault();
  const nome = document.getElementById("cad-nome").value;
  const whatsapp = document.getElementById("cad-whatsapp").value;
  const email = document.getElementById("cad-email").value;
  const pix = document.getElementById("cad-pix").value;
  const senha = document.getElementById("cad-senha").value;
  
  const btn = e.target.querySelector("button");
  btn.innerText = "Enviando...";
  btn.disabled = true;

  google.script.run
    .withSuccessHandler(function(res) {
      if (res.success) {
        showToast("Solicitação enviada com sucesso! Aguarde a liberação do administrador.");
        renderizarPortalLogin();
      } else {
        showToast(res.error, "erro");
        btn.innerText = "Enviar Solicitação de Cadastro";
        btn.disabled = false;
      }
    })
    .withFailureHandler(function(err) {
      showToast("Falha de conexão: " + err.message, "erro");
      btn.innerText = "Enviar Solicitação de Cadastro";
      btn.disabled = false;
    })
    .cadastrarVendedorGAS(nome, whatsapp, email, pix, senha);
}

// RENDERS THE COMPLETE ACCORDING TO USER STATE
function renderizarTelaPrincipal() {
  if (state.userType === "admin") {
    renderizarInterfaceAdmin();
  } else {
    renderizarInterfaceVendedor();
  }
}

// -------------------------------------------------------------
// SEÇÃO ADMINISTRATIVA DESKTOP DESIGN
// -------------------------------------------------------------
function renderizarInterfaceAdmin() {
  const main = document.getElementById("app");
  main.innerHTML = \`
    <div class="flex-grow flex flex-col md:flex-row">
      <!-- SIDEBAR -->
      <aside class="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col space-y-6">
        <div>
          <h2 class="text-2xl font-black text-white tracking-tight">ORENDA</h2>
          <p class="text-[10px] font-mono text-amber-500/80 uppercase">Administração Comercial</p>
        </div>

        <nav class="flex-grow space-y-1.5 text-sm">
          <button onclick="setTabAdmin('dashboard')" class="w-full text-left py-2 px-3 rounded hover:bg-zinc-800 transition flex items-center space-x-2 text-zinc-300 hover:text-white">
            <span>📊 Dashboard</span>
          </button>
          <button onclick="setTabAdmin('linhas')" class="w-full text-left py-2 px-3 rounded hover:bg-zinc-800 transition flex items-center space-x-2 text-zinc-300 hover:text-white">
            <span>📁 Gestão de Linhas</span>
          </button>
          <button onclick="setTabAdmin('produtos')" class="w-full text-left py-2 px-3 rounded hover:bg-zinc-800 transition flex items-center space-x-2 text-zinc-300 hover:text-white">
            <span>📦 Gestão de Produtos</span>
          </button>
          <button onclick="setTabAdmin('vendedores')" class="w-full text-left py-2 px-3 rounded hover:bg-zinc-800 transition flex items-center space-x-2 text-zinc-300 hover:text-white">
            <span>👥 Vendedores</span>
          </button>
          <button onclick="setTabAdmin('taxas')" class="w-full text-left py-2 px-3 rounded hover:bg-zinc-800 transition flex items-center space-x-2 text-zinc-300 hover:text-white">
            <span>💳 Taxas de Pagamento</span>
          </button>
        </nav>

        <div class="pt-6 border-t border-zinc-800 flex flex-col space-y-2">
          <p class="text-xs text-zinc-500 font-mono">Logado: \` + state.currentUser.EMAIL + \`</p>
          <button onclick="removerSessao()" class="w-full py-2 bg-zinc-950 hover:bg-red-950/40 border border-zinc-800 hover:border-red-900 text-red-500 text-xs font-semibold rounded transition">
            Encerrar Sessão
          </button>
        </div>
      </aside>

      <!-- EXIBIÇÃO DE SUBTELA -->
      <main id="sub-main" class="flex-grow p-6 md:p-8 bg-zinc-950 overflow-y-auto space-y-6">
        <!-- Injetado dinamicamente via setTabAdmin -->
      </main>
    </div>
  \`;
  
  // Mostra aba inicial do dashboard
  setTabAdmin('dashboard');
}

function removerSessao() {
  localStorage.removeItem("orenda_user");
  localStorage.removeItem("orenda_user_type");
  state.currentUser = null;
  state.userType = null;
  renderizarPortalLogin();
}

function setTabAdmin(tabName) {
  const container = document.getElementById("sub-main");
  
  if (tabName === 'dashboard') {
    // Calcular faturamento, taxas, liquido, comissoes etc
    let fatBruto = 0;
    let totalTaxas = 0;
    let totalComissoes = 0;
    let numVendas = state.vendas.length;
    
    state.vendas.forEach(function(v) {
      if (v.STATUS !== 'CANCELADO') {
        fatBruto += parseFloat(v.VALOR_BRUTO);
        totalTaxas += parseFloat(v.VALOR_TAXA);
        totalComissoes += parseFloat(v.VALOR_COMISSAO);
      }
    });
    
    let valorLiquido = fatBruto - totalTaxas - totalComissoes;
    let ticketMedio = numVendas > 0 ? fatBruto / numVendas : 0;
    
    // Identificar itens com alerta de estoque
    let produtosEstoqueBaixo = state.produtos.filter(function(p) {
      return parseInt(p.ESTOQUE) <= parseInt(p.ESTOQUE_MINIMO) && p.STATUS === 'ATIVO';
    });

    container.innerHTML = \`
      <div class="space-y-6 animate-fade-in">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-white">Consolidado Administrativo</h2>
          <p class="text-zinc-500 text-sm">Resumo operacional de vendas em tempo real</p>
        </div>

        <!-- CARDS METRICS -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-1">
            <p class="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Faturamento Bruto</p>
            <p class="text-xl font-bold text-emerald-500">R$ \` + fatBruto.toLocaleString('pt-BR', {minimumFractionDigits: 2}) + \`</p>
          </div>
          <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-1">
            <p class="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Retenção de Taxas</p>
            <p class="text-xl font-bold text-red-500">R$ \` + totalTaxas.toLocaleString('pt-BR', {minimumFractionDigits: 2}) + \`</p>
          </div>
          <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-1">
            <p class="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Comissões Emitidas</p>
            <p class="text-xl font-bold text-amber-500">R$ \` + totalComissoes.toLocaleString('pt-BR', {minimumFractionDigits: 2}) + \`</p>
          </div>
          <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-1">
            <p class="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Líquido Estimado</p>
            <p class="text-xl font-bold text-white">R$ \` + valorLiquido.toLocaleString('pt-BR', {minimumFractionDigits: 2}) + \`</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Alertas de Estoque Baixo -->
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h3 class="font-semibold text-white text-sm">⚠️ Alertas de Reposição de Estoque</h3>
            <div class="divide-y divide-zinc-800">
              \` + (produtosEstoqueBaixo.length === 0 ? '<p class="text-xs text-zinc-500 py-3">Todos os produtos ativos estão com nível de estoque adequado.</p>' : '') + \`
              \` + produtosEstoqueBaixo.map(function(p) {
                return \`
                  <div class="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p class="font-medium text-white">\` + p.NOME_PRODUTO + \`</p>
                      <p class="text-[10px] text-zinc-500 font-mono">\` + p.NOME_LINHA + \`</p>
                    </div>
                    <div class="text-right">
                      <p class="text-amber-500 font-bold">\` + p.ESTOQUE + \` / \` + p.ESTOQUE_MINIMO + \` un</p>
                      <span class="inline-block px-1.5 py-0.5 rounded text-[8px] bg-amber-950 text-amber-500 border border-amber-800/40">Estoque Baixo</span>
                    </div>
                  </div>
                \`;
              }).join('') + \`
            </div>
          </div>

          <!-- Histórico Recente de Operações -->
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h3 class="font-semibold text-white text-sm">🗓️ Últimos Registros de Vendas</h3>
            <div class="divide-y divide-zinc-800">
              \` + (state.vendas.length === 0 ? '<p class="text-xs text-zinc-500 py-3">Nenhuma venda efetuada no momento.</p>' : '') + \`
              \` + state.vendas.slice(-5).reverse().map(function(v) {
                return \`
                  <div class="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p class="font-semibold text-white">\` + v.NOME_PRODUTO + \`</p>
                      <p class="text-[10px] text-zinc-500">Parceiro: \` + v.NOME_VENDEDOR + \` | \` + v.FORMA_PAGAMENTO + \`</p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-white">R$ \` + v.VALOR_BRUTO.toFixed(2) + \`</p>
                      <p class="text-[9px] text-zinc-500 font-mono">\` + v.DATA_HORA + \`</p>
                    </div>
                  </div>
                \`;
              }).join('') + \`
            </div>
          </div>
        </div>
      </div>
    \`;
  }
  
  else if (tabName === 'linhas') {
    container.innerHTML = \`
      <div class="space-y-6 animate-fade-in">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-white">Linhas Comerciais Registradas</h2>
            <p class="text-xs text-zinc-400">Divisão do portfólio de produtos e faturamentos</p>
          </div>
          <button onclick="abrirModalLinha()" class="py-2 px-4 rounded bg-red-800 hover:bg-red-700 font-semibold text-xs text-white">
            + Nova Linha
          </button>
        </div>

        <div class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-zinc-950 border-b border-zinc-850 text-zinc-400 uppercase font-mono text-[10px]">
                  <th class="p-4">CÓDIGO</th>
                  <th class="p-4">NOME DA LINHA</th>
                  <th class="p-4">DESCRIÇÃO</th>
                  <th class="p-4">STATUS</th>
                  <th class="p-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800">
                \` + state.linhas.map(function(l) {
                  const statusClass = l.STATUS === 'ATIVO' ? 'bg-emerald-950 text-emerald-500 border-emerald-800/40' : 'bg-zinc-950 text-zinc-500 border-zinc-850';
                  return \`
                    <tr class="hover:bg-zinc-900/50">
                      <td class="p-4 font-mono text-zinc-500 font-semibold">\` + l.ID_LINHA + \`</td>
                      <td class="p-4 font-semibold text-white">\` + l.NOME_LINHA + \`</td>
                      <td class="p-4 text-zinc-400 max-w-xs truncate">\` + l.DESCRICAO + \`</td>
                      <td class="p-4">
                        <span class="px-2 py-0.5 rounded text-[10px] border font-bold \` + statusClass + \`">\` + l.STATUS + \`</span>
                      </td>
                      <td class="p-4 text-right">
                        <button onclick='editarFiltroLinha(\` + JSON.stringify(l) + \`)' class="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium rounded">Editar</button>
                      </td>
                    </tr>
                  \`;
                }).join('') + \`
              </tbody>
            </table>
          </div>
        </div>
      </div>
    \`;
  }
  
  else if (tabName === 'produtos') {
    container.innerHTML = \`
      <div class="space-y-6 animate-fade-in">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-white">Catálogo Geral da Empresa</h2>
            <p class="text-xs text-zinc-400">Gerencie preços de revenda, comissionamentos, custos e saldos de prateleira</p>
          </div>
          <button onclick="abrirModalProduto()" class="py-2 px-4 rounded bg-red-800 hover:bg-red-700 font-semibold text-xs text-white">
            + Cadastrar Produto
          </button>
        </div>

        <div class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-zinc-950 border-b border-zinc-805 text-zinc-400 uppercase font-mono text-[10px]">
                  <th class="p-4">SKU</th>
                  <th class="p-4">LINHA</th>
                  <th class="p-4">NOME DO PRODUTO / CATEGORIA</th>
                  <th class="p-4">PREÇO VENDA</th>
                  <th class="p-4">CUSTO</th>
                  <th class="p-4">COMISSÃO</th>
                  <th class="p-4">ESTOQUE / MÍNIMO</th>
                  <th class="p-4">STATUS</th>
                  <th class="p-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800">
                \` + state.produtos.map(function(p) {
                  const labelEstoque = parseInt(p.ESTOQUE) <= parseInt(p.ESTOQUE_MINIMO) ? 'text-amber-500 font-black' : 'text-zinc-300';
                  return \`
                    <tr class="hover:bg-zinc-900/50">
                      <td class="p-4 font-mono text-zinc-500 font-semibold">\` + p.ID_PRODUTO + \`</td>
                      <td class="p-4 font-bold text-zinc-400">\` + p.NOME_LINHA + \`</td>
                      <td class="p-4">
                        <p class="font-bold text-white text-sm">\` + p.NOME_PRODUTO + \`</p>
                        <p class="text-[10px] text-zinc-500 uppercase">\` + p.CATEGORIA + \`</p>
                      </td>
                      <td class="p-4 font-bold text-white font-mono">R$ \` + parseFloat(p.PRECO_VENDA).toFixed(2) + \`</td>
                      <td class="p-4 text-zinc-400 font-mono">R$ \` + parseFloat(p.CUSTO).toFixed(2) + \`</td>
                      <td class="p-4 text-amber-500 font-bold font-mono">\` + p.COMISSAO_PERCENTUAL + \`%</td>
                      <td class="p-4 font-semibold \` + labelEstoque + \` font-mono">\` + p.ESTOQUE + \` / \` + p.ESTOQUE_MINIMO + \` un</td>
                      <td class="p-4">
                        <span class="px-1.5 py-0.5 rounded text-[9px] font-bold border \` + (p.STATUS === 'ATIVO' ? 'bg-emerald-950 text-emerald-500 border-emerald-800/40' : 'bg-red-950 text-red-500 border-red-800/40') + \`">\` + p.STATUS + \`</span>
                      </td>
                      <td class="p-4 text-right">
                        <button onclick='editarFiltroProduto(\` + JSON.stringify(p) + \`)' class="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium rounded">Editar</button>
                      </td>
                    </tr>
                  \`;
                }).join('') + \`
              </tbody>
            </table>
          </div>
        </div>
      </div>
    \`;
  }
  
  else if (tabName === 'vendedores') {
    container.innerHTML = \`
      <div class="space-y-6 animate-fade-in">
        <div>
          <h2 class="text-2xl font-bold text-white">Parceiros de Venda (Vendedores)</h2>
          <p class="text-xs text-zinc-400">Gerencie aprovações de novos solicitantes, comissionamentos e bloqueios</p>
        </div>

        <div class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[10px]">
                  <th class="p-4">CÓDIGO</th>
                  <th class="p-4">NOME COMPLETO</th>
                  <th class="p-4">DADOS DE CONTATO</th>
                  <th class="p-4">CHAVE PIX RECEBIMENTO</th>
                  <th class="p-4 font-mono text-right">SOMA COMISSÕES</th>
                  <th class="p-4">STATUS REVISÃO</th>
                  <th class="p-4 text-right">MUDAR STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800">
                \` + state.vendedores.map(function(v) {
                  // Calcular soma comissões
                  let comissaoVendedor = 0;
                  state.vendas.forEach(function(vd) {
                    if (vd.ID_VENDEDOR == v.ID_VENDEDOR && vd.STATUS !== 'CANCELADO') {
                      comissaoVendedor += parseFloat(vd.VALOR_COMISSAO);
                    }
                  });
                  
                  // Status classes
                  let statusClass = 'bg-zinc-950 text-zinc-500 border-zinc-850';
                  if (v.STATUS === 'APROVADO') statusClass = 'bg-emerald-950 text-emerald-500 border-emerald-800/40';
                  else if (v.STATUS === 'PENDENTE') statusClass = 'bg-amber-950 text-amber-500 border-amber-800/40 animate-pulse';
                  else if (v.STATUS === 'BLOQUEADO') statusClass = 'bg-red-950 text-red-500 border-red-800/40';

                  return \`
                    <tr class="hover:bg-zinc-900/50">
                      <td class="p-4 font-mono text-zinc-500 font-semibold">\` + v.ID_VENDEDOR + \`</td>
                      <td class="p-4 font-bold text-white">\` + v.NOME + \`</td>
                      <td class="p-4 whitespace-nowrap">
                        <p class="text-zinc-300 font-semibold">📞 \` + v.WHATSAPP + \`</p>
                        <p class="text-zinc-500 font-mono text-[9px]">\` + v.EMAIL + \`</p>
                      </td>
                      <td class="p-4 font-mono text-zinc-400 font-medium">\` + v.PIX + \`</td>
                      <td class="p-4 text-right font-bold text-emerald-400 font-mono">R$ \` + comissaoVendedor.toFixed(2) + \`</td>
                      <td class="p-4">
                        <span class="px-2 py-0.5 rounded text-[9px] font-black border \` + statusClass + \`">\` + v.STATUS + \`</span>
                      </td>
                      <td class="p-4 text-right space-x-1">
                        \` + (v.STATUS !== 'APROVADO' ? \`
                          <button onclick="alterarStatusVendedor('\` + v.ID_VENDEDOR + \`', 'APROVADO')" class="px-2 py-1 bg-emerald-900/70 hover:bg-emerald-850 border border-emerald-800/20 text-emerald-200 text-[10px] font-bold rounded">Liberar</button>
                        \` : '') + \`
                        \` + (v.STATUS !== 'BLOQUEADO' ? \`
                          <button onclick="alterarStatusVendedor('\` + v.ID_VENDEDOR + \`', 'BLOQUEADO')" class="px-2 py-1 bg-zinc-850 hover:bg-red-950 text-red-400 border border-zinc-800 hover:border-red-900 text-[10px] rounded">Bloquear</button>
                        \` : '') + \`
                      </td>
                    </tr>
                  \`;
                }).join('') + \`
              </tbody>
            </table>
          </div>
        </div>
      </div>
    \`;
  }
}

function alterarStatusVendedor(vendedorId, novoStatus) {
  if (!confirm("Alterar o registro operacional deste vendedor?")) return;
  
  google.script.run
    .withSuccessHandler(function(res) {
      if (res.success) {
        showToast("Situação de vendedor atualizada com êxito!");
        carregarDadosBase(function() {
          setTabAdmin('vendedores');
        });
      } else {
        showToast(res.error, "erro");
      }
    })
    .withFailureHandler(function(err) {
      showToast(err.message, "erro");
    })
    .setStatusVendedorGAS(vendedorId, novoStatus, state.currentUser.EMAIL);
}

// -------------------------------------------------------------
// SEÇÃO DO VENDEDOR (PRODUTIVIDADE & VENDAS)
// -------------------------------------------------------------
function renderizarInterfaceVendedor() {
  const main = document.getElementById("app");
  main.innerHTML = \`
    <div class="flex-grow flex flex-col">
      <!-- HEADER VENDEDOR -->
      <header class="bg-zinc-900 border-b border-zinc-800 py-4 px-6 flex justify-between items-center bg-zinc-900/90 backdrop-blur">
        <div>
          <h2 class="text-lg font-bold text-white tracking-tight">ORENDA PRO COMERCIAL</h2>
          <p class="text-xs text-amber-500 font-mono tracking-wide">\` + state.currentUser.NOME + \`</p>
        </div>
        <div class="flex items-center space-x-4">
          <button onclick="setTabVendedor('venda')" class="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-xs font-semibold text-white transition">🚀 Lançar Venda</button>
          <button onclick="setTabVendedor('catalogo')" class="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs border border-zinc-700 text-zinc-300">📦 Catálogo</button>
          <button onclick="removerSessao()" class="px-2 py-1 text-zinc-500 hover:text-white text-xs">Sair</button>
        </div>
      </header>

      <!-- SUBTELA VENDEDOR CONTAINER -->
      <main id="seller-main" class="flex-grow p-6 md:p-8 bg-zinc-950 overflow-y-auto space-y-6">
        <!-- Injetado via setTabVendedor -->
      </main>
    </div>
  \`;
  
  setTabVendedor('venda');
}

function setTabVendedor(tabName) {
  const container = document.getElementById("seller-main");
  
  if (tabName === 'venda') {
    // Tela de registrar venda com primeiro filtro de linha
    container.innerHTML = \`
      <div class="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6 crimson-glow animate-fade-in">
        <h3 class="text-xl font-bold text-white">Criar Novo Lançamento de Venda</h3>
        
        <form id="form-venda" onsubmit="enviarLancamentoVenda(event)" class="space-y-4">
          <!-- Escolher Linha de Produtos -->
          <div class="space-y-1">
            <label class="text-xs font-semibold text-zinc-400">Escolha a Linha Comercial</label>
            <select id="vda-linha" onchange="filtroDinAmicoProduto()" required class="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-sm text-white focus:outline-none focus:border-red-800">
              <option value="">-- Selecione uma Linha --</option>
              \` + state.linhas.filter(l => l.STATUS === 'ATIVO').map(l => \`<option value="\` + l.ID_LINHA + \`">\` + l.NOME_LINHA + \`</option>\`).join('') + \`
            </select>
          </div>

          <!-- Escolher Produto (será carregado após escolher a linha) -->
          <div class="space-y-1">
            <label class="text-xs font-semibold text-zinc-400">Parâmetro de Produto</label>
            <select id="vda-produto" onchange="atualizarDadosPreVisualizacao()" required disabled class="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-sm text-white focus:outline-none focus:border-zinc-700">
              <option value="">Selecione primeiro uma Linha comercial acima</option>
            </select>
          </div>

          <!-- Cards Dinâmicos com PREÇO e COMISSÕES ESTIMATIVAS -->
          <div id="visual-preco" class="hidden grid grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-850">
            <div>
              <p class="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Preço Unitário</p>
              <p id="prev-preco" class="text-base font-bold text-white">R$ 0,00</p>
            </div>
            <div>
              <p class="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Comissão Unidade (<span id="prev-percent">0</span>%)</p>
              <p id="prev-comis" class="text-base font-bold text-amber-500">R$ 0,00</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-zinc-400">Quantidade</label>
              <input type="number" id="vda-quantidade" min="1" value="1" required class="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-sm text-white text-center font-bold" />
            </div>
            
            <div class="space-y-1">
              <label class="text-xs font-semibold text-zinc-400">Forma de Pagamento</label>
              <select id="vda-pagamento" required class="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-sm text-zinc-200">
                <option value="Pix">Pix</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de crédito">Cartão de Crédito</option>
                <option value="Cartão de débito">Cartão de Débito</option>
                <option value="Link de pagamento">Link de Pagamento</option>
                <option value="Boleto">Boleto</option>
              </select>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-zinc-400">Observações de Entrega/Cliente</label>
            <textarea id="vda-observacao" class="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-sm text-zinc-300 text-[11px] h-16" placeholder="ex: Apartamento 42-B, deixar com porteiro Cleber"></textarea>
          </div>

          <button type="submit" class="w-full py-3 bg-red-800 hover:bg-red-700 text-white font-bold text-sm tracking-wide transition rounded-md shadow-lg active:scale-97">
            Confirmar e Registrar Venda
          </button>
        </form>
      </div>
    \`;
  }
}

function filtroDinAmicoProduto() {
  const linhaId = document.getElementById("vda-linha").value;
  const pSelect = document.getElementById("vda-produto");
  const pDiv = document.getElementById("visual-preco");
  
  if (!linhaId) {
    pSelect.disabled = true;
    pSelect.innerHTML = '<option value="">Selecione primeiro uma Linha comercial acima</option>';
    pDiv.classList.add("hidden");
    return;
  }
  
  // Filtra produtos apenas ativos pertencentes à linha
  const filtrados = state.produtos.filter(p => p.ID_LINHA === linhaId && p.STATUS === 'ATIVO');
  
  if (filtrados.length === 0) {
    pSelect.disabled = true;
    pSelect.innerHTML = '<option value="">Sem produtos ativos cadastrados para este acordo</option>';
    pDiv.classList.add("hidden");
    return;
  }
  
  pSelect.disabled = false;
  pSelect.innerHTML = '<option value="">-- Escolha um Produto da Linha --</option>' + 
    filtrados.map(p => {
      const semEstoque = parseInt(p.ESTOQUE) <= 0 ? ' [SEM ESTOQUE]' : '';
      return \`<option value="\` + p.ID_PRODUTO + \`" \` + (semEstoque ? 'disabled' : '') + \`>\` + p.NOME_PRODUTO + semEstoque + \`</option>\`;
    }).join('');
}

function atualizarDadosPreVisualizacao() {
  const prodId = document.getElementById("vda-produto").value;
  const keyVisual = document.getElementById("visual-preco");
  
  if (!prodId) {
    keyVisual.classList.add("hidden");
    return;
  }
  
  const prod = state.produtos.filter(p => p.ID_PRODUTO === prodId)[0];
  if (prod) {
    keyVisual.classList.remove("hidden");
    document.getElementById("prev-preco").innerText = "R$ " + parseFloat(prod.PRECO_VENDA).toFixed(2);
    document.getElementById("prev-percent").innerText = prod.COMISSAO_PERCENTUAL;
    
    const valorComis = (parseFloat(prod.PRECO_VENDA) * parseInt(prod.COMISSAO_PERCENTUAL)) / 100;
    document.getElementById("prev-comis").innerText = "R$ " + valorComis.toFixed(2);
  }
}

function enviarLancamentoVenda(e) {
  e.preventDefault();
  const linha = document.getElementById("vda-linha").value;
  const prodId = document.getElementById("vda-produto").value;
  const qtd = parseInt(document.getElementById("vda-quantidade").value);
  const formPg = document.getElementById("vda-pagamento").value;
  const obs = document.getElementById("vda-observacao").value;
  
  const btn = e.target.querySelector("button");
  btn.innerText = "Registrando...";
  btn.disabled = true;

  google.script.run
    .withSuccessHandler(function(res) {
      if (res.success) {
        showToast("Venda lançada e lançada com sucesso no Sheets!");
        carregarDadosBase(function() {
          setTabVendedor('venda');
        });
      } else {
        showToast(res.error, "erro");
        btn.innerText = "Confirmar e Registrar Venda";
        btn.disabled = false;
      }
    })
    .withFailureHandler(function(err) {
      showToast(err.message, "erro");
      btn.innerText = "Confirmar e Registrar Venda";
      btn.disabled = false;
    })
    .registrarVendaGAS(state.currentUser.ID_VENDEDOR, state.currentUser.NOME, linha, prodId, qtd, formPg, obs);
}
</script>
`
};
