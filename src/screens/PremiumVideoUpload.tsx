import React, { useState } from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Play, 
  Youtube, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Trash2,
  Plus,
  Video
} from '../icons';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const PremiumVideoUpload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    video_url: '',
    category: 'Jiu-Jitsu',
    is_premium: false,
    duration: '10:00'
  });

  const categories = ['Jiu-Jitsu', 'Muay Thai', 'Wing Chun', 'Kickboxing', 'Defesa'];

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnailUrl = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!user) {
      setError('Você precisa estar logado para cadastrar vídeos.');
      setLoading(false);
      return;
    }

    const videoId = extractYoutubeId(formData.video_url);
    if (!videoId) {
      setError('URL do YouTube inválida. Use o link completo do vídeo.');
      setLoading(false);
      return;
    }

    const thumbnail_url = getThumbnailUrl(videoId);

    try {
      const { error: supabaseError } = await supabase.from('videos').insert({
        title: formData.title,
        video_url: formData.video_url, // Armazenamos a URL original ou apenas o ID
        thumbnail_url,
        category: formData.category,
        is_premium: formData.is_premium,
        duration: formData.duration,
        instructor_id: user.id,
        views_count: 0
      });

      if (supabaseError) throw supabaseError;

      setSuccess(true);
      setFormData({
        title: '',
        video_url: '',
        category: 'Jiu-Jitsu',
        is_premium: false,
        duration: '10:00'
      });
      
      // Navigate back after animation
      setTimeout(() => navigate('/videos'), 2000);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o vídeo.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center gap-6 border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-400 hover:text-white">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-black tracking-[0.3em] uppercase">Gestão de Treinos</h2>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 px-6 pt-10 max-w-xl mx-auto w-full space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="size-16 rounded-[1.5rem] bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary mx-auto shadow-2xl shadow-primary/20">
            <Video size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Novo Vídeo</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Adicione um novo treino à galeria via YouTube</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 bg-card-dark/50 border border-border-dark p-8 rounded-[2.5rem] backdrop-blur-sm">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Título do Treino</label>
              <input 
                required
                type="text"
                placeholder="Ex: Fundamentos de Guarda Fechada"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 text-sm font-medium focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>

            {/* YouTube URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Link do YouTube</label>
              <div className="relative">
                <input 
                  required
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 pl-12 text-sm font-medium focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                />
                <Youtube size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Categoria</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 text-sm font-black uppercase tracking-widest focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Duração</label>
                <input 
                  required
                  type="text"
                  placeholder="Ex: 12:45"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 text-sm font-medium focus:border-primary/50 outline-none transition-all text-center"
                />
              </div>
            </div>

            {/* Premium Toggle */}
            <div 
              onClick={() => setFormData({...formData, is_premium: !formData.is_premium})}
              className={`p-6 rounded-3xl border cursor-pointer transition-all flex items-center justify-between group ${
                formData.is_premium 
                  ? 'bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/5' 
                  : 'bg-background-dark/40 border-border-dark text-slate-500 grayscale hover:grayscale-0'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${formData.is_premium ? 'bg-primary text-white' : 'bg-slate-800 text-slate-600'}`}>
                  <Play size={20} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Conteúdo Premium</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Destaque na galeria principal</p>
                </div>
              </div>
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                formData.is_premium ? 'border-primary bg-primary' : 'border-slate-700'
              }`}>
                {formData.is_premium && <CheckCircle2 size={14} className="text-white" />}
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-3"
            >
              <CheckCircle2 size={20} />
              <p className="text-xs font-bold uppercase tracking-wide">Vídeo cadastrado com sucesso! Redirecionando...</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            disabled={loading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-xl transition-all ${
              loading || success 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-primary text-white shadow-primary/30 hover:shadow-primary/50'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} />
                Salvar Treino
              </>
            )}
          </motion.button>
        </form>
      </motion.main>
    </div>
  );
};

export default PremiumVideoUpload;
