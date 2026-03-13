import React, { useState } from 'react';
import { supabase } from '../supabase';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Target
} from '../icons';

const PremiumLogin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display selection:bg-primary selection:text-white">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-10%] size-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-primary/10 rounded-full blur-[120px] animate-pulse duration-[5s]" />
      </div>

      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Membro de Elite</h2>
        <div className="size-10" /> {/* Spacer */}
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full max-w-sm mx-auto px-6 pt-16 flex flex-col relative z-10"
      >
        <div className="mb-12">
          <motion.div variants={itemVariants} className="size-16 bg-primary/20 rounded-2xl border border-primary/30 flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/20">
             <Shield size={32} className="fill-current" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl font-black tracking-tighter leading-none mb-3 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
             Autenticação <br /> de Guerreiro
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-500 font-medium text-sm tracking-wide">
             Bem-vindo de volta ao centro de treinamento.
          </motion.p>
        </div>

        <motion.form 
          variants={itemVariants}
          className="space-y-6" 
          onSubmit={handleLogin}
        >
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Seu E-mail</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark/50 pl-16 pr-6 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-bold placeholder:text-slate-700 backdrop-blur-sm"
                placeholder="exemplo@combate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Senha Secreta</label>
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline transition-all"
              >
                Esqueceu?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark/50 pl-16 pr-16 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-bold placeholder:text-slate-700 backdrop-blur-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                <AnimatePresence mode='wait'>
                  <motion.div key={showPassword ? 'eye-off' : 'eye'} 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-primary/30 mt-8 relative overflow-hidden group border border-primary/20 flex items-center justify-center"
            disabled={loading}
          >
             {loading ? (
               <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
             ) : (
               <>
                 <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="flex items-center justify-center gap-3">
                     Entrar <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </div>
               </>
             )}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className="mt-16 text-center space-y-4">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">
            "A vitória pertence àqueles que persistem."
          </p>
          <div className="h-4 w-[1px] bg-white/5 mx-auto" />
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Novo na academia? 
            <button onClick={() => navigate('/register')} className="text-primary font-black hover:underline ml-2">Criar Perfil</button>
          </p>
        </motion.div>
      </motion.main>
      
      {/* Visual Props Bottom */}
      <footer className="w-full max-w-sm mx-auto px-6 py-12 flex justify-between items-center opacity-30">
          <div className="flex items-center gap-2"><TrendingUp size={14} /><span className="text-[8px] font-black uppercase tracking-[0.3em]">Legado</span></div>
          <div className="flex items-center gap-2"><Target size={14} /><span className="text-[8px] font-black uppercase tracking-[0.3em]">Honra</span></div>
          <div className="flex items-center gap-2"><Zap size={14} /><span className="text-[8px] font-black uppercase tracking-[0.3em]">Poder</span></div>
      </footer>
    </div>
  );
};

export default PremiumLogin;
