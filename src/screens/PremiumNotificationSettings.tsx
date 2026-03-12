import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  Mail, 
  Smartphone, 
  Shield, 
  Trophy, 
  Calendar,
  Zap
} from '../icons';
import BottomNav from '../components/BottomNav';

const PremiumNotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const [toggleStates, setToggleStates] = useState({
    push: true,
    email: false,
    sms: true,
    training: true,
    payment: false,
    community: true
  });

  const toggle = (key: keyof typeof toggleStates) => {
    setToggleStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const menuItems = [
    { key: 'training', label: 'Lembretes de Treino', icon: Zap, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { key: 'payment', label: 'Alertas de Mensalidade', icon: Trophy, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { key: 'community', label: 'Novidades da Comunidade', icon: Shield, color: 'text-primary bg-primary/10 border-primary/20' },
    { key: 'push', label: 'Notificações Push', icon: Smartphone, color: 'text-slate-400 bg-slate-900 border-white/5' },
    { key: 'email', label: 'E-mail Marketing', icon: Mail, color: 'text-slate-400 bg-slate-900 border-white/5' }
  ];

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-3xl">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Configuração de Alertas</h2>
        <div className="size-10" />
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-6 pt-12 pb-32 space-y-12"
      >
        <div className="space-y-4">
           <motion.h1 variants={itemVariants} className="text-4xl font-black mb-3 tracking-tighter">Personalize sua <br /><span className="text-primary italic">Conectividade</span></motion.h1>
           <motion.p variants={itemVariants} className="text-slate-400 text-sm font-medium tracking-wide">Mantenha-se informado nos seus próprios termos.</motion.p>
        </div>

        {/* Section Title */}
        <section className="space-y-4">
           <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">Canais de Transmissão</h3>
           <div className="space-y-4">
              {menuItems.map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  className="p-6 rounded-[2.5rem] bg-slate-900 border border-white/5 flex items-center justify-between group transition-all shadow-xl"
                >
                   <div className="flex items-center gap-5">
                      <div className={`size-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 ${item.color}`}>
                         <item.icon size={26} />
                      </div>
                      <span className="text-[12px] font-black uppercase tracking-widest text-white">{item.label}</span>
                   </div>
                   
                   <button 
                     onClick={() => toggle(item.key as keyof typeof toggleStates)}
                     className={`w-14 h-8 rounded-full border-2 transition-all p-1 group flex items-center ${toggleStates[item.key as keyof typeof toggleStates] ? 'bg-primary border-primary shadow-lg shadow-primary/30' : 'bg-slate-800 border-white/10'}`}
                   >
                      <motion.div 
                        animate={{ x: toggleStates[item.key as keyof typeof toggleStates] ? 24 : 0 }}
                        className={`size-5 rounded-full shadow-inner ${toggleStates[item.key as keyof typeof toggleStates] ? 'bg-white' : 'bg-slate-500'}`}
                      />
                   </button>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Support Section Tile */}
        <motion.section 
          variants={itemVariants}
          className="p-8 rounded-[3rem] bg-slate-900 border border-white/5 text-center flex flex-col items-center gap-6"
        >
           <div className="size-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/5">
              <Shield size={28} />
           </div>
           <div>
              <h3 className="text-base font-black tracking-widest uppercase mb-2">Segurança em Primeiro Lugar</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed italic max-w-xs mx-auto">Alertas de segurança e login crítico nunca podem ser desativados para sua proteção.</p>
           </div>
        </motion.section>
      </motion.main>
      <BottomNav />
    </div>
  );
};

export default PremiumNotificationSettings;
