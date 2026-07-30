import json, sys, subprocess, os

def get_workflow(wid):
    result = subprocess.run(
        ["docker", "exec", "-i", "n8n", "n8n", "export:workflow", f"--id={wid}", "--output=json"],
        capture_output=True, text=True, timeout=30
    )
    if result.returncode != 0:
        print(f"Error: {result.stderr[:500]}")
        return None
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print(f"stdout[:500]: {result.stdout[:500]}")
        return None

workflows = {
    "Id3FzEJC4bA4FCVI": "Fluxo 2 LinkedIn",
    "AckgqzMmYGlvhcND": "Fluxo 3 Instagram",
    "0uahIzCUQYRU3xmh": "Fluxo 4 GitHub"
}

for wid, wname in workflows.items():
    print(f"\n=== {wname} ({wid}) ===")
    wf = get_workflow(wid)
    if not wf:
        continue
    if 'webhookIds' in wf:
        print(f"  workflow-level webhookIds: {wf['webhookIds']}")
    if 'webhookId' in wf:
        print(f"  workflow-level webhookId: {wf['webhookId']}")
    for n in wf.get('nodes', []):
        ntype = n.get('type', '')
        if 'webhook' in ntype.lower():
            print(f"  Node: {n.get('name')}")
            print(f"    Type: {ntype}")
            params = n.get('parameters', {})
            for k, v in params.items():
                vstr = str(v)[:200]
                print(f"    {k}: {vstr}")
            # Print node-level webhookId
            if 'webhookId' in n:
                print(f"    node.webhookId: {n['webhookId']}")
