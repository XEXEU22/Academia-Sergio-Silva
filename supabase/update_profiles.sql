-- Adicionando colunas extras ao perfil para capturar dados do registro
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS specialty TEXT;

-- Atualizar a função de gatilho para capturar os novos metadados enviados no Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone, specialty)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'specialty'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
