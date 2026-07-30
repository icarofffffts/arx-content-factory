SELECT id, LEFT(topic,50) as topic, status, channel 
FROM public.content_pipeline 
WHERE status NOT IN ('draft') 
ORDER BY scheduled_at ASC NULLS LAST 
LIMIT 15;

SELECT id, LEFT(topic,50) as topic, status, slides_data IS NOT NULL as has_slides 
FROM public.content_pipeline 
WHERE id = '11d22374-bda3-460e-87da-b05e9bb2126c';
