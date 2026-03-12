import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar as CalendarIcon, Clock, User, CheckCircle2 } from '../icons';
import BottomNav from '../components/BottomNav';

const Schedule: React.FC = () => {
  const navigate = useNavigate();

  const classes = [
    { time: '07:00', duration: '60 min', title: 'Muay Thai', instructor: 'Mestre Sérgio', spots: '8 Vagas', level: 'Intermediário', status: 'available' },
    { time: '09:00', duration: '90 min', title: 'Karatê Do', instructor: 'Sensei Tanaka', spots: '4 Vagas', level: 'Todos Níveis', status: 'available' },
    { time: '11:00', duration: '60 min', title: 'Kickboxing', instructor: 'Instrutora Ana', spots: 'Esgotado', level: 'Avançado', status: 'full' },
    { time: '18:00', duration: '60 min', title: 'Wing Chun', instructor: 'Mestre Li', spots: '12 Vagas', level: 'Iniciante', status: 'available' },
  ];

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="sticky top-0 z-50 flex items-center bg-background-dark/90 backdrop-blur-md p-4 border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
          <ChevronLeft className="text-white" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Agendar Aula</h2>
        <button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
          <CalendarIcon size={24} />
        </button>
      </header>

      <main className="flex-1 pb-24">
        <div className="p-4">
          <div className="bg-card-dark p-4 rounded-2xl border border-border-dark">
            <div className="flex items-center justify-between mb-4">
              <button className="p-1 hover:bg-primary/20 rounded-full transition-colors">
                <ChevronLeft size={20} />
              </button>
              <p className="font-bold">Março 2026</p>
              <button className="p-1 hover:bg-primary/20 rounded-full transition-colors rotate-180">
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <p className="text-[11px] font-bold text-slate-500">{day}</p>
                  <button className={`flex size-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    i === 2 ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold' : 'hover:bg-primary/20 text-slate-300'
                  }`}>
                    {i + 9}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
          {['Todos', 'Karatê', 'Muay Thai', 'Kickboxing', 'Wing Chun'].map((filter, i) => (
            <button key={filter} className={`h-10 shrink-0 px-4 rounded-xl text-sm font-bold transition-all border ${
              i === 0 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-card-dark text-slate-400 border-border-dark hover:border-primary/50'
            }`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="px-4 py-2">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="text-primary" size={20} />
            Aulas Disponíveis
          </h3>
          <div className="space-y-4">
            {classes.map((cls, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                cls.status === 'full' ? 'bg-card-dark/50 border-border-dark opacity-50' : 'bg-card-dark border-border-dark hover:border-primary/30'
              }`}>
                <div className={`flex flex-col items-center justify-center rounded-xl p-3 min-w-[70px] ${
                  cls.status === 'full' ? 'bg-slate-800' : 'bg-primary/10 border border-primary/20'
                }`}>
                  <p className={`text-xs font-bold uppercase ${cls.status === 'full' ? 'text-slate-500' : 'text-primary'}`}>{cls.time}</p>
                  <p className="text-[10px] text-slate-500">{cls.duration}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-base">{cls.title}</h4>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <User size={14} />
                    {cls.instructor}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      cls.status === 'full' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}>
                      {cls.spots}
                    </span>
                    <span className="text-[10px] bg-slate-800/50 text-slate-400 border border-border-dark px-2 py-0.5 rounded-full font-bold">
                      {cls.level}
                    </span>
                  </div>
                </div>
                <button 
                  disabled={cls.status === 'full'}
                  className={`py-2 px-6 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    cls.status === 'full' ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90'
                  }`}
                >
                  {cls.status === 'full' ? 'Esgotado' : 'Reservar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Schedule;
