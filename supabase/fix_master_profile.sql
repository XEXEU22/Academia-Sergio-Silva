-- 1. Criar a tabela de Assets do Site (se não existir)
CREATE TABLE IF NOT EXISTS public.site_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_key TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS
ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;

-- 3. Políticas para site_assets
CREATE POLICY "Site assets are viewable by everyone" 
ON public.site_assets FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage site assets" 
ON public.site_assets FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

-- 4. Inicializar os registros básicos
INSERT INTO public.site_assets (asset_key, url, description)
VALUES 
    ('master_photo', 'https://ui-avatars.com/api/?name=S+S&background=FF6B00&color=fff', 'Foto do Mestre Sérgio'),
    ('master_instagram', '', 'Instagram do Mestre'),
    ('master_whatsapp', '', 'WhatsApp do Mestre')
ON CONFLICT (asset_key) DO NOTHING;

-- 5. Configurar o Storage (Bucket 'media')
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Políticas de Storage para o bucket 'media'
-- Permitir que qualquer um veja fotos públicas
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'media');

-- Permitir que apenas administradores façam upload
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'media' AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
);

CREATE POLICY "Admin Update Delete" 
ON storage.objects FOR ALL 
USING (
    bucket_id = 'media' AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
);
