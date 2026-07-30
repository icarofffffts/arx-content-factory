const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');

// Show the exact content around position 16758
console.log('Content around 16758:');
for (let i = 16750; i < 16780; i++) {
  console.log(i, JSON.stringify(content[i]), content.charCodeAt(i));
}

// Check if there's a valid JSON structure after the string
console.log('\nContent after 16758:');
console.log(JSON.stringify(content.slice(16758, 16790)));

// Check the context before 16758
console.log('\nContent before 16758 (last 50 chars of string):');
console.log(JSON.stringify(content.slice(16708, 16758)));
