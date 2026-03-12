import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info } from '../icons';
import BottomNav from '../components/BottomNav';

const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();

  const settings = [
    {
      group: 'Treinos e Atividades',
      items: [
        { title: 'Lembretes de Aula', desc: 'Receba avisos 30 minutos antes do início das suas aulas.', checked: true },
        { title: 'Novo Conteúdo', desc: 'Vídeos de técnicas, fotos de graduações e seminários.', checked: true },
      ]
    },
    {
      group: 'Administrativo',
      items: [
        { title: 'Alertas de Pagamento', desc: 'Lembretes de mensalidades e confirmações de recebimento.', checked: true },
        { title: 'Notícias da Academia', desc: 'Comunicados importantes, feriados e eventos especiais.', checked: false },
      ]
    },
    {
      group: 'Preferências',
      items: [
        { title: 'Ofertas e Promoções', desc: 'Descontos em equipamentos e planos para familiares.', checked: false },
      ]
    }
  ];

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-border-dark">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <ChevronLeft size={24} className="text-white" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center pr-10">Configurações de Notificações</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto pb-24">
        {settings.map((group, i) => (
          <div key={i} className="px-4 py-6">
            <h3 className="text-primary text-xs font-black uppercase tracking-widest mb-4">{group.group}</h3>
            <div className="space-y-1">
              {group.items.map((item, j) => (
                <div key={j} className="flex items-center gap-4 py-4 justify-between border-b border-border-dark">
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-base">{item.title}</p>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                  <div className="shrink-0">
                    <label className="relative flex h-[30px] w-[52px] cursor-pointer items-center rounded-full bg-slate-800 p-1 transition-all has-[:checked]:bg-primary shadow-inner">
                      <input type="checkbox" defaultChecked={item.checked} className="peer sr-only" />
                      <div className="h-5 w-5 rounded-full bg-white shadow-xl transition-all peer-checked:translate-x-5.5" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
};

export default NotificationSettings;
