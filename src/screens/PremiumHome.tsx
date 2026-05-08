import React from 'react';
import { motion, Variants } from 'motion/react';
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
  Zap,
  Star,
  Activity,
  Award,
  Crown
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';

const PremiumHome: React.FC = () => {
  const navigate = useNavigate();
  const [homeBanner, setHomeBanner] = React.useState('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200&auto=format&fit=crop');

  React.useEffect(() => {
    const fetchBanner = async () => {
      const { data } = await supabase
        .from('site_assets')
        .select('url')
        .eq('asset_key', 'home_banner')
        .single();
      
      if (data?.url) setHomeBanner(data.url);
    };
    fetchBanner();
  }, []);

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
      transition: { 
        type: 'spring' as const, 
        stiffness: 100,
        damping: 15
      }
    }
  };

  const newsItems = [
    {
      title: "Exame de Graduação",
      desc: "Prepare-se para o seminário de final de mês com o Mestre Takeshi.",
      img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop",
      badge: "NOVO"
    },
    {
      title: "Masterclass No-Gi",
      desc: "Aprimore suas técnicas de finalização sem o uso do kimono.",
      img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop",
      badge: "ELITE"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-100 font-display relative">
      <div className="site-bg-overlay" />
      {/* Dynamic Glass Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="size-10 bg-primary/20 rounded-xl border border-primary/40 flex items-center justify-center text-primary shadow-lg shadow-primary/20 ring-4 ring-primary/5"
          >
            <Crown size={22} className="fill-current" />
          </motion.div>
          <div className="leading-none">
            <h1 className="font-temple text-[11px] font-black text-primary">Arte de Lutar</h1>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Estúdio de Elite</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/notifications')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 relative group"
          >
            <Bell size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
            <span className="absolute top-2 right-2 size-1.5 bg-primary rounded-full ring-2 ring-slate-950" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/instructor')}
            className="size-10 rounded-xl border border-white/10 p-0.5 overflow-hidden bg-background-dark group"
          >
             <img src="https://ui-avatars.com/api/?name=S+S&background=FF6B00&color=fff" className="w-full h-full object-cover rounded-[0.5rem] opacity-80 group-hover:opacity-100 transition-opacity" alt="Mestre" />
          </motion.button>
        </div>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 space-y-12"
      >
        {/* Banner Superior com Imagem do Usuário */}
        <section className="relative w-full h-[45vh] overflow-hidden">
           <motion.div 
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.5 }}
             className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: 'url("/background_site.png")' }}
           />
           {/* Gradiente para suavizar a transição com o fundo */}
           <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent z-10" />
           
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
              <motion.h2 
                variants={itemVariants}
                className="font-temple text-4xl font-black leading-tight mb-4 text-white drop-shadow-[0_5px_20px_rgba(0,0,0,0.8)] [text-shadow:0_0_30px_rgba(255,107,0,0.4)]"
              >
                ARTE DE LUTAR
              </motion.h2>
              <motion.p 
                variants={itemVariants} 
                className="text-primary font-black uppercase tracking-[0.3em] text-[10px] bg-background-dark/80 px-4 py-1.5 rounded-full backdrop-blur-sm border border-primary/20"
              >
                Excelência em Combate
              </motion.p>
           </div>
        </section>

        <div className="px-6 space-y-12">
          {/* Welcome Text Section (Adjusted) */}
          <section className="text-center">
            <motion.p variants={itemVariants} className="text-slate-400 text-sm font-medium tracking-wide max-w-xs mx-auto">
              Sua jornada para a maestria física e mental continua agora. Domine cada movimento.
            </motion.p>
          </section>

          {/* Cinematic Video Teaser */}
          <section className="relative group">
             <motion.div 
               variants={itemVariants}
               whileHover={{ y: -5 }}
               className="relative rounded-[2.5rem] overflow-hidden bg-card-dark border border-border-dark shadow-2xl shadow-primary/5 aspect-video cursor-pointer"
             >
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop" 
                  alt="Teaser" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                   <div className="size-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 active:scale-95 transition-all">
                      <Play size={28} fill="white" className="ml-1" />
                   </div>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-3">
                   <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[9px] font-black uppercase tracking-widest animate-pulse">
                          Ao Vivo Agora
                      </div>
                   </div>
                   <h3 className="text-xl font-black text-white leading-tight">Aula de Defesa Pessoal: Contra-Ataques</h3>
                </div>
             </motion.div>
          </section>

          {/* Primary CTA Grid */}
          <section className="space-y-4">
             <motion.button 
               variants={itemVariants}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => navigate('/schedule')}
               className="w-full h-20 bg-primary rounded-[1.8rem] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/30 relative overflow-hidden group"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Calendar size={20} className="stroke-[3]" />
                Agendar Treino
             </motion.button>
             
             <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  variants={itemVariants}
                  whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/plans')}
                  className="py-10 bg-card-dark border border-border-dark rounded-[2.2rem] flex flex-col items-center gap-4 transition-all"
                >
                    <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                       <Dumbbell size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Planos Elite</span>
                </motion.button>
                <motion.button 
                  variants={itemVariants}
                  whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/instructor')}
                  className="py-10 bg-card-dark border border-border-dark rounded-[2.2rem] flex flex-col items-center gap-4 transition-all"
                >
                    <div className="size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                       <Star size={28} fill="currentColor" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Mestrado</span>
                </motion.button>
             </div>
          </section>

          {/* Fast Access List (Modern List) */}
          <section className="space-y-6">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2 mb-4">Acesso Rápido</h3>
             <div className="space-y-3">
                {[
                  { icon: ImageIcon, label: 'Galeria Imersiva', path: '/gallery', color: 'bg-primary/10 text-primary' },
                  { icon: GraduationCap, label: 'Portal do Guerreiro', path: '/dashboard', color: 'bg-primary/10 text-primary' },
                  { icon: Activity, label: 'Sessão de Sparring', path: '/videos', color: 'bg-primary/10 text-primary' }
                ].map((link, i) => (
                  <motion.button 
                    key={i}
                    variants={itemVariants}
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                    onClick={() => navigate(link.path)}
                    className="w-full p-6 rounded-3xl bg-card-dark border border-border-dark flex items-center justify-between group transition-all"
                  >
                     <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl ${link.color} shadow-sm`}>
                           <link.icon size={22} />
                        </div>
                        <span className="text-sm font-black text-white tracking-widest uppercase">{link.label}</span>
                     </div>
                     <ChevronRight size={20} className="text-slate-700 group-hover:text-primary transition-colors" />
                  </motion.button>
                ))}
             </div>
          </section>

          {/* Visual News Slider */}
          <section className="space-y-6 -mx-6 px-6">
             <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Novidades Elite</h3>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest">Ver Todas</button>
             </div>
             
             <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x pb-4">
                {newsItems.map((news, i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    whileHover={{ scale: 0.98 }}
                    className="min-w-[320px] bg-card-dark rounded-[2.5rem] border border-border-dark overflow-hidden snap-center group relative shadow-2xl"
                  >
                     <div className="h-48 overflow-hidden relative">
                        <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent" />
                        <div className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-primary/40 uppercase tracking-widest">
                           {news.badge}
                        </div>
                     </div>
                     <div className="p-8 space-y-2">
                        <h4 className="text-xl font-black text-white tracking-tight">{news.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{news.desc}"</p>
                        <button className="mt-4 flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                           Ler Mais <ChevronRight size={14} />
                        </button>
                     </div>
                  </motion.div>
                ))}
             </div>
          </section>
          
          {/* Footer CTA */}
          <section className="pt-8 text-center pb-12 border-t border-border-dark space-y-6">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deseja Expandir seu Legado?</p>
             <div className="flex items-center justify-center gap-12">
                <button onClick={() => navigate('/register')} className="text-primary font-black text-xl uppercase tracking-tighter hover:scale-110 transition-transform">Inscrição</button>
                <div className="h-8 w-[1px] bg-white/10" />
                <button onClick={() => navigate('/login')} className="text-white font-black text-xl uppercase tracking-tighter hover:scale-110 transition-transform">Acesso</button>
             </div>
          </section>
        </div>
      </motion.main>
      <BottomNav />
    </div>
  );
};

export default PremiumHome;
