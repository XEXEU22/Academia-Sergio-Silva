import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  ChevronLeft, 
  Search, 
  Edit3, 
  X, 
  Save,
  User,
  Award,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  CalendarDays,
  Filter,
  ChevronRight,
  ChevronDown,
  Plus,
  Banknote,
  Wallet,
  Users,
  RefreshCw,
  TrendingUp
} from '../icons';
import BottomNav from '../components/BottomNav';

/* ────────────────────────────────────────────────────────────────────────── */
/*  Types                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */
interface StudentProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  belt_level: string | null;
  role: string;
  payment_status: string | null;
  last_payment_date: string | null;
  next_payment_date: string | null;
  plan_name: string | null;
  modality: string | null;
  is_active: boolean;
  notes: string | null;
  enrollment_date: string | null;
  created_at: string;
  // joined data
  currentPlan: any;
  subscription_id: string | null;
  enrollments: EnrollmentData[];
}

interface EnrollmentData {
  id: string;
  status: string;
  created_at: string;
  class_title: string;
  class_start: string;
  class_category: string;
  class_duration: number;
}

interface PaymentRecord {
  id: string;
  user_id: string;
  amount: number;
  reference_month: string;
  status: string;
  payment_date: string | null;
  due_date: string;
  method: string | null;
  notes: string | null;
}

type TabFilter = 'todos' | 'pagos' | 'pendentes' | 'atrasados';

/* ────────────────────────────────────────────────────────────────────────── */
/*  Helpers                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */
function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatMonth(m: string) {
  const [year, month] = m.split('-');
  const names = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${names[parseInt(month)-1]} ${year}`;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
}

function statusBadge(status: string | null) {
  switch(status) {
    case 'paid': return { label: 'Pago', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 };
    case 'overdue': return { label: 'Atrasado', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertCircle };
    default: return { label: 'Pendente', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Clock };
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Main Component                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
function getInitialsColor(name: string | null) {
  const colors = [
    'from-red-500 to-rose-600','from-orange-500 to-amber-600','from-yellow-500 to-orange-500',
    'from-emerald-500 to-teal-600','from-teal-500 to-cyan-600','from-cyan-500 to-blue-600',
    'from-blue-500 to-indigo-600','from-indigo-500 to-violet-600','from-violet-500 to-purple-600',
    'from-purple-500 to-pink-600','from-pink-500 to-rose-600','from-lime-500 to-green-600'
  ];
  if (!name) return colors[0];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

function getInitials(name: string | null) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length-1][0]).toUpperCase() : parts[0].slice(0,2).toUpperCase();
}

function getDaysUntilPayment(dateStr: string | null): { days: number; label: string; color: string } | null {
  if (!dateStr) return null;
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0,0,0,0);
  due.setHours(0,0,0,0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { days: diff, label: `Atrasado ${Math.abs(diff)}d`, color: 'text-red-400' };
  if (diff === 0) return { days: 0, label: 'Vence hoje', color: 'text-amber-400' };
  if (diff <= 5) return { days: diff, label: `Vence em ${diff}d`, color: 'text-amber-400' };
  return { days: diff, label: `Vence em ${diff}d`, color: 'text-slate-500' };
}

export default function PremiumAdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabFilter>('todos');
  const [modalityFilter, setModalityFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'enrollment' | 'payment'>('name');
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Detail / Edit modal
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'pagamentos' | 'aulas'>('info');
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'pix', notes: '' });
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };
  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  /* ───── Data fetching ───── */
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profilesRes, plansRes, subsRes, enrollmentsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('plans').select('*').eq('is_active', true),
        supabase.from('subscriptions').select('user_id, plan_id, status').eq('status', 'active'),
        supabase.from('enrollments').select(`
          id, status, created_at, user_id,
          classes(title, start_time, category, duration_minutes)
        `).order('created_at', { ascending: false })
      ]);

      if (profilesRes.error) throw profilesRes.error;

      const mergedStudents: StudentProfile[] = (profilesRes.data || []).map((profile: any) => {
        const activeSub = (subsRes.data || []).find((s: any) => s.user_id === profile.id);
        const plan = (plansRes.data || []).find((p: any) => p.id === activeSub?.plan_id);
        const studentEnrollments = (enrollmentsRes.data || [])
          .filter((e: any) => e.user_id === profile.id)
          .map((e: any) => ({
            id: e.id,
            status: e.status,
            created_at: e.created_at,
            class_title: e.classes?.title || 'Aula',
            class_start: e.classes?.start_time || '',
            class_category: e.classes?.category || '',
            class_duration: e.classes?.duration_minutes || 0
          }));

        return {
          ...profile,
          currentPlan: plan || null,
          subscription_id: activeSub ? activeSub.plan_id : null,
          enrollments: studentEnrollments
        };
      });

      setStudents(mergedStudents);
      setPlans(plansRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (userId: string) => {
    setLoadingPayments(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: false });
      
      if (!error) setPayments(data || []);
    } catch(err) {
      console.error(err);
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  /* ───── Filters ───── */
  const filteredStudents = useMemo(() => {
    let list = students.filter(s =>
      (s.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.belt_level || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.modality || '').toLowerCase().includes(search.toLowerCase())
    );
    if (modalityFilter) list = list.filter(s => s.modality === modalityFilter);
    switch(activeTab) {
      case 'pagos': list = list.filter(s => s.payment_status === 'paid'); break;
      case 'pendentes': list = list.filter(s => !s.payment_status || s.payment_status === 'pending'); break;
      case 'atrasados': list = list.filter(s => s.payment_status === 'overdue'); break;
    }
    list = [...list].sort((a, b) => {
      if (sortBy === 'name') return (a.full_name||'').localeCompare(b.full_name||'');
      if (sortBy === 'enrollment') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'payment') {
        const order = { overdue: 0, pending: 1, paid: 2 };
        return (order[a.payment_status as keyof typeof order] ?? 1) - (order[b.payment_status as keyof typeof order] ?? 1);
      }
      return 0;
    });
    return list;
  }, [students, search, activeTab, modalityFilter, sortBy]);

  const stats = useMemo(() => ({
    total: students.length,
    paid: students.filter(s => s.payment_status === 'paid').length,
    pending: students.filter(s => !s.payment_status || s.payment_status === 'pending').length,
    overdue: students.filter(s => s.payment_status === 'overdue').length
  }), [students]);

  /* ───── Actions ───── */
  const openStudentDetail = (student: StudentProfile) => {
    setSelectedStudent(student);
    setDetailTab('info');
    setEditingStudent({
      ...student,
      selected_plan_id: student.currentPlan?.id || ''
    });
    fetchPayments(student.id);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSaving(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: editingStudent.full_name,
          belt_level: editingStudent.belt_level,
          role: editingStudent.role,
          phone: editingStudent.phone,
          payment_status: editingStudent.payment_status,
          last_payment_date: editingStudent.last_payment_date || null,
          next_payment_date: editingStudent.next_payment_date || null,
          modality: editingStudent.modality,
          is_active: editingStudent.is_active,
          notes: editingStudent.notes
        })
        .eq('id', editingStudent.id);
      
      if (profileError) throw profileError;

      // Update plan subscription
      if (editingStudent.selected_plan_id) {
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', editingStudent.id)
          .eq('status', 'active')
          .maybeSingle();

        if (existingSub) {
          if (existingSub.plan_id !== editingStudent.selected_plan_id) {
            await supabase
              .from('subscriptions')
              .update({ plan_id: editingStudent.selected_plan_id })
              .eq('id', existingSub.id);
          }
        } else {
          await supabase
            .from('subscriptions')
            .insert({
              user_id: editingStudent.id,
              plan_id: editingStudent.selected_plan_id,
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
            });
        }
      }

      await fetchData();
      setSelectedStudent(null);
      setEditingStudent(null);
      showToast('Aluno atualizado com sucesso!');
    } catch(err) {
      console.error('Erro ao salvar aluno:', err);
      showToast('Erro ao salvar. Verifique a conexão.', 'err');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePayment = async (student: StudentProfile) => {
    const newStatus = student.payment_status === 'paid' ? 'pending' : 'paid';
    const updates: any = { payment_status: newStatus };
    if (newStatus === 'paid') {
      updates.last_payment_date = new Date().toISOString().split('T')[0];
      // Next payment in 30 days
      const next = new Date();
      next.setDate(next.getDate() + 30);
      updates.next_payment_date = next.toISOString().split('T')[0];
    }

    await supabase.from('profiles').update(updates).eq('id', student.id);
    await fetchData();
  };

  const handleAddPayment = async () => {
    if (!selectedStudent || !paymentForm.amount) return;
    setSaving(true);
    try {
      const month = getCurrentMonth();
      const dueDate = new Date();
      dueDate.setDate(10); // Vencimento dia 10
      
      await supabase.from('payments').upsert({
        user_id: selectedStudent.id,
        amount: parseFloat(paymentForm.amount),
        reference_month: month,
        status: 'paid',
        payment_date: new Date().toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        method: paymentForm.method,
        notes: paymentForm.notes || null
      }, { onConflict: 'user_id,reference_month' });

      // Atualiza o status no perfil
      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      next.setDate(10);
      await supabase.from('profiles').update({
        payment_status: 'paid',
        last_payment_date: new Date().toISOString().split('T')[0],
        next_payment_date: next.toISOString().split('T')[0]
      }).eq('id', selectedStudent.id);

      await fetchPayments(selectedStudent.id);
      await fetchData();
      setShowPaymentModal(false);
      setPaymentForm({ amount: '', method: 'pix', notes: '' });
    } catch(err) {
      console.error(err);
      alert('Erro ao registrar pagamento.');
    } finally {
      setSaving(false);
    }
  };

  /* ───── Tabs config ───── */
  const tabs: { key: TabFilter; label: string; count: number; color: string }[] = [
    { key: 'todos', label: 'Todos', count: stats.total, color: 'text-white' },
    { key: 'pagos', label: 'Pagos', count: stats.paid, color: 'text-emerald-400' },
    { key: 'pendentes', label: 'Pendentes', count: stats.pending, color: 'text-amber-400' },
    { key: 'atrasados', label: 'Atrasados', count: stats.overdue, color: 'text-red-400' },
  ];

  /* ────────────────────────────────────────────────────────────────────────── */
  /*  Render                                                                   */
  /* ────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl text-xs font-black shadow-2xl transition-all ${
          toast.type === 'ok' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>{toast.msg}</div>
      )}
      {/* ───── Header ───── */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Gestão Admin</h2>
          <span className="text-[8px] font-black uppercase text-primary">Controle de Alunos</span>
        </div>
        <button onClick={fetchData} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <RefreshCw size={18} className={loading ? 'animate-spin text-primary' : 'text-slate-400'} />
        </button>
      </header>

      <main className="flex-1 px-6 pt-8 pb-32">
        {/* ───── Stats Cards ───── */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total', val: stats.total, color: 'text-white', bg: 'bg-white/5 border-white/10', tab: 'todos' as TabFilter },
            { label: 'Pagos', val: stats.paid, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/15', tab: 'pagos' as TabFilter },
            { label: 'Pendentes', val: stats.pending, color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/15', tab: 'pendentes' as TabFilter },
            { label: 'Atrasados', val: stats.overdue, color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/15', tab: 'atrasados' as TabFilter },
          ].map((s, i) => (
            <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}
              onClick={() => setActiveTab(s.tab)}
              className={`w-full text-center py-4 rounded-2xl border transition-all ${s.bg} ${
                activeTab === s.tab ? 'ring-2 ring-white/20 scale-105' : 'hover:scale-102'
              }`}
            >
              <p className={`text-xl font-black ${s.color}`}>{loading ? '—' : s.val}</p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
            </motion.button>
          ))}
        </div>

        {/* ───── Search + Filter Tabs ───── */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Buscar aluno, faixa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-card-dark border border-border-dark rounded-2xl text-xs text-white focus:outline-none focus:border-primary/50 placeholder:text-slate-600"
            />
          </div>
          <select
            value={modalityFilter}
            onChange={e => setModalityFilter(e.target.value)}
            className="bg-card-dark border border-border-dark rounded-2xl px-4 text-xs text-slate-400 focus:outline-none focus:border-primary/50 appearance-none"
          >
            <option value="">Todas</option>
            <option value="Jiu-Jitsu">Jiu-Jitsu</option>
            <option value="Muay Thai">Muay Thai</option>
            <option value="Kickboxing">Kickboxing</option>
            <option value="Defesa Pessoal">Defesa Pessoal</option>
            <option value="MMA">MMA</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-card-dark border border-border-dark rounded-2xl px-4 text-xs text-slate-400 focus:outline-none focus:border-primary/50 appearance-none"
          >
            <option value="name">A-Z</option>
            <option value="enrollment">Recentes</option>
            <option value="payment">Status</option>
          </select>
        </div>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-5">Exibindo {filteredStudents.length} de {students.length} alunos</p>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                activeTab === tab.key
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-card-dark border-border-dark text-slate-500 hover:text-white hover:border-slate-700'
              }`}
            >
              {tab.label} <span className={activeTab === tab.key ? 'text-white/70' : tab.color}>({tab.count})</span>
            </button>
          ))}
        </div>

        {/* ───── Students List ───── */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary text-xs font-black uppercase tracking-widest">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            Carregando Guerreiros...
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {filteredStudents.length === 0 && (
              <div className="py-16 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
                Nenhum aluno encontrado.
              </div>
            )}
            {filteredStudents.map(student => {
              const badge = statusBadge(student.payment_status);
              const BadgeIcon = badge.icon;
              return (
                <motion.div 
                  key={student.id} 
                  variants={itemVariants}
                  className="relative p-5 rounded-[2rem] bg-card-dark border border-border-dark hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar with colored initials */}
                    <div className={`size-14 rounded-2xl bg-gradient-to-br ${getInitialsColor(student.full_name)} flex items-center justify-center shrink-0 overflow-hidden border border-white/10`}>
                      {student.avatar_url ? (
                        <img src={student.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-black text-lg">{getInitials(student.full_name)}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-white truncate">{student.full_name || 'Usuário Sem Nome'}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 text-slate-400">
                          <Award size={10} className="text-primary"/> {student.belt_level || 'Branca'}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-wider flex items-center gap-1 px-2 py-0.5 rounded-full border ${badge.bg} ${badge.color}`}>
                          <BadgeIcon size={10} /> {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {student.currentPlan && (
                          <span className="text-[9px] text-indigo-400 font-bold">{student.currentPlan.name} · R${student.currentPlan.monthly_price}</span>
                        )}
                        {(() => { const d = getDaysUntilPayment(student.next_payment_date); return d ? <span className={`text-[9px] font-bold ${d.color}`}>{d.label}</span> : null; })()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleTogglePayment(student); }}
                        title={student.payment_status === 'paid' ? 'Marcar como pendente' : 'Marcar como pago'}
                        className={`p-2.5 rounded-xl border transition-all ${
                          student.payment_status === 'paid'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        <DollarSign size={16} />
                      </button>
                      <button
                        onClick={() => openStudentDetail(student)}
                        className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors border border-primary/20"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Enrolled classes + modality mini-bar */}
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-3 text-[9px] text-slate-500">
                    {student.modality && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-wider">{student.modality}</span>
                    )}
                    {student.enrollments.length > 0 && (
                      <><CalendarDays size={10} className="text-indigo-400" />
                      <span className="font-bold">{student.enrollments.length} aula(s)</span></>
                    )}
                    {student.enrollment_date && (
                      <span className="ml-auto">desde {formatDate(student.enrollment_date)}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*  DETAIL MODAL                                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedStudent && editingStudent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background-dark/98 backdrop-blur-xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border-dark">
              <button onClick={() => { setSelectedStudent(null); setEditingStudent(null); }} className="p-2 rounded-full bg-white/10 text-white">
                <X size={20} />
              </button>
              <h2 className="text-sm font-black tracking-[0.3em] uppercase">{editingStudent.full_name?.split(' ')[0] || 'Aluno'}</h2>
              <div className="size-10" />
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-1 px-6 py-3 border-b border-border-dark bg-card-dark/50">
              {[
                { key: 'info' as const, label: 'Dados', icon: User },
                { key: 'pagamentos' as const, label: 'Pagamentos', icon: Wallet },
                { key: 'aulas' as const, label: 'Aulas', icon: CalendarDays },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setDetailTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    detailTab === tab.key
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 no-scrollbar">
              {/* ── TAB: INFO ── */}
              {detailTab === 'info' && (
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Nome Completo</span>
                      <input 
                        type="text" 
                        value={editingStudent.full_name || ''}
                        onChange={e => setEditingStudent({...editingStudent, full_name: e.target.value})}
                        className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Telefone</span>
                      <input 
                        type="text" 
                        value={editingStudent.phone || ''}
                        onChange={e => setEditingStudent({...editingStudent, phone: e.target.value})}
                        className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Modalidade</span>
                      <select 
                        value={editingStudent.modality || ''}
                        onChange={e => setEditingStudent({...editingStudent, modality: e.target.value})}
                        className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary appearance-none"
                      >
                        <option value="">Selecionar...</option>
                        <option value="Jiu-Jitsu">Jiu-Jitsu</option>
                        <option value="Muay Thai">Muay Thai</option>
                        <option value="Kickboxing">Kickboxing</option>
                        <option value="Defesa Pessoal">Defesa Pessoal</option>
                        <option value="MMA">MMA</option>
                        <option value="Múltiplas">Múltiplas Modalidades</option>
                      </select>
                    </label>
                  </div>

                  {/* Belt / Role */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Faixa</span>
                      <select 
                        value={editingStudent.belt_level || ''}
                        onChange={e => setEditingStudent({...editingStudent, belt_level: e.target.value})}
                        className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary appearance-none"
                      >
                        <option value="">Nenhuma</option>
                        <option value="Faixa Branca">Faixa Branca</option>
                        <option value="Faixa Azul">Faixa Azul</option>
                        <option value="Faixa Roxa">Faixa Roxa</option>
                        <option value="Faixa Marrom">Faixa Marrom</option>
                        <option value="Faixa Preta">Faixa Preta</option>
                        <option value="Grau Preto">Grau Preto</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Permissão</span>
                      <select 
                        value={editingStudent.role || 'student'}
                        onChange={e => setEditingStudent({...editingStudent, role: e.target.value})}
                        className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary appearance-none"
                      >
                        <option value="student">Aluno</option>
                        <option value="instructor">Instrutor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </label>
                  </div>

                  {/* Payment Status */}
                  <div className="p-6 rounded-[2rem] bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/15">
                    <h3 className="text-sm font-black tracking-widest uppercase flex items-center gap-2 mb-5 text-emerald-400">
                      <DollarSign size={16} /> Status Financeiro
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Status Pgto</span>
                        <select 
                          value={editingStudent.payment_status || 'pending'}
                          onChange={e => setEditingStudent({...editingStudent, payment_status: e.target.value})}
                          className="w-full bg-card-dark border border-emerald-500/15 py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-emerald-500 appearance-none"
                        >
                          <option value="pending">Pendente</option>
                          <option value="paid">Pago</option>
                          <option value="overdue">Atrasado</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Último Pgto</span>
                        <input 
                          type="date" 
                          value={editingStudent.last_payment_date || ''}
                          onChange={e => setEditingStudent({...editingStudent, last_payment_date: e.target.value})}
                          className="w-full bg-card-dark border border-emerald-500/15 py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </label>
                      <label className="block col-span-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Próximo Vencimento</span>
                        <input 
                          type="date" 
                          value={editingStudent.next_payment_date || ''}
                          onChange={e => setEditingStudent({...editingStudent, next_payment_date: e.target.value})}
                          className="w-full bg-card-dark border border-emerald-500/15 py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20">
                    <h3 className="text-sm font-black tracking-widest uppercase flex items-center gap-2 mb-4 text-indigo-400">
                      <DollarSign size={16} /> Plano / Mensalidade
                    </h3>
                    <select 
                      value={editingStudent.selected_plan_id || ''}
                      onChange={e => setEditingStudent({...editingStudent, selected_plan_id: e.target.value})}
                      className="w-full bg-card-dark border border-indigo-500/20 py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                      <option value="">Personalizado / Sem Plano</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - R$ {plan.monthly_price}/mês
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Observações</span>
                    <textarea 
                      value={editingStudent.notes || ''}
                      onChange={e => setEditingStudent({...editingStudent, notes: e.target.value})}
                      rows={3}
                      className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary resize-none"
                      placeholder="Observações sobre o aluno..."
                    />
                  </label>

                  {/* Save */}
                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={saving}
                      className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-colors ${
                        saving ? 'bg-primary/50 text-white/50 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/20'
                      }`}
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><Save size={18} /> Salvar Alterações</>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ── TAB: PAGAMENTOS ── */}
              {detailTab === 'pagamentos' && (
                <div className="space-y-6">
                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Último Pgto</p>
                      <p className="text-sm font-black text-white mt-1">{formatDate(selectedStudent.last_payment_date)}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Próximo Venc.</p>
                      <p className="text-sm font-black text-white mt-1">{formatDate(selectedStudent.next_payment_date)}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/15">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Plano Atual</p>
                      <p className="text-sm font-black text-indigo-400 mt-1">{selectedStudent.currentPlan?.name || 'Sem Plano'}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-teal-500/5 border border-teal-500/15">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total no Ano</p>
                      <p className="text-sm font-black text-teal-400 mt-1">
                        R$ {payments.filter(p => p.status === 'paid' && p.reference_month?.startsWith(new Date().getFullYear().toString())).reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="flex-1 py-4 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-colors"
                    >
                      <Plus size={16} /> Registrar Pgto
                    </button>
                    <button
                      onClick={async () => {
                        await supabase.from('profiles').update({ payment_status: 'overdue' }).eq('id', selectedStudent.id);
                        await fetchData();
                        showToast('Marcado como atrasado', 'err');
                        setSelectedStudent(null); setEditingStudent(null);
                      }}
                      className="flex-1 py-4 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                    >
                      <AlertCircle size={16} /> Marcar Atrasado
                    </button>
                  </div>

                  {/* Payment history */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Histórico de Pagamentos</h4>
                    {loadingPayments ? (
                      <div className="py-8 flex justify-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : payments.length === 0 ? (
                      <div className="py-10 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        Nenhum pagamento registrado ainda.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {payments.map(pay => {
                          const pBadge = statusBadge(pay.status);
                          const methodColor: Record<string, string> = { pix: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dinheiro: 'text-blue-400 bg-blue-500/10 border-blue-500/20', cartao: 'text-violet-400 bg-violet-500/10 border-violet-500/20', transferencia: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
                          const mc = methodColor[pay.method || ''] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                          return (
                            <div key={pay.id} className="p-4 rounded-2xl bg-card-dark border border-border-dark flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${pBadge.bg}`}>
                                  <Banknote size={16} className={pBadge.color} />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-white">{formatMonth(pay.reference_month)}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {pay.method && <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${mc}`}>{pay.method}</span>}
                                    {pay.payment_date && <span className="text-[9px] text-slate-500">{formatDate(pay.payment_date)}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-emerald-400">R$ {Number(pay.amount).toFixed(2)}</p>
                                <p className={`text-[8px] font-black uppercase tracking-widest ${pBadge.color}`}>{pBadge.label}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB: AULAS ── */}
              {detailTab === 'aulas' && (() => {
                const now = new Date();
                const upcoming = selectedStudent.enrollments.filter(e => e.class_start && new Date(e.class_start) >= now);
                const past = selectedStudent.enrollments.filter(e => !e.class_start || new Date(e.class_start) < now);
                const attended = past.filter(e => e.status === 'attended').length;
                return (
                <div className="space-y-6">
                  {/* Attendance summary */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 text-center">
                      <p className="text-lg font-black text-indigo-400">{selectedStudent.enrollments.length}</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Total</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 text-center">
                      <p className="text-lg font-black text-emerald-400">{attended}</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Presença</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-center">
                      <p className="text-lg font-black text-primary">{upcoming.length}</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Próximas</p>
                    </div>
                  </div>

                  {selectedStudent.enrollments.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <CalendarDays size={40} className="mx-auto text-slate-700" />
                      <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Sem aulas agendadas.</p>
                    </div>
                  ) : (
                    <>
                      {upcoming.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-3">Próximas ({upcoming.length})</h4>
                          <div className="space-y-3">
                            {upcoming.map(enrollment => {
                              const classDate = new Date(enrollment.class_start);
                              return (
                                <div key={enrollment.id} className="p-5 rounded-2xl bg-card-dark border border-indigo-500/20">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-black text-white">{enrollment.class_title}</h4>
                                    <span className="text-[8px] font-black uppercase text-indigo-400">Confirmada</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-[9px] text-slate-500 font-bold">
                                    <span className="flex items-center gap-1"><Calendar size={10} />{classDate.toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span>
                                    <span className="flex items-center gap-1"><Clock size={10} />{classDate.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span>
                                    {enrollment.class_category && <span className="flex items-center gap-1"><Award size={10} className="text-primary" />{enrollment.class_category}</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {past.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Passadas ({past.length})</h4>
                          <div className="space-y-3">
                            {past.map(enrollment => {
                              const classDate = enrollment.class_start ? new Date(enrollment.class_start) : null;
                              const statusColor = enrollment.status === 'attended' ? 'text-emerald-400' : enrollment.status === 'cancelled' ? 'text-red-400' : 'text-slate-500';
                              const statusLabel = enrollment.status === 'attended' ? 'Presente' : enrollment.status === 'cancelled' ? 'Cancelada' : 'Concluída';
                              return (
                                <div key={enrollment.id} className="p-4 rounded-2xl bg-card-dark/50 border border-border-dark/50 opacity-70">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black text-white">{enrollment.class_title}</h4>
                                    <span className={`text-[8px] font-black uppercase ${statusColor}`}>{statusLabel}</span>
                                  </div>
                                  {classDate && <p className="text-[9px] text-slate-600 mt-1">{classDate.toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}</p>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                );
              })()}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*  PAYMENT REGISTRATION MODAL                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-card-dark rounded-t-[2rem] border-t border-border-dark p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight">Registrar Pagamento</h3>
                <button onClick={() => setShowPaymentModal(false)} className="p-1.5 rounded-full bg-white/10">
                  <X size={16} />
                </button>
              </div>

              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Valor (R$)</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                  placeholder={selectedStudent?.currentPlan?.monthly_price || '0.00'}
                  className="w-full bg-background-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Método</span>
                <select
                  value={paymentForm.method}
                  onChange={e => setPaymentForm({...paymentForm, method: e.target.value})}
                  className="w-full bg-background-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-emerald-500 appearance-none"
                >
                  <option value="pix">PIX</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Observações</span>
                <input 
                  type="text"
                  value={paymentForm.notes}
                  onChange={e => setPaymentForm({...paymentForm, notes: e.target.value})}
                  placeholder="Opcional..."
                  className="w-full bg-background-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </label>

              <button 
                onClick={handleAddPayment}
                disabled={saving || !paymentForm.amount}
                className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-colors ${
                  saving || !paymentForm.amount
                    ? 'bg-emerald-500/30 text-white/40 cursor-not-allowed'
                    : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600'
                }`}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><CheckCircle2 size={18} /> Confirmar Pagamento</>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
