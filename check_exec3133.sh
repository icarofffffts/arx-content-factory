#!/bin/bash
docker exec postgres-main psql -U arx -d n8n -t -c "SELECT substr(data::text, 1, 2000) FROM execution_data WHERE executionId = 3133;"
echo "---"
docker exec postgres-main psql -U arx -d n8n -t -c "SELECT substr(data::text, 1, 2000) FROM execution_data WHERE executionId = 3135;"
echo "---"
docker exec -i supabase-db psql -U supabase_admin -d postgres -c "SELECT id, LEFT(topic, 40), status, updated_at FROM content_pipeline ORDER BY updated_at DESC;"
