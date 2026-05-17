-- Corrige Permissões para a Tabela de Vídeos
DROP POLICY IF EXISTS "Admins can insert videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can delete videos" ON public.videos;
DROP POLICY IF EXISTS "Videos viewable by everyone" ON public.videos;
DROP POLICY IF EXISTS "Media is viewable by authenticated users" ON public.videos;

CREATE POLICY "Videos viewable by everyone" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Admins can insert videos" ON public.videos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update videos" ON public.videos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete videos" ON public.videos FOR DELETE USING (auth.role() = 'authenticated');
