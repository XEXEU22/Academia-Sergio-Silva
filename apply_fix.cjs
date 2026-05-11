const postgres = require('postgres');
const fs = require('fs');

const connectionString = 'postgresql://postgres:SilvaDefesa2026!#@db.jaaqotmetnrwqfkppads.supabase.co:5432/postgres';
const sqlFilePath = 'supabase/fix_rls_recursion.sql';

const sql = postgres(connectionString, { ssl: 'require' });

async function main() {
  try {
    const fileContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log(`🚀 Executando correção de RLS em ${sqlFilePath}...`);
    
    // Split the SQL file into separate commands if necessary, 
    // but postgres.js unsafe() can usually handle multiple commands.
    await sql.unsafe(fileContent);
    
    console.log('✅ Correção de RLS aplicada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao aplicar correção:', error.message);
  } finally {
    await sql.end();
  }
}

main();
