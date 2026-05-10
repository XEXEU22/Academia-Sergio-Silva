import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  Sparkles, 
  Zap, 
  Target, 
  Trophy, 
  CheckCircle2,
  Trash2,
  Info
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const PremiumNotifications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) setNotifications(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'class_reminder': return Zap;
      case 'payment': return Trophy;
      case 'system': return CheckCircle2;
      default: return Info;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 border-b border-border-dark">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-border-dark transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Centro de Mensagens</h2>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
             <Bell size={20} />
          </div>
        </div>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-6 pt-10 pb-32 space-y-4"
      >
        <div className="flex justify-between items-center px-2 mb-8">
           <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-primary animate-pulse" />
              <h3 className="text-sm font-black uppercase tracking-widest">Recentes</h3>
           </div>
           {notifications.length > 0 && (
             <button onClick={() => setNotifications([])} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">Limpar Tudo</button>
           )}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <Bell size={40} className="mx-auto text-slate-800" />
             <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Nenhuma notificação por enquanto.</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif) => {
              const Icon = getIcon(notif.type);
              return (
                <motion.div 
                  key={notif.id} 
                  variants={itemVariants}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => markAsRead(notif.id)}
                  className={`group relative flex gap-5 p-6 rounded-[2rem] border transition-all ${!notif.is_read ? 'bg-card-dark/80 border-primary/20 shadow-xl shadow-primary/5' : 'bg-card-dark border-border-dark opacity-60'}`}
                >
                  {!notif.is_read && <div className="absolute top-4 right-4 size-2 bg-primary rounded-full animate-ping" />}
                  
                  <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${!notif.is_read ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                     <Icon size={26} />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                     <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{notif.type.replace('_', ' ')}</span>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                          {new Date(notif.created_at).toLocaleDateString('pt-BR')}
                        </span>
                     </div>
                     <h4 className="text-base font-black text-white tracking-tight leading-tight">{notif.title}</h4>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{notif.message}</p>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                    className="absolute bottom-4 right-4 p-2 text-slate-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.main>
      
      <BottomNav />
    </div>
  );
};

export default PremiumNotifications;
