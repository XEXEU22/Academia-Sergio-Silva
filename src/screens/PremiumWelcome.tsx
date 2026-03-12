import React from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, Dumbbell, ChevronRight, Zap, Target, Star } from '../icons';

const PremiumWelcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden text-slate-100 font-display">
      {/* Background Hero Image with Overlay */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: 'url("/artifacts/media__1773248113670.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
        
        {/* Animated Particles/Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex p-8 relative -mt-32 flex-col items-center z-10"
      >
        {/* Logo/Icon Area */}
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="size-24 rounded-[2rem] border-2 border-primary/30 p-1 bg-card-dark overflow-hidden shadow-[0_20px_50px_rgba(255,107,0,0.3)] relative"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
           <div className="size-full bg-card-dark rounded-[1.8rem] flex items-center justify-center text-primary">
              <Zap size={40} className="fill-current" />
           </div>
        </motion.div>
        
        <div className="flex flex-col items-center justify-center mt-8 text-center">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-[1px] w-6 bg-primary/40"></span>
            <p className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">Estúdio de Elite</p>
            <span className="h-[1px] w-6 bg-primary/40"></span>
          </motion.div>
          
          <h1 className="text-5xl font-black leading-none tracking-tighter mb-4 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Arte da Defesa Pessoal
          </h1>
          
          <p className="text-slate-400 text-base font-medium leading-relaxed max-w-xs mx-auto mb-12">
            Onde a força encontra a disciplina. Transforme-se através da maestria das artes marciais.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full max-w-sm gap-4 mb-16">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/premium-register')}
            className="group relative h-16 flex items-center justify-center rounded-2xl bg-primary text-white text-xs font-black shadow-[0_20px_40px_rgba(255,107,0,0.3)] hover:shadow-primary/50 transition-all uppercase tracking-[0.3em] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            Começar Jornada
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/premium-login')}
            className="h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md"
          >
            Login de Membro
          </motion.button>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-md pt-8 border-t border-border-dark">
          {[
            { icon: Target, label: 'FOCO' },
            { icon: Shield, label: 'HONRA' },
            { icon: Star, label: 'DOMÍNIO' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="size-12 rounded-2xl bg-card-dark border border-border-dark flex items-center justify-center text-primary/60 hover:text-primary hover:border-primary/20 transition-all cursor-default shadow-xl">
                <item.icon size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumWelcome;
