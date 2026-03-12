import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Play, Bookmark, User, TrendingUp, History, Star, PlayCircle } from '../icons';
import BottomNav from '../components/BottomNav';

const VideoGallery: React.FC = () => {
  const navigate = useNavigate();

  const videos = [
    { title: 'Fundamentos do Muay Thai: O Clinch', instructor: 'Instrutora Ana Costa', views: '8.4k visualizações', duration: '12:20', icon: TrendingUp, type: 'Recentes' },
    { title: 'Wing Chun: A Arte da Linha Central', instructor: 'Sifu Carlos Yang', views: 'Novo hoje', duration: '08:15', icon: History, type: 'Recentes' },
    { title: 'Kickboxing Cardio: Nível Intenso', instructor: 'Instrutor Bruno Dias', views: 'Série Premium', duration: '22:05', icon: Star, type: 'Recentes' },
  ];

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-border-dark">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <ChevronLeft size={24} className="text-white" />
          </button>
          <h2 className="text-lg font-bold flex-1 text-center">Galeria de Vídeos</h2>
          <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <Search size={24} className="text-white" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full pb-24">
        <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar scroll-smooth">
          {['Todos', 'Karatê', 'Muay Thai', 'Wing Chun', 'Kickboxing'].map((filter, i) => (
            <button key={filter} className={`h-10 shrink-0 px-5 rounded-xl text-sm font-bold transition-all border ${
              i === 0 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-card-dark border-border-dark text-slate-400 hover:border-primary/50'
            }`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="px-4 py-2">
          <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card-dark border border-border-dark shadow-2xl">
            <div 
              className="relative w-full aspect-video bg-cover bg-center overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCDkCwCpA3VLnjDWTiEhb3Bl4avqjUJmAFJonv6rhygePJw9JBMntRMlyBSSEEGkowDuuxYdlpz8z1ohzbh3e4hk52q_EVhEAos0_Hwqa3FhXLcequyseaTkiQ7vlZ7eJvhZCVunhchRS9EKif-r2Rqq0R4Q6fHI2Eww6i5WtOh9xHg2I6vQugeb3DHqEJjlIlwAgIP3EJKGOEYlzM1Q-5uShHQ33kouvvJ8Vbs7SllFQ4SWbCPlRjZ7-vP-4SBDCpQBE9OX2K06Uo")' }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform">
                  <Play size={32} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded-lg text-white text-xs font-bold backdrop-blur-sm border border-white/10">
                15:40
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold leading-tight">Técnicas Avançadas de Defesa Pessoal</h3>
                <Bookmark className="text-primary" size={20} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <User size={14} />
                  </div>
                  <p className="text-slate-400 text-sm">Mestre Ricardo Silva</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-primary/20">
                  Assistir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary/60 px-1">Recentes</h4>
          {videos.map((video, i) => {
            const Icon = video.icon;
            return (
              <div key={i} className="flex gap-4 p-3 rounded-2xl bg-card-dark border border-border-dark hover:border-primary/30 transition-all group">
                <div className="relative h-24 w-32 shrink-0 rounded-xl overflow-hidden bg-cover bg-center border border-border-dark" style={{ backgroundImage: `url("https://picsum.photos/seed/${i+10}/300/200")` }}>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white group-hover:bg-black/10 transition-colors">
                    <PlayCircle size={28} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 rounded-md text-[10px] text-white font-bold border border-white/10">
                    {video.duration}
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between py-1 overflow-hidden">
                  <div>
                    <p className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{video.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{video.instructor}</p>
                  </div>
                  <div className="flex items-center text-xs text-primary font-bold">
                    <Icon size={12} className="mr-1" />
                    {video.views}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default VideoGallery;
