-- Change status from 'scheduled' to 'draft' in UPDATE node only
UPDATE workflow_entity
SET nodes = jsonb_set(
  nodes,
  (SELECT (array_agg(key) -1)::text[] FROM (
    SELECT row_number() OVER () -1 as idx, value as node
    FROM jsonb_array_elements(nodes)
    WHERE value->'parameters'->>'operation' = 'update'
    AND value->>'type' = 'n8n-nodes-base.postgres'
  ) t),
  (SELECT jsonb_set(
    node,
    '{parameters,values}',
    replace(node->'parameters'->>'values'::text, '''scheduled''', '''draft''')::jsonb
  ) FROM (
    SELECT value as node FROM jsonb_array_elements(nodes)
    WHERE value->'parameters'->>'operation' = 'update'
    AND value->>'type' = 'n8n-nodes-base.postgres'
    LIMIT 1
  ) t2)
)
WHERE id = 'dQnhyh8LbQsiBhxq'
AND EXISTS (
  SELECT 1 FROM jsonb_array_elements(nodes) n
  WHERE n->'parameters'->>'operation' = 'update'
  AND n->>'type' = 'n8n-nodes-base.postgres'
);
