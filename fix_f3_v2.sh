#!/bin/bash
# Fix Fluxo 3 connections key - n8n 2.x has separate columns
docker exec postgres-main sh -c 'psql -U arx -d n8n -t -A -c "SELECT connections FROM workflow_entity WHERE id = '\''AckgqzMmYGlvhcND'\'';"' > /tmp/f3_conn.json
echo "Current connections:"
cat /tmp/f3_conn.json | jq '. | keys'
# Fix the key name
jq 'with_entries(if .key == "Cron - Instagram (12h e 20h BRT - Seg a Sex)" then .key = "Cron - Instagram (a cada 15min - Seg a Sex)" else . end)' /tmp/f3_conn.json > /tmp/f3_conn_fixed.json
echo "Fixed connections keys:"
cat /tmp/f3_conn_fixed.json | jq '. | keys'
# Update the connections column
docker cp /tmp/f3_conn_fixed.json postgres-main:/tmp/f3_conn_fixed.json
docker exec postgres-main sh -c "psql -U arx -d n8n -c \"UPDATE workflow_entity SET connections = (SELECT convert_from(pg_read_binary_file('/tmp/f3_conn_fixed.json'), 'UTF8')::jsonb), updatedAt = NOW() WHERE id = 'AckgqzMmYGlvhcND';\""
echo "Done!"
