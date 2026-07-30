#!/bin/bash
echo '=== 1. Current connections keys ==='
echo "SELECT json_object_keys(connections) FROM workflow_entity WHERE id = 'AckgqzMmYGlvhcND';" | docker exec -i postgres-main psql -U arx -d n8n -t
echo '=== 2. Rename old key to new ==='
echo "UPDATE workflow_entity SET connections = jsonb_set(connections::jsonb, '{Cron - Instagram (a cada 15min - Seg a Sex)}', (connections::jsonb)->'Cron - Instagram (12h e 20h BRT - Seg a Sex)')::json WHERE id = 'AckgqzMmYGlvhcND' AND connections::jsonb ? 'Cron - Instagram (12h e 20h BRT - Seg a Sex)';" | docker exec -i postgres-main psql -U arx -d n8n
echo '=== 3. Remove old key ==='
echo "UPDATE workflow_entity SET connections = (connections::jsonb - 'Cron - Instagram (12h e 20h BRT - Seg a Sex)')::json WHERE id = 'AckgqzMmYGlvhcND' AND connections::jsonb ? 'Cron - Instagram (12h e 20h BRT - Seg a Sex)';" | docker exec -i postgres-main psql -U arx -d n8n
echo '=== 4. Connections keys after rename ==='
echo "SELECT json_object_keys(connections) FROM workflow_entity WHERE id = 'AckgqzMmYGlvhcND';" | docker exec -i postgres-main psql -U arx -d n8n -t
echo '=== 5. Activate workflow ==='
echo "UPDATE workflow_entity SET active = true, \"activeVersionId\" = \"versionId\", \"updatedAt\" = NOW() WHERE id = 'AckgqzMmYGlvhcND';" | docker exec -i postgres-main psql -U arx -d n8n
echo '=== 6. Workflow details ==='
echo "SELECT id, name, active, \"versionId\", \"activeVersionId\", \"updatedAt\" FROM workflow_entity WHERE id = 'AckgqzMmYGlvhcND';" | docker exec -i postgres-main psql -U arx -d n8n
