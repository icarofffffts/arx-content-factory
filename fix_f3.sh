#!/bin/bash
# Fix Fluxo 3 connections key
docker exec postgres-main sh -c 'psql -U arx -d n8n -t -A -c "SELECT workflowJson FROM workflow_entity WHERE id = '\''AckgqzMmYGlvhcND'\'';"' > /tmp/f3.json
jq '.connections |= with_entries(if .key == "Cron - Instagram (12h e 20h BRT - Seg a Sex)" then .key = "Cron - Instagram (a cada 15min - Seg a Sex)" else . end)' /tmp/f3.json > /tmp/f3_fixed.json
echo "Connections keys after fix:"
jq '.connections | keys' /tmp/f3_fixed.json
docker cp /tmp/f3_fixed.json postgres-main:/tmp/f3_fixed.json
docker exec postgres-main sh -c "psql -U arx -d n8n -c \"UPDATE workflow_entity SET workflowJson = (SELECT convert_from(pg_read_binary_file('/tmp/f3_fixed.json'), 'UTF8')::jsonb), updatedAt = NOW() WHERE id = 'AckgqzMmYGlvhcND';\""
echo "Done!"
