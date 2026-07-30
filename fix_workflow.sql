-- Fix Fluxo 2 (LinkedIn)
UPDATE workflow_entity SET "activeVersionId" = '04c8ebd2-a9ee-43d5-a145-bf3b3bb35ab9', "updatedAt" = NOW() WHERE id = 'Id3FzEJC4bA4FCVI';
INSERT INTO workflow_published_version ("workflowId", "publishedVersionId", "updatedAt") VALUES ('Id3FzEJC4bA4FCVI', '04c8ebd2-a9ee-43d5-a145-bf3b3bb35ab9', NOW()) ON CONFLICT ("workflowId") DO UPDATE SET "publishedVersionId" = '04c8ebd2-a9ee-43d5-a145-bf3b3bb35ab9', "updatedAt" = NOW();

-- Fix Fluxo 3 (Instagram)
UPDATE workflow_entity SET "activeVersionId" = '962ad58d-b51c-46d8-aa52-75b342314d2b', "updatedAt" = NOW() WHERE id = 'AckgqzMmYGlvhcND';
INSERT INTO workflow_published_version ("workflowId", "publishedVersionId", "updatedAt") VALUES ('AckgqzMmYGlvhcND', '962ad58d-b51c-46d8-aa52-75b342314d2b', NOW()) ON CONFLICT ("workflowId") DO UPDATE SET "publishedVersionId" = '962ad58d-b51c-46d8-aa52-75b342314d2b', "updatedAt" = NOW();

-- Fix Fluxo 4 (GitHub)
UPDATE workflow_entity SET "activeVersionId" = 'a6bf244e-ce8c-4431-abd5-9848daea27a4', "updatedAt" = NOW() WHERE id = '0uahIzCUQYRU3xmh';
INSERT INTO workflow_published_version ("workflowId", "publishedVersionId", "updatedAt") VALUES ('0uahIzCUQYRU3xmh', 'a6bf244e-ce8c-4431-abd5-9848daea27a4', NOW()) ON CONFLICT ("workflowId") DO UPDATE SET "publishedVersionId" = 'a6bf244e-ce8c-4431-abd5-9848daea27a4', "updatedAt" = NOW();
