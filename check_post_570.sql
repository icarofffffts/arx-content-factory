SELECT id, LEFT(topic,60) as topic, status, channel,
       LEFT(media_paths::text, 200) as media_paths,
       LEFT(linkedin_caption, 100) as caption_preview,
       slides_data IS NOT NULL as has_slides,
       pdf_url
FROM public.content_pipeline 
WHERE id = '570a0cbb-6b79-43e1-b9ee-99ecd57237bd';
