const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');

let quoteStart = 0;
let inString = false;
let backslashCount = 0;

for (let i = 0; i < content.length; i++) {
  if (content[i] === '\\') {
    backslashCount++;
  } else if (content[i] === '"') {
    if (backslashCount % 2 === 0) {
      inString = !inString;
      if (inString) {
        quoteStart = i;
      } else {
        if (quoteStart > 16000 && i < 17000) {
          console.log('String from', quoteStart, 'to', i, 'length', i - quoteStart);
        }
      }
    }
    backslashCount = 0;
  } else {
    backslashCount = 0;
  }
}

console.log('Final inString:', inString);
