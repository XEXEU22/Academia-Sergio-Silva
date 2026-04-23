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
  Users
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
export default function PremiumAdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabFilter>('todos');
  
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
    
    switch(activeTab) {
      case 'pagos': list = list.filter(s => s.payment_status === 'paid'); break;
      case 'pendentes': list = list.filter(s => !s.payment_status || s.payment_status === 'pending'); break;
      case 'atrasados': list = list.filter(s => s.payment_status === 'overdue'); break;
    }
    return list;
  }, [students, search, activeTab]);

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
    } catch(err) {
      console.error('Erro ao salvar aluno:', err);
      alert('Erro ao salvar os dados. Verifique a conexão e as permissões RLS.');
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
      {/* ───── Header ───── */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Gestão Admin</h2>
          <span className="text-[8px] font-black uppercase text-primary">Controle de Alunos</span>
        </div>
        <div className="size-10" />
      </header>

      <main className="flex-1 px-6 pt-8 pb-32">
        {/* ───── Stats Cards ───── */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total', val: stats.total, color: 'text-white', bg: 'bg-white/5 border-white/10' },
            { label: 'Pagos', val: stats.paid, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/15' },
            { label: 'Pendentes', val: stats.pending, color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/15' },
            { label: 'Atrasados', val: stats.overdue, color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/15' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}
              className={`text-center py-4 rounded-2xl border ${s.bg}`}
            >
              <p className={`text-xl font-black ${s.color}`}>{loading ? '—' : s.val}</p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ───── Search + Filter Tabs ───── */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Buscar aluno, faixa ou modalidade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card-dark border border-border-dark rounded-2xl text-xs text-white focus:outline-none focus:border-primary/50 placeholder:text-slate-600"
          />
        </div>

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
                    {/* Avatar */}
                    <div className="size-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                      {student.avatar_url ? (
                        <img src={student.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-slate-500" size={28} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-white truncate">{student.full_name || 'Usuário Sem Nome'}</h3>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 text-slate-400">
                          <Award size={10} className="text-primary"/> {student.belt_level || 'Faixa Branca'}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-wider flex items-center gap-1 px-2 py-0.5 rounded-full border ${badge.bg} ${badge.color}`}>
                          <BadgeIcon size={10} /> {badge.label}
                        </span>
                      </div>
                      {/* Next payment date */}
                      {student.next_payment_date && (
                        <p className="text-[9px] text-slate-600 mt-1 flex items-center gap-1">
                          <Calendar size={9} /> Venc: {formatDate(student.next_payment_date)}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Quick toggle payment */}
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
                      {/* Open detail */}
                      <button 
                        onClick={() => openStudentDetail(student)}
                        className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors border border-primary/20"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Enrolled classes mini-indicator */}
                  {student.enrollments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-[9px] text-slate-500">
                      <CalendarDays size={11} className="text-indigo-400" />
                      <span className="font-bold uppercase tracking-wider">{student.enrollments.length} aula(s) agendada(s)</span>
                      <span className="text-slate-700">•</span>
                      <span className="truncate text-indigo-300/60">
                        {student.enrollments.slice(0,2).map(e => e.class_title).join(', ')}
                      </span>
                    </div>
                  )}
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
                  {/* Current status summary */}
                  <div className="p-6 rounded-[2rem] bg-gradient-to-br from-emerald-500/5 to-amber-500/5 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest">Resumo</h3>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusBadge(selectedStudent.payment_status).bg} ${statusBadge(selectedStudent.payment_status).color}`}>
                        {statusBadge(selectedStudent.payment_status).label}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Último Pgto</p>
                        <p className="text-sm font-black text-white mt-1">{formatDate(selectedStudent.last_payment_date)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Próximo Venc.</p>
                        <p className="text-sm font-black text-white mt-1">{formatDate(selectedStudent.next_payment_date)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Plano</p>
                        <p className="text-sm font-black text-indigo-400 mt-1">{selectedStudent.currentPlan?.name || 'Sem Plano'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Valor Mensal</p>
                        <p className="text-sm font-black text-emerald-400 mt-1">
                          {selectedStudent.currentPlan ? `R$ ${selectedStudent.currentPlan.monthly_price}` : '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Register payment button */}
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full py-4 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Plus size={16} /> Registrar Pagamento
                  </button>

                  {/* Payment history */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Histórico de Pagamentos</h4>
                    {loadingPayments ? (
                      <div className="py-8 flex justify-center">
                        <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : payments.length === 0 ? (
                      <div className="py-10 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        Nenhum pagamento registrado ainda.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {payments.map(pay => {
                          const pBadge = statusBadge(pay.status);
                          return (
                            <div key={pay.id} className="p-4 rounded-2xl bg-card-dark border border-border-dark flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${pBadge.bg}`}>
                                  <Banknote size={16} className={pBadge.color} />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-white">{formatMonth(pay.reference_month)}</p>
                                  <p className="text-[9px] text-slate-500 font-bold">
                                    {pay.method ? pay.method.toUpperCase() : ''} {pay.payment_date ? `• ${formatDate(pay.payment_date)}` : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-emerald-400">R$ {pay.amount}</p>
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
              {detailTab === 'aulas' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest">Aulas Agendadas</h3>
                    <span className="text-[10px] font-black text-primary">{selectedStudent.enrollments.length} total</span>
                  </div>

                  {selectedStudent.enrollments.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <CalendarDays size={40} className="mx-auto text-slate-700" />
                      <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        Este aluno não tem aulas agendadas.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedStudent.enrollments.map(enrollment => {
                        const classDate = enrollment.class_start ? new Date(enrollment.class_start) : null;
                        const isPast = classDate ? classDate < new Date() : false;
                        const statusLabel = enrollment.status === 'attended' ? 'Presente' : enrollment.status === 'cancelled' ? 'Cancelada' : isPast ? 'Concluída' : 'Confirmada';
                        const statusColor = enrollment.status === 'attended' ? 'text-emerald-400' : enrollment.status === 'cancelled' ? 'text-red-400' : isPast ? 'text-slate-400' : 'text-indigo-400';

                        return (
                          <motion.div
                            key={enrollment.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-5 rounded-2xl border transition-all ${
                              isPast ? 'bg-card-dark/50 border-border-dark/50 opacity-60' : 'bg-card-dark border-border-dark'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-black text-white">{enrollment.class_title}</h4>
                              <span className={`text-[8px] font-black uppercase tracking-widest ${statusColor}`}>{statusLabel}</span>
                            </div>
                            <div className="flex items-center gap-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                              <span className="flex items-center gap-1">
                                <Calendar size={10} />
                                {classDate ? classDate.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {classDate ? classDate.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }) : '—'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Award size={10} className="text-primary" />
                                {enrollment.class_category}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
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
