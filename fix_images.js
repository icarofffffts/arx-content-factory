const fs = require('fs');
const content = fs.readFileSync('fluxo1_gerador_fixed.json', 'utf8');
const data = JSON.parse(content);

// Find the renderer node
const rendererNode = data.nodes.find(n => n.name === 'Renderizador - Injetar HTML & Salvar PNGs');
if (!rendererNode) {
  console.error('Renderer node not found');
  process.exit(1);
}

// Get the current code
let code = rendererNode.parameters.jsCode;
console.log('Current code length:', code.length);

// The fix: Replace the image rendering logic to use base64 data URIs
// Find the section that generates coverHtml

const oldLogic = `    let coverHtml = '';
    if (imageUrl) {
      const localImgName = \`tavily_web_\${postId}_\${num}.jpg\`;
      const localImgPath = \`/data/media/\${localImgName}\`;
      const downloaded = await downloadImage(imageUrl, localImgPath);
      if (downloaded) {
        coverHtml = \`<div class="cover-image-box"><img src="https://conteudos.icarodev.cloud/\${localImgName}" onerror="this.parentElement.style.display='none'" /></div>\`;
      }
    }`;

const newLogic = `    let coverHtml = '';
    if (imageUrl) {
      const localImgName = \`tavily_web_\${postId}_\${num}.jpg\`;
      const localImgPath = \`/data/media/\${localImgName}\`;
      const downloaded = await downloadImage(imageUrl, localImgPath);
      if (downloaded) {
        const imgBuf = fs.readFileSync(localImgPath);
        const base64Img = imgBuf.toString('base64');
        const ext = localImgName.endsWith('.png') ? 'png' : 'jpg';
        coverHtml = \`<div class="cover-image-box"><img src="data:image/\${ext};base64,\${base64Img}" /></div>\`;
      }
    }`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  console.log('Replaced old logic with new logic');
} else {
  console.log('Old logic not found, trying to find the pattern...');
  // Try to find the coverHtml generation section
  const coverHtmlIndex = code.indexOf('let coverHtml = \'\'');
  console.log('coverHtml declaration at:', coverHtmlIndex);
  
  if (coverHtmlIndex !== -1) {
    // Find the end of the if block
    const ifBlockStart = code.indexOf('if (imageUrl)', coverHtmlIndex);
    console.log('if block at:', ifBlockStart);
    
    // Find the closing brace of the if block
    let braceCount = 0;
    let ifBlockEnd = -1;
    for (let i = ifBlockStart; i < code.length; i++) {
      if (code[i] === '{') braceCount++;
      if (code[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          ifBlockEnd = i + 1;
          break;
        }
      }
    }
    console.log('if block end at:', ifBlockEnd);
    
    if (ifBlockEnd !== -1) {
      const oldBlock = code.slice(coverHtmlIndex, ifBlockEnd);
      console.log('Old block length:', oldBlock.length);
      console.log('Old block:');
      console.log(oldBlock);
      
      code = code.slice(0, coverHtmlIndex) + newLogic + code.slice(ifBlockEnd);
      console.log('Replaced using block replacement');
    }
  }
}

// Update the code
rendererNode.parameters.jsCode = code;

// Save the modified JSON
const newContent = JSON.stringify(data, null, 2);
fs.writeFileSync('fluxo1_gerador_fixed_images.json', newContent);
console.log('Fixed file with image base64 written to fluxo1_gerador_fixed_images.json');
console.log('New code length:', code.length);

// Validate
const testData = JSON.parse(newContent);
const testNode = testData.nodes.find(n => n.name === 'Renderizador - Injetar HTML & Salvar PNGs');
console.log('Test node found:', !!testNode);
console.log('Test code contains base64:', testNode.parameters.jsCode.includes('base64'));
console.log('Test code contains data:image:', testNode.parameters.jsCode.includes('data:image'));
