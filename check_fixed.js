const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador_fixed.json', 'utf8');

console.log('Content around 16772:');
console.log(JSON.stringify(content.slice(16760, 16790)));

for (let i = 16760; i < 16790; i++) {
  console.log(i, JSON.stringify(content[i]), content.charCodeAt(i));
}
