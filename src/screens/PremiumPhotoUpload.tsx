import React, { useState } from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Image as ImageIcon, 
  Save, 
  AlertCircle, 
  CheckCircle2
} from '../icons';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const PremiumPhotoUpload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    category: 'Recentes',
  });

  const categories = ['Recentes', 'Instalações', 'Treinos', 'Momentos', 'Mental', 'Alunos', 'Mestres'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!user) {
      setError('Você precisa estar logado para cadastrar fotos.');
      setLoading(false);
      return;
    }

    if (!formData.image_url) {
      setError('A URL da imagem é obrigatória.');
      setLoading(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase.from('photos').insert({
        title: formData.title || 'Foto sem título',
        image_url: formData.image_url,
        category: formData.category,
      });

      if (supabaseError) throw supabaseError;

      setSuccess(true);
      setFormData({
        title: '',
        image_url: '',
        category: 'Recentes',
      });
      
      // Navigate back after animation
      setTimeout(() => navigate('/gallery'), 2000);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar a foto.');
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
        <h2 className="text-sm font-black tracking-[0.3em] uppercase">Gestão da Galeria</h2>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 px-6 pt-10 max-w-xl mx-auto w-full space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="size-16 rounded-[1.5rem] bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary mx-auto shadow-2xl shadow-primary/20">
            <ImageIcon size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Nova Foto</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Adicione uma nova foto à galeria imersiva</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 bg-card-dark/50 border border-border-dark p-8 rounded-[2.5rem] backdrop-blur-sm">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Título da Foto</label>
              <input 
                type="text"
                placeholder="Ex: Graduação 2026"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 text-sm font-medium focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Link da Imagem (URL pública)</label>
              <div className="relative">
                <input 
                  required
                  type="url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 pl-12 text-sm font-medium focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                />
                <ImageIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

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
              <p className="text-xs font-bold uppercase tracking-wide">Foto adicionada com sucesso! Redirecionando...</p>
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
                Publicar Foto
              </>
            )}
          </motion.button>
        </form>
      </motion.main>
    </div>
  );
};

export default PremiumPhotoUpload;
