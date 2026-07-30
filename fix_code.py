import json

with open('/tmp/fluxo1_final.json') as f:
    wf = json.load(f)

# Find the Topic from Webhook node and fix the jsCode
for n in wf['nodes']:
    if n['name'] == 'Topic from Webhook':
        n['parameters']['jsCode'] = """const topic = $input.first().json.query?.topic || $input.first().json.body?.topic || '';
if (!topic) {
  return [{ json: { candidate_articles: [], webhook_received: false } }];
}
return [{
  json: {
    candidate_articles: [{
      title: topic,
      source_name: "Webhook",
      link: "",
      desc: topic,
      pubDate: new Date().toISOString()
    }],
    webhook_received: true
  }
}];"""
        print("Fixed jsCode to use $input")
        break

with open('/tmp/fluxo1_final.json', 'w') as f:
    json.dump(wf, f, indent=2, ensure_ascii=False)
print("Saved")
