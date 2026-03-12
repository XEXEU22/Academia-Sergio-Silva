import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Info, 
  Bell, 
  MessageSquare,
  Sparkles,
  Zap,
  Target,
  Trophy,
  CheckCircle2
} from '../icons';
import BottomNav from '../components/BottomNav';

const PremiumNotifications: React.FC = () => {
  const navigate = useNavigate();

  const notifications = [
    { type: 'Treino', title: 'Domínio do Tatame', time: 'Agira', desc: 'Uma nova aula de técnica avançada foi adicionada ao seu cronograma de combate.', icon: Zap, priority: true },
    { type: 'Finanças', title: 'Mensalidade Elite', time: '2h atrás', desc: 'Sua assinatura Guerreiro será renovada em 48 horas. Mantenha seu legado ativo.', icon: Trophy, priority: false },
    { type: 'Evento', title: 'Seminário de Mestres', time: '5h atrás', desc: 'Inscrições abertas para o Workshop com o Grande Mestre Silva.', icon: Target, priority: true },
    { type: 'Sistema', title: 'Segurança Fortalecida', time: '1d atrás', desc: 'Sua senha foi atualizada com sucesso no centro de comando.', icon: CheckCircle2, priority: false },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Centro de Mensagens</h2>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:scale-110 transition-transform"
          >
             <Bell size={20} />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           {['Tudo', 'Treinos', 'Financeiro', 'Alertas'].map((tab, i) => (
             <button key={tab} className={`h-10 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${i === 0 ? 'bg-white text-slate-950 border-white' : 'bg-slate-900 border-white/5 text-slate-500 hover:text-white'}`}>
                {tab}
             </button>
           ))}
        </div>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-6 pt-10 pb-32 space-y-4"
      >
        <div className="flex justify-between items-center px-2 mb-8">
           <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-primary animate-pulse" />
              <h3 className="text-sm font-black uppercase tracking-widest">Recentes</h3>
           </div>
           <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">Limpar Tudo</button>
        </div>

        {notifications.map((notif, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.02)' }}
            className={`group relative flex gap-5 p-6 rounded-[2rem] border transition-all ${notif.priority ? 'bg-slate-900 border-primary/20 shadow-xl shadow-primary/5' : 'bg-slate-900/40 border-white/5 outline-none'}`}
          >
            {notif.priority && <div className="absolute top-4 right-4 size-2 bg-primary rounded-full animate-ping" />}
            
            <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${notif.priority ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-slate-500'}`}>
               <notif.icon size={26} />
            </div>
            
            <div className="flex-1 space-y-1">
               <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{notif.type}</span>
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{notif.time}</span>
               </div>
               <h4 className="text-base font-black text-white tracking-tight leading-tight">{notif.title}</h4>
               <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{notif.desc}"</p>
            </div>
          </motion.div>
        ))}

        {/* Empty State Suggestion Footer */}
        <motion.div 
          variants={itemVariants}
          className="pt-12 text-center"
        >
           <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Fim das Transmissões</p>
           <div className="size-1 w-1 bg-slate-800 rounded-full mx-auto" />
        </motion.div>
      </motion.main>
      
      <BottomNav />
    </div>
  );
};

export default PremiumNotifications;
