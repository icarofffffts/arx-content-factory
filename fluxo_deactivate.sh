#!/bin/bash
ssh root@arxdevsvps "docker exec postgres-main psql -U arx -d n8n -c \"UPDATE workflow_entity SET active = false, updatedAt = NOW() WHERE id = 'AckgqzMmYGlvhcND';\""