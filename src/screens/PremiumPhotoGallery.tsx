import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Image as ImageIcon, 
  Play, 
  Maximize2, 
  Share2,
  Heart,
  Grid,
  Filter
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';

const PremiumPhotoGallery: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Recentes');
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      let query = supabase.from('photos').select('*').order('created_at', { ascending: false });
      
      if (activeTab !== 'Recentes') {
        query = query.eq('category', activeTab);
      }

      const { data, error } = await query;
      if (!error && data) {
        setPhotos(data.map((p, idx) => ({
          id: p.id,
          src: p.image_url,
          title: p.title,
          category: p.category,
          idx
        })));
      }
      setLoading(false);
    }
    
    fetchPhotos();
  }, [activeTab]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 100 } 
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Header com Glassmorphism Translúcido */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-bold tracking-widest uppercase">Galeria Imersiva</h2>
        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <Search size={20} />
        </button>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 px-6 pt-10"
      >
        {/* Intro Section */}
        <section className="mb-12">
           <motion.h1 variants={itemVariants} className="text-4xl font-black mb-3 tracking-tighter">O Caminho em <br /><span className="text-primary italic">Imagens</span></motion.h1>
           <motion.p variants={itemVariants} className="text-slate-400 text-sm font-medium">Explore a essência da nossa escola através das lentes da arte do combate.</motion.p>
        </section>

        {/* Filter Bar with Horizontal Scroll */}
        <section className="mb-10 flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
           <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary">
              <Filter size={18} />
           </div>
           {['Recentes', 'Instalações', 'Treinos', 'Momentos', 'Mental', 'Alunos', 'Mestres'].map((f, i) => (
             <button 
               key={i} 
               onClick={() => setActiveTab(f)}
               className={`h-11 shrink-0 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === f ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-card-dark border-border-dark text-slate-500'}`}
             >
                {f}
             </button>
           ))}
        </section>

        {/* High Precision Masonry/Grid */}
        <section className="grid grid-cols-2 gap-4">
           {loading ? (
             <div className="col-span-2 py-20 flex flex-col items-center justify-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
               <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
               Carregando Lentes...
             </div>
           ) : photos.length === 0 ? (
             <div className="col-span-2 py-20 flex flex-col items-center justify-center text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-dashed border-border-dark rounded-3xl">
               Nenhuma foto encontrada
             </div>
           ) : photos.map((photo) => (
             <motion.div
               key={photo.id}
               variants={itemVariants}
               whileHover={{ y: -5, scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setSelectedPhoto(photo.src)}
               className={`group relative rounded-[2.5rem] overflow-hidden bg-card-dark border border-border-dark shadow-2xl cursor-zoom-in ${photo.idx % 3 === 0 ? 'col-span-1 h-80' : 'h-60'}`}
             >
                <img src={photo.src} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" alt={photo.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-card-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-6 flex flex-col justify-end">
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{photo.category}</p>
                   <h4 className="text-sm font-black text-white leading-tight uppercase tracking-widest">{photo.title}</h4>
                   <div className="mt-4 flex items-center gap-4 text-white/60">
                      <Heart size={16} className="hover:text-red-500 transition-colors" />
                      <Share2 size={16} className="hover:text-primary transition-colors" />
                   </div>
                </div>
                {/* Micro Icon for Maximize */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="size-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-border-dark">
                      <Maximize2 size={14} className="text-white" />
                   </div>
                </div>
             </motion.div>
           ))}
        </section>

        {/* Bottom CTA for Contributions */}
        <motion.section 
          variants={itemVariants}
          className="mt-16 p-8 rounded-[3rem] bg-card-dark border border-border-dark flex flex-col items-center text-center gap-6"
        >
           <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner shadow-primary/10">
              <ImageIcon size={28} />
           </div>
           <div>
              <h3 className="text-lg font-black tracking-widest uppercase mb-2">Contribua com a Galeria</h3>
              <p className="text-slate-500 text-xs font-medium">Capture momentos do Tatame e compartilhe com a comunidade.</p>
           </div>
           <button className="px-8 py-4 bg-white text-background-dark rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-transform">
              Enviar Mídia
           </button>
        </motion.section>
      </motion.main>

      {/* Modern Photo Modal (Simple Implementation with Framer Motion) */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-3xl flex items-center justify-center p-6"
            onClick={() => setSelectedPhoto(null)}
          >
             <motion.button 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="absolute top-8 right-8 z-20 p-4 rounded-full bg-white/5 border border-border-dark text-white"
               onClick={() => setSelectedPhoto(null)}
             >
                <Maximize2 size={24} className="rotate-45" />
             </motion.button>
             
             <motion.img 
               layoutId="modal-image"
               initial={{ scale: 0.95 }}
               animate={{ scale: 1 }}
               src={selectedPhoto} 
               className="max-w-full max-h-[80vh] rounded-[2rem] shadow-2xl border border-border-dark"
             />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default PremiumPhotoGallery;
