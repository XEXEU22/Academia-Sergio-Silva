import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Calendar,
  Award,
  DollarSign,
  TrendingUp,
  AlertCircle,
  X,
  Bell,
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Student {
  id: string;
  full_name: string;
  phone?: string;
  belt_level?: string;
  modality?: string;
  plan_name?: string;
  payment_status?: 'paid' | 'pending' | 'overdue';
  last_payment_date?: string;
  next_payment_date?: string;
  enrollment_date?: string;
  is_active?: boolean;
  created_at: string;
  role: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const daysSince = (dateStr?: string): number => {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR');
};

const paymentBadge = (status?: string) => {
  switch (status) {
    case 'paid':
      return { label: 'Pago', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    case 'overdue':
      return { label: 'Atrasado', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    default:
      return { label: 'Pendente', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
  }
};

const beltColor = (belt?: string): string => {
  const map: Record<string, string> = {
    branca: 'bg-white text-gray-900',
    azul: 'bg-blue-600 text-white',
    roxa: 'bg-purple-600 text-white',
    marrom: 'bg-amber-800 text-white',
    preta: 'bg-gray-900 text-white border border-white/20',
  };
  return map[belt?.toLowerCase() || ''] || 'bg-slate-600 text-white';
};

// ─── Student Detail Modal ─────────────────────────────────────────────────────
const StudentModal: React.FC<{ student: Student; onClose: () => void; onUpdate: () => void }> = ({ student, onClose, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState(student.payment_status || 'pending');

  const handleMarkPaid = async () => {
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await supabase.from('profiles').update({
      payment_status: 'paid',
      last_payment_date: today,
      next_payment_date: nextMonth,
    }).eq('id', student.id);
    setSaving(false);
    onUpdate();
    onClose();
  };

  const badge = paymentBadge(student.payment_status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg mx-auto bg-[#0f1117] border-t border-border-dark rounded-t-[2.5rem] p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-2xl font-black text-primary">{student.full_name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{student.full_name}</h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badge.color}`}>{badge.label}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 border border-white/10">
            <X size={18} />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Modalidade', value: student.modality || '—', icon: Award },
            { label: 'Faixa', value: student.belt_level || '—', icon: Award },
            { label: 'Plano', value: student.plan_name || '—', icon: DollarSign },
            { label: 'Dias Inscrito', value: `${daysSince(student.enrollment_date || student.created_at)} dias`, icon: Calendar },
            { label: 'Último Pgto', value: formatDate(student.last_payment_date), icon: CheckCircle2 },
            { label: 'Próximo Pgto', value: formatDate(student.next_payment_date), icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5">
                <Icon size={11} className="text-slate-500" />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
              </div>
              <p className="text-sm font-bold text-white truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleMarkPaid}
            disabled={saving || student.payment_status === 'paid'}
            className="flex-1 py-3.5 rounded-2xl bg-emerald-500 text-white font-black text-sm uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {saving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {student.payment_status === 'paid' ? 'Já Pago' : 'Marcar Pago'}
          </button>
          <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 active:scale-95 transition-transform">
            <Bell size={18} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const PremiumStudentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [filterModality, setFilterModality] = useState('Todas');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const modalities = ['Todas', 'Jiu-Jitsu', 'Muay Thai', 'Wing Chun', 'Kickboxing'];

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false });
    if (!error && data) setStudents(data as Student[]);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total = students.length;
  const paid = students.filter(s => s.payment_status === 'paid').length;
  const overdue = students.filter(s => s.payment_status === 'overdue').length;
  const pending = students.filter(s => !s.payment_status || s.payment_status === 'pending').length;
  const newThisMonth = students.filter(s => daysSince(s.created_at) <= 30).length;

  // ── Filtered ───────────────────────────────────────────────────────────────
  const filtered = students.filter(s => {
    const matchSearch = !search || s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search);
    const matchStatus = filterStatus === 'all' || s.payment_status === filterStatus || (filterStatus === 'pending' && !s.payment_status);
    const matchModality = filterModality === 'Todas' || s.modality === filterModality;
    return matchSearch && matchStatus && matchModality;
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const statCards = [
    { label: 'Total Alunos', value: total, color: 'text-white', bg: 'from-primary/20 to-primary/5', border: 'border-primary/20', icon: Users },
    { label: 'Pagamentos OK', value: paid, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20', icon: CheckCircle2 },
    { label: 'Pendentes', value: pending, color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20', icon: Clock },
    { label: 'Atrasados', value: overdue, color: 'text-red-400', bg: 'from-red-500/20 to-red-500/5', border: 'border-red-500/20', icon: AlertCircle },
  ];

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Painel Admin</h2>
          <p className="text-sm font-black text-white">Gestão de Alunos</p>
        </div>
        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Users size={18} className="text-primary" />
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 px-5 pt-7 space-y-8"
      >
        {/* Stats Cards */}
        <section className="grid grid-cols-2 gap-3">
          {statCards.map(({ label, value, color, bg, border, icon: Icon }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className={`p-5 rounded-3xl bg-gradient-to-br ${bg} border ${border} space-y-3`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">{label}</p>
                <Icon size={16} className={color} />
              </div>
              <p className={`text-3xl font-black ${color}`}>
                {loading ? '—' : value}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Novos este mês */}
        <motion.section
          variants={itemVariants}
          className="p-5 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-primary/10 border border-indigo-500/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
              <TrendingUp size={22} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Novos este mês</p>
              <p className="text-xl font-black text-white">+{loading ? '—' : newThisMonth} alunos</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-600 uppercase tracking-widest">Taxa pago</p>
            <p className="text-lg font-black text-emerald-400">
              {total > 0 ? Math.round((paid / total) * 100) : 0}%
            </p>
          </div>
        </motion.section>

        {/* Busca */}
        <motion.section variants={itemVariants} className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-card-dark border border-border-dark text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </motion.section>

        {/* Filtro Status */}
        <motion.section variants={itemVariants} className="space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status de Pagamento</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {(['all', 'paid', 'pending', 'overdue'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filterStatus === s
                    ? s === 'paid' ? 'bg-emerald-500 border-emerald-500 text-white'
                    : s === 'overdue' ? 'bg-red-500 border-red-500 text-white'
                    : s === 'pending' ? 'bg-amber-500 border-amber-500 text-white'
                    : 'bg-primary border-primary text-white'
                    : 'bg-card-dark border-border-dark text-slate-500 hover:border-slate-600'
                }`}
              >
                {s === 'all' ? 'Todos' : s === 'paid' ? 'Pagos' : s === 'pending' ? 'Pendentes' : 'Atrasados'}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Filtro Modalidade */}
        <motion.section variants={itemVariants} className="space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Modalidade</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {modalities.map(m => (
              <button
                key={m}
                onClick={() => setFilterModality(m)}
                className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filterModality === m
                    ? 'bg-primary border-primary text-white'
                    : 'bg-card-dark border-border-dark text-slate-500 hover:border-slate-600'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Lista de Alunos */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-black text-white">
              {filtered.length} {filtered.length === 1 ? 'aluno' : 'alunos'}
            </p>
            {search || filterStatus !== 'all' || filterModality !== 'Todas' ? (
              <button
                onClick={() => { setSearch(''); setFilterStatus('all'); setFilterModality('Todas'); }}
                className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1"
              >
                <X size={12} /> Limpar
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Carregando alunos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-4">
              <div className="size-16 rounded-3xl bg-card-dark border border-border-dark flex items-center justify-center">
                <Users size={28} className="text-slate-700" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest text-center">
                Nenhum aluno encontrado
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((student) => {
                const badge = paymentBadge(student.payment_status);
                const daysEnrolled = daysSince(student.enrollment_date || student.created_at);
                return (
                  <motion.div
                    key={student.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStudent(student)}
                    className="group p-4 rounded-3xl bg-card-dark border border-border-dark hover:border-primary/30 transition-all cursor-pointer flex items-center gap-4"
                  >
                    {/* Avatar */}
                    <div className="size-12 shrink-0 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-lg font-black text-primary">{student.full_name?.[0]?.toUpperCase() || '?'}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-white text-sm truncate group-hover:text-primary transition-colors">
                          {student.full_name}
                        </h4>
                        {student.belt_level && (
                          <span className={`shrink-0 text-[8px] font-black px-2 py-0.5 rounded-full ${beltColor(student.belt_level)}`}>
                            {student.belt_level}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {student.modality && (
                          <span className="text-[9px] text-primary font-black uppercase tracking-widest">{student.modality}</span>
                        )}
                        <span className="text-[9px] text-slate-600 font-bold flex items-center gap-0.5">
                          <Calendar size={9} /> {daysEnrolled}d inscrito
                        </span>
                        {student.plan_name && (
                          <span className="text-[9px] text-slate-600 font-bold">{student.plan_name}</span>
                        )}
                      </div>
                    </div>

                    {/* Status + Arrow */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <ChevronRight size={16} className="text-slate-700 group-hover:text-primary transition-colors" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      </motion.main>

      <BottomNav />

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onUpdate={fetchStudents}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumStudentManagement;
