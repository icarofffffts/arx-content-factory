import json
doc = json.load(open('/tmp/swagger.json'))
print('=== securityDefinitions ===')
sd = doc.get('securityDefinitions', {})
for k, v in sd.items():
    print(f'{k}: type={v.get("type")}, in={v.get("in")}, name={v.get("name")}')

# Also check the security on /send/text
print('\n=== /send/text security ===')
txt = doc['paths'].get('/send/text', {}).get('post', {})
print('security:', txt.get('security', 'none'))
print('parameters:')
for p in txt.get('parameters', []):
    print(f'  {p["name"]} (in: {p["in"]})')
    if p.get('required'):
        print('    REQUIRED')
