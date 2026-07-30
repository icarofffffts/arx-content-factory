import json, sys
d = json.load(sys.stdin)
for i in d.get('data', []):
    print(i['name'], i['token'][:12]+'...', i.get('connected'))
