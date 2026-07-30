#!/bin/bash
docker exec -i postgres-main psql -U arx -d n8n << 'SQL'
UPDATE workflow_entity SET connections = (SELECT convert_from(pg_read_binary_file('/tmp/f3_conn_fixed.json'), 'UTF8')::jsonb), "updatedAt" = NOW() WHERE id = 'AckgqzMmYGlvhcND';
SQL
echo "Exit code: $?"
