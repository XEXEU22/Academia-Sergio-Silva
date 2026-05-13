const postgres = require('postgres');
const fs = require('fs');

const connectionString = 'postgresql://postgres:SilvaDefesa2026!#@db.jaaqotmetnrwqfkppads.supabase.co:5432/postgres';
const migrations = [
    'supabase/fix_rls_recursion.sql',
    'supabase/add_email_and_requests.sql',
    'supabase/fix_master_profile.sql'
];

const sql = postgres(connectionString, { ssl: 'require' });

async function applyMigration(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Arquivo não encontrado: ${filePath}`);
        return;
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`🚀 Aplicando: ${filePath}...`);
        await sql.unsafe(content);
        console.log(`✅ Sucesso: ${filePath}`);
    } catch (error) {
        console.error(`❌ Erro em ${filePath}:`, error.message);
    }
}

async function main() {
    console.log('🏁 Iniciando atualização do banco de dados Supabase...');
    for (const migration of migrations) {
        await applyMigration(migration);
    }
    console.log('🏁 Atualização concluída!');
    await sql.end();
}

main();
