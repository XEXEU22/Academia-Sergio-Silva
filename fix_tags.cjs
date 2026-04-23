const fs = require('fs');

const path = 'src/screens/PremiumAdminDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// The issue is like: </div>div> -> </div>
// </motion.div>motion.div> -> </motion.div>
// </span>span> -> </span>
// </header>header> -> </header>
// </h1>h1> -> </h1>
// </p>p> -> </p>
// </section>section> -> </section>

content = content.replace(/<\/([a-zA-Z]+)(\.[a-zA-Z]+)?>\1\2>/g, '</$1$2>');
content = content.replace(/<\/([a-zA-Z]+)>\1>/g, '</$1>');
content = content.replace(/<\/([a-zA-Z]+\.[a-zA-Z]+)>\1>/g, '</$1>');

// A generic replace just in case:
content = content.replace(/(<\/[a-zA-Z0-9_\.]+>)[a-zA-Z0-9_\.]+(>)/g, '$1');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed ', path);
