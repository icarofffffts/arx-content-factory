const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');

// Show the exact content after the jsCode string ends at 16758
console.log('Content after 16758 (20 chars):');
console.log(JSON.stringify(content.slice(16758, 16778)));

// Show the content before the next "parameters"
const nextParams = content.indexOf('"parameters"', 16758);
console.log('Next "parameters" at:', nextParams);
console.log('Content between 16758 and next params:');
console.log(JSON.stringify(content.slice(16758, nextParams + 20)));

// Check if the renderer node is missing its properties
// The expected structure after the jsCode string should be:
// "\n      },\n      "id": "...",\n      "name": "...",\n      "type": "...",\n      "typeVersion": 2,\n      "position": [1120, 240]\n    },\n"

// But the actual content might be missing these properties
console.log('\nActual content structure:');
for (let i = 16758; i < 16758 + 100; i++) {
  console.log(i, JSON.stringify(content[i]));
}
