import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  CreditCard, 
  ArrowRight, 
  Receipt,
  Trophy,
  Star,
  Zap,
  ShieldCheck,
  Crown
} from '../icons';

const PremiumPaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center p-6 font-display relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-slate-900 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5 relative z-10 overflow-hidden"
      >
        <div className="pt-16 pb-12 flex flex-col items-center text-center px-8 relative">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.3 }}
            className="size-28 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mb-8 border-2 border-primary/40 shadow-2xl shadow-primary/30 relative group"
          >
             <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] animate-ping" />
             <CheckCircle2 className="text-primary fill-current" size={60} />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl font-black mb-3 tracking-tighter leading-none bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
             Legado Consagrado
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-500 font-medium text-sm italic">
             "A jornada de mil milhas começa com um único passo."
          </motion.p>
        </div>

        {/* Transaction Receipt Card */}
        <motion.div 
          variants={itemVariants}
          className="mx-6 p-8 rounded-[2.5rem] bg-slate-950/50 border border-white/5 shadow-inner"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
               <Crown size={14} className="text-primary animate-bounce" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Status de Elite</span>
            </div>
            <span className="bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg shadow-emerald-500/20 tracking-widest">Ativo</span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Plano Guerreiro</h2>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Acesso Total Vitalício</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white tracking-tighter">R$ 180<span className="text-xs font-bold text-slate-500">/mês</span></p>
              </div>
            </div>

            <div className="h-px w-full bg-white/5" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Método</span>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-xl border border-white/5">
                  <CreditCard className="text-primary" size={14} />
                  <span className="text-[10px] font-bold text-slate-300 tracking-tighter">VISA •••• 9928</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Codificação</span>
                <span className="font-mono text-[10px] text-slate-500 opacity-60">#TRX-MAA-2024-X99</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="p-8 space-y-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary text-white font-black py-6 rounded-[1.8rem] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all relative overflow-hidden group border border-primary/20"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="text-[10px] uppercase tracking-[0.4em]">Entrar no Dojo</span>
             <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-transparent text-slate-500 font-black py-4 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 border border-white/5 group"
          >
            <Receipt size={18} className="group-hover:text-primary transition-colors" />
            <span className="text-[9px] uppercase tracking-widest">Recibo de Investimento</span>
          </motion.button>
        </div>

        <div className="h-1.5 w-full bg-gradient-to-r from-primary/5 via-primary to-primary/5" />
      </motion.div>
    </div>
  );
};

export default PremiumPaymentSuccess;
