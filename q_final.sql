-- Query 1: ALL posts sorted by created_at DESC (meta columns only)
\x auto
SELECT id, topic, status, channel, scheduled_at, created_at, updated_at, pdf_url, linkedin_caption, instagram_caption, instagram_post_id FROM public.content_pipeline ORDER BY created_at DESC;

-- Query 2: Google posts (meta columns)
SELECT id, topic, status, channel, scheduled_at, created_at, updated_at, pdf_url, linkedin_caption, instagram_caption, instagram_post_id FROM public.content_pipeline WHERE topic ILIKE '%google%';

-- Query 3: columns info
\pset format unaligned
SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;

-- Query 4: all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Query 5: execution/log/workflow tables
SELECT table_name FROM information_schema.tables WHERE table_name ILIKE '%execut%' OR table_name ILIKE '%log%' OR table_name ILIKE '%webhook%' OR table_name ILIKE '%workflow%';

-- Query 6: post id starting '11d22374' - full
\x auto
\pset format wrapped
SELECT * FROM public.content_pipeline WHERE id::text LIKE '11d22374%';

-- Query 7: Google posts - full
SELECT * FROM public.content_pipeline WHERE topic ILIKE '%google%';
