-- ============================================================
-- FIX: Resolver recursão infinita nas políticas RLS
-- ============================================================
-- O problema: As policies de 'classes', 'payments', etc. 
-- fazem SELECT na tabela 'profiles' para verificar o role.
-- Isso causa recursão porque profiles também tem policies RLS.
-- 
-- Solução: Criar uma função SECURITY DEFINER que acessa
-- diretamente a tabela profiles SEM passar pelo RLS,
-- quebrando o ciclo de recursão.
-- ============================================================

-- 1. Criar função auxiliar para verificar se o usuário é admin
-- (SECURITY DEFINER executa com os privilégios do owner, bypassando RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Criar função auxiliar para verificar se é instrutor ou admin
CREATE OR REPLACE FUNCTION public.is_instructor_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('instructor', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- 3. Recriar policies de CLASSES usando as funções auxiliares
-- ============================================================
DROP POLICY IF EXISTS "Instructors can manage classes" ON public.classes;
CREATE POLICY "Instructors can manage classes" ON public.classes
FOR ALL USING (public.is_instructor_or_admin());

-- ============================================================
-- 4. Recriar policies de PAYMENTS usando as funções auxiliares
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
CREATE POLICY "Admins can manage all payments" ON public.payments
FOR ALL USING (public.is_admin());

-- ============================================================
-- 5. Recriar policies de VIDEOS para evitar recursão
-- ============================================================
-- Primeiro, verificar e dropar policies que possam causar recursão
DROP POLICY IF EXISTS "Media is viewable by authenticated users" ON public.videos;
DROP POLICY IF EXISTS "Videos are viewable by everyone" ON public.videos;
-- Recriar com acesso público (como estava no fix.sql)
CREATE POLICY "Videos are viewable by everyone" ON public.videos 
FOR SELECT USING (true);

-- Policy para admins gerenciarem vídeos
DROP POLICY IF EXISTS "Admins can manage videos" ON public.videos;
CREATE POLICY "Admins can manage videos" ON public.videos
FOR ALL USING (public.is_admin());

-- ============================================================
-- 6. Adicionar policy para admin gerenciar profiles
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (public.is_admin());

-- ============================================================
-- 7. Adicionar policy para admin gerenciar enrollments
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON public.enrollments;
CREATE POLICY "Admins can manage all enrollments" ON public.enrollments
FOR ALL USING (public.is_admin());
