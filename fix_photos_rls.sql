-- Fix RLS for photos table
DROP POLICY IF EXISTS "Admins can insert photos" ON public.photos;
DROP POLICY IF EXISTS "Admins can delete photos" ON public.photos;
DROP POLICY IF EXISTS "Admins can update photos" ON public.photos;
DROP POLICY IF EXISTS "Photos viewable by everyone" ON public.photos;
DROP POLICY IF EXISTS "Media is viewable by authenticated users" ON public.photos;

CREATE POLICY "Photos viewable by everyone" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Admins can insert photos" ON public.photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update photos" ON public.photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete photos" ON public.photos FOR DELETE USING (auth.role() = 'authenticated');

-- Also check videos
DROP POLICY IF EXISTS "Videos viewable by everyone" ON public.videos;
DROP POLICY IF EXISTS "Media is viewable by authenticated users" ON public.videos;
CREATE POLICY "Videos viewable by everyone" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Admins can insert videos" ON public.videos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update videos" ON public.videos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete videos" ON public.videos FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket if not exists
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Storage policies
DROP POLICY IF EXISTS "Media is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;

CREATE POLICY "Media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
