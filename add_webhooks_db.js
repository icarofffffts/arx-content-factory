const { Client } = require('pg');

const DB = {
  host: process.env.N8N_DB_HOST || 'postgres-main',
  port: parseInt(process.env.N8N_DB_PORT || '5432', 10),
  user: process.env.N8N_DB_USER || 'arx',
  password: process.env.N8N_DB_PASSWORD || 'REDACTED_N8N_PASSWORD',
  database: process.env.N8N_DB_NAME || 'n8n'
};

async function addWebhookToWorkflow(workflowId, workflowName, webhookPath) {
  const client = new Client(DB);
  await client.connect();
  
  console.log(`\n=== ${workflowName} (${workflowId}) ===`);
  
  // Get workflow
  const res = await client.query(
    'SELECT id, name, nodes, connections, active FROM workflow_entity WHERE id = $1',
    [workflowId]
  );
  
  if (res.rows.length === 0) {
    console.log('Workflow not found');
    await client.end();
    return null;
  }
  
  const wf = res.rows[0];
  console.log(`Found: ${wf.name}, active=${wf.active}`);
  
  let nodes = typeof wf.nodes === 'string' ? JSON.parse(wf.nodes) : wf.nodes;
  let connections = typeof wf.connections === 'string' ? JSON.parse(wf.connections) : wf.connections;
  
  // Check if webhook already exists
  const hasWebhook = nodes.some(n => n.type === 'n8n-nodes-base.webhook');
  if (hasWebhook) {
    const wh = nodes.find(n => n.type === 'n8n-nodes-base.webhook');
    console.log(`  Webhook already exists: /webhook/${wh.parameters?.path}`);
    await client.end();
    return wh.parameters?.path;
  }
  
  // Find node that Cron connects to
  const cronNode = nodes.find(n => n.type === 'n8n-nodes-base.scheduleTrigger');
  let targetName = null;
  
  if (cronNode && connections[cronNode.name]) {
    const conn = connections[cronNode.name]?.main?.[0]?.[0];
    if (conn) targetName = conn.node;
  }
  
  if (!targetName) {
    // Find postgres node
    const pgNode = nodes.find(n => n.type === 'n8n-nodes-base.postgres');
    targetName = pgNode?.name || nodes.find(n => n.name?.includes('Postgres'))?.name;
  }
  
  if (!targetName) targetName = nodes[1]?.name;
  console.log(`  Target node: ${targetName}`);
  
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
  
  nodes.push(webhookNode);
  
  // Add connection from webhook to target
  connections['Webhook - Publicar Agora'] = {
    main: [[{ node: targetName, type: 'main', index: 0 }]]
  };
  
  // Update workflow
  await client.query(
    'UPDATE workflow_entity SET nodes = $1, connections = $2 WHERE id = $3',
    [JSON.stringify(nodes), JSON.stringify(connections), workflowId]
  );
  console.log(`  Updated workflow JSON`);
  
  // Activate if not already
  if (!wf.active) {
    await client.query(
      'UPDATE workflow_entity SET active = true WHERE id = $1',
      [workflowId]
    );
    console.log(`  Activated`);
  }
  
  await client.end();
  console.log(`  SUCCESS: /webhook/${webhookPath}`);
  return webhookPath;
}

async function main() {
  console.log('Adding webhook triggers via PostgreSQL...');
  
  const linkedin = await addWebhookToWorkflow('Id3FzEJC4bA4FCVI', 'LinkedIn', 'linkedin-publish-now');
  const instagram = await addWebhookToWorkflow('AckgqzMmYGlvhcND', 'Instagram', 'instagram-publish-now');
  
  console.log('\n=== WEBHOOKS READY ===');
  console.log(`LinkedIn: https://n8n.arxsolutions.cloud/webhook/${linkedin}`);
  console.log(`Instagram: https://n8n.arxsolutions.cloud/webhook/${instagram}`);
}

main().catch(e => console.error('ERROR:', e.message));