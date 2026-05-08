import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Key } from '../icons';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const PremiumDirectAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const becomeAdmin = async () => {
    if (!user) {
      setMessage('Você precisa estar logado primeiro.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setMessage('Sucesso! Sua conta agora é Admin.');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err: any) {
      setMessage('Erro ao atualizar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-slate-100 relative overflow-hidden">
      <div className="site-bg-overlay" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-[2.5rem] border border-border-dark max-w-sm w-full text-center relative z-10"
      >
        <div className="size-20 bg-primary/20 rounded-3xl border border-primary/30 flex items-center justify-center text-primary mx-auto mb-6 shadow-2xl shadow-primary/20">
          <ShieldCheck size={40} />
        </div>

        <h1 className="text-2xl font-black mb-2 tracking-tight uppercase">Portal Mestre</h1>
        <p className="text-slate-400 text-sm mb-8">
          Acesso direto ao painel de controle da academia.
        </p>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left mb-6">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Logado como:</p>
              <p className="text-sm font-bold truncate">{user.email}</p>
              <p className="text-[10px] text-primary font-bold uppercase mt-1">Status: {profile?.role || 'Buscando...'}</p>
            </div>

            <button
              onClick={() => navigate('/admin')}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group"
            >
              Ir para Painel Admin <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={becomeAdmin}
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Me tornar Admin Agora'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            Fazer Login <Key size={18} />
          </button>
        )}

        {message && (
          <p className="mt-4 text-xs font-bold text-primary animate-pulse">{message}</p>
        )}
      </motion.div>

      <button 
        onClick={() => navigate('/')}
        className="mt-8 text-slate-500 hover:text-white text-xs font-black uppercase tracking-[0.3em] transition-colors"
      >
        Voltar para Home
      </button>
    </div>
  );
};

export default PremiumDirectAdmin;
