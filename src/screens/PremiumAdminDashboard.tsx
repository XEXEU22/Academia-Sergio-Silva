import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    Video, 
    Users, 
    Settings, 
    ShieldCheck,
    ExternalLink,
    ChevronRight,
    Image,
    CheckCircle2,
    Clock,
    AlertCircle,
    UserCheck,
    CalendarDays
} from '../icons';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

const PremiumAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, overdue: 0, videos: 0, classes: 0, enrollments: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoadingStats(true);
            const [studentsRes, videosRes, classesRes, enrollmentsRes] = await Promise.all([
                supabase.from('profiles').select('payment_status').eq('role', 'student'),
                supabase.from('videos').select('id', { count: 'exact', head: true }),
                supabase.from('classes').select('id', { count: 'exact', head: true }),
                supabase.from('enrollments').select('id', { count: 'exact', head: true }),
            ]);

            if (!studentsRes.error && studentsRes.data) {
                const data = studentsRes.data;
                setStats({
                    total: data.length,
                    paid: data.filter(s => s.payment_status === 'paid').length,
                    pending: data.filter(s => !s.payment_status || s.payment_status === 'pending').length,
                    overdue: data.filter(s => s.payment_status === 'overdue').length,
                    videos: videosRes.count || 0,
                    classes: classesRes.count || 0,
                    enrollments: enrollmentsRes.count || 0,
                });
            }
            setLoadingStats(false);
        }
        fetchStats();
    }, []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const adminActions = [
        { 
            title: 'Gestão de Alunos', 
            icon: Users, 
            desc: 'Matrículas, pagamentos e dados', 
            path: '/admin/students', 
            color: 'bg-emerald-500/10 text-emerald-400',
            badge: stats.overdue > 0 ? `${stats.overdue} atrasados` : null,
            badgeColor: 'bg-red-500/20 text-red-400'
        },
        { 
            title: 'Agenda de Aulas', 
            icon: CalendarDays, 
            desc: 'Criar e editar horários de treino', 
            path: '/admin/schedule', 
            color: 'bg-pink-500/10 text-pink-400',
            badge: stats.classes > 0 ? `${stats.classes} aulas` : null,
            badgeColor: 'bg-pink-500/20 text-pink-400'
        },
        { 
            title: 'Vídeos', 
            icon: Video, 
            desc: 'Gerenciar galeria digital', 
            path: '/upload-video', 
            color: 'bg-indigo-500/10 text-indigo-400',
            badge: stats.videos > 0 ? `${stats.videos} vídeos` : null,
            badgeColor: 'bg-indigo-500/20 text-indigo-400'
        },
        { 
            title: 'Imagens', 
            icon: Image, 
            desc: 'Alterar fotos do site', 
            path: '/admin/assets', 
            color: 'bg-primary/10 text-primary',
            badge: null,
            badgeColor: ''
        },
        { 
            title: 'Configurações', 
            icon: Settings, 
            desc: 'Ajustes do sistema', 
            path: '/settings', 
            color: 'bg-slate-500/10 text-slate-400',
            badge: null,
            badgeColor: ''
        },
    ];

    const statsConfig = [
        { label: 'Total Alunos', val: loadingStats ? '-' : stats.total, desc: 'Cadastrados', color: 'text-white', icon: Users },
        { label: 'Pgtos. OK', val: loadingStats ? '-' : stats.paid, desc: 'Este mês', color: 'text-emerald-400', icon: CheckCircle2 },
        { label: 'Pendentes', val: loadingStats ? '-' : stats.pending, desc: 'Aguardando', color: 'text-amber-400', icon: Clock },
        { label: 'Atrasados', val: loadingStats ? '-' : stats.overdue, desc: 'Atenção', color: 'text-red-400', icon: AlertCircle },
        { label: 'Aulas', val: loadingStats ? '-' : stats.classes, desc: 'Na agenda', color: 'text-pink-400', icon: CalendarDays },
        { label: 'Agendamentos', val: loadingStats ? '-' : stats.enrollments, desc: 'Confirmados', color: 'text-indigo-400', icon: UserCheck },
    ];

    return (
        <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
                <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Painel de Controle</h2>
                    <div className="flex items-center gap-1">
                        <ShieldCheck size={12} className="text-primary" />
                        <span className="text-[8px] font-black uppercase text-primary">Acesso Master</span>
                    </div>
                </div>
                <div className="size-10" />
            </header>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 overflow-y-auto pb-32 px-6 pt-10 space-y-10"
            >
                {/* Greeting */}
                <section className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter">Olá, {profile?.full_name?.split(' ')[0] || 'Admin'}</h1>
                    <p className="text-slate-500 text-sm font-medium">Gestão centralizada da Academia Sergio Silva.</p>
                </section>

                {/* Stats Grid - 6 cards */}
                <section className="grid grid-cols-2 gap-4">
                    {statsConfig.map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="p-5 rounded-3xl bg-card-dark border border-border-dark"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                <stat.icon size={14} className={stat.color} />
                            </div>
                            <h3 className={`text-2xl font-black ${stat.color}`}>{stat.val}</h3>
                            <p className="text-[10px] font-bold text-slate-600 mt-1">{stat.desc}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Admin Actions */}
                <section className="space-y-6">
                    <h3 className="text-lg font-bold tracking-tight">Ferramentas Rápidas</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {adminActions.map((action, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ x: 10 }}
                                onClick={() => action.path && navigate(action.path)}
                                className="group p-5 rounded-3xl bg-card-dark border border-border-dark hover:border-primary/30 transition-all cursor-pointer flex items-center gap-5"
                            >
                                <div className={`size-14 rounded-2xl ${action.color} flex items-center justify-center shrink-0`}>
                                    <action.icon size={28} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-black text-white text-lg group-hover:text-primary transition-colors">{action.title}</h4>
                                        {action.badge && (
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${action.badgeColor} border-current`}>
                                                {action.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{action.desc}</p>
                                </div>
                                <ChevronRight size={20} className="text-slate-800 group-hover:text-primary transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Roadmap Section */}
                <section className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <h4 className="text-xl font-black text-white">Próximos Passos</h4>
                        <p className="text-white/60 text-xs leading-relaxed italic">
                            "Em breve: Gestão de presença por QR Code e integração direta com o financeiro."
                        </p>
                        <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                            Ver Roadmap <ExternalLink size={14} />
                        </div>
                    </div>
                </section>
            </motion.main>

            <BottomNav />
        </div>
    );
};

export default PremiumAdminDashboard;
