import React, { useState, useEffect } from 'react';
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
  Upload,
  RefreshCw,
  Filter
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
    thumbnail_url: '', 
    is_premium: false,
    is_home_featured: false,
    duration: '10:00'
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [autoThumbnail, setAutoThumbnail] = useState<string | null>(null); 
  const [existingVideos, setExistingVideos] = useState<any[]>([]);
  const [currentHomeVideo, setCurrentHomeVideo] = useState<{title: string} | null>(null);

  useEffect(() => {
    fetchHomeVideo();
    fetchVideos();
  }, []);

  const fetchHomeVideo = async () => {
    const { data } = await supabase.from('site_assets').select('description').eq('asset_key', 'home_video').single();
    if (data) setCurrentHomeVideo({ title: data.description });
  };

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (data) setExistingVideos(data);
  };



  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnailUrl = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    if (file) {
      // Small logic to generate thumb if needed
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    let finalVideoUrl = formData.video_url;

    if (videoFile) {
      // Direct file upload logic (skipped for brevity as it requires bucket setup)
      setError('Upload direto de arquivo desativado. Por favor, use links do YouTube para melhor performance.');
      setLoading(false);
      return;
    }

    const videoId = extractYoutubeId(formData.video_url);
    if (!videoId) {
      setError('URL do YouTube inválida.');
      setLoading(false);
      return;
    }

    let thumbnail_url = formData.thumbnail_url || getThumbnailUrl(videoId);

    try {
      const { error: supabaseError } = await supabase.from('videos').insert({
        title: formData.title,
        video_url: finalVideoUrl,
        thumbnail_url,
        category: 'Geral',
        is_premium: formData.is_premium,
        duration: formData.duration,
        instructor_id: user.id,
        views_count: 0
      });

      if (supabaseError) throw supabaseError;

      if (formData.is_home_featured) {
        await supabase.from('site_assets').upsert({
          asset_key: 'home_video',
          url: finalVideoUrl,
          description: formData.title,
          updated_at: new Date().toISOString()
        }, { onConflict: 'asset_key' });
      }

      setSuccess(true);
      setFormData({
        title: '',
        video_url: '',
        thumbnail_url: '',
        is_premium: false,
        is_home_featured: false,
        duration: '10:00'
      });
      fetchVideos();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar o vídeo.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center gap-6 border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-400 hover:text-white">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary">Gestão de Vídeos</h2>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto pb-32 px-6 pt-10 max-w-2xl mx-auto w-full space-y-12"
      >
        <div className="text-center space-y-2">
          <div className="size-16 rounded-[1.5rem] bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary mx-auto shadow-2xl shadow-primary/20">
            <Video size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Novo Treino</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Publique novos vídeos na academia digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 bg-card-dark/50 border border-border-dark p-8 rounded-[2.5rem] backdrop-blur-sm">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Título do Vídeo</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 text-sm font-medium focus:border-primary/50 outline-none transition-all" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Link do YouTube</label>
                <input required type="url" value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 text-sm font-medium focus:border-primary/50 outline-none transition-all" />
             </div>
                 <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Duração</label>
                    <input required type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-background-dark/80 border border-border-dark rounded-2xl p-4 text-sm font-medium text-center outline-none" />
                 </div>
             <div onClick={() => setFormData({...formData, is_home_featured: !formData.is_home_featured})} className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${formData.is_home_featured ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-background-dark/40 border-border-dark text-slate-500'}`}>
                <div className="flex items-center gap-3">
                   <Star size={16} />
                   <span className="text-[10px] font-black uppercase">Vídeo Destaque da Home</span>
                </div>
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${formData.is_home_featured ? 'border-amber-500 bg-amber-500' : 'border-slate-700'}`}>
                   {formData.is_home_featured && <CheckCircle2 size={12} className="text-white" />}
                </div>
             </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 size={20} />
              Vídeo salvo com sucesso!
            </div>
          )}

          <button disabled={loading} className="w-full py-5 rounded-[1.8rem] bg-primary text-white font-black uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3">
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <><Save size={20} /> Salvar Vídeo</>}
          </button>
        </form>

        {/* Management List */}
        <div className="space-y-6 pt-10 border-t border-border-dark">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Play size={18} className="text-primary" />
                Gerenciar Treinos
              </h3>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {existingVideos.length} Vídeos
              </span>
            </div>
            
          </div>

          <div className="space-y-4">
            {existingVideos.map((video) => (
              <motion.div 
                key={video.id}
                layout
                className="p-4 rounded-3xl bg-card-dark border border-border-dark flex items-center justify-between group hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                   <div className="size-16 rounded-2xl overflow-hidden bg-background-dark border border-white/5">
                      <img src={video.thumbnail_url} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[8px] font-black uppercase text-primary tracking-widest">{video.category}</span>
                         <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{video.duration}</span>
                      </div>
                      <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors truncate max-w-[200px]">{video.title}</h4>
                   </div>
                </div>
                <button 
                  onClick={async () => {
                    if (window.confirm('Remover este vídeo permanentemente?')) {
                      await supabase.from('videos').delete().eq('id', video.id);
                      fetchVideos();
                    }
                  }}
                  className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          {existingVideos.length === 0 && (
            <div className="py-20 text-center border border-dashed border-border-dark rounded-[2rem]">
               <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Nenhum vídeo listado.</p>
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default PremiumVideoUpload;
