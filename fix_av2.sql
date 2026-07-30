INSERT INTO workflow_published_version ("workflowId", "publishedVersionId", "createdAt", "updatedAt") 
SELECT 'dQnhyh8LbQsiBhxq', '1d8fd926-adb5-4a6b-810a-d5f4a8737a32', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM workflow_published_version WHERE "workflowId" = 'dQnhyh8LbQsiBhxq');
