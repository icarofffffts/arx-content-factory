const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador.json', 'utf8');

// The jsCode string ends at position 16758
// After that we have:
// 16764: } (closes parameters)
// 16765: , (comma)
// 16766-16770: whitespace
// 16771: { (starts next node - ERROR!)

// We need to replace from 16765 to 16771 with:
// , "id": ..., "name": ..., "type": ..., "typeVersion": 2, "position": [1120, 240] }
// and then a comma before the next node

const insertPosition = 16765; // After the } that closes parameters
const nextNodeStart = 16771;

const replacement = `,\n      "id": "renderizador",\n      "name": "Renderizador - Injetar HTML & Salvar PNGs",\n      "type": "n8n-nodes-base.code",\n      "typeVersion": 2,\n      "position": [1120, 240]\n    },`;

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
  if (e.position) {
    console.log('Error position:', e.position);
    console.log('Context around error:', JSON.stringify(newContent.slice(e.position - 20, e.position + 20)));
  }
}
