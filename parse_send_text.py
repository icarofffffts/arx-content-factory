import json
doc = json.load(open('/tmp/swagger.json'))
text = doc['paths']['/send/text']['post']
for p in text['parameters']:
    print('Parameter:', p['name'], '(' + p['in'] + ')')
    if 'schema' in p and '$ref' in p['schema']:
        ref = p['schema']['$ref']
        defn_name = ref.split('/')[-1]
        print('  Schema ref:', defn_name)
        if defn_name in doc['definitions']:
            defn = doc['definitions'][defn_name]
            for prop_name, prop in defn.get('properties', {}).items():
                print(f'  {prop_name}: type={prop.get("type","")} desc={prop.get("description","")[:80]}')
