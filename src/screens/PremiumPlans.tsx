import React, { useState } from 'react';
import { motion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles,
  Shield,
  Zap,
  Target,
  Trophy,
  Star
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';

interface PlanData {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  features: string[];
  is_active: boolean;
}

const PremiumPlans: React.FC = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  const [dbPlans, setDbPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });
      
      if (data) {
        setDbPlans(data);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  // Map dbPlans to the visual structure, adding icons and highlights based on price/order
  const getPlanVisuals = (plan: PlanData, index: number) => {
    // Determine visuals based on index (0: Essencial, 1: Elite/Popular, 2+: Master)
    const visuals = [
      { icon: Target, highlight: false, badge: null },
      { icon: Shield, highlight: true, badge: 'MAIS POPULAR' },
      { icon: Trophy, highlight: false, badge: null }
    ];
    return visuals[Math.min(index, 2)];
  };

  const plans = dbPlans.map((p, i) => {
    const visuals = getPlanVisuals(p, i);
    return {
      title: p.name,
      price: isAnnual ? p.annual_price : p.monthly_price,
      description: p.description,
      highlight: visuals.highlight,
      badge: visuals.badge,
      icon: visuals.icon,
      features: p.features || []
    };
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Header com Glassmorphism */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-bold tracking-widest uppercase">Investimento</h2>
        <button onClick={() => navigate('/notifications')} className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all hover:scale-105">
          <Bell size={20} />
        </button>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pb-32 pt-12 px-6"
      >
        <div className="text-center mb-12 space-y-4">
           <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} /> Transformação Real
           </motion.div>
           <motion.h2 variants={itemVariants} className="text-5xl font-black tracking-tighter leading-none mb-4 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
              Escolha seu Legado
           </motion.h2>
           <motion.p variants={itemVariants} className="text-slate-400 text-sm max-w-xs mx-auto">
              Selecione o plano que melhor se adapta ao seu objetivo e comece sua evolução hoje.
           </motion.p>
        </div>

        {/* Toggle Mensal/Anual */}
        <motion.div variants={itemVariants} className="flex items-center justify-center mb-16">
           <div className="bg-card-dark border border-border-dark p-1.5 rounded-[2rem] flex items-center gap-1 shadow-2xl">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${!isAnnual ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all relative ${isAnnual ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500'}`}
              >
                Anual
                {isAnnual && dbPlans.length > 0 && dbPlans[0].annual_price > 0 && (
                  <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-emerald-500 text-[8px] rounded-full text-white font-black animate-bounce shadow-lg shadow-emerald-500/20">
                    -{Math.round((1 - dbPlans[0].annual_price / dbPlans[0].monthly_price) * 100)}%
                  </span>
                )}
              </button>
           </div>
        </motion.div>

        {/* Plan Cards Slider/Stack */}
        <div className="space-y-12 mb-16">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : plans.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-border-dark rounded-[2rem]">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum plano disponível no momento.</p>
            </div>
          ) : (
            plans.map((plan, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className={`relative flex flex-col gap-8 rounded-[3rem] border p-8 transition-all overflow-hidden ${
                  plan.highlight 
                    ? 'border-primary/40 bg-card-dark shadow-[0_25px_60px_-15px_rgba(255,107,0,0.3)] ring-4 ring-primary/10' 
                    : 'border-border-dark bg-card-dark/50'
                }`}
              >
                {plan.highlight && plan.badge && (
                  <div className="absolute top-0 right-0 px-6 py-2 bg-primary rounded-bl-[2rem] text-[9px] uppercase tracking-[0.3em] font-black text-white shadow-xl">
                    {plan.badge}
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <div className={`size-14 rounded-3xl ${plan.highlight ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 text-slate-400'} flex items-center justify-center mb-4`}>
                     <plan.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{plan.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{plan.description}</p>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className={`text-5xl font-black ${plan.highlight ? 'text-primary' : 'text-white'}`}>R$ {plan.price}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">/ por mês</span>
                  </div>
                </div>

                <div className="space-y-5">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={plan.highlight ? 'text-primary' : 'text-slate-600'} size={20} />
                      <span className={`text-[11px] font-bold uppercase tracking-tight ${plan.highlight ? 'text-white' : 'text-white/60'}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/dashboard')}
                  className={`w-full py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl ${
                    plan.highlight 
                      ? 'bg-primary text-white shadow-primary/30 border border-primary/20' 
                      : 'bg-white text-background-dark shadow-white/5'
                  }`}
                >
                  Começar Treino
                </motion.button>
              </motion.div>
            ))
          )}
        </div>

        {/* Bottom Support Section */}
        <motion.section 
          variants={itemVariants}
          className="relative rounded-[2.5rem] bg-card-dark/30 border border-border-dark p-8 overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 mb-12"
        >
          <div className="absolute -left-20 -bottom-20 size-60 bg-primary/10 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-2">
            <h4 className="text-xl font-black tracking-tight">Precisa de Ajuda?</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">Nossos consultores estão online para tirar todas as suas dúvidas agora.</p>
          </div>
          <button className="relative z-10 flex items-center gap-3 px-8 py-4 bg-white/5 border border-border-dark rounded-2xl hover:bg-white/10 transition-all active:scale-95 group">
             <MessageSquare size={20} className="text-primary group-hover:scale-110 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Chat em Tempo Real</span>
          </button>
        </motion.section>
      </motion.main>
      
      <BottomNav />
    </div>
  );
};

export default PremiumPlans;
