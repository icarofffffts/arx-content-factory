UPDATE workflow_entity SET "activeVersionId" = '1d8fd926-adb5-4a6b-810a-d5f4a8737a32' WHERE id = 'dQnhyh8LbQsiBhxq';
INSERT INTO workflow_published_version ("workflowId", "versionId", "publishedVersionId", "publishedAt") 
SELECT 'dQnhyh8LbQsiBhxq', '1d8fd926-adb5-4a6b-810a-d5f4a8737a32', '1d8fd926-adb5-4a6b-810a-d5f4a8737a32', NOW()
WHERE NOT EXISTS (SELECT 1 FROM workflow_published_version WHERE "workflowId" = 'dQnhyh8LbQsiBhxq');
