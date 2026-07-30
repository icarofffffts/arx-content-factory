const fs = require('fs');
const data = JSON.parse(fs.readFileSync('fluxo1_gerador_fixed_images.json'));
const node = data.nodes.find(n => n.name === 'Renderizador - Injetar HTML & Salvar PNGs');
console.log('Node:', node.id, node.name);
console.log('Code contains base64:', node.parameters.jsCode.includes('base64'));
console.log('Code contains data:image:', node.parameters.jsCode.includes('data:image'));

const idx = node.parameters.jsCode.indexOf('const imgBuf');
console.log('Code snippet around image:');
console.log(node.parameters.jsCode.slice(idx - 100, idx + 200));
