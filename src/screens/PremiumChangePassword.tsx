import React, { useState } from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Info,
  Shield,
  Zap,
  CheckCircle2
} from '../icons';
import BottomNav from '../components/BottomNav';

const PremiumChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const toggle = (key: keyof typeof showPass) => {
    setShowPass(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark backdrop-blur-3xl">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-border-dark transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Comando de Segurança</h2>
        <div className="size-10" />
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full max-w-sm mx-auto px-6 pt-16 pb-32 flex flex-col z-10 space-y-12"
      >
        <div className="space-y-4">
           <motion.div variants={itemVariants} className="size-16 bg-primary/20 rounded-2xl border border-primary/30 flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/20">
              <ShieldCheck size={32} />
           </motion.div>
           <motion.h1 variants={itemVariants} className="text-4xl font-black mb-3 tracking-tighter leading-none bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              Fortalecer <br /><span className="text-primary italic">Credenciais</span>
           </motion.h1>
           <motion.p variants={itemVariants} className="text-slate-500 font-medium text-sm leading-relaxed tracking-wide">Mantenha seu perfil de elite impenetrável.</motion.p>
        </div>

        <motion.form 
          variants={itemVariants}
          className="space-y-6" 
          onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}
        >
          {/* Current Password */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Senha de Combate Atual</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600">
                <Lock size={18} />
              </div>
              <input 
                type={showPass.current ? "text" : "password"} 
                className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark/50 pl-16 pr-16 focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-slate-700 backdrop-blur-sm"
                placeholder="Sua senha de agora"
              />
              <button 
                type="button"
                onClick={() => toggle('current')}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Nova Codificação</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600">
                <Lock size={18} />
              </div>
              <input 
                type={showPass.new ? "text" : "password"} 
                className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark/50 pl-16 pr-16 focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-slate-700 backdrop-blur-sm"
                placeholder="Crie seu novo segredo"
              />
              <button 
                type="button"
                onClick={() => toggle('new')}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex gap-4 shadow-xl">
             <Info className="text-indigo-400 shrink-0" size={20} />
             <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                "Um guerreiro vigilante usa caracteres especiais e números para máxima resiliência."
             </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-primary/30 mt-8 group relative overflow-hidden border border-primary/20"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             Consagrar Nova Senha
          </motion.button>
        </motion.form>
      </motion.main>
      
      <BottomNav />
    </div>
  );
};

export default PremiumChangePassword;
