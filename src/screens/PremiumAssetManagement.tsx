import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Image as ImageIcon, 
  Link as LinkIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';

interface SiteAsset {
  id: string;
  asset_key: string;
  url: string;
  description: string;
}

const PremiumAssetManagement: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<SiteAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_assets')
      .select('*')
      .order('asset_key');
    
    if (data) setAssets(data);
    setLoading(false);
  };

  const handleUpdate = async (id: string, newUrl: string) => {
    setSaving(id);
    const { error } = await supabase
      .from('site_assets')
      .update({ url: newUrl, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Imagem atualizada com sucesso!' });
      fetchAssets();
    }
    setSaving(null);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Administração</h2>
          <h1 className="text-sm font-black uppercase text-white">Gestão de Imagens</h1>
        </div>
        <button onClick={fetchAssets} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-6 pt-10 space-y-8">
        <section className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter">Assets do Site</h2>
          <p className="text-slate-500 text-sm font-medium">Troque as imagens principais do aplicativo colando novos links URLs abaixo.</p>
        </section>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-2xl flex items-center gap-3 border shadow-lg ${
                message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span className="text-xs font-bold uppercase tracking-wide">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
               <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">Buscando Imagens...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-border-dark rounded-3xl">
              <p className="text-slate-500 text-xs font-medium">Nenhum asset configurado no banco de dados.</p>
            </div>
          ) : (
            assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onSave={handleUpdate} isSaving={saving === asset.id} />
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

const AssetCard: React.FC<{ asset: SiteAsset, onSave: (id: string, url: string) => void, isSaving: boolean }> = ({ asset, onSave, isSaving }) => {
  const [url, setUrl] = useState(asset.url);
  const isChanged = url !== asset.url;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-card-dark border border-border-dark space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <ImageIcon size={18} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white">{asset.asset_key.replace('_', ' ')}</h4>
            <p className="text-[10px] text-slate-500 font-bold">{asset.description}</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-background-dark border border-border-dark group">
        <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent flex flex-col justify-end p-4">
           <span className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-1">Preview Atual</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <LinkIcon size={16} />
          </div>
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole o link da nova imagem..."
            className="w-full bg-background-dark border border-border-dark rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-white placeholder:text-slate-600 focus:border-primary/50 transition-colors outline-none"
          />
        </div>
        
        <button 
          disabled={!isChanged || isSaving}
          onClick={() => onSave(asset.id, url)}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            isChanged 
              ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95' 
              : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
          }`}
        >
          {isSaving ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <>
              <Save size={16} />
              Salvar Alteração
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default PremiumAssetManagement;
