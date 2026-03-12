import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Verified, Star, GraduationCap, History, Calendar, Plus } from '../icons';
import BottomNav from '../components/BottomNav';

const InstructorProfile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-border-dark px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Perfil do Instrutor</h1>
        <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
          <Share2 size={24} className="text-white" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <section className="flex flex-col items-center px-6 pt-8 pb-6">
          <div className="relative">
            <div className="size-32 rounded-full border-4 border-primary p-1 bg-background-dark overflow-hidden shadow-2xl shadow-primary/20">
              <img 
                alt="Mestre Sérgio" 
                className="w-full h-full object-cover rounded-full" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ3cyTFUpOEz-J0nLAoJM3CZPKIU9hNrS_NUMeqWphl7UTzdLhw-YXuJh016U93P5i2PFVcB4vuBEdQHn3PHNOHf-qzMgdeM9fBv8Z9x4UIDHbU7gfi2SWOvlmtS4CeykgMq43wiM1t-hX9WFFXfJ_MSpIg5yA4TeDiTMMTbSp7aKN9N59o5MFjUdBjSw1RPc6Ag4k6py9lxOxTizx8LgJjnLeUmd6Bk1z8r9fzLWkfIAmsFgaKffxFCI17uxMacJ9RQaeIIoiyMA" 
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-white size-8 rounded-full flex items-center justify-center border-2 border-background-dark shadow-lg">
              <Verified size={16} />
            </div>
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold">Mestre Sérgio</h2>
            <p className="text-primary font-bold">Faixa Preta 5º Dan</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-slate-400 text-sm">
              <GraduationCap size={16} />
              <span>15 Anos de Experiência</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3 px-4 mb-8">
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card-dark border border-border-dark shadow-lg">
            <span className="text-xl font-black text-primary">1.2k</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Alunos</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card-dark border border-border-dark shadow-lg">
            <span className="text-xl font-black text-primary">4.9</span>
            <div className="flex items-center gap-1">
              <Star size={10} className="text-amber-500 fill-amber-500" />
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Avaliação</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card-dark border border-border-dark shadow-lg">
            <span className="text-xl font-black text-primary">12</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Aulas</span>
          </div>
        </section>

        <section className="px-6 mb-8">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <History className="text-primary" size={20} />
            Biografia
          </h3>
          <p className="text-slate-400 leading-relaxed text-sm">
            Mestre Sérgio é um praticante dedicado com mais de 15 anos de experiência em várias disciplinas de artes marciais. Ele se concentra em desenvolver disciplina, clareza mental e força física em seus alunos, combinando filosofia tradicional com técnicas modernas de combate.
          </p>
        </section>

        <section className="px-6 mb-8">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Verified className="text-primary" size={20} />
            Especialidades
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Karatê', 'Muay Thai', 'Wing Chun'].map(spec => (
              <span key={spec} className="px-5 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-bold">
                {spec}
              </span>
            ))}
          </div>
        </section>

        <section className="px-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              Próximas Aulas
            </h3>
            <button onClick={() => navigate('/schedule')} className="text-primary text-sm font-bold hover:underline">Ver Todas</button>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-2xl bg-card-dark border border-border-dark shadow-xl group hover:border-primary/30 transition-all">
              <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-border-dark pr-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Mar</span>
                <span className="text-2xl font-black text-primary leading-none">12</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold group-hover:text-primary transition-colors">Karatê Avançado</h4>
                <p className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                  <History size={14} />
                  18:00 - 19:30 • Dojo 1
                </p>
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-xl self-center shadow-lg shadow-primary/20 active:scale-95 transition-all">
                <Plus size={20} />
              </button>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default InstructorProfile;
