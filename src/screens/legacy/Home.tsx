import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  Play, 
  Calendar, 
  Dumbbell, 
  GraduationCap, 
  Image as ImageIcon, 
  ChevronRight,
  BookOpen
} from '../icons';
import BottomNav from '../components/BottomNav';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1a120b] min-h-screen text-white flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 z-50 bg-[#1a120b]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-[#2a1f16] rounded-lg flex items-center justify-center border border-[#3d2c1e]">
            <div className="size-6 bg-primary rounded-sm rotate-45 flex items-center justify-center">
              <div className="size-3 bg-[#1a120b] rounded-full -rotate-45" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Mestre Sergio Silva</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/notifications')} className="relative p-2 text-slate-400 hover:text-primary transition-colors">
            <Bell size={24} />
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-[#1a120b]" />
          </button>
          <button onClick={() => navigate('/instructor')} className="size-10 rounded-full border-2 border-[#3d2c1e] p-0.5 overflow-hidden hover:border-primary transition-colors">
            <div className="size-full bg-[#2a1f16] rounded-full flex items-center justify-center text-primary">
              <User size={20} />
            </div>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4">
        {/* Hero Section */}
        <section className="py-6">
          <h2 className="text-3xl font-bold leading-tight">Bem-vindo ao Tatame</h2>
          <p className="text-slate-400 mt-1">Sua jornada de mestre começa aqui.</p>
        </section>

        {/* Video Player Section */}
        <section className="relative rounded-2xl overflow-hidden border border-[#3d2c1e] bg-[#2a1f16] group">
          <div className="aspect-video relative">
            <img 
              src="https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=2070&auto=format&fit=crop" 
              alt="Martial Arts Training" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="size-16 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 transition-transform active:scale-95">
                <Play size={32} fill="white" className="ml-1" />
              </button>
            </div>
            {/* Progress Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[35%] bg-primary shadow-[0_0_10px_rgba(255,107,0,0.8)]" />
              </div>
              <div className="flex justify-end">
                <span className="text-[10px] font-mono text-white/80">01:45 / 04:20</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Actions */}
        <section className="mt-6 space-y-4">
          <button 
            onClick={() => navigate('/schedule')}
            className="w-full h-16 bg-primary rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <Calendar size={24} />
            Agendar Aula
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/plans')}
              className="h-32 bg-[#2a1f16] rounded-2xl border border-[#3d2c1e] flex flex-col items-center justify-center gap-2 hover:bg-[#32261b] transition-colors"
            >
              <div className="text-primary">
                <Dumbbell size={32} />
              </div>
              <span className="font-bold">Planos</span>
            </button>
            <button 
              onClick={() => navigate('/instructor')}
              className="h-32 bg-[#2a1f16] rounded-2xl border border-[#3d2c1e] flex flex-col items-center justify-center gap-2 hover:bg-[#32261b] transition-colors"
            >
              <div className="text-primary">
                <User size={32} />
              </div>
              <span className="font-bold">Mestre</span>
            </button>
          </div>
        </section>

        {/* Quick Access */}
        <section className="mt-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Acesso Rápido</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/gallery')}
              className="w-full p-5 bg-[#2a1f16] rounded-2xl border border-[#3d2c1e] flex items-center justify-between group hover:bg-[#32261b] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-primary">
                  <ImageIcon size={24} />
                </div>
                <span className="font-bold">Galeria de Fotos e Vídeos</span>
              </div>
              <ChevronRight size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
            </button>

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full p-5 bg-[#2a1f16] rounded-2xl border border-[#3d2c1e] flex items-center justify-between group hover:bg-[#32261b] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-primary">
                  <GraduationCap size={24} />
                </div>
                <span className="font-bold">Portal do Aluno</span>
              </div>
              <ChevronRight size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </section>

        {/* News Section */}
        <section className="mt-10">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Notícias</h3>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x">
            {[
              {
                title: "Novo Exame de Faixas",
                desc: "Prepare-se para a próxima graduação que ocorrerá no final deste mês. Inscrições...",
                img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop",
                badge: "NOVO"
              },
              {
                title: "Workshop de Defesa",
                desc: "Aprenda técnicas avançadas de imobilização e controle em situações reais...",
                img: "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?q=80&w=800&auto=format&fit=crop",
                badge: null
              }
            ].map((news, i) => (
              <div key={i} className="min-w-[280px] w-[280px] bg-[#2a1f16] rounded-2xl border border-[#3d2c1e] overflow-hidden snap-start group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={news.img} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {news.badge && (
                    <div className="absolute bottom-3 right-3 bg-primary text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">
                      {news.badge}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg leading-tight mb-2">
                    {news.title}
                  </h4>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {news.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Auth Links */}
        <section className="mt-12 mb-8 text-center">
          <p className="text-slate-500 text-sm font-medium">Ainda não é um membro?</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={() => navigate('/register')} className="text-primary font-bold text-xl hover:underline">Criar Conta</button>
            <span className="text-slate-700 text-xl font-bold">•</span>
            <button onClick={() => navigate('/login')} className="text-white font-bold text-xl hover:underline">Fazer Login</button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
