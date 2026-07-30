const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');

let start = -1;
for (let i = 0; i < content.length; i++) {
  if (content[i] === 'j' && content.slice(i, i+7) === 'jsCode"') {
    start = i;
    break;
  }
}

console.log('Found at', start);
let quoteStart = -1;
for (let i = start; i < start + 50; i++) {
  if (content[i] === '"') {
    quoteStart = i + 1;
    break;
  }
}

console.log('Quote starts at', quoteStart);
let quoteEnd = -1;
for (let i = quoteStart; i < quoteStart + 20000; i++) {
  if (content[i] === '"' && content[i-1] !== '\\') {
    let j = i - 1;
    let backslashes = 0;
    while (j >= 0 && content[j] === '\\') {
      backslashes++;
      j--;
    }
    if (backslashes % 2 === 0) {
      quoteEnd = i;
      break;
    }
  }
}

console.log('Quote ends at', quoteEnd);
if (quoteEnd > 0) {
  for (let i = quoteStart; i < quoteEnd; i++) {
    if (content.charCodeAt(i) === 10 || content.charCodeAt(i) === 13) {
      console.log('Literal newline in string at', i, 'relative', i - quoteStart);
    }
  }
} else {
  console.log('String not terminated within 20000 chars');
}
