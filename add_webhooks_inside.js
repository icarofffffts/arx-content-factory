#!/usr/bin/env node
const http = require('http');

const N8N_HOST = 'localhost';
const N8N_PORT = 5678;

function n8nReq(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: N8N_HOST,
      port: N8N_PORT,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch(e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', e => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function addWebhookTrigger(workflowId, workflowName, webhookPath) {
  console.log(`\n=== ${workflowName} (${workflowId}) ===`);
  
  const wf = await n8nReq('GET', `/rest/workflows/${workflowId}`);
  console.log(`GET workflow: ${wf.status}`);
  if (wf.status !== 200) { console.log(JSON.stringify(wf.body).substring(0, 200)); return null; }

  const data = wf.body.data;
  if (!data) { console.log('No data'); return null; }

  // Check if webhook already exists
  const hasWebhook = data.nodes.some(n => n.type === 'n8n-nodes-base.webhook');
  if (hasWebhook) {
    const wh = data.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
    console.log(`  Already has webhook: /webhook/${wh.parameters?.path}`);
    return wh.parameters?.path;
  }

  // Find node that Cron connects to
  const cronNode = data.nodes.find(n => n.type === 'n8n-nodes-base.scheduleTrigger');
  let targetNodeName = null;
  
  for (const [from, conns] of Object.entries(data.connections)) {
    if (from === cronNode?.name) {
      const firstConn = conns.main?.[0]?.[0];
      if (firstConn) targetNodeName = firstConn.node;
    }
  }

  if (!targetNodeName) {
    const pgNode = data.nodes.find(n => n.type === 'n8n-nodes-base.postgres');
    targetNodeName = pgNode?.name || data.nodes.find(n => n.name.includes('Postgres'))?.name;
  }

  if (!targetNodeName) {
    targetNodeName = data.nodes[1]?.name; // skip trigger
  }
  console.log(`  Webhook will connect to: ${targetNodeName}`);

  // Create webhook node
  const webhookNode = {
    parameters: {
      httpMethod: 'POST',
      path: webhookPath,
      responseMode: 'onReceived',
      options: {}
    },
    id: 'webhook-trigger-' + Date.now(),
    name: 'Webhook - Publicar Agora',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 1.1,
    position: [-1800, 200],
    webhookId: webhookPath
  };

  data.nodes.push(webhookNode);

  // Add connection
  data.connections['Webhook - Publicar Agora'] = {
    main: [[{ node: targetNodeName, type: 'main', index: 0 }]]
  };

  // Update workflow
  const update = await n8nReq('PUT', `/rest/workflows/${workflowId}`, data);
  console.log(`  PUT: ${update.status}`);
  if (update.status !== 200) { console.log(JSON.stringify(update.body).substring(0, 300)); return null; }

  // Activate
  await new Promise(r => setTimeout(r, 800));
  const activate = await n8nReq('PATCH', `/rest/workflows/${workflowId}/activate`, {});
  console.log(`  Activate: ${activate.status}`);

  console.log(`  SUCCESS: /webhook/${webhookPath}`);
  return webhookPath;
}

async function main() {
  console.log('Adding webhook triggers to n8n workflows...');
  
  const linkedin = await addWebhookTrigger('Id3FzEJC4bA4FCVI', 'LinkedIn', 'linkedin-publish-now');
  const instagram = await addWebhookTrigger('AckgqzMmYGlvhcND', 'Instagram', 'instagram-publish-now');

  console.log('\n=== DONE ===');
  console.log(`LinkedIn: http://localhost:5678/webhook/${linkedin}`);
  console.log(`Instagram: http://localhost:5678/webhook/${instagram}`);
}

main().catch(e => console.error('ERROR:', e.message));