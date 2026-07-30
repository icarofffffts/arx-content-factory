import json
doc = json.load(open('/tmp/swagger.json'))

# Find the ButtonStruct definition
def find_def(name):
    for key in doc.get('definitions', {}):
        if name in key:
            print(f'\n=== {key} ===')
            defn = doc['definitions'][key]
            for prop_name, prop in defn.get('properties', {}).items():
                desc = str(prop.get('description', ''))[:100]
                ptype = prop.get('type', '')
                if '$ref' in prop:
                    ref = prop['$ref'].split('.')[-1]
                    print(f'  {prop_name}: ref={ref}')
                else:
                    print(f'  {prop_name}: type={ptype} desc={desc}')

find_def('ButtonStruct')
find_def('MediaStruct')
find_def('TextMessage')
print('\n=== All /send/ paths ===')
for path in sorted(doc.get('paths', {}).keys()):
    if '/send/' in path:
        methods = list(doc['paths'][path].keys())
        print(f'  {path} [{",".join(methods)}]')
