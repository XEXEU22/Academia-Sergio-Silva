import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, ArrowRight, Receipt } from '../icons';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark font-display text-white min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card-dark rounded-2xl shadow-2xl overflow-hidden border border-border-dark">
        <div className="pt-12 pb-8 flex flex-col items-center text-center px-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 border-4 border-primary/30 shadow-2xl shadow-primary/20">
            <CheckCircle2 className="text-primary" size={60} />
          </div>
          <h1 className="text-3xl font-black mb-2">Pagamento Sucesso!</h1>
          <p className="text-slate-400">Seu treinamento começa agora. Prepare o seu kimono!</p>
        </div>

        <div className="px-6 py-6 border-t border-b border-border-dark bg-primary/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plano Selecionado</span>
            <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg shadow-primary/30">Ativo</span>
          </div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-black text-primary">Plano Trimestral</h2>
              <p className="text-sm text-slate-500">Acesso ilimitado a todas as aulas</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black">R$ 120<span className="text-sm font-normal text-slate-500">/mês</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Método de Pagamento</span>
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary" size={16} />
                <span className="font-bold text-slate-300">Cartão de Crédito **** 1234</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">ID da Transação</span>
              <span className="font-mono text-xs text-slate-500">#MAA-8829-XPL-2024</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Data e Hora</span>
              <span className="font-bold text-slate-300">24 Out, 2023 - 14:35</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest text-sm"
          >
            <span>Ir para a Home</span>
            <ArrowRight size={20} />
          </button>
          <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
            <Receipt size={20} className="text-primary" />
            <span>Visualizar Recibo Completo</span>
          </button>
        </div>

        <div className="h-2 w-full bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
      </div>
    </div>
  );
};

export default PaymentSuccess;
