$comms = @(
  'docker exec -i postgres-main psql -U arx -d n8n -t -A -c "SELECT id, """createdAt""", """status""" FROM execution_entity WHERE """workflowId""" = ''Id3FzEJC4bA4FCVI'' ORDER BY """createdAt""" DESC LIMIT 5;"',
  'docker exec -i postgres-main psql -U arx -d n8n -t -A -c "SELECT id, """workflowId""", """createdAt""", """status""" FROM execution_entity WHERE """createdAt""" > ''2026-07-28 17:10:00+00'' ORDER BY """createdAt""";',
  'docker exec -i postgres-main psql -U arx -d n8n -t -A -c "SELECT """executionId""", data FROM execution_data WHERE """executionId""" = (SELECT MAX(id) FROM execution_entity WHERE """workflowId""" = ''Id3FzEJC4bA4FCVI'');"'
)

foreach ($c in $comms) {
  ssh root@arxdevsvps $c
  echo "---"
}
