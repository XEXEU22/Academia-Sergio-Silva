const https = require('https');

const data = JSON.stringify({
  name: "Academia Sergio Silva",
  organization_id: "ykbvrmxadcvwyrmokqob",
  region: "sa-east-1",
  db_pass: "SilvaDefesa2026!#",
  plan: "free"
});

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: '/v1/projects',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sbp_c9d25415e93427b9876304c7eaccd34f1180f0ee',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log(JSON.stringify({
        status: res.statusCode,
        body: JSON.parse(body)
    }, null, 2));
  });
});

req.on('error', (e) => { console.error(e); });
req.write(data);
req.end();
