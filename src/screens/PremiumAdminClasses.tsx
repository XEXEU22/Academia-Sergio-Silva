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
  User,
  Search,
  Bell,
  CheckCircle2
} from '../icons';
import BottomNav from '../components/BottomNav';

export default function PremiumAdminClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State for Class Editing
  const [editingClass, setEditingClass] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Modal State for Student Management
  const [managingStudentsFor, setManagingStudentsFor] = useState<any | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);

  useEffect(() => {
    fetchData();
    fetchAllStudents();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: instData } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .in('role', ['instructor', 'admin']);
      setInstructors(instData || []);

      const { data: clsData } = await supabase
        .from('classes')
        .select('*, profiles:instructor_id (full_name)')
        .order('start_time', { ascending: true });
      setClasses(clsData || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name, email').eq('role', 'student');
    setAllStudents(data || []);
  };

  const fetchEnrollments = async (classId: string) => {
    const { data } = await supabase
      .from('enrollments')
      .select('*, profiles:user_id (id, full_name)')
      .eq('class_id', classId)
      .eq('status', 'confirmed');
    setEnrollments(data || []);
  };

  const handleOpenEdit = (cls: any) => {
    let formattedDate = '';
    if (cls.start_time) {
       const d = new Date(cls.start_time);
       d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
       formattedDate = d.toISOString().slice(0, 16);
    }
    setEditingClass({ ...cls, start_time_local: formattedDate });
    setIsNew(false);
  };

  const handleOpenNew = () => {
    setEditingClass({
      title: '',
      instructor_id: instructors.length > 0 ? instructors[0].id : '',
      category: 'Jiu-Jitsu',
      level: 'Todos os Níveis',
      start_time_local: '',
      duration_minutes: 60,
      max_spots: 20,
      status: 'available'
    });
    setIsNew(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar esta aula?')) return;
    const { error } = await supabase.from('classes').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    setSaving(true);
    try {
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
        await supabase.from('classes').insert(payload);
      } else {
        await supabase.from('classes').update(payload).eq('id', editingClass.id);
      }
      fetchData();
      setEditingClass(null);
    } catch (err) {
      console.error('Erro ao salvar aula:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleManageStudents = (cls: any) => {
    setManagingStudentsFor(cls);
    fetchEnrollments(cls.id);
  };

  const handleAddStudent = async (student: any) => {
    if (!managingStudentsFor) return;
    setAddingStudent(true);
    try {
      // 1. Add to enrollments
      const { error } = await supabase.from('enrollments').insert({
        user_id: student.id,
        class_id: managingStudentsFor.id,
        status: 'confirmed'
      });

      if (!error) {
        // 2. Send Notification
        const start = new Date(managingStudentsFor.start_time);
        const dateStr = start.toLocaleDateString('pt-BR');
        const timeStr = start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        await supabase.from('notifications').insert({
          user_id: student.id,
          title: 'Novo Treino Agendado',
          message: `O Mestre Sérgio adicionou você na aula de ${managingStudentsFor.title} para o dia ${dateStr} às ${timeStr}.`,
          type: 'class_reminder'
        });

        fetchEnrollments(managingStudentsFor.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingStudent(false);
    }
  };

  const handleRemoveStudent = async (enrollId: string) => {
    await supabase.from('enrollments').delete().eq('id', enrollId);
    if (managingStudentsFor) fetchEnrollments(managingStudentsFor.id);
  };

  const filteredSearchStudents = allStudents.filter(s => 
    s.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) &&
    !enrollments.some(e => e.user_id === s.id)
  );

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Gestão Admin</h2>
          <span className="text-[8px] font-black uppercase text-primary">Grade de Aulas</span>
        </div>
        <button onClick={handleOpenNew} className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 active:scale-95 transition-all">
          <Plus size={20} />
        </button>
      </header>

      <main className="flex-1 px-6 pt-10 pb-32">
        <div className="mb-8">
           <h1 className="text-3xl font-black">Aulas e Horários</h1>
           <p className="text-slate-500 text-sm mt-1">Gerencie a grade e os alunos presentes.</p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary text-xs font-black uppercase tracking-widest">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            Buscando Aulas...
          </div>
        ) : classes.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center text-slate-500 border border-dashed border-border-dark rounded-3xl p-6">
             <Calendar size={32} className="mb-3 opacity-50"/>
             <span className="text-sm font-bold uppercase tracking-widest">Nenhuma aula.</span>
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
                  className="p-5 rounded-[2rem] bg-card-dark border border-border-dark hover:border-primary/30 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2 inline-block">
                        {cls.category} - {cls.level}
                      </span>
                      <h3 className="text-lg font-black text-white leading-tight">{cls.title}</h3>
                      <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1">
                         <User size={12} className="text-primary" /> {cls.profiles?.full_name || 'Mestre Sérgio'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleManageStudents(cls)} className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/20">
                        <Users size={18} />
                      </button>
                      <button onClick={() => handleOpenEdit(cls)} className="p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(cls.id)} className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2 bg-background-dark/50 p-3 rounded-2xl">
                     <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary"/> {dayStr}</span>
                     <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary"/> {timeStr}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL GESTÃO DE ALUNOS */}
      <AnimatePresence>
        {managingStudentsFor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-background-dark/98 backdrop-blur-2xl flex flex-col p-6"
          >
            <div className="flex items-center justify-between mt-4 mb-8">
               <div>
                  <h2 className="text-xl font-black tracking-widest uppercase">Participantes</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{managingStudentsFor.title}</p>
               </div>
               <button onClick={() => setManagingStudentsFor(null)} className="p-2 rounded-full bg-white/10 text-white">
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
               {/* Search to Add */}
               <div className="relative">
                  <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar aluno para adicionar..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="w-full bg-card-dark border border-border-dark py-4 pl-12 pr-5 rounded-2xl text-xs text-white focus:outline-none focus:border-primary"
                  />
                  {studentSearch && filteredSearchStudents.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card-dark border border-border-dark rounded-2xl shadow-2xl z-20 max-h-48 overflow-y-auto">
                        {filteredSearchStudents.map(s => (
                          <button 
                            key={s.id} 
                            onClick={() => handleAddStudent(s)}
                            className="w-full px-5 py-3 text-left text-xs font-bold hover:bg-white/5 border-b border-white/5 flex items-center justify-between"
                          >
                             {s.full_name}
                             <Plus size={14} className="text-primary"/>
                          </button>
                        ))}
                    </div>
                  )}
               </div>

               {/* Current List */}
               <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Alunos Confirmados ({enrollments.length})</h3>
                  {enrollments.length === 0 ? (
                    <div className="py-10 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest border border-dashed border-border-dark rounded-2xl">
                       Nenhum aluno adicionado.
                    </div>
                  ) : (
                    enrollments.map(e => (
                      <div key={e.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                         <span className="text-xs font-bold">{e.profiles?.full_name}</span>
                         <button onClick={() => handleRemoveStudent(e.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                            <Trash2 size={14} />
                         </button>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE EDIÇÃO / CRIAÇÃO DE AULA */}
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
               <button onClick={() => setEditingClass(null)} className="p-2 rounded-full bg-white/10 text-white">
                 <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-6 pb-20 no-scrollbar">
               <label className="block">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Título da Aula</span>
                  <input type="text" required value={editingClass.title} onChange={e => setEditingClass({...editingClass, title: e.target.value})} className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary" />
               </label>

               <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Categoria</span>
                    <select value={editingClass.category} onChange={e => setEditingClass({...editingClass, category: e.target.value})} className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary appearance-none">
                       <option value="Jiu-Jitsu">Jiu-Jitsu</option>
                       <option value="Muay Thai">Muay Thai</option>
                       <option value="Kickboxing">Kickboxing</option>
                       <option value="No-Gi">No-Gi</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Nível</span>
                    <select value={editingClass.level} onChange={e => setEditingClass({...editingClass, level: e.target.value})} className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary appearance-none">
                       <option value="Todos os Níveis">Todos os Níveis</option>
                       <option value="Iniciante">Iniciante</option>
                       <option value="Intermediário">Intermediário</option>
                       <option value="Avançado">Avançado</option>
                    </select>
                  </label>
               </div>

               <label className="block">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Instrutor</span>
                  <select required value={editingClass.instructor_id || ''} onChange={e => setEditingClass({...editingClass, instructor_id: e.target.value})} className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary appearance-none">
                     {instructors.map(inst => (
                        <option key={inst.id} value={inst.id}>{inst.full_name}</option>
                     ))}
                  </select>
               </label>

               <div className="grid grid-cols-2 gap-4">
                  <label className="block col-span-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Data e Hora</span>
                    <input type="datetime-local" required value={editingClass.start_time_local} onChange={e => setEditingClass({...editingClass, start_time_local: e.target.value})} className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary" style={{ colorScheme: 'dark' }} />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Duração (min)</span>
                    <input type="number" required value={editingClass.duration_minutes} onChange={e => setEditingClass({...editingClass, duration_minutes: e.target.value})} className="w-full bg-card-dark border border-border-dark py-4 px-5 rounded-[1.5rem] text-sm text-white focus:outline-none focus:border-primary" />
                  </label>
               </div>

               <button type="submit" disabled={saving} className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-colors ${saving ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary text-white shadow-xl shadow-primary/20'}`}>
                 {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={18} /> Salvar Aula</>}
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
