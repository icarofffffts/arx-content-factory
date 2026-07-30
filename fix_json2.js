const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');

// The jsCode string ends at position 16758
// After that we have:
// 16759: \n
// 16760-16763: spaces
// 16764: } (closes parameters)
// 16765: , (comma)
// 16766: \n
// 16767-16770: spaces
// 16771: { (starts next node - ERROR!)

// We need to replace everything from 16765 to before the next node with:
// , "id": ..., "name": ..., "type": ..., "typeVersion": 2, "position": [1120, 240] }

const insertPosition = 16765; // After the } that closes parameters

// Find where the next node actually starts (the { at 16771)
const nextNodeStart = 16771;

// The missing node properties + closing brace
const replacement = `,\n      "id": "renderizador",\n      "name": "Renderizador - Injetar HTML & Salvar PNGs",\n      "type": "n8n-nodes-base.code",\n      "typeVersion": 2,\n      "position": [1120, 240]\n    }`;

// Replace from position 16765 to 16771 (before the next {)
const newContent = content.slice(0, insertPosition) + replacement + content.slice(nextNodeStart);

fs.writeFileSync('fluxo1_gerador_fixed.json', newContent);
console.log('Fixed file written to fluxo1_gerador_fixed.json');
console.log('Original length:', content.length);
console.log('New length:', newContent.length);

// Validate the JSON
try {
  const data = JSON.parse(newContent);
  console.log('JSON is valid!');
  console.log('Nodes:', data.nodes.length);
  const rendererNode = data.nodes.find(n => n.name === 'Renderizador - Injetar HTML & Salvar PNGs');
  console.log('Renderer node found:', !!rendererNode);
  if (rendererNode) {
    console.log('Renderer node id:', rendererNode.id);
    console.log('Renderer code length:', rendererNode.parameters.jsCode.length);
  }
} catch (e) {
  console.error('JSON validation failed:', e.message);
  console.log('Error position:', e.position);
  if (e.position) {
    console.log('Context around error:', JSON.stringify(newContent.slice(e.position - 20, e.position + 20)));
  }
}
