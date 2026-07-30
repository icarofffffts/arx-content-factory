\pset format unaligned
\pset tuples_only on
\pset pager off
SELECT '-- QUERY 1: ALL POSTS --';
SELECT id, topic, status, channel, scheduled_at::text, created_at::text FROM public.content_pipeline ORDER BY created_at DESC;
SELECT '-- QUERY 2: GOOGLE IN TOPIC --';
SELECT id, topic, status, channel FROM public.content_pipeline WHERE topic ILIKE '%google%';
SELECT '-- QUERY 3: COLUMNS --';
SELECT table_schema||'.'||table_name||'.'||column_name||' '||data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;
SELECT '-- QUERY 4: ALL TABLES --';
SELECT table_schema||'.'||table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
SELECT '-- QUERY 5: LOG/WORKFLOW TABLES --';
SELECT table_schema||'.'||table_name FROM information_schema.tables WHERE table_name ILIKE '%execut%' OR table_name ILIKE '%log%' OR table_name ILIKE '%webhook%' OR table_name ILIKE '%workflow%';
SELECT '-- QUERY 6: ID 11d22374 --';
SELECT id, topic, status, channel, scheduled_at::text, created_at::text, updated_at::text FROM public.content_pipeline WHERE id::text LIKE '11d22374%';
