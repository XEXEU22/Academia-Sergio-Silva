import React, { useState } from 'react';
import { supabase } from '../supabase';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen
} from '../icons';

const PremiumRegister: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          specialty,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoading(false);
      
      // Check if email confirmation is required (session will be null)
      if (data?.session) {
        if (confirm('Cadastro realizado com sucesso! Deseja que o sistema lembre seus dados de acesso?')) {
          localStorage.setItem('remembered_email', email);
        }
        navigate('/dashboard');
      } else {
        // More descriptive success for when email confirmation is ON
        alert('Cadastro realizado com sucesso! \n\nIMPORTANTE: Verifique seu e-mail para ativar sua conta. O acesso só será liberado após a confirmação no link enviado para ' + email + '.');
        navigate('/login');
      }
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-100 font-display selection:bg-primary selection:text-white relative">
      <div className="site-bg-overlay" />
      {/* Background Hero with Dynamic Blur */}
      <div className="fixed top-0 left-0 w-full h-[50vh] overflow-hidden pointer-events-none z-0">
         <motion.div 
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.3 }}
           transition={{ duration: 2, ease: "easeOut" }}
           className="w-full h-full bg-center bg-cover"
           style={{ backgroundImage: 'url("/background_site.png")' }}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent" />
         
         {/* Colorful Aura Glows */}
         <div className="absolute top-[-10%] right-[-14%] size-96 bg-primary/25 rounded-full blur-[140px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-primary/15 rounded-full blur-[140px] animate-pulse duration-[5s]" />
      </div>

      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Mestre em Ascensão</h2>
        <div className="size-10" />
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full max-w-sm mx-auto px-6 pt-16 pb-24 flex flex-col relative z-10"
      >
        <div className="mb-12">
          <motion.div variants={itemVariants} className="size-16 bg-primary/20 rounded-2xl border border-primary/30 flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/20">
             <Zap size={32} className="fill-current" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl font-black tracking-tighter leading-none mb-3 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
             Iniciação <br /> ao Combate
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-500 font-medium text-sm tracking-wide">
             Torne-se parte da elite. Inicie sua jornada hoje.
          </motion.p>
        </div>

        <motion.form 
          variants={itemVariants}
          className="space-y-5" 
          onSubmit={handleRegister}
        >
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Nome de Guerra</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">
                <User size={18} />
              </div>
              <input 
                className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark/50 pl-16 pr-6 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-bold placeholder:text-slate-700 backdrop-blur-sm"
                placeholder="Seu Nome Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Comunicação Principal</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark/50 pl-16 pr-6 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-bold placeholder:text-slate-700 backdrop-blur-sm"
                placeholder="seu-email@elite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Linha de Contato</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">
                <Phone size={18} />
              </div>
              <input 
                type="tel" 
                className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark/50 pl-16 pr-6 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-bold placeholder:text-slate-700 backdrop-blur-sm"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Caminho Desejado</label>
             <div className="relative">
               <select 
                 className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark pl-6 pr-10 focus:border-primary outline-none appearance-none text-sm font-bold tracking-tight text-white transition-all shadow-xl"
                 value={specialty}
                 onChange={(e) => setSpecialty(e.target.value)}
                 required
               >
                 <option disabled value="">Selecione uma modalidade</option>
                 <option value="karate">Karatê Do</option>
                 <option value="muay-thai">Muay Thai Elite</option>
                 <option value="kickboxing">Kickboxing Pro</option>
                 <option value="personal-defense">Defesa Pessoal</option>
                 <option value="wing-chun">Wing Chun Sifu</option>
               </select>
             </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Senha de Acesso</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full h-16 rounded-2xl border border-border-dark bg-card-dark/50 pl-16 pr-16 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-bold placeholder:text-slate-700 backdrop-blur-sm"
                placeholder="Crie sua Senha Forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'var(--primary)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-primary/30 mt-10 relative overflow-hidden group border border-primary/20 flex items-center justify-center"
            disabled={loading}
          >
             {loading ? (
               <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
             ) : (
               <>
                 <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 Criar Perfil
               </>
             )}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className="mt-16 text-center space-y-6">
          <div className="h-[1px] w-12 bg-white/10 mx-auto" />
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            Já possui um login ativo? 
            <button onClick={() => navigate('/login')} className="text-primary font-black hover:underline ml-2">Acessar Conta</button>
          </p>
        </motion.div>
      </motion.main>
      
      {/* Footer Support Info */}
      <footer className="w-full max-w-sm mx-auto px-6 py-12 flex justify-center opacity-40">
          <div className="flex items-center gap-2"><Award size={14} /><span className="text-[8px] font-black uppercase tracking-[0.3em]">Certificação Mundial</span></div>
      </footer>
    </div>
  );
};

export default PremiumRegister;
