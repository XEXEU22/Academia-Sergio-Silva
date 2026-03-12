-- 1. Remover temporariamente as restrições rígidas de visualização (RLS) para permitir que nosso App de Teste veja os vídeos e fotos
DROP POLICY IF EXISTS "Media is viewable by authenticated users" ON public.videos;
CREATE POLICY "Videos are viewable by everyone" ON public.videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Media is viewable by authenticated users" ON public.photos;
CREATE POLICY "Photos are viewable by everyone" ON public.photos FOR SELECT USING (true);

-- 2. Limpar qualquer lixo que tenha ficado da tentativa anterior falha
DELETE FROM public.classes;
DELETE FROM public.videos;
DELETE FROM public.photos;

-- 3. Inserir dados de forma simplificada sem exigir um Perfil do Auth.users ainda (instructor_id = NULL)
-- A UI já está preparada para exibir "Prof. Substituto" ou "Desconhecido" caso não ache o nome do instrutor.
INSERT INTO public.classes (title, instructor_id, category, level, start_time, duration_minutes, max_spots, status)
VALUES
    ('Muay Thai', NULL, 'Lutas', 'Intermediário', CURRENT_DATE + interval '7 hours', 60, 8, 'available'),
    ('Karatê Do', NULL, 'Tradicional', 'Todos Níveis', CURRENT_DATE + interval '9 hours', 90, 4, 'available'),
    ('Kickboxing', NULL, 'Cardio', 'Avançado', CURRENT_DATE + interval '11 hours', 60, 0, 'full'),
    ('Jiu-Jitsu No-Gi', NULL, 'Grappling', 'Iniciante', CURRENT_DATE + interval '18 hours 30 minutes', 60, 12, 'available');

-- Inserindo Vídeos 
INSERT INTO public.videos (title, category, duration, video_url, thumbnail_url, instructor_id, views_count, is_premium)
VALUES
    ('Defesa Pessoal: Contra-Ataques de Elite', 'Defesa', '18:45', '', '/artifacts/jiujitsu_training_1773243516160.png', NULL, 1200, true),
    ('O Clinch no Muay Thai: Controle Total', 'Muay Thai', '12:20', '', '/artifacts/video_muay_thai_thumb_1773245407335.png', NULL, 12000, false),
    ('Wing Chun: Linha Central e Velocidade', 'Wing Chun', '08:15', '', '/artifacts/video_wing_chun_thumb_1773245426284.png', NULL, 100, false),
    ('Kickboxing: Combinações Explosivas', 'Kickboxing', '22:05', '', '/artifacts/video_kickboxing_thumb_1773245445077.png', NULL, 5000, true);

-- Inserindo Galeria de Fotos
INSERT INTO public.photos (title, category, image_url)
VALUES
    ('Treino de Grappling', 'Treinos', '/artifacts/jiujitsu_training_1773243516160.png'),
    ('Visão do Dojo Principal', 'Instalações', '/artifacts/modern_dojo_bg_1773243537365.png'),
    ('Domínio do Ar', 'Momentos', '/artifacts/martial_arts_black_and_white_1773245780192.png'),
    ('Foco e Meditação', 'Mental', '/artifacts/meditation_focus_martial_arts_1773245799687.png'),
    ('Retrato de Aluno', 'Alunos', '/artifacts/warrior_avatar_1773243555349.png'),
    ('Sifu em Demonstração', 'Mestres', '/artifacts/instructor_avatar_1773243572454.png');
