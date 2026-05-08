const fs = require('fs');
const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<iframe src=/g, '<iframe sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" src=');

fs.writeFileSync(file, content);
console.log('Iframes sandboxed.');
