import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Play, 
  Bookmark, 
  User, 
  TrendingUp, 
  History, 
  Star, 
  PlayCircle,
  Filter,
  CheckCircle2
} from '../icons';
import BottomNav from '../components/BottomNav';

const PremiumVideoGallery: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filters = ['Todos', 'Jiu-Jitsu', 'Muay Thai', 'Wing Chun', 'Kickboxing'];

  const featuredVideo = {
    title: 'Defesa Pessoal: Contra-Ataques de Elite',
    instructor: 'Mestre Sérgio',
    duration: '18:45',
    thumb: '/artifacts/jiujitsu_training_1773243516160.png'
  };

  const videos = [
    { title: 'O Clinch no Muay Thai: Controle Total', instructor: 'Mestre Sérgio', views: '12k', duration: '12:20', thumb: '/artifacts/video_muay_thai_thumb_1773245407335.png', type: 'Muay Thai' },
    { title: 'Wing Chun: Linha Central e Velocidade', instructor: 'Mestre Sérgio', views: 'Novo', duration: '08:15', thumb: '/artifacts/video_wing_chun_thumb_1773245426284.png', type: 'Wing Chun' },
    { title: 'Kickboxing: Combinações Explosivas', instructor: 'Mestre Sérgio', views: 'Série Pro', duration: '22:05', thumb: '/artifacts/video_kickboxing_thumb_1773245445077.png', type: 'Kickboxing' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Header com Glassmorphism */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-bold tracking-widest uppercase">Academia Digital</h2>
        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <Search size={20} />
        </button>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 px-6 pt-8 space-y-10"
      >
        {/* Filtros Estilizados */}
        <section>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Filter size={18} />
            </div>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`h-11 shrink-0 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                  selectedFilter === filter 
                    ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(255,107,0,0.3)]' 
                    : 'bg-card-dark border-border-dark text-slate-500 hover:border-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Vídeo em Destaque (Cinema Style) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">Destaque da Semana</h3>
          </div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group relative rounded-[2.5rem] overflow-hidden bg-card-dark border border-border-dark aspect-video shadow-2xl shadow-primary/10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-card-dark/20 to-transparent z-10" />
            <img 
              src={featuredVideo.thumb} 
              alt="Featured" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] opacity-70"
            />
            
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
               <div className="flex items-center gap-2 mb-3">
                 <span className="px-3 py-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/30">
                   Premium
                 </span>
                 <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                   <Star size={12} className="fill-amber-500 text-amber-500" /> 4.9 (1.2k)
                 </span>
               </div>
               
               <h4 className="text-2xl md:text-3xl font-black text-white mb-2 leading-none max-w-sm tracking-tighter">
                 {featuredVideo.title}
               </h4>
               
               <div className="flex items-center justify-between mt-4">
                 <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                    <Play size={18} fill="white" />
                    <span className="text-xs font-bold text-white tracking-widest uppercase">{featuredVideo.duration}</span>
                 </div>
                 <button className="size-14 rounded-full bg-white text-background-dark flex items-center justify-center shadow-2xl shadow-white/20 active:scale-90 transition-transform">
                   <Play size={24} fill="currentColor" />
                 </button>
               </div>
            </div>
          </motion.div>
        </section>

        {/* Lista de Treinos (Netflix Style) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight">Recém Adicionados</h3>
            <button className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
              Explorar Todos
            </button>
          </div>

          <div className="space-y-4">
            {videos.map((video, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="group flex gap-5 p-4 rounded-3xl bg-card-dark border border-border-dark hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="relative w-36 h-24 shrink-0 rounded-2xl overflow-hidden bg-card-dark/80 ring-2 ring-white/5">
                  <img src={video.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" alt={video.title} />
                  <div className="absolute inset-0 bg-background-dark/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={32} className="text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-background-dark/80 px-2 py-0.5 rounded text-[9px] font-black text-white border border-white/10">
                    {video.duration}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-center py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-primary font-black uppercase tracking-widest">{video.type}</span>
                    <span className="size-1 rounded-full bg-slate-700" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{video.views} Views</span>
                  </div>
                  <h5 className="font-black text-base text-white leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors tracking-tight">
                    {video.title}
                  </h5>
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-slate-500" />
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{video.instructor}</p>
                  </div>
                </div>
                
                <div className="flex items-center pr-2">
                   <Bookmark className="text-slate-700 hover:text-primary transition-colors" size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sugestão de Serie Premium */}
        <motion.section 
          variants={itemVariants}
          className="relative rounded-[2rem] bg-gradient-to-br from-card-dark/50 to-primary/30 border border-primary/20 p-8 overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 size-60 bg-primary/20 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-2">
                <Star className="text-amber-500" size={18} fill="currentColor" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Série Exclusiva</span>
             </div>
             <h4 className="text-2xl font-black text-white max-w-xs">A Arte do Combate Real</h4>
             <p className="text-white/60 text-xs leading-relaxed max-w-xs">Aprenda a filosofia secreta do Mestre Sérgio para lutas rápidas e eficazes.</p>
             <button className="px-6 py-3 bg-white text-background-dark rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/10 active:scale-95 transition-transform">
                Desbloquear Série
             </button>
          </div>
        </motion.section>
      </motion.main>
      
      <BottomNav />
    </div>
  );
};

export default PremiumVideoGallery;
