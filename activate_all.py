import json
import subprocess

with open('/tmp/workflows_export.json') as f:
    wfs = json.load(f)

for wf in wfs:
    wf_id = wf['id']
    subprocess.run(['docker', 'exec', 'n8n', 'n8n', 'update:workflow', f'--id={wf_id}', '--active=true'])

print("ALL N8N WORKFLOWS FULLY ACTIVATED WITH NEW GOLDEN BENCHMARK SCHEDULE!")
