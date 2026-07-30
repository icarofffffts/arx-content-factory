SELECT id, topic, status, created_at FROM public.content_pipeline WHERE status = 'draft' ORDER BY created_at DESC LIMIT 5;
