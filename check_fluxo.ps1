ssh root@arxdevsvps @'
echo "SELECT id, workflowId, createdAt, finished, mode, status, startedAt, stoppedAt FROM execution_entity WHERE workflowId = 'AckgqzMmYGlvhcND' ORDER BY createdAt DESC LIMIT 3;" | docker exec -i postgres-main psql -U arx -d n8n
'@