const fs = require('fs');
const data = JSON.parse(fs.readFileSync('fluxo1_gerador_fixed_images.json'));
const node = data.nodes.find(n => n.name === 'Renderizador - Injetar HTML & Salvar PNGs');

const idx = node.parameters.jsCode.indexOf('const imgBuf');
console.log('Full snippet:');
console.log(node.parameters.jsCode.slice(idx - 50, idx + 400));
