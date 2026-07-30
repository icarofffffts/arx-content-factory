import json
doc = json.load(open('/tmp/swagger.json'))

# Print full ButtonStruct definition
key = 'github_com_EvolutionAPI_evolution-go_pkg_sendMessage_service.ButtonStruct'
defn = doc['definitions'][key]
print('=== Full ButtonStruct ===')
for prop_name, prop in defn.get('properties', {}).items():
    print(f'\n{prop_name}:')
    for k, v in prop.items():
        print(f'  {k}: {v}')
