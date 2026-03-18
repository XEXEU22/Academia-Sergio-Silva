import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  Search, 
  Filter,
  Users,
  Award,
  ChevronRight,
  Plus,
  Zap
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';

interface ClassData {
  id: string;
  title: string;
  instructor_name: string;
  category: string;
  level: string;
  start_time: string;
  duration_minutes: number;
  max_spots: number;
  status: 'available' | 'full' | 'cancelled';
}

const PremiumSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(12);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          profiles(full_name)
        `)
        .order('start_time', { ascending: true });

      if (!error && data) {
        // Mapeando para o formato que a UI consumia
        const formatted = data.map((cls: any) => {
          const startTime = new Date(cls.start_time);
          const hours = startTime.getHours().toString().padStart(2, '0');
          const minutes = startTime.getMinutes().toString().padStart(2, '0');

          return {
            id: cls.id,
            time: `${hours}:${minutes}`,
            duration: `${cls.duration_minutes} min`,
            title: cls.title,
            instructor: cls.profiles?.full_name || 'Prof. Substituto',
            spots: cls.max_spots === 0 ? 'Esgotado' : `${cls.max_spots} Vagas`,
            level: cls.level,
            status: cls.status,
            category: cls.category
          };
        });
        setClasses(formatted);
      }
      setLoading(false);
    }
    
    fetchClasses();
  }, [selectedDay]); // O selectedDay fará reload quando mudarmos a lógica de datas futuramente


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
      {/* Header com Glassmorphism */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-bold tracking-widest uppercase">Reservar Aula</h2>
        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-primary">
          <CalendarIcon size={20} />
        </button>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 pt-8"
      >
        {/* Modern Date Picker */}
        <section className="px-6 mb-10">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-black tracking-tight">Março 2026</h3>
             <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"><ChevronLeft size={20} /></button>
                <div className="rotate-180 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"><ChevronLeft size={20} /></div>
             </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[
              { day: 'SEG', num: 9 },
              { day: 'TER', num: 10 },
              { day: 'QUA', num: 11 },
              { day: 'QUI', num: 12, active: true },
              { day: 'SEX', num: 13 },
              { day: 'SAB', num: 14 },
              { day: 'DOM', num: 15 }
            ].map((d, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedDay(d.num)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-3 min-w-[65px] py-6 rounded-[2rem] border transition-all ${
                  selectedDay === d.num 
                    ? 'bg-primary border-primary text-white shadow-[0_15px_30px_rgba(255,107,0,0.3)]' 
                    : 'bg-card-dark border-border-dark text-slate-500 hover:border-slate-700'
                }`}
              >
                <span className={`text-[10px] font-black tracking-widest ${selectedDay === d.num ? 'text-white/80' : 'text-slate-600'}`}>{d.day}</span>
                <span className="text-xl font-black">{d.num}</span>
                {selectedDay === d.num && <motion.div layoutId="dot" className="size-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Filters Grid */}
        <section className="px-6 mb-10">
           <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <div className="p-3 rounded-2xl bg-card-dark border border-border-dark text-primary">
                 <Filter size={20} />
              </div>
              {['Todos', 'Jiu-Jitsu', 'Muay Thai', 'Kickboxing', 'Defesa'].map(filter => (
                 <button key={filter} className="h-12 shrink-0 px-6 rounded-2xl bg-card-dark border border-border-dark text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                    {filter}
                 </button>
              ))}
           </div>
        </section>

        {/* Class List with Progress Style */}
        <section className="px-6 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                 <Clock size={20} className="text-primary" />
                 Próximas Disponíveis
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">4 Resultados</p>
           </div>

           <div className="space-y-4">
              {loading ? (
                <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  Carregando Aulas...
                </div>
              ) : classes.length === 0 ? (
                <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                  Nenhuma aula encontrada para este dia.
                </div>
              ) : classes.map((cls, i) => (
                <motion.div
                  key={cls.id || i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, backgroundColor: cls.status === 'full' ? '' : 'rgba(255,107,0,0.05)' }}
                  className={`relative p-6 rounded-[2.5rem] border transition-all overflow-hidden ${
                    cls.status === 'full' ? 'bg-card-dark/30 border-border-dark opacity-40 grayscale' : 'bg-card-dark border-border-dark'
                  }`}
                >
                   {/* Animated Background Pulse for Available */}
                   {cls.status !== 'full' && cls.category === 'Grappling' && (
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -mr-10 -mt-10" />
                   )}

                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className={`p-3 rounded-2xl ${cls.status === 'full' ? 'bg-slate-800' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
                            <Clock size={20} />
                         </div>
                         <div>
                            <p className="text-xl font-black text-white">{cls.time}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{cls.duration}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                           cls.status === 'full' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                         }`}>
                           {cls.spots}
                         </span>
                      </div>
                   </div>

                   <div className="mb-6">
                      <h4 className="text-lg font-black text-white mb-2 leading-tight tracking-tight">{cls.title}</h4>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-500" />
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{cls.instructor}</p>
                         </div>
                         <div className="size-1 rounded-full bg-slate-700" />
                         <div className="flex items-center gap-2">
                            <Award size={14} className="text-slate-500" />
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{cls.level}</p>
                         </div>
                      </div>
                   </div>

                   <button 
                     disabled={cls.status === 'full'}
                     className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl ${
                       cls.status === 'full' 
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5' 
                        : 'bg-primary text-white shadow-primary/30 border border-primary/20 hover:shadow-primary/50'
                     }`}
                   >
                     {cls.status === 'full' ? 'Esgotado' : 'Reservar Vaga'}
                   </button>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Floating Stat Overlay */}
        <div className="fixed bottom-32 left-6 right-6 z-40">
           <motion.div 
             initial={{ y: 100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="glass rounded-full p-2 pl-6 flex items-center justify-between border border-border-dark shadow-2xl shadow-primary/20"
           >
              <div className="flex flex-col">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Seu Crédito Atual</p>
                 <p className="text-sm font-black text-white">12 Aulas Disponíveis</p>
              </div>
              <button 
                onClick={() => navigate('/plans')}
                className="h-12 px-6 bg-white text-background-dark rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-transform"
              >
                 Planos
              </button>
           </motion.div>
        </div>
      </motion.main>
      
      <BottomNav />
    </div>
  );
};

export default PremiumSchedule;
