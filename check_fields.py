import json
doc = json.load(open('/tmp/swagger.json'))

# Check all send-related definitions
for key in sorted(doc.get('definitions', {}).keys()):
    if 'sendMessage_service' in key or 'TextStruct' in key or 'ButtonStruct' in key:
        print(f'\n=== {key} ===')
        defn = doc['definitions'][key]
        for prop_name, prop in defn.get('properties', {}).items():
            print(f'  field: {prop_name}')
            for pk, pv in prop.items():
                if pk == 'description':
                    print(f'    desc: {str(pv)[:80]}')
                elif pk == 'type':
                    print(f'    type: {pv}')
