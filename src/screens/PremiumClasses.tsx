import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  User,
  Calendar as CalendarIcon,
  RefreshCw,
  Award,
  CheckCircle2,
  Zap,
  Star,
  Plus,
  X,
  Clock as ClockIcon,
  MessageSquare
} from '../icons';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const PremiumClasses: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [classesByDay, setClassesByDay] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  
  // Booking Modal State
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Custom Booking State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [customModality, setCustomModality] = useState('Wing Chun');

  useEffect(() => {
    fetchData();
    // Check for request intent from Dashboard
    const params = new URLSearchParams(window.location.search);
    if (params.get('request') === 'true') {
      setIsCustomModalOpen(true);
    }
  }, []);


  const handleBookClass = async (cls: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setBookingLoading(true);
    try {
      // 1. Create Enrollment
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          class_id: cls.id,
          status: 'confirmed'
        });

      if (enrollError) {
        if (enrollError.code === '23505') {
          alert('Você já está inscrito nesta aula!');
        } else {
          throw enrollError;
        }
      } else {
        // 2. Send Notification to Master
        const { data: admins } = await supabase
          .from('profiles')
          .select('id')
          .in('role', ['admin', 'instructor']);

        if (admins && admins.length > 0) {
          const notifications = admins.map(admin => ({
            user_id: admin.id,
            title: 'Novo Aluno Confirmado',
            message: `${profile?.full_name || 'Um aluno'} confirmou presença na aula de ${cls.title} dia ${new Date(cls.start_time).toLocaleDateString('pt-BR')}.`,
            type: 'system'
          }));

          await supabase.from('notifications').insert(notifications);
        }

        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setSelectedClass(null);
          fetchData();
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro ao agendar: ' + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCustomBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!customDate || !customTime) {
      alert('Por favor, selecione a data e o horário.');
      return;
    }

    setBookingLoading(true);
    try {
      // Send Notification to Master for Special Request
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .in('role', ['admin', 'instructor']);

      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          title: 'Solicitação de Horário Especial',
          message: `${profile?.full_name || 'Um aluno'} solicitou um treino de ${customModality} para o dia ${customDate} às ${customTime}.`,
          type: 'system'
        }));

        await supabase.from('notifications').insert(notifications);
      }

      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setIsCustomModalOpen(false);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      alert('Erro ao enviar solicitação.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      {/* Header / Banner */}
      <header className="relative h-64 shrink-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000&auto=format&fit=crop" 
             className="w-full h-full object-cover opacity-40 grayscale"
             alt="Treino"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
        </div>

        <div className="relative z-10 p-6 pt-12 h-full flex flex-col justify-between">
           <div className="flex items-center justify-between">
              <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={fetchData} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all text-primary">
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
           </div>

           <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-black uppercase tracking-[0.2em] text-primary">Cronograma Elite</div>
                 <button 
                  onClick={() => setIsCustomModalOpen(true)}
                  className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5"
                 >
                   <Plus size={10} /> Solicitar Data
                 </button>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white leading-none">Grade de <br/><span className="text-primary italic">Aulas</span></h1>
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-40 -mt-8 relative z-20">
        
        {/* My Confirmed Banner */}
        {user && myEnrollments.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4 px-2">
               <Star size={16} className="text-primary fill-current" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Suas Próximas Aulas</h3>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
              {myEnrollments.map((enroll, idx) => {
                const cls = enroll.classes;
                const date = new Date(cls.start_time);
                return (
                  <motion.div
                    key={enroll.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="shrink-0 w-80 p-6 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-dark border border-white/20 shadow-2xl shadow-primary/30 relative overflow-hidden group"
                  >
                    <div className="absolute -right-4 -top-4 size-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                    
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                         <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20">
                            <Zap size={20} className="text-white fill-current" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-none mb-1">
                              {date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                            </p>
                            <p className="text-lg font-black text-white leading-none">
                              {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </div>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-white/20 px-3 py-1.5 rounded-xl text-white border border-white/10">
                        {cls.category}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-white mb-6 relative z-10">{cls.title}</h4>
                    
                    <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-white/60" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">{cls.profiles?.full_name || 'Mestre Sérgio'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-[8px] font-black text-green-300 uppercase">
                         Confirmado
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Full Schedule List Grouped by Day */}
        <section className="space-y-12">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-primary">
              <RefreshCw size={32} className="animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Mapeando Grade...</span>
            </div>
          ) : Object.keys(classesByDay).length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-card-dark rounded-[3rem] border border-border-dark p-10">
               <CalendarIcon size={48} className="mx-auto text-slate-700" />
               <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Nenhuma aula programada.</p>
            </div>
          ) : (
            Object.entries(classesByDay).map(([day, dayClasses], dayIdx) => (
              <div key={day} className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                   <div className="h-px flex-1 bg-border-dark" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary whitespace-nowrap">
                     {day}
                   </h3>
                   <div className="h-px flex-1 bg-border-dark" />
                </div>

                <div className="grid gap-4">
                  {dayClasses.map((cls, idx) => {
                    const start = new Date(cls.start_time);
                    const end = new Date(start.getTime() + cls.duration_minutes * 60000);
                    return (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (dayIdx * 0.1) + (idx * 0.05) }}
                        onClick={() => setSelectedClass(cls)}
                        className="p-6 rounded-[2.5rem] bg-card-dark border border-border-dark hover:border-primary/40 transition-all flex items-center justify-between group cursor-pointer active:scale-95"
                      >
                      >
                         <div className="flex items-center gap-5">
                            <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-background-dark border border-border-dark min-w-[70px] group-hover:border-primary/30 transition-colors">
                               <span className="text-lg font-black text-white leading-none">
                                 {start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                               </span>
                               <span className="text-[8px] font-bold text-slate-600 mt-1 uppercase">Início</span>
                            </div>

                            <div>
                               <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                                    {cls.category}
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic">{cls.level}</span>
                               </div>
                               <h4 className="text-lg font-black text-white tracking-tight">{cls.title}</h4>
                               <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-1">
                                  <User size={12} className="text-primary" /> Prof. {cls.profiles?.full_name || 'Mestre Sérgio'}
                               </p>
                            </div>
                         </div>

                         <div className="text-right">
                            <div className="text-[10px] font-black text-white/50">{cls.duration_minutes}m</div>
                            <Award size={18} className="text-slate-700 mt-2 ml-auto group-hover:text-primary transition-colors" />
                         </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <BottomNav />

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedClass && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClass(null)}
              className="absolute inset-0 bg-background-dark/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-sm bg-card-dark border border-border-dark rounded-[3rem] p-8 shadow-2xl"
            >
              <div className="size-16 rounded-3xl bg-primary/20 border border-primary/30 text-primary flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              
              <h3 className="text-2xl font-black mb-2">Confirmar Agendamento</h3>
              <p className="text-slate-400 text-sm mb-8">Deseja confirmar sua presença na aula de <span className="text-white font-bold">{selectedClass.title}</span>?</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <CalendarIcon size={18} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">{new Date(selectedClass.start_time).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <ClockIcon size={18} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">{new Date(selectedClass.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="w-full py-5 rounded-[1.5rem] bg-emerald-500 text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[11px]">
                  <CheckCircle2 size={20} /> Agendado!
                </div>
              ) : (
                <div className="flex gap-4">
                  <button onClick={() => setSelectedClass(null)} className="flex-1 py-5 rounded-[1.5rem] bg-white/5 text-[10px] font-black uppercase tracking-widest">Cancelar</button>
                  <button 
                    onClick={() => handleBookClass(selectedClass)}
                    disabled={bookingLoading}
                    className="flex-1 py-5 rounded-[1.5rem] bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 disabled:opacity-50"
                  >
                    {bookingLoading ? 'Processando...' : 'Confirmar'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {isCustomModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomModalOpen(false)}
              className="absolute inset-0 bg-background-dark/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-sm bg-card-dark border border-border-dark rounded-[3rem] p-8 shadow-2xl"
            >
              <button onClick={() => setIsCustomModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5">
                <X size={18} />
              </button>

              <div className="size-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mb-6">
                <ClockIcon size={32} />
              </div>
              
              <h3 className="text-2xl font-black mb-2">Solicitar Horário</h3>
              <p className="text-slate-400 text-sm mb-8">Selecione o dia e horário que você gostaria de treinar.</p>
              
              <div className="space-y-4 mb-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Data</label>
                  <input 
                    type="date" 
                    value={customDate}
                    onChange={e => setCustomDate(e.target.value)}
                    className="w-full bg-background-dark border border-border-dark rounded-2xl p-4 text-sm font-bold text-white focus:border-primary/50 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Horário</label>
                  <input 
                    type="time" 
                    value={customTime}
                    onChange={e => setCustomTime(e.target.value)}
                    className="w-full bg-background-dark border border-border-dark rounded-2xl p-4 text-sm font-bold text-white focus:border-primary/50 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Modalidade</label>
                  <select 
                    value={customModality}
                    onChange={e => setCustomModality(e.target.value)}
                    className="w-full bg-background-dark border border-border-dark rounded-2xl p-4 text-sm font-bold text-white focus:border-primary/50 outline-none appearance-none"
                  >
                    <option value="Wing Chun">Wing Chun</option>
                    <option value="Kickboxing">Kickboxing</option>
                    <option value="Defesa Pessoal">Defesa Pessoal</option>
                  </select>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="w-full py-5 rounded-[1.5rem] bg-emerald-500 text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[11px]">
                  <MessageSquare size={20} /> Solicitação Enviada!
                </div>
              ) : (
                <button 
                  onClick={handleCustomBooking}
                  disabled={bookingLoading}
                  className="w-full py-5 rounded-[1.5rem] bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 disabled:opacity-50"
                >
                  {bookingLoading ? 'Enviando...' : 'Solicitar Agendamento'}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumClasses;
