import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Eye } from '../icons';
import BottomNav from '../components/BottomNav';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="flex items-center p-4 border-b border-border-dark bg-background-dark/90 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
          <ChevronLeft className="text-white" size={24} />
        </button>
        <h1 className="ml-4 text-lg font-bold tracking-tight">Arte da Defesa Pessoal</h1>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-8 pb-24">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-primary mb-2">Alterar Senha</h2>
          <p className="text-slate-400 text-sm">Atualize sua credencial de acesso para manter sua conta protegida.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-300 ml-1">Senha Atual</label>
            <div className="relative group">
              <input 
                type="password" 
                className="w-full h-14 px-4 bg-card-dark border border-border-dark rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="Digite sua senha atual"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors">
                <Eye size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-300 ml-1">Nova Senha</label>
            <div className="relative group">
              <input 
                type="password" 
                className="w-full h-14 px-4 bg-card-dark border border-border-dark rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="Crie uma nova senha"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors">
                <Eye size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-300 ml-1">Confirmar Nova Senha</label>
            <div className="relative group">
              <input 
                type="password" 
                className="w-full h-14 px-4 bg-card-dark border border-border-dark rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="Repita a nova senha"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors">
                <Eye size={20} />
              </button>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-3 shadow-inner">
            <Info className="text-primary shrink-0" size={20} />
            <p className="text-xs text-slate-400 leading-relaxed">
              Dica de segurança: Use ao menos 8 caracteres, misturando letras maiúsculas, números e caracteres especiais para uma proteção máxima.
            </p>
          </div>

          <button type="submit" className="w-full h-14 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest text-sm">
            Salvar Alterações
          </button>
        </form>
      </main>
      <BottomNav />
    </div>
  );
};

export default ChangePassword;
