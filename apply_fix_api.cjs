const https = require('https');
const fs = require('fs');

const sqlFile = 'supabase/fix_rls_recursion.sql';
if (!fs.existsSync(sqlFile)) {
    console.error(`File not found: ${sqlFile}`);
    process.exit(1);
}

const sql = fs.readFileSync(sqlFile, 'utf8');

const data = JSON.stringify({
  query: sql
});

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: '/v1/projects/jaaqotmetnrwqfkppads/database/query',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sbp_c9d25415e93427b9876304c7eaccd34f1180f0ee',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log(`🚀 Enviando ${sqlFile} via Supabase API...`);

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    try {
        const response = body ? JSON.parse(body) : { message: 'No body returned' };
        console.log(JSON.stringify({
            status: res.statusCode,
            body: response
        }, null, 2));
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Migração aplicada com sucesso!');
        } else {
            console.error('❌ Erro ao aplicar migração.');
        }
    } catch (e) {
        console.error('Erro ao processar resposta:', e.message);
        console.log('Raw body:', body);
    }
  });
});

req.on('error', (e) => { console.error('Erro na requisição:', e.message); });
req.write(data);
req.end();
