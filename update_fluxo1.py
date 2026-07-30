import json
import subprocess

# Read the modified workflow
with open('/tmp/fluxo1_final.json') as f:
    wf = json.load(f)

workflow_id = wf['id']

# Extract nodes and connections as JSON strings
nodes_json = json.dumps(wf['nodes'])
connections_json = json.dumps(wf['connections'])
version_id = wf['versionId']

# Build SQL
sql = f"""
UPDATE workflow_entity 
SET 
  nodes = '{nodes_json.replace("'", "''")}'::jsonb,
  connections = '{connections_json.replace("'", "''")}'::jsonb,
  version_id = '{version_id}'
WHERE id = '{workflow_id}';
"""

# Execute via docker
result = subprocess.run(
    ['docker', 'exec', '-i', 'postgres-main', 'psql', '-U', 'arx', '-d', 'n8n'],
    input=sql,
    capture_output=True,
    text=True,
    timeout=15
)
print("STDOUT:", result.stdout)
print("STDERR:", result.stderr[:500] if result.stderr else "")
print("Return code:", result.returncode)
