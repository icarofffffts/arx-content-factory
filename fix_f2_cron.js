const https = require('https');
const API = 'https://n8n.arxsolutions.cloud/api/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWQ1ODUyOC01YTRjLTQ2NDMtOGNlYi1lN2RjMDExNzI5NWYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNGFjYWQ0YmQtOGJjYy00Mjc3LTk3MDQtN2U1ZTVjYzNhMjE3IiwiaWF0IjoxNzc3OTIwODY4fQ.n7vnEc_O3LVGMk5zvrLV_VBd1iZy-gB6Iw8urtoAeHc';

function apiGet(path) {
  return new Promise((resolve) => {
    https.get(API + path, { headers: { 'X-N8N-API-KEY': KEY } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
  });
}

function apiPut(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = https.request(API + path, {
      method: 'PUT',
      headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(d) }));
    });
    req.on('error', e => resolve({ status: 0, data: e.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  // Fluxo 2 - fix cron para cada 15 min e corrigir query
  const f2 = await apiGet('/workflows/Id3FzEJC4bA4FCVI');

  const cronNode = f2.nodes.find(n => n.name.includes('Cron'));
  if (cronNode) {
    cronNode.parameters.rule.interval[0].expression = '*/15 * * * *';
    cronNode.name = 'Cron - LinkedIn (a cada 15min - Seg a Sex)';
  }

  const pgNode = f2.nodes.find(n => n.name.includes('Buscar'));
  if (pgNode) {
    pgNode.parameters.query = `SELECT id, topic, linkedin_caption, media_paths, pdf_url
FROM public.content_pipeline 
WHERE status IN ('scheduled', 'posted_instagram')
  AND channel IN ('linkedin', 'all')
ORDER BY scheduled_at ASC 
LIMIT 1;`;
  }

  const result = await apiPut('/workflows/Id3FzEJC4bA4FCVI', {
    name: f2.name,
    nodes: f2.nodes,
    connections: f2.connections,
    settings: { executionOrder: 'v1' }
  });

  console.log('Fluxo 2 atualizado:', result.status, result.data.name || result.data.message?.substring(0, 100));

  // Fluxo 3 - fix cron para cada 15 min
  const f3 = await apiGet('/workflows/AckgqzMmYGlvhcND');
  const cron3 = f3.nodes.find(n => n.name.includes('Cron'));
  if (cron3) {
    cron3.parameters.rule.interval[0].expression = '*/15 * * * *';
    cron3.name = 'Cron - Instagram (a cada 15min - Seg a Sex)';
  }

  const result3 = await apiPut('/workflows/AckgqzMmYGlvhcND', {
    name: f3.name,
    nodes: f3.nodes,
    connections: f3.connections,
    settings: { executionOrder: 'v1' }
  });
  console.log('Fluxo 3 atualizado:', result3.status);
}

main().catch(e => console.error(e));
