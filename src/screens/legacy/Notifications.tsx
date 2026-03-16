import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Info, Bell, MessageSquare } from '../icons';
import BottomNav from '../components/BottomNav';

const Notifications: React.FC = () => {
  const navigate = useNavigate();

  const notifications = [
    { type: 'Aulas', title: 'Nova aula de Jiu-Jitsu', time: '2 min atrás', desc: 'Uma nova aula de técnica avançada foi adicionada ao seu cronograma de terça-feira.', icon: Calendar, color: 'primary' },
    { type: 'Pagamentos', title: 'Mensalidade vencendo', time: '1 hora atrás', desc: 'Sua mensalidade vence em 2 dias. Evite multas efetuando o pagamento agora pelo app.', icon: Info, color: 'red-500' },
    { type: 'Novidades', title: 'Novo Workshop de Muay Thai', time: '5 horas atrás', desc: 'Estão abertas as inscrições para o workshop especial de defesa pessoal com o Mestre Silva.', icon: MessageSquare, color: 'blue-500' },
    { type: 'Aulas', title: 'Lembrete de Treino', time: 'Ontem', desc: 'Não esqueça o seu treino de Krav Maga hoje às 19:30.', icon: Bell, color: 'primary' },
  ];

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-border-dark">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
              <ChevronLeft size={24} className="text-white" />
            </button>
            <h1 className="text-xl font-bold">Notificações</h1>
          </div>
          <button className="text-primary text-sm font-bold hover:underline">
            Marcar todas como lidas
          </button>
        </div>
        <div className="max-w-2xl mx-auto w-full px-4">
          <div className="flex gap-6 overflow-x-auto no-scrollbar pt-2">
            {['Todas', 'Aulas', 'Pagamentos', 'Novidades'].map((tab, i) => (
              <button key={tab} className={`pb-3 pt-2 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                i === 0 ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'
              }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full py-4 px-4 space-y-3 pb-24">
        {notifications.map((notif, i) => {
          const Icon = notif.icon;
          const colorClass = notif.color === 'primary' ? 'primary' : notif.color;
          return (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-card-dark border border-border-dark hover:border-primary/30 transition-all group">
              <div className={`flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 size-12 border border-primary/20`}>
                <Icon size={24} />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <div className="flex justify-between items-start">
                  <p className="font-bold group-hover:text-primary transition-colors">{notif.title}</p>
                  <span className="text-slate-500 text-xs whitespace-nowrap ml-2">{notif.time}</span>
                </div>
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1 mt-0.5">{notif.type}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{notif.desc}</p>
              </div>
            </div>
          );
        })}
      </main>
      <BottomNav />
    </div>
  );
};

export default Notifications;
