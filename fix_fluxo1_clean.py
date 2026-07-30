import json, subprocess, sys, base64

# Get workflow nodes from database
cmd = [
    "docker", "exec", "postgres-main", "psql", "-U", "arx", "-d", "n8n",
    "-t", "-A",
    "-c", "SELECT encode(convert_to(COALESCE(nodes::text,'{}'),'UTF8'),'base64') FROM workflow_entity WHERE id='dQnhyh8LbQsiBhxq';"
]
r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
b64 = r.stdout.strip()
if not b64:
    print("STDERR:", r.stderr[:200])
    sys.exit(1)

nodes = json.loads(base64.b64decode(b64))

# Find and modify the UPDATE postgres node
for i, n in enumerate(nodes):
    if n.get("type") == "n8n-nodes-base.postgres" and n.get("parameters",{}).get("operation") == "update":
        v = n["parameters"].get("values","")
        print(f"Node {i}: {n.get('name')}")
        print(f"  has scheduled: {'scheduled' in v}")
        if "'scheduled'" in v:
            n["parameters"]["values"] = v.replace("'scheduled'", "'draft'")
            new_json = json.dumps(nodes)
            new_b64 = base64.b64encode(new_json.encode()).decode()
            up_cmd = [
                "docker","exec","postgres-main","psql","-U","arx","-d","n8n",
                "-c", f"UPDATE workflow_entity SET nodes=convert_from(decode('{new_b64}','base64'),'UTF8')::jsonb WHERE id='dQnhyh8LbQsiBhxq';"
            ]
            subprocess.run(up_cmd, timeout=30)
            print("UPDATED successfully")
        else:
            print("  no scheduled found, already changed?")
        break
