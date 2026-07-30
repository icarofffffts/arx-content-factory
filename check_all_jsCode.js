const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');

// Show context around position 10558
console.log('Content around 10558:');
console.log(JSON.stringify(content.slice(10540, 10570)));

// Show context around position 16758
console.log('Content around 16758 (last 100 chars of string):');
console.log(JSON.stringify(content.slice(16658, 16758)));

// Find all occurrences of '"jsCode"'
let pos = 0;
let count = 0;
while (true) {
  const idx = content.indexOf('"jsCode"', pos);
  if (idx === -1) break;
  count++;
  console.log('jsCode', count, 'at position', idx);
  pos = idx + 1;
}
