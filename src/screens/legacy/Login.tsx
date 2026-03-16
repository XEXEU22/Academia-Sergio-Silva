import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, Eye } from '../icons';

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="flex items-center p-4 sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
          <ChevronLeft className="text-white" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">Arte da Defesa Pessoal</h2>
      </header>

      <main className="flex-1 w-full max-w-[480px] mx-auto px-6 pt-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo de Volta</h1>
          <p className="text-slate-400">Entre para continuar seu treinamento</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1 text-slate-300">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="email" 
                className="w-full h-14 rounded-xl border border-border-dark bg-card-dark pl-12 pr-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="exemplo@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-slate-300">Senha</label>
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-primary font-bold hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="password" 
                className="w-full h-14 rounded-xl border border-border-dark bg-card-dark pl-12 pr-12 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="••••••••"
                required
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                <Eye size={20} />
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 mt-4 hover:bg-primary/90"
          >
            Entrar
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Não tem uma conta? 
            <button onClick={() => navigate('/register')} className="text-primary font-bold hover:underline ml-1">Cadastre-se</button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
