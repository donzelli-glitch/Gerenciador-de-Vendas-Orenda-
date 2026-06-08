/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { dbSim } from './dbSim';
import { VendedorRow } from './types';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import DeveloperPanel from './components/DeveloperPanel';
import { 
  Building2, UserCheck, Shield, Clipboard, Terminal, 
  HelpCircle, Sparkles, UserPlus, FileCode, CheckCircle, Smartphone, Info
} from 'lucide-react';

export default function App() {
  // Session States
  const [userType, setUserType] = useState<'admin' | 'vendedor' | null>(() => {
    return (localStorage.getItem('orenda_session_type') as any) || null;
  });
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('orenda_session_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation states within standard login flow
  const [currentScreen, setCurrentScreen] = useState<'portal' | 'login-admin' | 'login-vendedor' | 'cadastro-vendedor'>('portal');
  // Global Mode switcher: 'simulador' (active Orenda system) or 'dev-panel' (GAS coding scripts & instruction sheets)
  const [globalMode, setGlobalMode] = useState<'simulador' | 'dev-panel'>('simulador');

  // Input States for login forms
  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Registration States
  const [regNome, setRegNome] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPix, setRegPix] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Trigger base seeder if empty
  useEffect(() => {
    dbSim.getConfigs();
    dbSim.getLinhas();
    dbSim.getProdutos();
    dbSim.getVendedores();
    dbSim.getVendas();
    dbSim.getEstoque();
    dbSim.getMetas();
    dbSim.getLogs();
  }, []);

  // Sync session with storage
  const loginAsAdmin = (email: string, pass: string) => {
    setErrorMsg('');
    const success = dbSim.loginAdmin(email, pass);
    if (success) {
      const mockAdmin = { NOME: 'Administrador Orenda', EMAIL: email };
      setUserType('admin');
      setCurrentUser(mockAdmin);
      localStorage.setItem('orenda_session_type', 'admin');
      localStorage.setItem('orenda_session_user', JSON.stringify(mockAdmin));
      setEmailInput('');
      setSenhaInput('');
    } else {
      setErrorMsg('Credenciais administrativas incorretas. Tente novamente.');
    }
  };

  const loginAsVendedor = (email: string, pass: string) => {
    setErrorMsg('');
    const res = dbSim.loginVendedor(email, pass);
    
    if ('error' in res) {
      setErrorMsg(res.error);
    } else {
      setUserType('vendedor');
      setCurrentUser(res);
      localStorage.setItem('orenda_session_type', 'vendedor');
      localStorage.setItem('orenda_session_user', JSON.stringify(res));
      setEmailInput('');
      setSenhaInput('');
    }
  };

  const handleRegisterVendedor = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = dbSim.cadastrarVendedor(regNome, regWhatsapp, regEmail, regPix, regSenha);
    
    if (res.success) {
      setRegSuccess(true);
      // Clean up fields
      setRegNome('');
      setRegWhatsapp('');
      setRegEmail('');
      setRegPix('');
      setRegSenha('');
    } else {
      setErrorMsg(res.error || 'Erro ao processar cadastro de vendedor.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('orenda_session_type');
    localStorage.removeItem('orenda_session_user');
    setUserType(null);
    setCurrentUser(null);
    setCurrentScreen('portal');
  };

  return (
    <div className="min-h-screen bg-[#020813] text-zinc-100 font-sans flex flex-col selection:bg-cobalt-600 selection:text-white">
      {/* Global Header with Live Toggle and Developer Widget */}
      <header className="bg-zinc-900 border-b border-zinc-805 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cobalt-600/10 rounded-xl border border-cobalt-500/20 text-cobalt-400">
              <Building2 size={18} />
            </div>
            <div>
              <span className="text-lg font-black tracking-widest text-white block">ORENDA</span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">Grupo de Vendas</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Global Mode Toggle Pill */}
            <div className="flex bg-zinc-950 p-1 rounded-full border border-zinc-800 text-xs">
              <button
                onClick={() => setGlobalMode('simulador')}
                className={`px-3 py-1.5 rounded-full font-bold transition flex items-center space-x-1 ${
                  globalMode === 'simulador'
                    ? 'bg-gradient-to-r from-cobalt-600 to-petrol-900 text-white font-black'
                    : 'text-zinc-500 hover:text-zinc-350'
                }`}
              >
                <Smartphone size={11} />
                <span>Simulador de Vendas</span>
              </button>
              <button
                onClick={() => setGlobalMode('dev-panel')}
                className={`px-3 py-1.5 rounded-full font-bold transition flex items-center space-x-1 ${
                  globalMode === 'dev-panel'
                    ? 'bg-amber-500 text-zinc-950 font-black'
                    : 'text-zinc-500 hover:text-zinc-350'
                }`}
              >
                <FileCode size={11} />
                <span>Integração Apps Script (Link)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Warning top banner on simulated environment */}
      {globalMode === 'simulador' && (
        <div className="bg-zinc-900/60 border-b border-zinc-800/40 px-4 py-2 text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 font-mono">
          <Info size={11} className="text-amber-500" />
          <span><b>Ambiente Simulador:</b> Você pode cadastrar vendedores fictícios, aprová-los no painel de admin e testar lançamentos de estoque em tempo real.</span>
        </div>
      )}

      {/* Main Content View routing */}
      <div className="flex-grow">
        {globalMode === 'dev-panel' ? (
          <DeveloperPanel />
        ) : (
          /* Active portal simulator router */
          <div className="p-4 sm:p-6 lg:p-8">
            {currentUser ? (
              userType === 'admin' ? (
                <AdminDashboard adminEmail={currentUser.EMAIL} onLogout={handleLogout} />
              ) : (
                <SellerDashboard vendedor={currentUser} onLogout={handleLogout} />
              )
            ) : (
              /* Portal landing choices login */
              <div className="max-w-md mx-auto my-12 animate-fade-in bg-petrol-900/40 border border-zinc-800/80 rounded-3xl p-8 space-y-8 shadow-2xl biotech-glow">
                
                {/* Visual branding Orenda Portal */}
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono uppercase text-amber-500 tracking-widest font-black">
                    SISTEMA DE GESTÃO INTEGRADO GOOGLE SHEETS
                  </span>
                  <h1 className="text-4xl font-extrabold text-white tracking-widest font-sans">ORENDA</h1>
                  <p className="text-zinc-500 text-xs">
                    Distribuição, preços corporativos e comissões do time comercial
                  </p>
                </div>

                {/* Subscreen Choices Router */}
                {currentScreen === 'portal' && (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setCurrentScreen('login-vendedor');
                        setErrorMsg('');
                      }}
                      className="w-full py-3.5 px-4 bg-cobalt-600 hover:bg-cobalt-500 transition font-bold text-sm rounded-xl text-white tracking-wide uppercase active:scale-98 hover:shadow-lg hover:shadow-cobalt-600/20"
                    >
                      Acessar Área do Vendedor
                    </button>

                    <button
                      onClick={() => {
                        setCurrentScreen('login-admin');
                        setErrorMsg('');
                      }}
                      className="w-full py-3.5 px-4 bg-zinc-800 hover:bg-zinc-750 text-zinc-350 border border-zinc-70 transition font-bold text-sm rounded-xl uppercase active:scale-98"
                    >
                      Painel Administrativo (Gerência)
                    </button>

                    <div className="relative flex py-3 items-center">
                      <div className="flex-grow border-t border-zinc-800"></div>
                      <span className="flex-shrink mx-4 text-zinc-650 font-mono text-[9px] uppercase tracking-wider">Afiliação Comercial</span>
                      <div className="flex-grow border-t border-zinc-800"></div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentScreen('cadastro-vendedor');
                        setErrorMsg('');
                        setRegSuccess(false);
                      }}
                      className="w-full py-3 px-4 bg-zinc-950 hover:bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-xs rounded-lg transition active:scale-98"
                    >
                      Cadastrar-se Solicitando Vaga Comercial
                    </button>

                    {/* Quick helper tips inside choices page */}
                    <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl leading-relaxed text-[11px] text-zinc-500 font-mono space-y-1">
                      <p className="text-zinc-400 font-bold mb-1">💡 Credenciais de Testes Prontas:</p>
                      <p><b>Admin</b>: admin@orenda.com.br / orenda2026</p>
                      <p><b>Vendedor</b>: ana@orenda.com.br / vendedor123</p>
                      <p className="text-[10px] text-zinc-650 mt-2">Dica: Cadastre um vendedor, mude para "Admin" para aprová-lo na lista de vendedores, e depois logue com as credenciais dele!</p>
                    </div>
                  </div>
                )}

                {/* LOGIN CORES */}
                {currentScreen === 'login-admin' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center space-x-1">
                        <Shield className="text-cobalt-400" size={16} />
                        <span>Admin Login</span>
                      </h3>
                      <button 
                        onClick={() => setCurrentScreen('portal')}
                        className="text-xs text-zinc-500 hover:text-white"
                      >
                        ← Voltar ao Portal
                      </button>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        loginAsAdmin(emailInput, senhaInput);
                      }} 
                      className="space-y-4 text-xs font-semibold"
                    >
                      <div className="space-y-1">
                        <label className="text-zinc-400 block">E-mail Administrativo</label>
                        <input
                          type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-cobalt-600"
                          placeholder="admin@orenda.com.br"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-zinc-400 block">Senha Master</label>
                        <input
                          type="password" required value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-cobalt-600"
                          placeholder="••••••••"
                        />
                      </div>

                      {errorMsg && (
                        <p className="p-3 bg-red-950/20 border border-red-900/30 rounded text-red-400 text-[11px] leading-relaxed">
                          ⚠️ {errorMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 bg-cobalt-600 hover:bg-gradient-to-r hover:from-cobalt-600 hover:to-cobalt-500 transition text-white rounded-lg font-bold text-xs uppercase"
                      >
                        Acessar Gerenciamento
                      </button>
                    </form>
                  </div>
                )}

                {currentScreen === 'login-vendedor' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center space-x-1">
                        <UserCheck className="text-amber-500" size={16} />
                        <span>Vendedor Login</span>
                      </h3>
                      <button 
                        onClick={() => setCurrentScreen('portal')}
                        className="text-xs text-zinc-500 hover:text-white"
                      >
                        ← Voltar ao Portal
                      </button>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        loginAsVendedor(emailInput, senhaInput);
                      }} 
                      className="space-y-4 text-xs font-semibold"
                    >
                      <div className="space-y-1">
                        <label className="text-zinc-400 block">Seu E-mail Cadastrado</label>
                        <input
                          type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-cobalt-600"
                          placeholder="ana@orenda.com.br"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-zinc-400 block">Sua Senha</label>
                        <input
                          type="password" required value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-cobalt-600"
                          placeholder="••••••••"
                        />
                      </div>

                      {errorMsg && (
                        <p className="p-3 bg-red-950/20 border border-red-900/30 rounded text-red-400 text-[11px] leading-relaxed">
                          ⚠️ {errorMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 bg-cobalt-600 hover:bg-cobalt-500 transition text-white rounded-lg font-bold text-xs uppercase"
                      >
                        Autenticar Painel Vendedor
                      </button>
                    </form>
                  </div>
                )}

                {/* VENDOR REGISTRATION FLOW */}
                {currentScreen === 'cadastro-vendedor' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center space-x-1">
                        <UserPlus className="text-amber-500" size={16} />
                        <span>Formulário de Cadastro</span>
                      </h3>
                      <button 
                        onClick={() => setCurrentScreen('portal')}
                        className="text-xs text-zinc-500 hover:text-white"
                      >
                        ← Voltar ao Portal
                      </button>
                    </div>

                    {regSuccess ? (
                      <div className="space-y-4 text-center p-4 bg-amber-950/10 border border-amber-900/40 rounded-xl">
                        <CheckCircle className="text-amber-500 mx-auto" size={40} />
                        <h4 className="font-bold text-white text-base">Inscrição Efetuada com Sucesso!</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Sua solicitação de vendedor comercial foi enviada e está guardada na aba de <b>VENDEDORES</b> da planilha Google Sheets. 
                          <br /><br />
                          <b>Próximo Passo no Simulador:</b> Acesse o "Painel de Administrador" com a conta master (admin@orenda.com.br) e libere/aprove o seu cadastro na aba Vendedores. Depois disso você já poderá logar com a senha criada!
                        </p>
                        <button
                          onClick={() => {
                            setRegSuccess(false);
                            setCurrentScreen('portal');
                          }}
                          className="py-2 px-4 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded border border-zinc-850"
                        >
                          Voltar ao Menu Principal
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleRegisterVendedor} className="space-y-4 text-xs font-semibold">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-zinc-400 block">Nome Completo</label>
                            <input
                              type="text" required value={regNome} onChange={(e) => setRegNome(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white"
                              placeholder="Julio Cesar"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-zinc-400 block font-sans">WhatsApp (Número)</label>
                            <input
                              type="text" required value={regWhatsapp} onChange={(e) => setRegWhatsapp(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white"
                              placeholder="ex: 11988887766"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-400 block">E-mail Comercial de Trabalho</label>
                          <input
                            type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white"
                            placeholder="julio@orenda.com.br"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-400 block font-sans">Sua Chave PIX de Recebimento</label>
                          <input
                            type="text" required value={regPix} onChange={(e) => setRegPix(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white"
                            placeholder="CPF, celular, e-mail ou chave aleatória"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-400 block">Crie uma Senha Forte</label>
                          <input
                            type="password" required value={regSenha} onChange={(e) => setRegSenha(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-805 rounded p-2.5 text-sm text-white"
                            placeholder="Mínimo de 6 dígitos"
                          />
                        </div>

                        {errorMsg && (
                          <p className="p-3 bg-red-950/40 border border-red-900 rounded text-red-500 text-[11px]">
                            ⚠️ {errorMsg}
                          </p>
                        )}

                        <button
                          type="submit"
                          className="w-full py-3 bg-amber-500 hover:bg-amber-600 transition text-zinc-950 font-extrabold text-xs tracking-wider uppercase rounded-lg shadow-lg active:scale-98"
                        >
                          Enviar Minhas Credenciais
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="bg-zinc-900 border-t border-zinc-805 py-6 px-4 text-center text-xs text-zinc-650">
        <p>© 2026 Orenda Group S.A. | Todos os direitos reservados.</p>
        <p className="mt-1 font-mono text-[10px] text-zinc-650">Desenvolvido sob padrões corporativos no Google Cloud e Google Sheets.</p>
      </footer>
    </div>
  );
}
