SELECT jsonb_pretty(node::jsonb) FROM workflow_entity, json_array_elements(nodes) AS node WHERE id = 'Id3FzEJC4bA4FCVI' AND node->>'name' = 'Cron - LinkedIn (a cada 15min - Seg a Sex)';
