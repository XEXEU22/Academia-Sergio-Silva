import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Filter,
  Users,
  Award,
  Calendar as CalendarIcon,
  RefreshCw,
  CheckCircle2
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = ['Todos', 'Muay Thai', 'Wing Chun', 'Kickboxing', 'Karatê', 'MMA'];
const DAYS_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const PremiumSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

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

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

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
      .select('class_id')
      .eq('user_id', user.id)
      .eq('status', 'confirmed');
    if (data) setEnrolledIds(new Set(data.map((e: any) => e.class_id)));
  };

  const handleEnroll = async (cls: any) => {
    if (!user) { navigate('/login'); return; }
    if (enrolledIds.has(cls.id)) { showToast('Você já está inscrito nesta aula!', false); return; }
    if (cls.status === 'full') { showToast('Aula lotada!', false); return; }

    setEnrolling(cls.id);
    const { error } = await supabase.from('enrollments').insert({
      user_id: user.id,
      class_id: cls.id,
      status: 'confirmed'
    });

    if (error) {
      showToast('Erro ao reservar. Tente novamente.', false);
    } else {
      setEnrolledIds(prev => new Set([...prev, cls.id]));
      showToast('Vaga reservada com sucesso! ✅');
    }
    setEnrolling(null);
  };

  const filteredClasses = classes.filter(c =>
    categoryFilter === 'Todos' || c.category === categoryFilter
  );

  const isToday = (d: Date) => d.toDateString() === today.toDateString();
  const isSelected = (d: Date) => d.toDateString() === selectedDate.toDateString();

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl text-xs font-black shadow-2xl ${
              toast.ok ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Arte de Lutar</h2>
          <span className="text-sm font-black uppercase text-white">Agenda de Aulas</span>
        </div>
        <button onClick={fetchClasses} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-primary">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-36">
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
              Aulas do Dia
            </h3>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              {loading ? '...' : `${filteredClasses.length} resultado(s)`}
            </span>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-primary">
              <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Carregando aulas...</span>
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
                const isEnrolled = enrolledIds.has(cls.id);
                const isFull = cls.status === 'full';

                return (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-5 rounded-[2.5rem] border transition-all ${
                      isFull ? 'bg-card-dark/40 border-border-dark opacity-50' : 'bg-card-dark border-border-dark hover:border-primary/30'
                    }`}
                  >
                    {/* Time + Status Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${isFull ? 'bg-slate-800' : 'bg-primary/10 border border-primary/20'}`}>
                          <Clock size={18} className={isFull ? 'text-slate-600' : 'text-primary'} />
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

                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          isFull
                            ? 'border-red-500/20 text-red-400 bg-red-500/5'
                            : isEnrolled
                            ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
                            : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
                        }`}>
                          {isFull ? 'Lotado' : isEnrolled ? 'Inscrito' : `${cls.max_spots} vagas`}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-slate-500">
                          {cls.category}
                        </span>
                      </div>
                    </div>

                    {/* Title + Instructor + Level */}
                    <div className="mb-5">
                      <h4 className="text-base font-black text-white mb-2 tracking-tight">{cls.title}</h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <User size={12} /> {cls.profiles?.full_name || 'Instrutor'}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <Award size={12} /> {cls.level}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      disabled={isFull || !!enrolling || isEnrolled}
                      onClick={() => handleEnroll(cls)}
                      className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        isEnrolled
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
                          : isFull
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                          : 'bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50'
                      }`}
                    >
                      {enrolling === cls.id ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : isEnrolled ? (
                        <><CheckCircle2 size={16} /> Você está inscrito</>
                      ) : isFull ? 'Aula Lotada' : 'Reservar Vaga'}
                    </button>
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

export default PremiumSchedule;
