import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, Dumbbell } from '../icons';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden text-white">
      <div className="relative w-full min-h-[400px] border-b border-border-dark overflow-hidden">
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCjcKwYNC21mANGmcXjfR2C8-Nn_gmRi0uT1gWQaORIUv0XHMxNLQk7RHPzpeUNH2UWsyivmgsE1GlkaIP1y7SCqTXhHCrpdcxo7bMscPhiD3hb5-5Fz9biJeibiOO1qKGiGYYBiJdl-NA4O65uMNAWj-y39FDT9Ux4Us4muv8wennU63prhVjGivIFyHZd9HD-MwlCbcctg-nSMf-7twGOVoTzQJHtVqDzJoZHsK3XSsdIOOdJ3WbKLrocWsQg3_w5TCS-hVteH6Q")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent" />
      </div>

      <div className="flex p-4 relative -mt-20 flex-col items-center">
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl min-h-32 w-32 border-4 border-background-dark shadow-2xl shadow-primary/20" 
             style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAq1BVNHBxR2y7rj-MRW4qheI3ed_tz0z8jAL3nuM6daIAAXWmXaXj7E5meYc-mPYpRghlAy8jwaRTZCXEreP78Gd_1v9BLGregfUw1OthvI5seZCwB_51HQzlQSj9_U-6onp3OKVp_KIZ6eD6GqZjq45IgVWgTrM0PGzphAco1RVmlG192XVDdEGgpiZCFFssQzp5sHSLrLPFGi15FsQ-nHuJsU6AX7ZmnRfmYW5v5ICOLcD63nl6NP4idVRHg1sbjrGK-BoAjzHw")' }} 
        />
        
        <div className="flex flex-col items-center justify-center px-4 mt-4">
          <h1 className="text-white text-[28px] font-black leading-tight tracking-tight text-center uppercase">
            Arte da Defesa Pessoal
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-px w-8 bg-primary"></span>
            <p className="text-primary text-xs font-black leading-normal text-center tracking-widest uppercase">Domine a Arte</p>
            <span className="h-px w-8 bg-primary"></span>
          </div>
        </div>

        <div className="flex flex-col items-center px-4 mt-8">
          <h2 className="text-white tracking-tight text-[32px] font-black leading-tight text-center pb-3 max-w-md">
            Desperte seu Guerreiro Interior
          </h2>
          <p className="text-slate-400 text-lg font-normal leading-relaxed pb-8 pt-1 text-center max-w-sm">
            Treinamento especializado em defesa pessoal, disciplina e excelência física. Junte-se à nossa comunidade de elite hoje.
          </p>
        </div>

        <div className="flex flex-col w-full max-w-[480px] gap-4 px-4 pb-12">
          <button 
            onClick={() => navigate('/register')}
            className="flex h-14 items-center justify-center rounded-xl bg-primary text-white text-lg font-black shadow-lg shadow-primary/25 transition-transform active:scale-95 uppercase tracking-widest"
          >
            Juntar-se à Academia
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="flex h-14 items-center justify-center rounded-xl bg-slate-800 text-white text-lg font-black transition-transform active:scale-95 uppercase tracking-widest"
          >
            Login de Membro
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 px-6 pb-12 w-full max-w-[480px]">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Dumbbell size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Equipamento</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <GraduationCap size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mestres</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Shield size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Segurança</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
