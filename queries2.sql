\a
\t
SELECT id, topic, titulo, fonte, status, created_at, updated_at, categoria FROM public.content_pipeline ORDER BY created_at DESC;
SELECT id, topic, titulo, fonte, status, created_at, updated_at, categoria FROM public.content_pipeline WHERE topic ILIKE '%google%' OR titulo ILIKE '%google%';
\a
\t
SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;
\a
\t
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
SELECT table_name FROM information_schema.tables WHERE table_name ILIKE '%execut%' OR table_name ILIKE '%log%' OR table_name ILIKE '%webhook%' OR table_name ILIKE '%workflow%';
\a
\t
SELECT id, topic, titulo, fonte, status, created_at, updated_at, categoria FROM public.content_pipeline WHERE id::text LIKE '11d22374%';
SELECT id, topic, titulo, fonte, status, created_at, updated_at, categoria FROM public.content_pipeline WHERE titulo ILIKE '%google%';
