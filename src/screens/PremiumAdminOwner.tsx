import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  Users, 
  DollarSign, 
  CalendarDays, 
  Bell, 
  ChevronLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Wallet,
  ShieldCheck,
  Award,
  Calendar,
  Image as ImageIcon,
  Save
} from '../icons';

/* ────────────────────────────────────────────────────────────────────────── */
/*  Types                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */
interface OwnerData {
  students: any[];
  enrollments: any[];
  notifications: any[];
  stats: {
    totalStudents: number;
    paidThisMonth: number;
    pendingPayments: number;
    reservationsToday: number;
  };
}

const PremiumAdminOwner: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'reservations' | 'notifications' | 'photo'>('students');
  const [data, setData] = useState<OwnerData>({
    students: [],
    enrollments: [],
    notifications: [],
    stats: {
      totalStudents: 0,
      paidThisMonth: 0,
      pendingPayments: 0,
      reservationsToday: 0
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  // Master Photo
  const [masterPhoto, setMasterPhoto] = useState('');
  const [masterPhotoInput, setMasterPhotoInput] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoMsg, setPhotoMsg] = useState<{ok: boolean; text: string} | null>(null);

  useEffect(() => {
    fetchDashboardData();
    fetchMasterPhoto();
  }, []);

  const fetchMasterPhoto = async () => {
    const { data } = await supabase.from('site_assets').select('url').eq('asset_key', 'master_photo').single();
    if (data?.url) { setMasterPhoto(data.url); setMasterPhotoInput(data.url); }
  };

  const handleSavePhoto = async () => {
    if (!masterPhotoInput.trim()) return;
    setSavingPhoto(true);
    const { data: existing } = await supabase.from('site_assets').select('id').eq('asset_key', 'master_photo').single();
    let error;
    if (existing) {
      ({ error } = await supabase.from('site_assets').update({ url: masterPhotoInput }).eq('asset_key', 'master_photo'));
    } else {
      ({ error } = await supabase.from('site_assets').insert({ asset_key: 'master_photo', url: masterPhotoInput, description: 'Foto do Mestre na aba Mestre' }));
    }
    if (error) {
      setPhotoMsg({ ok: false, text: 'Erro ao salvar: ' + error.message });
    } else {
      setMasterPhoto(masterPhotoInput);
      setPhotoMsg({ ok: true, text: 'Foto atualizada com sucesso!' });
    }
    setSavingPhoto(false);
    setTimeout(() => setPhotoMsg(null), 3000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Students
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('full_name', { ascending: true });

      if (pError) throw pError;

      // 2. Fetch Enrollments (Reservations)
      const { data: enrollments, error: eError } = await supabase
        .from('enrollments')
        .select(`
          id, status, created_at,
          user:user_id (full_name, avatar_url),
          class:class_id (title, start_time, category)
        `)
        .order('created_at', { ascending: false });

      if (eError) throw eError;

      // 3. Fetch Notifications
      const { data: notifications, error: nError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (nError) throw nError;

      // Calculate Stats
      const total = profiles.length;
      const paid = profiles.filter(s => s.payment_status === 'paid').length;
      const pending = profiles.filter(s => s.payment_status === 'pending' || !s.payment_status).length;
      const overdue = profiles.filter(s => s.payment_status === 'overdue').length;

      // Filter reservations for "today" (simplified)
      const today = new Date().toISOString().split('T')[0];
      const todayRes = enrollments.filter((e: any) => e.class?.start_time?.startsWith(today)).length;

      setData({
        students: profiles,
        enrollments,
        notifications,
        stats: {
          totalStudents: total,
          paidThisMonth: paid,
          pendingPayments: pending + overdue,
          reservationsToday: todayRes
        }
      });
    } catch (error) {
      console.error('Error fetching owner dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = data.students.filter(s => {
    const matchesSearch = (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = paymentFilter === 'all' || s.payment_status === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'paid': return <CheckCircle2 size={14} className="text-emerald-400" />;
      case 'overdue': return <AlertCircle size={14} className="text-red-400" />;
      default: return <Clock size={14} className="text-amber-400" />;
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'overdue': return 'Atrasado';
      default: return 'Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-display flex flex-col">
      {/* Premium Static Header */}
      <header className="px-6 py-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Painel do Dono</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck size={12} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Acesso Restrito · Arte de Lutar</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={fetchDashboardData}
          className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-10 pb-32">
        {/* Quick Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
          {[
            { label: 'Alunos Ativos', val: data.stats.totalStudents, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Pagos (Mês)', val: data.stats.paidThisMonth, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Pendentes', val: data.stats.pendingPayments, icon: Wallet, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Reservas Hoje', val: data.stats.reservationsToday, icon: Calendar, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                <stat.icon size={48} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className={`text-3xl font-black ${stat.color}`}>{stat.val}</h3>
                <TrendingUp size={14} className="text-slate-700" />
              </div>
            </motion.div>
          ))}
        </section>

        {/* Navigation Tabs - Modern & Focused */}
        <div className="flex p-1.5 bg-white/5 rounded-[2rem] border border-white/10 overflow-x-auto">
          {[
            { id: 'students', label: 'Alunos', icon: Users },
            { id: 'reservations', label: 'Reservas', icon: CalendarDays },
            { id: 'notifications', label: 'Avisos', icon: Bell },
            { id: 'photo', label: 'Foto', icon: ImageIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                activeTab === tab.id 
                ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                : 'text-slate-500 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'students' && (
            <motion.section
              key="students"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <button 
                  onClick={() => setPaymentFilter(curr => curr === 'all' ? 'paid' : curr === 'paid' ? 'pending' : 'all')}
                  className={`p-4 rounded-[1.8rem] border transition-all ${
                    paymentFilter !== 'all' ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <Filter size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, i) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-5 rounded-[2.2rem] bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 overflow-hidden">
                          {student.avatar_url ? (
                            <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-black text-primary">{(student.full_name || 'U')[0]}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{student.full_name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                              <Award size={10} className="text-amber-500" /> {student.belt_level || 'Branca'}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
                              student.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {getStatusIcon(student.payment_status)}
                              {getStatusLabel(student.payment_status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/admin/students')}
                        className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-600 italic text-sm">
                    Nenhum aluno encontrado.
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {activeTab === 'reservations' && (
            <motion.section
              key="reservations"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {data.enrollments.length > 0 ? (
                  data.enrollments.map((enrollment: any, i) => (
                    <div 
                      key={enrollment.id}
                      className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <CalendarDays size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white">{enrollment.class?.title}</h4>
                            <p className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">{enrollment.class?.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-white">
                            {new Date(enrollment.class?.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                            {new Date(enrollment.class?.start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-white/10 overflow-hidden">
                          {enrollment.user?.avatar_url ? (
                            <img src={enrollment.user.avatar_url} alt="" className="w-full h-full object-cover opacity-70" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-400">
                              {(enrollment.user?.full_name || 'U')[0]}
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-400">
                          <span className="text-white font-bold">{enrollment.user?.full_name}</span> reservou esta aula
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-600 italic text-sm">
                    Nenhuma reserva encontrada.
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {activeTab === 'notifications' && (
            <motion.section
              key="notifications"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {data.notifications.length > 0 ? (
                data.notifications.map((notif, i) => (
                  <div 
                    key={notif.id}
                    className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 flex gap-4 items-start"
                  >
                    <div className={`p-3 rounded-2xl bg-white/5 ${
                      notif.type === 'payment' ? 'text-emerald-400' : 'text-primary'
                    }`}>
                      <Bell size={18} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{notif.title}</h4>
                        <span className="text-[9px] font-medium text-slate-600 italic">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-slate-600 italic text-sm">
                  Nenhum aviso ou notificação.
                </div>
              )}
            </motion.section>
          )}
          {activeTab === 'photo' && (
            <motion.section
              key="photo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-base font-black text-white">Foto do Mestre</h3>
                <p className="text-xs text-slate-500">Esta imagem aparece na aba <span className="text-primary font-bold">Mestre</span> para todos os alunos.</p>
              </div>

              {/* Preview */}
              {masterPhoto && (
                <div className="relative size-36 mx-auto">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[30px] animate-pulse" />
                  <div className="relative size-36 rounded-full border-4 border-primary overflow-hidden">
                    <img src={masterPhoto} alt="Mestre" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Input URL */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">URL da Nova Foto</label>
                <input
                  type="text"
                  value={masterPhotoInput}
                  onChange={e => setMasterPhotoInput(e.target.value)}
                  placeholder="https://exemplo.com/foto-mestre.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 px-5 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
                <p className="text-[9px] text-slate-600">Cole o link de uma imagem pública (Google Drive, Imgur, etc.)</p>
              </div>

              {/* Feedback */}
              {photoMsg && (
                <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  photoMsg.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  {photoMsg.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {photoMsg.text}
                </div>
              )}

              <button
                onClick={handleSavePhoto}
                disabled={savingPhoto || !masterPhotoInput.trim()}
                className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
                  savingPhoto || !masterPhotoInput.trim()
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                    : 'bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/40'
                }`}
              >
                {savingPhoto ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                {savingPhoto ? 'Salvando...' : 'Salvar Foto'}
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Floating Action Button - Clean exit */}
      <div className="fixed bottom-10 left-6 right-6 z-[60]">
        <button 
          onClick={() => navigate('/')}
          className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-slate-900 to-black border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl flex items-center justify-center gap-3 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Sair do Modo Admin
        </button>
      </div>
    </div>
  );
};

export default PremiumAdminOwner;
