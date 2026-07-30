const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');
const matches = content.match(/"name":\s*"[^"]+"/g);
console.log(matches.slice(0, 30).join('\n'));
