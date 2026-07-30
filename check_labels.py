import json, sys
c = json.load(sys.stdin)[0]
labels = c.get('Config', {}).get('Labels', {})
for k, v in labels.items():
    if 'traefik' in k.lower():
        print(k, '=', v)
if not any('traefik' in k.lower() for k in labels):
    print('NO TRAEFIK LABELS FOUND')
    print('All labels:', list(labels.keys()))
