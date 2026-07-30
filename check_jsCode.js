const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');

let inString = false;
let backslashCount = 0;
let lastStringStart = 0;
let lastStringEnd = 0;

for (let i = 0; i < content.length; i++) {
  if (content[i] === '\\') {
    backslashCount++;
  } else if (content[i] === '"') {
    if (backslashCount % 2 === 0) {
      if (inString) {
        lastStringEnd = i;
        if (i > 16500 && i < 16800) {
          console.log('String ends at', i, 'length', i - lastStringStart, 'starts at', lastStringStart);
        }
      } else {
        lastStringStart = i;
      }
      inString = !inString;
    }
    backslashCount = 0;
  } else {
    backslashCount = 0;
  }
}

console.log('Last string ended at:', lastStringEnd);
console.log('Total length:', content.length);

// Find the jsCode string
const jsCodeIndex = content.indexOf('"jsCode"');
console.log('jsCode property at:', jsCodeIndex);

// Find the quote after jsCode:
let quoteStart = -1;
for (let i = jsCodeIndex + 8; i < jsCodeIndex + 50; i++) {
  if (content[i] === '"') {
    quoteStart = i + 1;
    break;
  }
}
console.log('jsCode string starts at:', quoteStart);

// Find the matching end quote
let quoteEnd = -1;
let nestedBackslashes = 0;
for (let i = quoteStart; i < content.length; i++) {
  if (content[i] === '\\') {
    nestedBackslashes++;
  } else if (content[i] === '"') {
    if (nestedBackslashes % 2 === 0) {
      quoteEnd = i;
      break;
    }
    nestedBackslashes = 0;
  } else {
    nestedBackslashes = 0;
  }
}

console.log('jsCode string ends at:', quoteEnd);
console.log('jsCode string length:', quoteEnd - quoteStart);

// Show the content after the jsCode string
console.log('Content after jsCode string:');
console.log(JSON.stringify(content.slice(quoteEnd, quoteEnd + 50)));
