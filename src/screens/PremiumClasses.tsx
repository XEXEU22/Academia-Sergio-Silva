import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Filter,
  Calendar as CalendarIcon,
  RefreshCw,
  Award,
  CheckCircle2
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = ['Todos', 'Muay Thai', 'Wing Chun', 'Kickboxing', 'Karatê', 'MMA'];
const DAYS_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const PremiumClasses: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);

  // Date navigation
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay()); // Sunday
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(today);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });

  useEffect(() => {
    fetchClasses();
  }, [selectedDate]);

  useEffect(() => {
    if (user) fetchEnrollments();
  }, [user]);

  const fetchClasses = async () => {
    setLoading(true);
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('classes')
      .select('*, profiles(full_name)')
      .gte('start_time', dayStart.toISOString())
      .lte('start_time', dayEnd.toISOString())
      .order('start_time', { ascending: true });

    if (!error && data) setClasses(data);
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('enrollments')
      .select('*, classes(*, profiles(full_name))')
      .eq('user_id', user.id)
      .eq('status', 'confirmed');
    
    if (data) {
      const now = new Date();
      const upcoming = data
        .filter((e: any) => new Date(e.classes.start_time) >= now)
        .sort((a: any, b: any) => new Date(a.classes.start_time).getTime() - new Date(b.classes.start_time).getTime());
      setMyEnrollments(upcoming);
    }
  };

  const filteredClasses = classes.filter(c =>
    categoryFilter === 'Todos' || c.category === categoryFilter
  );

  const isToday = (d: Date) => d.toDateString() === today.toDateString();
  const isSelected = (d: Date) => d.toDateString() === selectedDate.toDateString();

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Arte de Lutar</h2>
          <span className="text-sm font-black uppercase text-white">Grade de Aulas</span>
        </div>
        <button onClick={fetchClasses} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-primary">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-36">
        {/* My Upcoming Classes Section */}
        {user && myEnrollments.length > 0 && (
          <section className="px-6 pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black tracking-widest uppercase text-primary">Meus Próximos Treinos</h3>
              <span className="px-2 py-1 rounded-lg bg-primary/10 text-[9px] font-black text-primary border border-primary/20">
                {myEnrollments.length} RESERVA(S)
              </span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {myEnrollments.map((enroll, idx) => {
                const cls = enroll.classes;
                const date = new Date(cls.start_time);
                return (
                  <motion.div
                    key={enroll.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="shrink-0 w-72 p-5 rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark border border-primary/30 shadow-xl shadow-primary/20 relative overflow-hidden group"
                  >
                    <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                    
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                         <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20">
                            <Clock size={16} className="text-white" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                              {date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                            </p>
                            <p className="text-base font-black text-white leading-none">
                              {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </div>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-1 rounded-lg text-white">
                        {cls.category}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-white mb-4 line-clamp-1 relative z-10">{cls.title}</h4>
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full border border-white/30 overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=${cls.profiles?.full_name || 'I'}&background=fff&color=FF6B00`} className="w-full h-full object-cover" alt="Instrutor" />
                        </div>
                        <span className="text-[10px] font-bold text-white/80">{cls.profiles?.full_name || 'Instrutor'}</span>
                      </div>
                      <CheckCircle2 size={20} className="text-white/40" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Month + Week Navigation */}
        <section className="px-6 pt-8 pb-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-black tracking-tight">
              {MONTHS[selectedDate.getMonth()]} <span className="text-primary">{selectedDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentWeekStart(d => { const n = new Date(d); n.setDate(d.getDate() - 7); return n; })}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentWeekStart(d => { const n = new Date(d); n.setDate(d.getDate() + 7); return n; })}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedDate(d)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-[1.5rem] border transition-all ${
                  isSelected(d)
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                    : isToday(d)
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-card-dark border-border-dark text-slate-500 hover:border-slate-600'
                }`}
              >
                <span className="text-[9px] font-black uppercase tracking-wider">{DAYS_ABBR[d.getDay()]}</span>
                <span className="text-base font-black leading-none">{d.getDate()}</span>
                {isToday(d) && !isSelected(d) && (
                  <div className="size-1 rounded-full bg-primary" />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Category Filters */}
        <section className="px-6 pb-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
            <div className="shrink-0 p-3 rounded-2xl bg-card-dark border border-border-dark text-primary">
              <Filter size={18} />
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`shrink-0 h-11 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  categoryFilter === cat
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-card-dark border-border-dark text-slate-500 hover:text-white hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Class List */}
        <section className="px-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black tracking-tight flex items-center gap-2 text-white">
              <Clock size={16} className="text-primary" />
              Horários Disponíveis
            </h3>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              {loading ? '...' : `${filteredClasses.length} resultado(s)`}
            </span>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-primary">
              <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Carregando horários...</span>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <CalendarIcon size={40} className="mx-auto text-slate-700" />
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Nenhuma aula para este dia.</p>
              <p className="text-slate-700 text-[10px]">Tente outro dia ou categoria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClasses.map((cls, i) => {
                const start = new Date(cls.start_time);
                const end = new Date(start.getTime() + cls.duration_minutes * 60000);

                return (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-[2.5rem] border bg-card-dark border-border-dark hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                          <Clock size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-white">
                            {start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold">
                            até {end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · {cls.duration_minutes} min
                          </p>
                        </div>
                      </div>

                      <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 text-slate-500 border border-white/5">
                        {cls.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-white mb-2 tracking-tight">{cls.title}</h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <User size={12} /> {cls.profiles?.full_name || 'Mestre Sérgio'}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <Award size={12} /> {cls.level}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default PremiumClasses;
