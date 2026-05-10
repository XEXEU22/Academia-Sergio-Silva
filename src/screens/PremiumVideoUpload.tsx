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
  Video,
  Star,
  Image as ImageIcon,
  Upload
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
    thumbnail_url: '', // New field for custom thumbnail
    category: 'Jiu-Jitsu',
    is_premium: false,
    is_home_featured: false,
    duration: '10:00'
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [autoThumbnail, setAutoThumbnail] = useState<string | null>(null); // To store the base64 or blob URL of the captured frame
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentHomeVideo, setCurrentHomeVideo] = useState<{title: string} | null>(null);

  React.useEffect(() => {
    const fetchHomeVideo = async () => {
      const { data } = await supabase.from('site_assets').select('description').eq('asset_key', 'home_video').single();
      if (data) setCurrentHomeVideo({ title: data.description });
    };
    fetchHomeVideo();
  }, []);

  const categories = ['Jiu-Jitsu', 'Muay Thai', 'Wing Chun', 'Kickboxing', 'Defesa'];

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnailUrl = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  const generateThumbnail = (file: File) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const url = URL.createObjectURL(file);

    video.src = url;
    video.currentTime = 2; // Capture frame at 2 seconds
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      setAutoThumbnail(dataUrl);
      URL.revokeObjectURL(url);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    if (file) {
      generateThumbnail(file);
    } else {
      setAutoThumbnail(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    let finalVideoUrl = formData.video_url;

    // Handle Direct File Upload
    if (videoFile) {
      try {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `videos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, videoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        finalVideoUrl = publicUrl;
      } catch (err: any) {
        setError('Erro ao subir arquivo: ' + err.message + '. Certifique-se de que o bucket "media" existe no Supabase.');
        setLoading(false);
        return;
      }
    } else {
      const videoId = extractYoutubeId(formData.video_url);
      if (!videoId) {
        setError('URL do YouTube inválida ou nenhum arquivo selecionado.');
        setLoading(false);
        return;
      }
    }

    const videoId = extractYoutubeId(finalVideoUrl);
    let thumbnail_url = formData.thumbnail_url;

    // If no custom thumbnail, but we have an auto-generated one from file
    if (!thumbnail_url && autoThumbnail && videoFile) {
      try {
        // Convert dataURL to Blob
        const response = await fetch(autoThumbnail);
        const blob = await response.blob();
        const thumbName = `thumbs/${Math.random()}.jpg`;
        
        const { error: thumbError } = await supabase.storage
          .from('media')
          .upload(thumbName, blob);
        
        if (!thumbError) {
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(thumbName);
          thumbnail_url = publicUrl;
        }
      } catch (e) {
        console.error('Erro ao subir thumbnail automática:', e);
      }
    }

    if (!thumbnail_url) {
      thumbnail_url = videoId ? getThumbnailUrl(videoId) : 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop';
    }

    try {
      const { error: supabaseError } = await supabase.from('videos').insert({
        title: formData.title,
        video_url: finalVideoUrl,
        thumbnail_url,
        category: formData.category,
        is_premium: formData.is_premium,
        duration: formData.duration,
        instructor_id: user.id,
        views_count: 0
      });

      if (supabaseError) throw supabaseError;

      // If featured on home, update site_assets
      if (formData.is_home_featured) {
        await supabase.from('site_assets').upsert({
          asset_key: 'home_video',
          url: finalVideoUrl,
          description: formData.title,
          updated_at: new Date().toISOString()
        }, { onConflict: 'asset_key' });

        // Store thumbnail as a separate asset key for easy access
        await supabase.from('site_assets').upsert({
          asset_key: 'home_video_thumbnail',
          url: thumbnail_url,
          description: 'Capa do vídeo da home',
          updated_at: new Date().toISOString()
        }, { onConflict: 'asset_key' });
      }

      setSuccess(true);
      setFormData({
        title: '',
        video_url: '',
        thumbnail_url: '',
        category: 'Jiu-Jitsu',
        is_premium: false,
        is_home_featured: false,
        duration: '10:00'
      });
      setVideoFile(null);
      setAutoThumbnail(null);
      
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

            {/* Video Source Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Origem do Vídeo</label>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    !videoFile ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  <Youtube size={16} /> YouTube
                </button>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className={`w-full p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      videoFile ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    <Upload size={16} /> Galeria
                  </button>
                </div>
              </div>

              {videoFile ? (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video size={18} className="text-primary" />
                      <span className="text-xs font-bold text-white truncate max-w-[150px]">{videoFile.name}</span>
                    </div>
                    <button onClick={() => { setVideoFile(null); setAutoThumbnail(null); }} className="text-[10px] font-black text-rose-500 uppercase">Remover</button>
                  </div>
                  
                  {/* Thumbnail Preview */}
                  {autoThumbnail && !formData.thumbnail_url && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Capa capturada automaticamente:</p>
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                        <img src={autoThumbnail} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <CheckCircle2 size={24} className="text-emerald-500" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <input 
                    type="url"
                    placeholder="Cole o link do YouTube aqui..."
                    value={formData.video_url}
                    onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                    className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 pl-12 text-sm font-medium focus:border-primary/50 outline-none transition-all"
                  />
                  <Youtube size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              )}
            </div>

            {/* Custom Thumbnail URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Capa Personalizada (Opcional - URL)</label>
              <div className="relative">
                <input 
                  type="url"
                  placeholder="https://exemplo.com/capa.jpg"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                  className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 pl-12 text-sm font-medium focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                />
                <ImageIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              <p className="text-[9px] text-slate-600 font-bold ml-2">Se deixar vazio, usaremos a capa automática do YouTube.</p>
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

            {/* Home Featured Toggle */}
            <div 
              onClick={() => setFormData({...formData, is_home_featured: !formData.is_home_featured})}
              className={`p-6 rounded-3xl border cursor-pointer transition-all flex items-center justify-between group ${
                formData.is_home_featured 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-lg shadow-amber-500/50' 
                  : 'bg-background-dark/40 border-border-dark text-slate-500 grayscale hover:grayscale-0'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${formData.is_home_featured ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                  <Star size={20} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Substituir Vídeo da Home</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    {currentHomeVideo ? `Substituirá: "${currentHomeVideo.title}"` : 'Definir como vídeo principal da Home'}
                  </p>
                </div>
              </div>
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                formData.is_home_featured ? 'border-amber-500 bg-amber-500' : 'border-slate-700'
              }`}>
                {formData.is_home_featured && <CheckCircle2 size={14} className="text-white" />}
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
