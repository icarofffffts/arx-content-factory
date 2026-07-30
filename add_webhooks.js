#!/usr/bin/env node
const http = require('http');

const N8N_HOST = '172.18.0.1';
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
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function addWebhookTrigger(workflowId, workflowName, webhookPath) {
  const wf = await n8nReq('GET', `/rest/workflows/${workflowId}`);
  console.log(`Fetching ${workflowName} (${workflowId}): status=${wf.status}`);
  if (wf.status !== 200) { console.log(JSON.stringify(wf.body)); return null; }

  const data = wf.body.data;
  if (!data) { console.log('No workflow data'); return null; }

  // Check if webhook already exists
  const hasWebhook = data.nodes.some(n => n.type === 'n8n-nodes-base.webhook');
  if (hasWebhook) {
    const wh = data.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
    console.log(`  Webhook already exists: /webhook/${wh.parameters?.path}`);
    return wh.parameters?.path;
  }

  // Find node that Cron connects to (usually "PostgreSQL - Buscar Posts" or similar)
  const cronNode = data.nodes.find(n => n.type === 'n8n-nodes-base.scheduleTrigger');
  
  // Get the cron output target
  let targetNodeName = null;
  for (const [from, conns] of Object.entries(data.connections)) {
    if (from === cronNode?.name) {
      const firstConn = conns.main?.[0]?.[0];
      if (firstConn) targetNodeName = firstConn.node;
    }
  }

  if (!targetNodeName) {
    // Find first postgres node
    const pgNode = data.nodes.find(n => n.type === 'n8n-nodes-base.postgres');
    targetNodeName = pgNode?.name || data.nodes[0]?.name;
  }
  console.log(`  Will connect webhook -> ${targetNodeName}`);

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

  // Add connection from webhook to target
  data.connections['Webhook - Publicar Agora'] = {
    main: [[{ node: targetNodeName, type: 'main', index: 0 }]]
  };

  // Update workflow via PUT
  const update = await n8nReq('PUT', `/rest/workflows/${workflowId}`, data);
  console.log(`  PUT workflow: ${update.status}`);
  if (update.status !== 200) { console.log(JSON.stringify(update.body)); return null; }

  // Activate
  await new Promise(r => setTimeout(r, 500));
  const activate = await n8nReq('PATCH', `/rest/workflows/${workflowId}/activate`, {});
  console.log(`  Activate: ${activate.status}`);

  return webhookPath;
}

async function main() {
  const linkedinPath = await addWebhookTrigger('Id3FzEJC4bA4FCVI', 'LinkedIn', 'linkedin-publish-now');
  const instagramPath = await addWebhookTrigger('AckgqzMmYGlvhcND', 'Instagram', 'instagram-publish-now');

  console.log('\n=== WEBHOOKS CREATED ===');
  console.log(`LinkedIn: http://172.18.0.1:5678/webhook/${linkedinPath}`);
  console.log(`Instagram: http://172.18.0.1:5678/webhook/${instagramPath}`);
}

main().catch(e => console.error('ERROR:', e.message));