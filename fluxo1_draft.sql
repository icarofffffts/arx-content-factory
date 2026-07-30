-- Replace 'scheduled' with 'draft' in the UPDATE PostgreSQL node's values
UPDATE workflow_entity
SET nodes = (
  SELECT jsonb_agg(result_node)::json
  FROM (
    SELECT
      CASE 
        WHEN (node->'parameters'->>'operation' = 'update' 
              AND node->>'type' = 'n8n-nodes-base.postgres')
        THEN jsonb_set(
          node,
          '{parameters,values}',
          to_jsonb(replace(node->'parameters'->>'values', '''scheduled''', '''draft'''))
        )
        ELSE node
      END AS result_node
    FROM jsonb_array_elements(nodes::jsonb) AS node
  ) sub
)
WHERE id = 'dQnhyh8LbQsiBhxq';
