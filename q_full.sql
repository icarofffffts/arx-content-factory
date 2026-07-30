\x auto
\pset pager off
SELECT '-- QUERY 6: FULL ROW ID 11d22374 --';
SELECT * FROM public.content_pipeline WHERE id::text LIKE '11d22374%';
SELECT '-- QUERY 7: FULL ROW GOOGLE --';
SELECT * FROM public.content_pipeline WHERE topic ILIKE '%google%';
