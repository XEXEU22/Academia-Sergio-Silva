const https = require('https');
const fs = require('fs');

const sql = fs.readFileSync('supabase/students_migration.sql', 'utf8');

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

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log(JSON.stringify({
        status: res.statusCode,
        body: body ? JSON.parse(body) : null
    }, null, 2));
  });
});

req.on('error', (e) => { console.error(e); });
req.write(data);
req.end();
