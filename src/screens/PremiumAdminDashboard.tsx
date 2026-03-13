import React from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Video, 
  Users, 
  Settings, 
  Trash2, 
  Plus, 
  BarChart, 
  ShieldCheck,
  Zap,
  Star,
  Clock,
  ExternalLink,
  ChevronRight
} from '../icons';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';

const PremiumAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const adminActions = [
    { title: 'Vídeos', icon: Video, desc: 'Gerenciar galeria digital', path: '/upload-video', color: 'bg-indigo-500/10 text-indigo-400' },
    { title: 'Imagens', icon: ImageIcon, desc: 'Alterar fotos do site', path: '/admin/assets', color: 'bg-primary/10 text-primary' },
    { title: 'Alunos', icon: Users, desc: 'Lista de membros e graduação', color: 'bg-emerald-500/10 text-emerald-400' },
    { title: 'Relatórios', icon: Zap, desc: 'Estatísticas de uso', color: 'bg-amber-500/10 text-amber-400' },
    { title: 'Configurações', icon: Settings, desc: 'Ajustes do sistema', color: 'bg-slate-500/10 text-slate-400' },
  ];

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
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
        <section className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter">Olá, {profile?.full_name?.split(' ')[0] || 'Admin'}</h1>
          <p className="text-slate-500 text-sm font-medium">Gestão centralizada da Academia Sergio Silva.</p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
           {[
             { label: 'Novos Alunos', val: '+24', desc: 'Este mês' },
             { label: 'Acesso App', val: '1.2k', desc: 'Sessões hoje' }
           ].map((stat, i) => (
             <motion.div key={i} variants={itemVariants} className="p-6 rounded-3xl bg-card-dark border border-border-dark">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
               <h3 className="text-2xl font-black text-white">{stat.val}</h3>
               <p className="text-[10px] font-bold text-emerald-500 mt-1">{stat.desc}</p>
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
                  <h4 className="font-black text-white text-lg group-hover:text-primary transition-colors">{action.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{action.desc}</p>
                </div>
                <ChevronRight size={20} className="text-slate-800 group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Activity Log Overlay placeholder */}
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
