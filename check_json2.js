const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');

// Find the node with name "Renderizador - Injetar HTML & Salvar PNGs"
const searchStr = '"name": "Renderizador - Injetar HTML & Salvar PNGs"';
const nodeStart = content.indexOf(searchStr);
console.log('Node found at', nodeStart);

if (nodeStart === -1) {
  console.log('Node not found');
  process.exit(1);
}

// Find jsCode after this node
let jsCodePos = content.indexOf('"jsCode"', nodeStart);
console.log('jsCode at', jsCodePos);

// Find the opening quote after jsCode:
let quoteStart = -1;
for (let i = jsCodePos + 8; i < jsCodePos + 50; i++) {
  if (content[i] === '"') {
    quoteStart = i + 1;
    break;
  }
}
console.log('Quote starts at', quoteStart);

// Find the closing quote
let quoteEnd = -1;
for (let i = quoteStart; i < content.length; i++) {
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
console.log('String length', quoteEnd - quoteStart);

if (quoteEnd > 0) {
  let newlineCount = 0;
  for (let i = quoteStart; i < quoteEnd; i++) {
    if (content.charCodeAt(i) === 10 || content.charCodeAt(i) === 13) {
      newlineCount++;
      if (newlineCount <= 5) {
        console.log('Literal newline in string at', i, 'relative', i - quoteStart);
      }
    }
  }
  console.log('Total literal newlines in string:', newlineCount);
} else {
  console.log('String not terminated');
}
