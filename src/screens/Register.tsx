import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Phone, Lock, Eye } from '../icons';

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="flex items-center p-4 sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
          <ChevronLeft className="text-white" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">Arte da Defesa Pessoal</h2>
      </header>

      <main className="flex-1 w-full max-w-[480px] mx-auto px-6 pb-12">
        <div className="my-6">
          <div 
            className="w-full h-44 bg-center bg-cover rounded-2xl border border-border-dark shadow-xl"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPJ0mm38W8XsPK_sDy1uZ2jP3D6JN2YcjuZ3rR1ZrwhVz_LvAUJ3vhdgG4BEQLVRg-ITFM34wQIlzPHEHrrwDFccuph9jQx7yJF3Q5dCmo_nfSKwnfwjtdSMRBrRIWaTOUMp244ST1iwwPojF7-9bg9Yu2SeSqhwG5p9psznMFW_35XhPWsgn7aui3j90_CmCB2izwtBt-3vmo9qBDr6j1rfHtRpo_TLoJnZBiyQfCnBXqeW3xxtgO7nis2apWyckSo-jfZsoq7ro")' }}
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">Novo Aluno</h1>
          <p className="text-slate-400 text-sm">Comece sua jornada para dominar a arte da defesa</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="space-y-1">
            <label className="text-sm font-semibold px-1 text-slate-300">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input className="w-full h-14 rounded-xl border border-border-dark bg-card-dark pl-12 pr-4 focus:border-primary outline-none text-white placeholder:text-slate-600 transition-all" placeholder="Seu Nome" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold px-1 text-slate-300">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input className="w-full h-14 rounded-xl border border-border-dark bg-card-dark pl-12 pr-4 focus:border-primary outline-none text-white placeholder:text-slate-600 transition-all" placeholder="exemplo@email.com" type="email" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold px-1 text-slate-300">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input className="w-full h-14 rounded-xl border border-border-dark bg-card-dark pl-12 pr-4 focus:border-primary outline-none text-white placeholder:text-slate-600 transition-all" placeholder="(11) 99999-9999" type="tel" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold px-1 text-slate-300">Arte Marcial de Interesse</label>
            <div className="relative">
              <select className="w-full h-14 rounded-xl border border-border-dark bg-card-dark pl-4 pr-10 focus:border-primary outline-none appearance-none text-white transition-all">
                <option disabled selected value="">Selecione uma modalidade</option>
                <option value="karate">Karatê</option>
                <option value="muay-thai">Muay Thai</option>
                <option value="kickboxing">Kickboxing</option>
                <option value="personal-defense">Defesa Pessoal</option>
                <option value="wing-chun">Wing Chun</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold px-1 text-slate-300">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input className="w-full h-14 rounded-xl border border-border-dark bg-card-dark pl-12 pr-12 focus:border-primary outline-none text-white placeholder:text-slate-600 transition-all" placeholder="••••••••" type="password" required />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                <Eye size={20} />
              </button>
            </div>
          </div>

          <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 mt-6 hover:bg-primary/90">
            Cadastrar
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Já tem uma conta? 
            <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline ml-1">Entrar</button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
