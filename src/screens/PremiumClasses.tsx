import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  User,
  Calendar as CalendarIcon,
  RefreshCw,
  Award,
  CheckCircle2,
  Zap,
  Star
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const PremiumClasses: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classesByDay, setClassesByDay] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Classes (from today onwards)
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const { data: clsData } = await supabase
        .from('classes')
        .select('*, profiles(full_name)')
        .gte('start_time', now.toISOString())
        .order('start_time', { ascending: true });

      if (clsData) {
        // Group by day
        const grouped: { [key: string]: any[] } = {};
        clsData.forEach(cls => {
          const date = new Date(cls.start_time);
          const dateStr = date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
          if (!grouped[dateStr]) grouped[dateStr] = [];
          grouped[dateStr].push(cls);
        });
        setClassesByDay(grouped);
      }

      // 2. Fetch Enrollments
      if (user) {
        const { data: enrollData } = await supabase
          .from('enrollments')
          .select('*, classes(*, profiles(full_name))')
          .eq('user_id', user.id)
          .eq('status', 'confirmed');
        
        if (enrollData) {
          const currentNow = new Date();
          const upcoming = enrollData
            .filter((e: any) => new Date(e.classes.start_time) >= currentNow)
            .sort((a: any, b: any) => new Date(a.classes.start_time).getTime() - new Date(b.classes.start_time).getTime());
          setMyEnrollments(upcoming);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Header / Banner */}
      <header className="relative h-64 shrink-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000&auto=format&fit=crop" 
             className="w-full h-full object-cover opacity-40 grayscale"
             alt="Treino"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
        </div>

        <div className="relative z-10 p-6 pt-12 h-full flex flex-col justify-between">
           <div className="flex items-center justify-between">
              <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={fetchData} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all text-primary">
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
           </div>

           <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-black uppercase tracking-[0.2em] text-primary">Cronograma Elite</div>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white leading-none">Grade de <br/><span className="text-primary italic">Aulas</span></h1>
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-40 -mt-8 relative z-20">
        
        {/* My Confirmed Banner */}
        {user && myEnrollments.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4 px-2">
               <Star size={16} className="text-primary fill-current" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Suas Próximas Aulas</h3>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
              {myEnrollments.map((enroll, idx) => {
                const cls = enroll.classes;
                const date = new Date(cls.start_time);
                return (
                  <motion.div
                    key={enroll.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="shrink-0 w-80 p-6 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-dark border border-white/20 shadow-2xl shadow-primary/30 relative overflow-hidden group"
                  >
                    <div className="absolute -right-4 -top-4 size-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                    
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                         <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20">
                            <Zap size={20} className="text-white fill-current" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-none mb-1">
                              {date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                            </p>
                            <p className="text-lg font-black text-white leading-none">
                              {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </div>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-white/20 px-3 py-1.5 rounded-xl text-white border border-white/10">
                        {cls.category}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-white mb-6 relative z-10">{cls.title}</h4>
                    
                    <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-white/60" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">{cls.profiles?.full_name || 'Mestre Sérgio'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-[8px] font-black text-green-300 uppercase">
                         Confirmado
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Full Schedule List Grouped by Day */}
        <section className="space-y-12">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-primary">
              <RefreshCw size={32} className="animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Mapeando Grade...</span>
            </div>
          ) : Object.keys(classesByDay).length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-card-dark rounded-[3rem] border border-border-dark p-10">
               <CalendarIcon size={48} className="mx-auto text-slate-700" />
               <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Nenhuma aula programada.</p>
            </div>
          ) : (
            Object.entries(classesByDay).map(([day, dayClasses], dayIdx) => (
              <div key={day} className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                   <div className="h-px flex-1 bg-border-dark" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary whitespace-nowrap">
                     {day}
                   </h3>
                   <div className="h-px flex-1 bg-border-dark" />
                </div>

                <div className="grid gap-4">
                  {dayClasses.map((cls, idx) => {
                    const start = new Date(cls.start_time);
                    const end = new Date(start.getTime() + cls.duration_minutes * 60000);
                    return (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (dayIdx * 0.1) + (idx * 0.05) }}
                        className="p-6 rounded-[2.5rem] bg-card-dark border border-border-dark hover:border-primary/40 transition-all flex items-center justify-between group"
                      >
                         <div className="flex items-center gap-5">
                            <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-background-dark border border-border-dark min-w-[70px] group-hover:border-primary/30 transition-colors">
                               <span className="text-lg font-black text-white leading-none">
                                 {start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                               </span>
                               <span className="text-[8px] font-bold text-slate-600 mt-1 uppercase">Início</span>
                            </div>

                            <div>
                               <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                                    {cls.category}
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic">{cls.level}</span>
                               </div>
                               <h4 className="text-lg font-black text-white tracking-tight">{cls.title}</h4>
                               <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-1">
                                  <User size={12} className="text-primary" /> Prof. {cls.profiles?.full_name || 'Mestre Sérgio'}
                               </p>
                            </div>
                         </div>

                         <div className="text-right">
                            <div className="text-[10px] font-black text-white/50">{cls.duration_minutes}m</div>
                            <Award size={18} className="text-slate-700 mt-2 ml-auto group-hover:text-primary transition-colors" />
                         </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default PremiumClasses;
