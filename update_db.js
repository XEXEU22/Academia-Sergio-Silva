const postgres = require('postgres');
const fs = require('fs');

const connectionString = 'postgresql://postgres:SilvaDefesa2026!#@db.jaaqotmetnrwqfkppads.supabase.co:5432/postgres';
const sqlFilePath = 'supabase/students_migration.sql';

const sql = postgres(connectionString, { ssl: 'require' });

async function main() {
  try {
    const fileContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log(`Executing SQL from ${sqlFilePath}...`);
    // execute raw sql
    const result = await sql.unsafe(fileContent);
    console.log('Migration executed successfully:', result);
  } catch (error) {
    console.error('Error executing migration:', error);
  } finally {
    await sql.end();
  }
}

main();
