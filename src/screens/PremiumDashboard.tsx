import React from 'react';
import { motion, Variants } from 'motion/react';
import { 
  Bell, 
  Calendar, 
  TrendingUp, 
  PlayCircle, 
  Star, 
  Clock, 
  Trophy, 
  Award, 
  Users, 
  ChevronRight,
  Activity,
  Zap,
  Target
} from '../icons';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const PremiumDashboard: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display selection:bg-primary selection:text-white">
      {/* Premium Gradient Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="size-10 rounded-full border-2 border-primary p-0.5 overflow-hidden ring-4 ring-primary/10"
          >
            <img 
              src="/artifacts/warrior_avatar_1773243555349.png" 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Alex Viana</h2>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Guerreiro Ativo</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl bg-card-dark border border-border-dark transition-colors relative"
          >
            <Bell size={20} className="text-slate-300" />
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-background-dark" />
          </motion.button>
        </div>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 px-6 pt-8 space-y-10"
      >
        {/* Personalized Welcome */}
        <section>
          <motion.p 
            variants={itemVariants}
            className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2"
          >
            Sua Jornada de Hoje
          </motion.p>
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight leading-none mb-4 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent"
          >
            Osu, Alex!
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-400 max-w-xs text-sm leading-relaxed">
            Você está a apenas <span className="text-white font-semibold">12 treinos</span> de alcançar a sua próxima graduação.
          </motion.p>
        </section>

        {/* Dynamic Progress Card */}
        <motion.section variants={itemVariants} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-card-dark border border-border-dark rounded-3xl p-6 overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -right-12 -top-12 size-48 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Nível Atual</p>
                <div className="flex items-center gap-2">
                  <Award className="text-primary" size={18} />
                  <h3 className="text-xl font-bold">Faixa Marrom</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Aulas</p>
                <p className="text-xl font-bold text-primary">85%</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-3 w-full bg-background-dark rounded-full overflow-hidden p-0.5 border border-border-dark">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '85%' }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]" />
                </motion.div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>FAIXA MARROM</span>
                <span>FAIXA PRETA</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 gap-4">
          {[
            { icon: Calendar, label: 'Agendar', color: 'bg-primary/10 text-primary', desc: 'Próxima Aula', path: '/schedule' },
            { icon: TrendingUp, label: 'Evolução', color: 'bg-emerald-500/10 text-emerald-400', desc: 'Estatísticas' },
            { icon: PlayCircle, label: 'Técnicas', color: 'bg-primary/10 text-primary', desc: '148 Vídeos', path: '/videos' },
            { icon: Trophy, label: 'Conquistas', color: 'bg-amber-500/10 text-amber-400', desc: '8 Medalhas' }
          ].map((action, idx) => (
            <motion.button
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.03)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => action.path && navigate(action.path)}
              className="p-5 rounded-3xl bg-card-dark border border-border-dark text-left transition-all"
            >
              <div className={`size-10 rounded-2xl ${action.color} flex items-center justify-center mb-4`}>
                <action.icon size={22} />
              </div>
              <p className="font-bold text-white text-base">{action.label}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight mt-0.5">{action.desc}</p>
            </motion.button>
          ))}
        </section>

        {/* Upcoming Class Premium Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight">Sua Próxima Batalha</h3>
            <button 
               onClick={() => navigate('/schedule')}
               className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all"
            >
              Ver Agenda <ChevronRight size={14} />
            </button>
          </div>

          <motion.div 
            variants={itemVariants}
            className="group relative rounded-[2rem] overflow-hidden bg-card-dark border border-border-dark"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent z-10" />
            <img 
              src="/artifacts/jiujitsu_training_1773243516160.png" 
              alt="Training" 
              className="w-full h-56 object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-60"
            />
            
            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
                  Ao Vivo em 45min
                </span>
                <span className="flex items-center gap-1 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                  <Users size={12} /> +12 Confirmados
                </span>
              </div>
              
              <h4 className="text-2xl font-black text-white mb-2 tracking-tight">Defesa Pessoal Avançada</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full border border-white/20 overflow-hidden ring-2 ring-white/5">
                    <img 
                      src="/artifacts/instructor_avatar_1773243572454.png" 
                      alt="Sensei" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-white">Mestre Sérgio</p>
                    <p className="text-[10px] text-white/50">Grão Mestre 5º Dan</p>
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'var(--primary)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20"
                >
                  Presença
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Weekly Stats Section */}
        <section className="space-y-4">
           <h3 className="text-lg font-bold tracking-tight">Consistência da Semana</h3>
           <div className="grid grid-cols-7 gap-1.5 h-24 items-end">
             {[
               { day: 'S', val: 0.3 },
               { day: 'T', val: 0.8 },
               { day: 'Q', val: 0.5 },
               { day: 'Q', val: 0.9, highlight: true },
               { day: 'S', val: 0.4 },
               { day: 'S', val: 0.0 },
               { day: 'D', val: 0.0 }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center gap-2 group flex-1">
                 <div className="w-full relative">
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: `${stat.val * 80}px` }}
                     className={`w-full rounded-t-xl transition-colors duration-300 ${stat.highlight ? 'bg-primary shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-card-dark group-hover:bg-slate-700'}`}
                   />
                 </div>
                 <span className={`text-[10px] font-black ${stat.highlight ? 'text-primary' : 'text-slate-500'}`}>{stat.day}</span>
               </div>
             ))}
           </div>
        </section>

      </motion.main>
      
      <BottomNav />

      <style>{`
        @keyframes slide {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>
    </div>
  );
};

export default PremiumDashboard;
