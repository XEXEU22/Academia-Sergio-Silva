import React from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Share2, 
  Verified, 
  Star, 
  GraduationCap, 
  History, 
  Calendar, 
  Plus, 
  MessageSquare,
  Trophy,
  Award,
  Users,
  Shield,
  Zap,
  Target
} from '../icons';
import BottomNav from '../components/BottomNav';

const PremiumInstructorProfile: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Header com Glassmorphism Translúcido */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-bold tracking-widest uppercase">Mestre Sérgio</h2>
        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <Share2 size={20} />
        </button>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 pt-8"
      >
        {/* Profile Hero with Dramatic Lighting */}
        <section className="px-6 flex flex-col items-center mb-10 text-center">
          <div className="relative mb-6">
             {/* Glowing Aura */}
             <div className="absolute inset-0 bg-primary/30 rounded-full blur-[40px] animate-pulse scale-125" />
             <div className="relative size-40 rounded-full border-[6px] border-primary p-1.5 bg-card-dark shadow-2xl overflow-hidden ring-offset-4 ring-offset-background-dark ring-2 ring-primary/20">
                <img 
                   alt="Mestre Sérgio" 
                   className="w-full h-full object-cover rounded-full" 
                   src="https://ui-avatars.com/api/?name=S+S&background=FF6B00&color=fff" 
                />
             </div>
             <div className="absolute bottom-2 right-2 bg-primary text-white size-10 rounded-full flex items-center justify-center border-4 border-background-dark shadow-2xl">
                <Verified size={20} className="fill-current" />
             </div>
          </div>
          
          <motion.h2 variants={itemVariants} className="text-4xl font-black tracking-tighter mb-1">Mestre Sérgio</motion.h2>
          <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">
             Faixa Preta 5º Dan
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-6">
             <div className="flex flex-col items-center">
                <p className="text-xl font-black text-white">4.9</p>
                <div className="flex gap-0.5"><Star size={10} className="fill-amber-500 text-amber-500" /></div>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Rating</p>
             </div>
             <div className="w-[1px] h-8 bg-white/5" />
             <div className="flex flex-col items-center">
                <p className="text-xl font-black text-white">1.2k</p>
                <Users size={12} className="text-primary" />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Alunos</p>
             </div>
             <div className="w-[1px] h-8 bg-white/5" />
             <div className="flex flex-col items-center">
                <p className="text-xl font-black text-white">15y</p>
                <GraduationCap size={12} className="text-primary" />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">XP</p>
             </div>
          </motion.div>
        </section>

        {/* Dynamic Buttons */}
        <section className="px-6 grid grid-cols-2 gap-4 mb-10">
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="px-6 py-4 bg-primary rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
           >
              <Plus size={20} className="stroke-[3]" />
              <span className="font-black text-xs uppercase tracking-widest">Seguir</span>
           </motion.button>
           <motion.button 
             whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
             whileTap={{ scale: 0.98 }}
             className="px-6 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center gap-3 backdrop-blur-md"
           >
              <MessageSquare size={20} />
              <span className="font-black text-xs uppercase tracking-widest">DM</span>
           </motion.button>
        </section>

        {/* Biografia Premium */}
        <section className="px-6 mb-10">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-card-dark border border-border-dark text-primary">
                 <History size={18} />
              </div>
              <h3 className="text-lg font-black tracking-tight uppercase tracking-widest">Biografia Profissional</h3>
           </div>
           <p className="text-slate-400 text-sm leading-relaxed tracking-wide bg-card-dark/50 p-6 rounded-[2rem] border border-border-dark">
             Especialista em <span className="text-white font-bold">Defesa Pessoal Moderna</span> e Krav Maga, o Mestre Sérgio refinou sua técnica em diversos centros globais. Seu método foca no 
             <span className="text-primary font-bold"> psicológico do combate</span> e em movimentos minimalistas para máxima eficácia sob pressão. Mentor de mais de 100 professores diplomados.
           </p>
        </section>

        {/* Grid de Especialidades com Estilo Game */}
        <section className="px-6 mb-10">
           <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Mastery Skills</h3>
           <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Jiu-Jitsu', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400', level: '100%', icon: Shield },
                { label: 'Muay Thai', color: 'bg-red-500/10 border-red-500/20 text-red-400', level: '95%', icon: Zap },
                { label: 'Wing Chun', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', level: '88%', icon: Target },
                { label: 'Karatê', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400', level: '92%', icon: Award }
              ].map((skill, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${skill.color} flex flex-col gap-3 group overflow-hidden relative`}>
                   <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-150 transition-transform">
                      <skill.icon size={48} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest">{skill.label}</p>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-60">Mastery</span>
                      <span className="text-[10px] font-black">{skill.level}</span>
                   </div>
                   <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: skill.level }}
                        className={`h-full bg-current rounded-full`} 
                      />
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Schedule Preview Section */}
        <section className="px-6 mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
              <Calendar className="text-primary" size={20} />
              Agenda Próxima
            </h3>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest" onClick={() => navigate('/premium-schedule')}>Abrir Calendário</button>
          </div>
          
          <div className="space-y-4">
             {[
               { date: '12 MAR', time: '18:00', title: 'Defesa Pessoal: Contra-Ataques', category: 'Avançado' },
               { date: '14 MAR', time: '09:00', title: 'Fundamentos da Luta de Chão', category: 'Iniciantes' }
             ].map((lesson, i) => (
               <div key={i} className="flex items-center gap-5 p-5 rounded-[2rem] bg-card-dark border border-border-dark group hover:border-primary/40 transition-all">
                  <div className="flex flex-col items-center justify-center min-w-[70px] py-1 border-r border-border-dark pr-5">
                     <span className="text-[9px] font-black text-slate-500 uppercase leading-none mb-1">DATA</span>
                     <span className="text-lg font-black text-white leading-none text-center">{lesson.date}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                     <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                           {lesson.category}
                        </span>
                     </div>
                     <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors tracking-tight">{lesson.title}</h4>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{lesson.time} • DOJO PRINCIPAL</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: 'var(--primary)' }}
                    whileTap={{ scale: 0.9 }}
                    className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
                  >
                     <Plus size={20} />
                  </motion.button>
               </div>
             ))}
          </div>
        </section>
      </motion.main>
      
      <BottomNav />
    </div>
  );
};

export default PremiumInstructorProfile;
