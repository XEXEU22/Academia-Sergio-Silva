-- Inserindo um Perfil de Mestre Genérico para ser o Instrutor das aulas (Note que no futuro os perfis virão do Auth)
-- Usaremos um UUID fixo apenas para popular estes dados base.
INSERT INTO public.profiles (id, full_name, avatar_url, role, belt_level, experience_years)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Mestre Sérgio', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ3cyTFUpOEz-J0nLAoJM3CZPKIU9hNrS_NUMeqWphl7UTzdLhw-YXuJh016U93P5i2PFVcB4vuBEdQHn3PHNOHf-qzMgdeM9fBv8Z9x4UIDHbU7gfi2SWOvlmtS4CeykgMq43wiM1t-hX9WFFXfJ_MSpIg5yA4TeDiTMMTbSp7aKN9N59o5MFjUdBjSw1RPc6Ag4k6py9lxOxTizx8LgJjnLeUmd6Bk1z8r9fzLWkfIAmsFgaKffxFCI17uxMacJ9RQaeIIoiyMA', 'instructor', 'Faixa Preta 5º Dan', 15),
    ('00000000-0000-0000-0000-000000000002', 'Sensei Tanaka', '', 'instructor', 'Faixa Preta 4º Dan', 12),
    ('00000000-0000-0000-0000-000000000003', 'Instrutora Ana', '', 'instructor', 'Faixa Preta 2º Dan', 8)
ON CONFLICT (id) DO NOTHING;

-- Inserindo Aulas (Schedule)
INSERT INTO public.classes (title, instructor_id, category, level, start_time, duration_minutes, max_spots, status)
VALUES
    ('Muay Thai', '00000000-0000-0000-0000-000000000001', 'Lutas', 'Intermediário', CURRENT_DATE + interval '7 hours', 60, 8, 'available'),
    ('Karatê Do', '00000000-0000-0000-0000-000000000002', 'Tradicional', 'Todos Níveis', CURRENT_DATE + interval '9 hours', 90, 4, 'available'),
    ('Kickboxing', '00000000-0000-0000-0000-000000000003', 'Cardio', 'Avançado', CURRENT_DATE + interval '11 hours', 60, 0, 'full'),
    ('Jiu-Jitsu No-Gi', '00000000-0000-0000-0000-000000000001', 'Grappling', 'Iniciante', CURRENT_DATE + interval '18 hours 30 minutes', 60, 12, 'available');

-- Inserindo Vídeos (Academia Digital)
INSERT INTO public.videos (title, category, duration, video_url, thumbnail_url, instructor_id, views_count, is_premium)
VALUES
    ('Defesa Pessoal: Contra-Ataques de Elite', 'Defesa', '18:45', '', '/artifacts/jiujitsu_training_1773243516160.png', '00000000-0000-0000-0000-000000000001', 1200, true),
    ('O Clinch no Muay Thai: Controle Total', 'Muay Thai', '12:20', '', '/artifacts/video_muay_thai_thumb_1773245407335.png', '00000000-0000-0000-0000-000000000001', 12000, false),
    ('Wing Chun: Linha Central e Velocidade', 'Wing Chun', '08:15', '', '/artifacts/video_wing_chun_thumb_1773245426284.png', '00000000-0000-0000-0000-000000000001', 100, false),
    ('Kickboxing: Combinações Explosivas', 'Kickboxing', '22:05', '', '/artifacts/video_kickboxing_thumb_1773245445077.png', '00000000-0000-0000-0000-000000000001', 5000, true);

-- Inserindo Galeria de Fotos
INSERT INTO public.photos (title, category, image_url)
VALUES
    ('Treino de Grappling', 'Treinos', '/artifacts/jiujitsu_training_1773243516160.png'),
    ('Visão do Dojo Principal', 'Instalações', '/artifacts/modern_dojo_bg_1773243537365.png'),
    ('Domínio do Ar', 'Momentos', '/artifacts/martial_arts_black_and_white_1773245780192.png'),
    ('Foco e Meditação', 'Mental', '/artifacts/meditation_focus_martial_arts_1773245799687.png'),
    ('Retrato de Aluno', 'Alunos', '/artifacts/warrior_avatar_1773243555349.png'),
    ('Sifu em Demonstração', 'Mestres', '/artifacts/instructor_avatar_1773243572454.png');

-- Inserindo Planos Iniciais
INSERT INTO public.plans (name, description, monthly_price, annual_price, features)
VALUES
    ('Free', 'Acesso Básico', 0, 0, '["Acesso ao conteúdo gratuito", "Notificações básicas", "Comunidade"]'::jsonb),
    ('Premium', 'Acesso Total à Academia', 89.90, 899.00, '["Acesso a todas as aulas de vídeo", "Reserva prioritária presencial", "Lives Exclusivas com o Mestre", "Análise de Frequência"]'::jsonb);
