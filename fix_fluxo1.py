import json, subprocess, sys

# Get workflow JSON from postgres
cmd = """docker exec postgres-main psql -U arx -d n8n -t -A -c "SELECT encode(convert_to(COALESCE(nodes::text,'{}'), 'UTF8'), 'base64') FROM workflow_entity WHERE id = 'dQnhyh8LbQsiBhxq';" """
result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
b64 = result.stdout.strip()
if not b64:
    print("ERROR: no data returned")
    sys.exit(1)

# decode base64 to JSON
import base64
nodes_json = base64.b64decode(b64).decode('utf-8')
nodes = json.loads(nodes_json)

# Find the UPDATE postgres node
for i, node in enumerate(nodes):
    ntype = node.get('type', '')
    params = node.get('parameters', {})
    operation = params.get('operation', '')
    if ntype == 'n8n-nodes-base.postgres' and operation == 'update':
        values_str = params.get('values', '')
        print(f"Found node {i}: {node.get('name')}")
        print(f"  values before: {values_str[:200]}")
        # Replace 'scheduled' with 'draft' in the values
        if "'scheduled'" in values_str or "'scheduled'," in values_str:
            new_values = values_str.replace("'scheduled'", "'draft'")
            nodes[i]['parameters']['values'] = new_values
            print(f"  values after: {new_values[:200]}")
            
            # Update database
            new_nodes_json = json.dumps(nodes)
            import base64
            new_b64 = base64.b64encode(new_nodes_json.encode('utf-8')).decode('utf-8')
            update_cmd = f"""docker exec postgres-main psql -U arx -d n8n -c "UPDATE workflow_entity SET nodes = convert_from(decode('{new_b64}', 'base64'), 'UTF8')::jsonb WHERE id = 'dQnhyh8LbQsiBhxq';" """
            subprocess.run(update_cmd, shell=True, timeout=30)
            print("Workflow updated!")
        else:
            print("  'scheduled' not found in values (already draft?)")
        break
