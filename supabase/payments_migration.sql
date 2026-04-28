-- Tabela de Pagamentos (Histórico mensal)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reference_month TEXT NOT NULL, -- ex: '2026-04'
  status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  payment_date DATE,
  due_date DATE NOT NULL,
  method TEXT, -- ex: 'pix', 'dinheiro', 'cartao'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, reference_month)
);

-- Habilitar RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas: Admin pode tudo, aluno pode ver os próprios
CREATE POLICY "Admins can manage all payments" ON public.payments
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view own payments" ON public.payments
FOR SELECT USING (auth.uid() = user_id);

-- Adiciona campos extras na profiles se ainda não existem
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS enrollment_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_payment_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS next_payment_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS modality TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notes TEXT;
