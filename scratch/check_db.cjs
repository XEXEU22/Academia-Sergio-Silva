const https = require('https');
const SUPABASE_URL = 'jaaqotmetnrwqfkppads.supabase.co';
const SUPABASE_KEY = 'sb_publishable_AP6kep3CTSzcKiwoS27hHQ_qxye7Unh'; // Using publishable key for now, if it fails I'll ask.

// Note: publishable key might not have permission for RPC execute_sql depending on config.
// But let's try to just update the code first to see if it's a code issue.

async function checkProfiles() {
    const options = {
        hostname: SUPABASE_URL,
        path: '/rest/v1/profiles?select=id,full_name,role',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    };
    
    return new Promise((resolve) => {
        https.get(options, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve(JSON.parse(data)));
        });
    });
}

checkProfiles().then(console.log);
