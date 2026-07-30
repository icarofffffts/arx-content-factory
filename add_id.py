import json
with open('/tmp/fluxo1_final.json') as f:
    wf = json.load(f)
wf['id'] = 'dQnhyh8LbQsiBhxq'
wf['active'] = True
wf['versionId'] = '1d8fd926-adb5-4a6b-810a-d5f4a8737a32'
with open('/tmp/fluxo1_final.json', 'w') as f:
    json.dump(wf, f, indent=2, ensure_ascii=False)
print('OK - id adicionado')
