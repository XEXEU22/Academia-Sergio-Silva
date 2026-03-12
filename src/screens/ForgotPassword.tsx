import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, Mail, LogIn } from '../icons';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="flex items-center p-4 pb-2 justify-between bg-background-dark/90 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
      </header>

      <main className="flex flex-col flex-1 max-w-[480px] w-full mx-auto px-6">
        <div className="pt-8 pb-4 flex justify-start">
          <div className="bg-primary/10 p-4 rounded-3xl text-primary border border-primary/20">
            <Lock size={48} />
          </div>
        </div>

        <h1 className="text-[32px] font-bold leading-tight pb-3 pt-4">Esqueci minha Senha</h1>
        <p className="text-slate-400 text-base leading-relaxed pb-6">
          Insira seu e-mail cadastrado abaixo. Enviaremos um link de recuperação para que você possa redefinir sua senha com segurança.
        </p>

        <div className="flex flex-col gap-6 py-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">E-mail</span>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="email" 
                className="w-full h-14 rounded-xl border border-border-dark bg-card-dark pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary outline-none transition-all"
                placeholder="seuemail@exemplo.com"
              />
            </div>
          </label>
        </div>

        <div className="pt-6 pb-4">
          <button className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all">
            Enviar Link de Recuperação
          </button>
        </div>

        <div className="mt-auto pb-10 flex flex-col items-center gap-4">
          <div className="w-full h-px bg-border-dark my-4" />
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <LogIn size={18} />
            Voltar para o Login
          </button>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
