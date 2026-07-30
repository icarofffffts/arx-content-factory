import json
doc = json.load(open('/tmp/swagger.json'))
button = doc['paths']['/send/button']['post']
params = button['parameters']
print('Parameters:')
for p in params:
    print(f'  {p["name"]} ({p["in"]}): {p.get("description","")[:100]}')
    if p.get('schema'):
        schema = p['schema']
        if 'properties' in schema:
            for prop_name, prop in schema['properties'].items():
                print(f'    {prop_name}: {prop.get("type","")} - {str(prop.get("description",""))[:80]}')
        elif '$ref' in schema:
            print(f'    $ref: {schema["$ref"]}')
