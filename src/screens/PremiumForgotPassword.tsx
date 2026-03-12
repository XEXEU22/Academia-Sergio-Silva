import React, { useState } from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Lock, 
  Mail, 
  LogIn, 
  ShieldCheck, 
  ArrowRight,
  Shield,
  Zap
} from '../icons';

const PremiumForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

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
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Recuperação de Acesso</h2>
        <div className="size-10" />
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full max-w-sm mx-auto px-6 pt-16 flex flex-col z-10"
      >
        <div className="mb-12">
           <motion.div variants={itemVariants} className="size-20 bg-primary/10 rounded-[2rem] border border-primary/20 flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/10">
              <Shield size={40} className="fill-current" />
           </motion.div>
           <motion.h1 variants={itemVariants} className="text-4xl font-black mb-3 tracking-tighter leading-none bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              {emailSent ? "Verifique seu E-mail" : "Resgate sua Identidade"}
           </motion.h1>
           <motion.p variants={itemVariants} className="text-slate-500 font-medium text-sm leading-relaxed tracking-wide">
              {emailSent 
                ? "Enviamos as instruções para o seu e-mail cadastrado. Siga o link para resetar sua senha."
                : "Insira seu endereço de e-mail abaixo. Enviaremos um link seguro para restaurar seu acesso ao portal."}
           </motion.p>
        </div>

        {!emailSent ? (
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">E-mail Cadastrado</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark/50 pl-16 pr-6 focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-slate-700 backdrop-blur-sm shadow-xl"
                  placeholder="seu-email@dominio.com"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEmailSent(true)}
              className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-primary/30 relative overflow-hidden group border border-primary/20"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               Solicitar Resgate
            </motion.button>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-8">
             <div className="p-8 rounded-[2.5rem] bg-card-dark border border-emerald-500/20 text-center">
                <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-4 animate-bounce">
                   <Zap size={28} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-500">Link Enviado</p>
             </div>
             <motion.button 
               whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
               whileTap={{ scale: 0.98 }}
               onClick={() => navigate('/login')}
               className="w-full h-16 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl transition-all"
             >
                Voltar para Login
             </motion.button>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mt-16 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-3 text-slate-500 hover:text-primary font-black uppercase tracking-widest text-[10px] transition-all group mx-auto"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Lembrei minha senha
          </button>
        </motion.div>
      </motion.main>
      
      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 w-full h-[30vh] pointer-events-none z-0 opacity-20">
         <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-primary/20 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default PremiumForgotPassword;
