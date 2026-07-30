import json, sys
doc = json.load(sys.stdin)
paths = list(doc.get('paths', {}).keys())
print('\n'.join(sorted(paths)))
