ssh root@arxdevsvps "echo ""UPDATE workflow_entity SET active = false, updatedAt = NOW() WHERE id = 'AckgqzMmYGlvhcND';"" | docker exec -i postgres-main psql -U arx -d n8n"
