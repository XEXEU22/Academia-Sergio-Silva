import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Tag,
  DollarSign
} from '../icons';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

interface Plan {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  features: string[];
  is_active: boolean;
}

const PremiumAdminPlans: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State for new/editing plan
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error: sbError } = await supabase
      .from('plans')
      .select('*')
      .order('monthly_price', { ascending: true });
    
    if (sbError) {
      setError('Erro ao carregar os planos. Verifique as permissões.');
    } else if (data) {
      setPlans(data as Plan[]);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingPlan.id) {
        // Update
        const { error: upError } = await supabase
          .from('plans')
          .update({
            name: editingPlan.name,
            description: editingPlan.description,
            monthly_price: editingPlan.monthly_price,
            annual_price: editingPlan.annual_price,
            features: editingPlan.features,
            is_active: editingPlan.is_active
          })
          .eq('id', editingPlan.id);
        
        if (upError) throw upError;
        setSuccess('Plano atualizado com sucesso!');
      } else {
        // Insert
        const { error: inError } = await supabase
          .from('plans')
          .insert({
            name: editingPlan.name,
            description: editingPlan.description,
            monthly_price: editingPlan.monthly_price,
            annual_price: editingPlan.annual_price,
            features: editingPlan.features,
            is_active: editingPlan.is_active
          });
          
        if (inError) throw inError;
        setSuccess('Novo plano criado com sucesso!');
      }
      setIsFormOpen(false);
      fetchPlans();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar plano. Certifique-se de ser um Administrador.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este plano?')) return;
    setLoading(true);
    const { error: delError } = await supabase.from('plans').delete().eq('id', id);
    if (delError) {
      setError(delError.message);
    } else {
      setSuccess('Plano excluído.');
      fetchPlans();
    }
    setLoading(false);
  };

  const openNewForm = () => {
    setEditingPlan({
      id: '',
      name: '',
      description: '',
      monthly_price: 0,
      annual_price: 0,
      features: ['Acesso ao tatame'],
      is_active: true
    });
    setIsFormOpen(true);
  };

  const openEditForm = (plan: Plan) => {
    setEditingPlan({ ...plan, features: plan.features || [] });
    setIsFormOpen(true);
  };

  const updateFeature = (index: number, value: string) => {
    if (!editingPlan) return;
    const newFeatures = [...editingPlan.features];
    newFeatures[index] = value;
    setEditingPlan({ ...editingPlan, features: newFeatures });
  };

  const addFeature = () => {
    if (!editingPlan) return;
    setEditingPlan({ ...editingPlan, features: [...editingPlan.features, 'Nova vantagem'] });
  };

  const removeFeature = (index: number) => {
    if (!editingPlan) return;
    const newFeatures = editingPlan.features.filter((_, i) => i !== index);
    setEditingPlan({ ...editingPlan, features: newFeatures });
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-slate-100 font-display">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center gap-6 border-b border-border-dark">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-400 hover:text-white">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-black tracking-[0.3em] uppercase">Gestão de Planos</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-6 pt-10 max-w-xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tighter">Mensalidades</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Crie e edite os planos da academia</p>
          </div>
          {!isFormOpen && (
            <button 
              onClick={openNewForm}
              className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-3">
            <CheckCircle2 size={20} />
            <p className="text-xs font-bold uppercase tracking-wide">{success}</p>
          </div>
        )}

        {isFormOpen && editingPlan ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave} 
            className="space-y-6 bg-card-dark/50 border border-border-dark p-6 rounded-[2rem]"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nome do Plano</label>
                <div className="relative">
                  <input required type="text" value={editingPlan.name} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full bg-background-dark border border-border-dark rounded-xl p-4 pl-12 text-sm font-bold focus:border-primary/50 outline-none" placeholder="Ex: Elite" />
                  <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Descrição Curta</label>
                <input required type="text" value={editingPlan.description} onChange={e => setEditingPlan({...editingPlan, description: e.target.value})} className="w-full bg-background-dark border border-border-dark rounded-xl p-4 text-sm focus:border-primary/50 outline-none" placeholder="Perfeito para iniciantes..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Preço Mensal</label>
                  <div className="relative">
                    <input required type="number" step="0.01" value={editingPlan.monthly_price} onChange={e => setEditingPlan({...editingPlan, monthly_price: parseFloat(e.target.value)})} className="w-full bg-background-dark border border-border-dark rounded-xl p-4 pl-10 text-sm font-bold text-white focus:border-primary/50 outline-none" />
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Preço Anual</label>
                  <div className="relative">
                    <input required type="number" step="0.01" value={editingPlan.annual_price} onChange={e => setEditingPlan({...editingPlan, annual_price: parseFloat(e.target.value)})} className="w-full bg-background-dark border border-border-dark rounded-xl p-4 pl-10 text-sm font-bold text-white focus:border-primary/50 outline-none" />
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border-dark mt-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Vantagens Inclusas</label>
                {editingPlan.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={feature} 
                      onChange={e => updateFeature(idx, e.target.value)} 
                      className="flex-1 bg-background-dark border border-border-dark rounded-lg p-3 text-xs focus:border-primary/50 outline-none" 
                    />
                    <button type="button" onClick={() => removeFeature(idx)} className="p-3 bg-rose-500/10 text-rose-500 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addFeature} className="w-full py-3 border border-dashed border-border-dark text-slate-400 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                  + Adicionar Vantagem
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-4 bg-white/5 rounded-xl text-xs font-black uppercase tracking-widest">Cancelar</button>
              <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                {loading ? <div className="size-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> : <><Save size={16} /> Salvar</>}
              </button>
            </div>
          </motion.form>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="py-12 flex justify-center"><div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
            ) : plans.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border-dark rounded-3xl">
                <p className="text-slate-500 text-sm">Nenhum plano cadastrado ainda.</p>
              </div>
            ) : (
              plans.map(plan => (
                <div key={plan.id} className="p-6 rounded-[2rem] bg-card-dark border border-border-dark flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-black">{plan.name}</h3>
                      <p className="text-xs text-slate-500">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary">R$ {plan.monthly_price}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">/ mês</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => openEditForm(plan)} className="flex-1 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="px-4 py-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PremiumAdminPlans;
