-- ============================================================
-- MIGRAÇÃO: Campos de Gestão de Alunos para a tabela profiles
-- Academia Sergio Silva
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Adicionar campos de gestão à tabela profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS enrollment_date DATE,
  ADD COLUMN IF NOT EXISTS plan_name TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' 
    CHECK (payment_status IN ('paid', 'pending', 'overdue')),
  ADD COLUMN IF NOT EXISTS last_payment_date DATE,
  ADD COLUMN IF NOT EXISTS next_payment_date DATE,
  ADD COLUMN IF NOT EXISTS modality TEXT 
    CHECK (modality IN ('Jiu-Jitsu', 'Muay Thai', 'Wing Chun', 'Kickboxing', 'Misto', NULL)),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Preencher enrollment_date com created_at para alunos já existentes
UPDATE public.profiles
  SET enrollment_date = created_at::date
  WHERE enrollment_date IS NULL AND role = 'student';

-- 3. Política RLS: Admin pode ver e editar todos os profiles
-- (Primeiro remove se já existir para evitar erro de conflito)
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;

CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update all profiles" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Exemplos de dados para testes (opcional — comente se não quiser)
-- UPDATE public.profiles SET payment_status = 'paid', plan_name = 'Mensal', modality = 'Jiu-Jitsu' WHERE role = 'student' LIMIT 5;
-- UPDATE public.profiles SET payment_status = 'overdue', plan_name = 'Mensal', modality = 'Muay Thai' WHERE role = 'student' LIMIT 2 OFFSET 5;

-- ============================================================
-- FIM DA MIGRAÇÃO
-- ============================================================
