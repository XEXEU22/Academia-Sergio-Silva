import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, CheckCircle2, MessageSquare } from '../icons';
import BottomNav from '../components/BottomNav';

const Plans: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      title: 'Plano Mensal',
      price: '150',
      highlight: false,
      features: ['Acesso a todas as modalidades', 'Aulas ilimitadas', 'Avaliação física mensal']
    },
    {
      title: 'Plano Trimestral',
      price: '120',
      highlight: true,
      badge: 'Melhor Valor',
      features: ['Tudo do Plano Mensal', 'Kimono oficial de brinde', 'Desconto em seminários', 'Acesso a conteúdo online']
    },
    {
      title: 'Plano Anual',
      price: '90',
      highlight: false,
      features: ['Maior economia garantida', 'Sem taxa de matrícula', 'Acesso total premium']
    }
  ];

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="flex items-center justify-between p-4 border-b border-border-dark sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Arte da Defesa Pessoal</h1>
        </div>
        <button onClick={() => navigate('/notifications')} className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Bell size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-8 pb-4">
          <h2 className="text-3xl font-black tracking-tight">Escolha seu plano</h2>
          <p className="text-slate-400 mt-1">Transforme seu corpo e mente com nossos treinos.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 px-4 py-6">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`relative flex flex-col gap-6 rounded-2xl border p-6 transition-all ${
                plan.highlight 
                  ? 'border-2 border-primary bg-primary/5 shadow-2xl shadow-primary/10 scale-[1.02]' 
                  : 'border-border-dark bg-card-dark shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase tracking-widest font-black px-4 py-1 rounded-full shadow-lg shadow-primary/30">
                  {plan.badge}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">{plan.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-primary">R$ {plan.price}</span>
                  <span className="text-sm font-semibold text-slate-500">/mês</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/payment-success')}
                className={`w-full py-4 px-4 rounded-xl font-bold transition-all active:scale-95 ${
                  plan.highlight 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                Assinar Agora
              </button>
              <div className="flex flex-col gap-4">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="text-primary" size={20} />
                    <span className={plan.highlight ? 'font-medium text-white' : 'text-slate-300'}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-card-dark border border-border-dark">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <p className="text-lg font-bold">Ainda com dúvidas?</p>
              <p className="text-slate-400 text-sm">Fale com nossos instrutores agora mesmo pelo chat.</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
              <MessageSquare size={20} />
              Falar com Consultor
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Plans;
