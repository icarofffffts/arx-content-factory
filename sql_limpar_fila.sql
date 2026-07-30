-- ============================================================
-- SQL: LIMPAR FILA DE POSTAGEM + PREVENIR AUTO-PUBLICACAO
-- ============================================================
-- Executar NO BANCO (10.0.1.20:5432) via psql ou PGAdmin
-- ============================================================

-- 1. Backup de seguranca: cria tabela com snapshot antes de alterar
DROP TABLE IF EXISTS public.content_pipeline_backup_20260730;
CREATE TABLE public.content_pipeline_backup_20260730 AS 
SELECT * FROM public.content_pipeline;

-- 2. Marcar TODOS os posts pendentes como 'published'
--    Isso limpa a fila dos fluxos 2/3/4 que so pegam status 'scheduled'
UPDATE public.content_pipeline
SET status = 'published',
    updated_at = NOW()
WHERE status IN (
    'draft',
    'rendering',
    'awaiting_approval',
    'scheduled',
    'paused',
    'posted_linkedin',
    'posted_instagram'
);

-- 3. Confirmar que nao sobrou nenhum post viavel pros crons
SELECT status, COUNT(*) AS quantidade
FROM public.content_pipeline
GROUP BY status
ORDER BY status;

-- ============================================================
-- VERIFICACAO: Nenhum post com 'scheduled' deve aparecer
-- ============================================================
-- SELECT id, topic, status, scheduled_at 
-- FROM public.content_pipeline 
-- WHERE status = 'scheduled';
-- (deve retornar 0 linhas)
