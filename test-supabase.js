import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jaaqotmetnrwqfkppads.supabase.co";
const SUPABASE_KEY = "sb_publishable_AP6kep3CTSzcKiwoS27hHQ_qxye7Unh";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log("Iniciando teste de conexao com:", SUPABASE_URL);
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      // Se a tabela não existir, ainda assim a conexão ocorreu e nós recebemos o erro do banco, o que prova que a conexão funciona.
      console.log("Conectado com sucesso ao Supabase! Resposta do servidor:", error.message);
    } else {
      console.log("Conectado com sucesso! Dados recebidos:", data);
    }
  } catch(err) {
    console.error("Erro critico de conexao:", err);
  }
}

testConnection();
