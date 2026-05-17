import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Image as ImageIcon, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Trash2,
  Filter,
  RefreshCw,
  Upload,
  Link as LinkIcon,
  X
} from '../icons';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from '../components/BottomNav';

interface Photo {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

const PremiumPhotoUpload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

  const [existingPhotos, setExistingPhotos] = useState<Photo[]>([]);

  const fetchPhotos = async () => {
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
    if (data) setExistingPhotos(data as Photo[]);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

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

    let finalImageUrl = formData.image_url;

    try {
      // 1. Handle File Upload if in file mode
      if (uploadMode === 'file' && photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, photoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      if (!finalImageUrl) {
        throw new Error('Nenhuma imagem selecionada ou URL vazia.');
      }

      // 2. Insert into database
      const { error: supabaseError } = await supabase.from('photos').insert({
        title: formData.title || 'Foto sem título',
        image_url: finalImageUrl,
        category: 'Geral'
      });

      if (supabaseError) throw supabaseError;

      setSuccess(true);
      setFormData({
        title: '',
        image_url: '',
      });
      setPhotoFile(null);
      setPhotoPreview(null);
      
      fetchPhotos();
      setTimeout(() => setSuccess(false), 3000);
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
        <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary">Gestão da Galeria</h2>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 px-6 pt-10 max-w-2xl mx-auto w-full space-y-12"
      >
        <div className="text-center space-y-2">
          <div className="size-16 rounded-[1.5rem] bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary mx-auto shadow-2xl shadow-primary/20">
            <ImageIcon size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Adicionar Mídia</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Alimente a galeria com novos momentos</p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 bg-card-dark/50 border border-border-dark p-8 rounded-[2.5rem] backdrop-blur-sm">
            
            {/* Upload Mode Selector */}
            <div className="grid grid-cols-2 gap-4 p-1.5 bg-background-dark/50 rounded-2xl border border-border-dark">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  uploadMode === 'file' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'
                }`}
              >
                <Upload size={14} /> Galeria Celular
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  uploadMode === 'url' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'
                }`}
              >
                <LinkIcon size={14} /> Link / URL
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Título da Foto</label>
              <input 
                type="text"
                placeholder="Ex: Treino de Muay Thai Noite"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 text-sm font-medium focus:border-primary/50 outline-none transition-all"
              />
            </div>

            {uploadMode === 'file' ? (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Escolher Imagem</label>
                <div className="relative aspect-video rounded-3xl border-2 border-dashed border-border-dark bg-background-dark/30 hover:border-primary/50 transition-all flex flex-col items-center justify-center overflow-hidden group">
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        type="button"
                        onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-3">
                         <Upload size={24} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clique para selecionar</p>
                      <p className="text-[8px] font-bold text-slate-600 mt-1">PNG, JPG ou WEBP</p>
                    </label>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Link da Imagem (URL)</label>
                <input 
                  required
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 text-sm font-medium focus:border-primary/50 outline-none transition-all"
                />
              </div>
            )}
          </div>

          {error && <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest flex gap-2"><AlertCircle size={14}/> {error}</div>}
          {success && <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex gap-2"><CheckCircle2 size={14}/> Foto adicionada!</div>}

          <button
            disabled={loading}
            className="w-full py-5 rounded-[1.8rem] bg-primary text-white font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <><Save size={20} /> Publicar na Galeria</>}
          </button>
        </form>

        {/* Management List */}
        <div className="space-y-6 pt-10 border-t border-border-dark">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                Gerenciar Galeria
              </h3>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {existingPhotos.length} Fotos
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {existingPhotos.map((photo) => (
              <motion.div 
                key={photo.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group relative aspect-square rounded-3xl overflow-hidden border border-border-dark bg-card-dark shadow-xl"
              >
                <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <p className="text-[9px] font-bold text-white truncate">{photo.title}</p>
                  </div>
                  <button 
                    onClick={async () => {
                      if (window.confirm('Excluir esta foto permanentemente?')) {
                        const { error } = await supabase.from('photos').delete().eq('id', photo.id);
                        if (!error) fetchPhotos();
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {existingPhotos.length === 0 && (
            <div className="py-20 text-center border border-dashed border-border-dark rounded-3xl">
               <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Nenhuma foto na galeria.</p>
            </div>
          )}
        </div>
      </motion.main>
      <BottomNav />
    </div>
  );
};

export default PremiumPhotoUpload;
