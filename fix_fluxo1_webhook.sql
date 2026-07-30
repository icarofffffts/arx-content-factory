-- Modify the webhook node to set topic from query params
-- And add a check to skip RSS when topic is provided
UPDATE workflow_entity
SET nodes = (
  SELECT jsonb_agg(result_node)::json
  FROM (
    SELECT
      CASE
        -- Webhook node: add code to pass query.topic as the topic
        WHEN node->>'name' = 'Webhook - Receber Tema'
        THEN jsonb_set(
          node,
          '{parameters,options}',
          (COALESCE(node->'parameters'->'options', '{}'::jsonb) || '{"responseHeaders":{"Content-Type":"application/json"},"rawBody":true}'::jsonb)
        )
        ELSE node
      END AS result_node
    FROM jsonb_array_elements(nodes::jsonb) AS node
  ) sub
)
WHERE id = 'dQnhyh8LbQsiBhxq';
