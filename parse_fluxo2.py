import json

with open(r'C:\Users\Administrator\Desktop\Automacoes de Posts\fluxo2.json', 'r') as f:
    raw = f.read()

parts = raw.strip().split(' | ')
nodes = json.loads(parts[0])
connections = json.loads(parts[1])
triggerCount = parts[2].strip() if len(parts) > 2 else 'N/A'

print('=== NODES ===')
for n in nodes:
    print(f"  {n['name']}: type={n['type']}, disabled={n.get('disabled', False)}, position={n['position']}")

print()
print('=== CONNECTIONS ===')
print(json.dumps(connections, indent=2))

print()
print('=== TRIGGER COUNT ===')
print(triggerCount)

print()
print('=== PINNED DATA ===')
for n in nodes:
    if n.get('pinnedData'):
        print(f"  {n['name']}: {json.dumps(n['pinnedData'])}")
