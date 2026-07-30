const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador_fixed.json', 'utf8');

console.log('Content around 16950:');
for (let i = 16940; i < 16960; i++) {
  console.log(i, JSON.stringify(content[i]), content.charCodeAt(i));
}

// Try to find the exact error by parsing manually
let pos = 16950;
console.log('\nContext around 16950:');
console.log(JSON.stringify(content.slice(pos - 20, pos + 20)));
