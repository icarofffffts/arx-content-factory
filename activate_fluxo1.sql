-- Activate Fluxo 1
UPDATE workflow_entity SET active = true WHERE id = 'dQnhyh8LbQsiBhxq';

-- Set activeVersionId if not set
UPDATE workflow_entity
SET "activeVersionId" = "versionId"
WHERE id = 'dQnhyh8LbQsiBhxq' AND "activeVersionId" IS NULL;

-- Check if published version exists
INSERT INTO workflow_published_version ("workflowId", "versionId", "publishedAt")
SELECT 'dQnhyh8LbQsiBhxq', "versionId", NOW()
FROM workflow_entity
WHERE id = 'dQnhyh8LbQsiBhxq'
AND NOT EXISTS (SELECT 1 FROM workflow_published_version WHERE "workflowId" = 'dQnhyh8LbQsiBhxq')
ON CONFLICT DO NOTHING;
