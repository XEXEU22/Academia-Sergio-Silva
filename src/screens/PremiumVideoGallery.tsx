import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Play, 
  Bookmark, 
  User, 
  Star, 
  PlayCircle,
  Filter,
  Youtube,
  X
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';

const PremiumVideoGallery: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      let query = supabase.from('videos').select('*, profiles(full_name)');
      if (selectedFilter !== 'Todos') {
        query = query.eq('category', selectedFilter);
      }
      const { data, error } = await query;
      if (!error && data) {
        const premiumVid = data.find(v => v.is_premium);
        if (premiumVid) {
          setFeaturedVideo({
            title: premiumVid.title,
            instructor: premiumVid.profiles?.full_name || 'Desconhecido',
            duration: premiumVid.duration,
            thumb: premiumVid.thumbnail_url,
            video_url: premiumVid.video_url,
            type: premiumVid.category
          });
        }
        const mapped = data.map(v => ({
          title: v.title,
          video_url: v.video_url,
          instructor: v.profiles?.full_name || 'Desconhecido',
          views: `${(v.views_count || 0) / 1000}k`,
          duration: v.duration,
          thumb: v.thumbnail_url,
          type: v.category
        }));
        setVideos(mapped);
      }
      setLoading(false);
    }
    fetchVideos();
  }, [selectedFilter]);

  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    // Suporta: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/shorts/
    const regExp = /^.*(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|u\/\w\/))([^#&?]{11}).*/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
      : null;
  };

  const filters = ['Todos', 'Jiu-Jitsu', 'Muay Thai', 'Wing Chun', 'Kickboxing', 'Defesa'];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
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
        {/* Filtros */}
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

        {/* Destaque da Semana */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">Destaque da Semana</h3>
          </div>
          {loading ? (
            <div className="h-48 w-full rounded-[2.5rem] border border-border-dark flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs">
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-3" />
              Buscando Destaque...
            </div>
          ) : featuredVideo ? (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onClick={() => setActiveVideo(featuredVideo)}
              className="group relative rounded-[2.5rem] overflow-hidden bg-card-dark border border-border-dark aspect-video shadow-2xl shadow-primary/10 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-card-dark/20 to-transparent z-10" />
              <img
                src={featuredVideo.thumb}
                alt="Featured"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] opacity-70"
              />
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/30">Premium</span>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Star size={12} className="fill-amber-500 text-amber-500" /> 4.9 (1.2k)
                  </span>
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-white mb-2 leading-none max-w-sm tracking-tighter">{featuredVideo.title}</h4>
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
          ) : (
            <div className="h-48 w-full rounded-[2.5rem] border border-border-dark flex items-center justify-center text-slate-500 text-xs font-bold uppercase tracking-widest">
              Nenhum destaque para exibir
            </div>
          )}
        </section>

        {/* Lista de Treinos */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight">Recém Adicionados</h3>
            <button className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Explorar Todos</button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="py-6 min-h-[120px] rounded-3xl border border-border-dark flex items-center justify-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Carregando lista de vídeos...
              </div>
            ) : videos.length === 0 ? (
              <div className="py-6 min-h-[120px] rounded-3xl border border-border-dark flex items-center justify-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Nenhum vídeo listado
              </div>
            ) : videos.map((video, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                onClick={() => setActiveVideo(video)}
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
                  <h5 className="font-black text-base text-white leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors tracking-tight">{video.title}</h5>
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

        {/* Série Premium */}
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

      {/* Player de Vídeo */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-0 z-[100] bg-background-dark/98 backdrop-blur-2xl flex flex-col pt-12 overflow-y-auto"
          >
            <div className="px-6 flex items-center justify-between mb-8">
              <button onClick={() => setActiveVideo(null)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                <ChevronLeft size={24} />
              </button>
              <div className="text-center">
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1">Assistindo Agora</p>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activeVideo.category || activeVideo.type}</h4>
              </div>
              <button onClick={() => setActiveVideo(null)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 px-4 flex flex-col max-w-4xl mx-auto w-full pb-16">
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                {activeVideo.video_url && getEmbedUrl(activeVideo.video_url) ? (
                  <iframe
                    src={getEmbedUrl(activeVideo.video_url) || ''}
                    title={activeVideo.title || 'Vídeo da Academia'}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 space-y-4">
                    <Youtube size={64} />
                    <p className="text-sm font-black uppercase tracking-widest">Vídeo Indisponível</p>
                    <p className="text-xs text-slate-600 text-center px-8">Nenhuma URL de vídeo foi cadastrada.</p>
                  </div>
                )}
              </div>

              <div className="mt-10 px-4 space-y-6">
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-white mb-4 leading-none">{activeVideo.title}</h3>
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full border border-primary/30 bg-card-dark flex items-center justify-center overflow-hidden">
                      <img src="/artifacts/mestre_sergio_profile_pic_2_1773245462033.png" className="w-full h-full object-cover rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{activeVideo.instructor}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mestre de Elite</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                  <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Descrição do Treino</h5>
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    "Foque na precisão dos movimentos e na respiração. A técnica supera a força quando aplicada no momento exato."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumVideoGallery;
