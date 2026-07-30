\pset format wrapped
\pset columns 180
SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'content_pipeline' AND table_schema = 'public' ORDER BY ordinal_position;

SELECT id, topic, titulo, fonte, status, categoria, created_at, updated_at FROM public.content_pipeline ORDER BY created_at DESC;
