import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  ChevronLeft, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Save,
  User,
  ShieldAlert,
  Award,
  DollarSign
} from '../icons';
import BottomNav from '../components/BottomNav';

export default function PremiumAdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Busca Alunos
      const { data: profiles, error: errProf } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (errProf) throw errProf;

      // Busca Planos (Mensalidades)
      const { data: plansData, error: errPlans } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true);
      if (errPlans) throw errPlans;

      // Busca Assinaturas ativas para mapear os planos aos alunos
      const { data: subsData, error: errSubs } = await supabase
        .from('subscriptions')
        .select('user_id, plan_id, status')
        .eq('status', 'active');
      if (errSubs) throw errSubs;

      const mergedStudents = profiles.map(profile => {
        const activeSub = subsData?.find(s => s.user_id === profile.id);
        const plan = plansData?.find(p => p.id === activeSub?.plan_id);
        return {
          ...profile,
          currentPlan: plan || null,
          subscription_id: activeSub ? activeSub.plan_id : null
        };
      });

      setStudents(mergedStudents || []);
      setPlans(plansData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    (s.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
    (s.belt_level || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSaving(true);
    try {
      // 1. Update Profile Info (Graduation, Name, etc)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: editingStudent.full_name,
          belt_level: editingStudent.belt_level,
          role: editingStudent.role,
          phone: editingStudent.phone
        })
        .eq('id', editingStudent.id);
      
      if (profileError) throw profileError;

      // 2. Update Plan / Tuition
      if (editingStudent.selected_plan_id) {
        // Verifica se já existe uma assinatura para atualizar
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
          // Criar nova assinatura
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
      } else {
         // Opcional: remover assinatura ativa se foi desmarcado?
         // Neste exemplo simplificado, se nenhuma for escolhida, não fazemos nada.
      }

      await fetchData(); // Recarrega os dados
      setEditingStudent(null);
    } catch(err) {
      console.error('Erro ao salvar aluno:', err);
      alert('Erro ao salvar os dados. Verifique a conexão e as permissões RLS.');
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
          <span className="text-[8px] font-black uppercase text-primary">Controle de Alunos</span>
        </div>
        <div className="size-10" />
      </header>

      <main className="flex-1 px-6 pt-10 pb-32">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-black">Alunos</h1>
           <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar Aluno..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-card-dark border border-border-dark rounded-xl text-xs text-white focus:outline-none focus:border-primary/50"
              />
           </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary text-xs font-black uppercase tracking-widest">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            Carregando Guerreiros...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map(student => (
              <motion.div 
                key={student.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-5 rounded-[2rem] bg-card-dark border border-border-dark hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                     {student.avatar_url ? (
                        <img src={student.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                        <User className="text-slate-500" size={24} />
                     )}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{student.full_name || 'Usuário Sem Nome'}</h3>
                    <div className="flex items-center gap-3 mt-1 opacity-60">
                       <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Award size={12} className="text-primary"/> {student.belt_level || 'Faixa Branca'}
                       </span>
                       <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-emerald-400">
                          <DollarSign size={12} /> {student.currentPlan?.name || 'Sem Plano'} ({student.currentPlan ? `R$ ${student.currentPlan.monthly_price}` : 'R$ 0'})
                       </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingStudent({
                     ...student, 
                     selected_plan_id: student.currentPlan?.id || ''
                  })}
                  className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors border border-primary/20"
                >
                  <Edit3 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE EDIÇÃO */}
      <AnimatePresence>
        {editingStudent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl flex flex-col p-6"
          >
            <div className="flex items-center justify-between mt-4 mb-8">
               <h2 className="text-xl font-black tracking-widest uppercase">Editar Aluno</h2>
               <button onClick={() => setEditingStudent(null)} className="p-2 rounded-full bg-white/10 text-white">
                 <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-6 pb-20 no-scrollbar">
               
               {/* Informações Básicas */}
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
               </div>

               {/* Graduação e Papel */}
               <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Faixa / Graduação</span>
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
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Permissão (Role)</span>
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

               {/* Plano e Mensalidade */}
               <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20 mt-8">
                  <h3 className="text-sm font-black tracking-widest uppercase flex items-center gap-2 mb-4 text-indigo-400">
                     <DollarSign size={16} /> Gestão de Mensalidade
                  </h3>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Vincular Plano Base</span>
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
                  </label>
                  <p className="text-[10px] text-indigo-300/60 mt-4 leading-relaxed italic">
                    Ao atribuir um plano, o valor da mensalidade deste guerreiro será ajustado para os valores padrões da academia.
                  </p>
               </div>

               <div className="pt-8 mb-safe">
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
                     <>
                       <Save size={18} /> Salvar Alterações
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
