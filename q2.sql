SELECT node->>'name', node->>'disabled', node->>'type' FROM workflow_entity, json_array_elements(nodes) AS node WHERE id = 'Id3FzEJC4bA4FCVI' AND (node::jsonb ? 'disabled') ORDER BY node->>'name';
