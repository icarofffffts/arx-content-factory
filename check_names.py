import json
with open('/tmp/fluxo1_final.json') as f:
    wf = json.load(f)
for n in wf['nodes']:
    if 'Webhook' in n['name'] or 'Topic' in n['name']:
        print(repr(n['name']))
