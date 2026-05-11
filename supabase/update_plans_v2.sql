-- Delete existing plans
DELETE FROM plans;

-- Insert Wing Chun plan
INSERT INTO plans (name, description, monthly_price, annual_price, features, is_active)
VALUES (
  'WHING CHUN', 
  'Segunda a Sábado - 20h às 21h', 
  150, 
  125, -- 1500 / 12 = 125/mo
  '["Treino de Segunda a Sábado", "Horário: 20:00 às 21:00", "Economia de R$ 300 no ano", "Acesso total ao tatame"]'::jsonb, 
  true
);

-- Insert Kickboxing plan
INSERT INTO plans (name, description, monthly_price, annual_price, features, is_active)
VALUES (
  'KINKING BOX', 
  'Segunda a Sábado - 20h às 21h', 
  120, 
  100, -- 1200 / 12 = 100/mo
  '["Treino de Segunda a Sábado", "Horário: 20:00 às 21:00", "Economia de R$ 240 no ano", "Acesso total ao tatame"]'::jsonb, 
  true
);
