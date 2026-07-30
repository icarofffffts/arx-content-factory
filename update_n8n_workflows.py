import json
import subprocess

# Copy export file from docker container
subprocess.run(['docker', 'cp', 'n8n:/tmp/workflows_export.json', '/tmp/workflows_export.json'], capture_output=True, text=True)

with open('/tmp/workflows_export.json', 'r', encoding='utf-8') as f:
    wfs = json.load(f)

updated_count = 0
for wf in wfs:
    wf_name = wf.get('name', '')
    
    # 1. Update Fluxo 1 (Gerador) scheduled_at calculation
    if 'Fluxo 1' in wf_name or 'Gerador' in wf_name:
        for node in wf.get('nodes', []):
            if node.get('name') == 'PostgreSQL - Atualizar URLs e Agendar':
                node['parameters']['query'] = """UPDATE public.content_pipeline 
SET 
  media_paths = '{{ JSON.stringify($json.media_urls) }}'::jsonb, 
  instagram_media_paths = '{{ JSON.stringify($json.instagram_media_urls) }}'::jsonb,
  pdf_url = '{{ $json.pdf_url }}',
  status = 'scheduled', 
  scheduled_at = (
    CASE 
      WHEN EXTRACT(DOW FROM NOW()) IN (1, 2, 3, 4) AND EXTRACT(HOUR FROM NOW()) < 19 THEN
        (NOW()::date + CASE 
          WHEN EXTRACT(HOUR FROM NOW()) < 8 THEN TIME '08:45'
          WHEN EXTRACT(HOUR FROM NOW()) < 12 THEN TIME '12:15'
          WHEN EXTRACT(HOUR FROM NOW()) < 17 THEN TIME '17:15'
          ELSE TIME '19:45'
        END)
      WHEN EXTRACT(DOW FROM NOW()) = 5 THEN (NOW()::date + INTERVAL '3 days' + TIME '08:45')
      WHEN EXTRACT(DOW FROM NOW()) = 6 THEN (NOW()::date + INTERVAL '2 days' + TIME '08:45')
      WHEN EXTRACT(DOW FROM NOW()) = 0 THEN (NOW()::date + INTERVAL '1 day' + TIME '08:45')
      ELSE (NOW()::date + INTERVAL '1 day' + TIME '08:45')
    END
  ),
  updated_at = NOW()
WHERE id = '{{ $json.id }}';"""
                updated_count += 1
                with open('/tmp/wf1_fix.json', 'w', encoding='utf-8') as f_out:
                    json.dump(wf, f_out, indent=2)

    # 2. Update Fluxo 2 (LinkedIn) Query
    if 'Fluxo 2' in wf_name or 'LinkedIn' in wf_name:
        for node in wf.get('nodes', []):
            if node.get('name') == 'PostgreSQL - Buscar Post Agendado para LinkedIn':
                node['parameters']['query'] = """SELECT id, topic, linkedin_caption, media_paths, pdf_url
FROM public.content_pipeline 
WHERE status = 'scheduled'
  AND (channel = 'linkedin' OR channel = 'all')
  AND scheduled_at <= NOW()
ORDER BY scheduled_at ASC 
LIMIT 1;"""
                updated_count += 1
                with open('/tmp/wf2_fix.json', 'w', encoding='utf-8') as f_out:
                    json.dump(wf, f_out, indent=2)

print(f'Done processing! Updated {updated_count} nodes.')
