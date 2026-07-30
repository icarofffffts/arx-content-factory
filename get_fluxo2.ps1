ssh root@arxdevsvps @"
printf 'SELECT workflowJson FROM workflow_entity WHERE id = '"'"'Id3FzEJC4bA4FCVI'"'"';\n' > /tmp/run.sql
docker exec -i postgres-main psql -U arx -d n8n -t -f /tmp/run.sql > /tmp/fluxo2.json
"@
