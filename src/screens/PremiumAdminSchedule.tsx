import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Users, 
  Trash2, 
  Edit3, 
  Plus, 
  X, 
  Save,
  User
} from '../icons';
import BottomNav from '../components/BottomNav';

export default function PremiumAdminSchedule() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [editingClass, setEditingClass] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Busca instrutores
      const { data: instData, error: errInst } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .in('role', ['instructor', 'admin']);
      if (errInst) throw errInst;
      
      setInstructors(instData || []);

      // Busca aulas c/ detalhes do instrutor
      const { data: clsData, error: errCls } = await supabase
        .from('classes')
        .select(`
          *,
          profiles:instructor_id (full_name)
        `)
        .order('start_time', { ascending: true });
      if (errCls) throw errCls;
      
      setClasses(clsData || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (cls: any) => {
    // format date for datetime-local input
    let formattedDate = '';
    if (cls.start_time) {
       const d = new Date(cls.start_time);
       d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
       formattedDate = d.toISOString().slice(0, 16);
    }

    setEditingClass({
       ...cls,
       start_time_local: formattedDate
    });
    setIsNew(false);
  };

  const handleOpenNew = () => {
    setEditingClass({
      title: '',
      instructor_id: instructors.length > 0 ? instructors[0].id : '',
      category: 'Jiu-Jitsu',
      level: 'Iniciante',
      start_time_local: '',
      duration_minutes: 60,
      max_spots: 20,
      status: 'available'
    });
    setIsNew(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar esta aula?')) return;
    try {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      console.error('Error deleting class:', err);
      alert('Erro ao apagar. Esta aula pode ter reservas (matriculas) associadas.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    setSaving(true);
    try {
      // Convert back start_time_local to ISO string for DB
      const startTimeISO = new Date(editingClass.start_time_local).toISOString();

      const payload = {
        title: editingClass.title,
        instructor_id: editingClass.instructor_id,
        category: editingClass.category,
        level: editingClass.level,
        start_time: startTimeISO,
        duration_minutes: parseInt(editingClass.duration_minutes),
        max_spots: parseInt(editingClass.max_spots),
        status: editingClass.status
      };

      if (isNew) {
        const { error } = await supabase.from('classes').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('classes').update(payload).eq('id', editingClass.id);
        if (error) throw error;
      }

      await fetchData();
      setEditingClass(null);
    } catch (err) {
      console.error('Erro ao salvar aula:', err);
      alert('Erro ao salvar os dados. Verifique todos os campos.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Gestão Admin</h2>
          <span className="text-[8px] font-black uppercase text-pink-500">Agenda de Aulas</span>
        </div>
        <button onClick={handleOpenNew} className="p-2.5 rounded-xl bg-pink-500 text-white shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
          <Plus size={20} />
        </button>
      </header>

      <main className="flex-1 px-6 pt-10 pb-32">
        <div className="mb-8">
           <h1 className="text-3xl font-black">Agenda e Horários</h1>
           <p className="text-slate-500 text-sm mt-1">Configure os horários e modalidades.</p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-pink-500 text-xs font-black uppercase tracking-widest">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
            Buscando Horários...
          </div>
        ) : classes.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center text-slate-500 border border-dashed border-border-dark rounded-3xl p-6">
             <Calendar size={32} className="mb-3 opacity-50"/>
             <span className="text-sm font-bold uppercase tracking-widest">Nenhuma aula.</span>
             <span className="text-xs">Clique no "+" para criar a primeira.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map(cls => {
               const dateObj = new Date(cls.start_time);
               const dayStr = dateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
               const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

               return (
                <motion.div 
                  key={cls.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-[2rem] bg-card-dark border border-border-dark hover:border-pink-500/30 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2 inline-block">
                        {cls.category} - {cls.level}
                      </span>
                      <h3 className="text-lg font-black text-white leading-tight">{cls.title}</h3>
                      <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1">
                         <User size={12} className="text-pink-500" /> Prof. {cls.profiles?.full_name || 'Alocado'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenEdit(cls)} className="p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(cls.id)} className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2 bg-background-dark/50 p-3 rounded-2xl">
                     <span className="flex items-center gap-1.5"><Calendar size={14} className="text-pink-400"/> {dayStr}</span>
                     <span className="flex items-center gap-1.5"><Clock size={14} className="text-pink-400"/> {timeStr}</span>
                     <span className="flex items-center gap-1.5 ml-auto"><Users size={14} className="text-white"/> {cls.max_spots} Vagas</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL DE EDIÇÃO / CRIAÇÃO */}
      <AnimatePresence>
        {editingClass && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl flex flex-col p-6"
          >
            <div className="flex items-center justify-between mt-4 mb-8">
               <h2 className="text-xl font-black tracking-widest uppercase">{isNew ? 'Nova Aula' : 'Editar Aula'}</h2>
               <button onClick={() => setEditingClass(null)} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                 <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-6 pb-20 no-scrollbar">
               
               <label className="block">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Título da Aula</span>
                  <input 
                    type="text" 
                    required
                    value={editingClass.title}
                    onChange={e => setEditingClass({...editingClass, title: e.target.value})}
                    placeholder="Ex: Treino de Competição"
                    className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-pink-500"
                  />
               </label>

               <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Categoria</span>
                    <select 
                      value={editingClass.category}
                      onChange={e => setEditingClass({...editingClass, category: e.target.value})}
                      className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-pink-500 appearance-none"
                    >
                       <option value="Jiu-Jitsu">Jiu-Jitsu</option>
                       <option value="Muay Thai">Muay Thai</option>
                       <option value="No-Gi">No-Gi</option>
                       <option value="Judo">Judo</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Nível</span>
                    <select 
                      value={editingClass.level}
                      onChange={e => setEditingClass({...editingClass, level: e.target.value})}
                      className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-pink-500 appearance-none"
                    >
                       <option value="Iniciante">Iniciante</option>
                       <option value="Intermediário">Intermediário</option>
                       <option value="Avançado">Avançado</option>
                       <option value="Todos os Níveis">Todos os Níveis</option>
                       <option value="Kids">Kids</option>
                    </select>
                  </label>
               </div>

               <label className="block">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block flex items-center gap-1"><User size={10}/> Instrutor</span>
                  <select 
                    required
                    value={editingClass.instructor_id || ''}
                    onChange={e => setEditingClass({...editingClass, instructor_id: e.target.value})}
                    className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-pink-500 appearance-none"
                  >
                     <option value="" disabled>Selecione um instrutor</option>
                     {instructors.map(inst => (
                        <option key={inst.id} value={inst.id}>{inst.full_name || 'Sem Nome'} ({inst.role})</option>
                     ))}
                  </select>
               </label>

               <div className="grid grid-cols-2 gap-4">
                  <label className="block col-span-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block flex items-center gap-1"><Calendar size={10}/> Data e Hora de Início</span>
                    <input 
                      type="datetime-local" 
                      required
                      value={editingClass.start_time_local}
                      onChange={e => setEditingClass({...editingClass, start_time_local: e.target.value})}
                      className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-pink-500"
                      style={{ colorScheme: 'dark' }}
                    />
                  </label>
                  
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Duração (min)</span>
                     <input 
                        type="number" 
                        required
                        min="15"
                        value={editingClass.duration_minutes}
                        onChange={e => setEditingClass({...editingClass, duration_minutes: e.target.value})}
                        className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-pink-500"
                     />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Vagas</span>
                     <input 
                        type="number" 
                        required
                        min="1"
                        value={editingClass.max_spots}
                        onChange={e => setEditingClass({...editingClass, max_spots: e.target.value})}
                        className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-pink-500"
                     />
                  </label>
               </div>

               <label className="block">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Status</span>
                  <select 
                    required
                    value={editingClass.status}
                    onChange={e => setEditingClass({...editingClass, status: e.target.value})}
                    className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-pink-500 appearance-none"
                  >
                     <option value="available">Disponível</option>
                     <option value="full">Lotada / Esgotada</option>
                     <option value="cancelled">Cancelada (Aviso vermelho)</option>
                  </select>
               </label>

               <div className="pt-8 mb-safe">
                 <button 
                   type="submit"
                   disabled={saving}
                   className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-colors ${
                     saving ? 'bg-pink-500/50 text-white/50 cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600 shadow-xl shadow-pink-500/20'
                   }`}
                 >
                   {saving ? (
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   ) : (
                     <>
                       <Save size={18} /> Salvar Aula
                     </>
                   )}
                 </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
