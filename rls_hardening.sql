-- ============================================================
-- RLS HARDENING — Arx Content Factory (Supabase/Postgres)
-- ============================================================
-- Objetivo: defesa em profundidade. O app acessa via Express
-- (supabase_admin, BYPASSRLS). PostgREST/kong NÃO é exposto
-- publicamente hoje, mas se um dia vazar (key anon, port forward,
-- config errada), anon/authenticated NÃO podem ler/escrever nada
-- sensível.
--
-- Tabelas PÚBLICAS por design (mantidas com policies públicas):
--   convites (SELECT pago+ativo), temas (SELECT ativo),
--   rsvp (INSERT + SELECT via convite ativo), plans (SELECT),
--   templates (SELECT), categories (SELECT)
--
-- Tabelas SENSÍVEIS (revoga anon/authenticated, RLS ON, policy
-- service_role documental — já é bypass): todas as demais.
-- ============================================================

BEGIN;

-- 1. REVOGAR grants de anon/authenticated nas tabelas sensíveis
REVOKE ALL ON public.users              FROM anon, authenticated;
REVOKE ALL ON public.sessions           FROM anon, authenticated;
REVOKE ALL ON public.api_keys           FROM anon, authenticated;
REVOKE ALL ON public.social_accounts    FROM anon, authenticated;
REVOKE ALL ON public.whatsapp_instances FROM anon, authenticated;
REVOKE ALL ON public.settings           FROM anon, authenticated;
REVOKE ALL ON public.system_settings    FROM anon, authenticated;
REVOKE ALL ON public.content_pipeline   FROM anon, authenticated;
REVOKE ALL ON public.short_links        FROM anon, authenticated;
REVOKE ALL ON public.leads              FROM anon, authenticated;
REVOKE ALL ON public.promotions         FROM anon, authenticated;
REVOKE ALL ON public.clientes           FROM anon, authenticated;
REVOKE ALL ON public.pagamentos         FROM anon, authenticated;
REVOKE ALL ON public.demo_requests      FROM anon, authenticated;
REVOKE ALL ON public.ai_assistant_memory FROM anon, authenticated;
REVOKE ALL ON public.ai_vps_log         FROM anon, authenticated;
REVOKE ALL ON public.ia_model_preference FROM anon, authenticated;
REVOKE ALL ON public.generation_claims  FROM anon, authenticated;
REVOKE ALL ON public.dashboard_settings FROM anon, authenticated;
REVOKE ALL ON public.contacts           FROM anon, authenticated;
REVOKE ALL ON public.events             FROM anon, authenticated;
REVOKE ALL ON public.interactions       FROM anon, authenticated;
REVOKE ALL ON public.tasks              FROM anon, authenticated;
REVOKE ALL ON public.user_plans         FROM anon, authenticated;
REVOKE ALL ON public.profiles           FROM anon, authenticated;
REVOKE ALL ON public.categories         FROM anon, authenticated;
REVOKE ALL ON public.templates          FROM anon, authenticated;
REVOKE ALL ON public.plans              FROM anon, authenticated;
REVOKE ALL ON public.convites           FROM anon, authenticated;
REVOKE ALL ON public.rsvp               FROM anon, authenticated;
REVOKE ALL ON public.temas              FROM anon, authenticated;

-- 2. HABILITAR RLS em todas as tabelas do app
ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pipeline   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_links        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assistant_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_vps_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_model_preference ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_claims   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convites            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temas               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans               ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES documentais service_role (bypass real, mas fica
--    explícito caso role() mude) + policies públicas onde
--    o design exige acesso público.
DROP POLICY IF EXISTS "service_role_users" ON public.users;
CREATE POLICY "service_role_users" ON public.users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_sessions" ON public.sessions;
CREATE POLICY "service_role_sessions" ON public.sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_api_keys" ON public.api_keys;
CREATE POLICY "service_role_api_keys" ON public.api_keys
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_social_accounts" ON public.social_accounts;
CREATE POLICY "service_role_social_accounts" ON public.social_accounts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_whatsapp_instances" ON public.whatsapp_instances;
CREATE POLICY "service_role_whatsapp_instances" ON public.whatsapp_instances
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_settings" ON public.settings;
CREATE POLICY "service_role_settings" ON public.settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_system_settings" ON public.system_settings;
CREATE POLICY "service_role_system_settings" ON public.system_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_content_pipeline" ON public.content_pipeline;
CREATE POLICY "service_role_content_pipeline" ON public.content_pipeline
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_short_links" ON public.short_links;
CREATE POLICY "service_role_short_links" ON public.short_links
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_leads" ON public.leads;
CREATE POLICY "service_role_leads" ON public.leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_promotions" ON public.promotions;
CREATE POLICY "service_role_promotions" ON public.promotions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_clientes" ON public.clientes;
CREATE POLICY "service_role_clientes" ON public.clientes
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_pagamentos" ON public.pagamentos;
CREATE POLICY "service_role_pagamentos" ON public.pagamentos
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_demo_requests" ON public.demo_requests;
CREATE POLICY "service_role_demo_requests" ON public.demo_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_ai_memory" ON public.ai_assistant_memory;
CREATE POLICY "service_role_ai_memory" ON public.ai_assistant_memory
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_ai_vps_log" ON public.ai_vps_log;
CREATE POLICY "service_role_ai_vps_log" ON public.ai_vps_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_ia_model" ON public.ia_model_preference;
CREATE POLICY "service_role_ia_model" ON public.ia_model_preference
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_generation_claims" ON public.generation_claims;
CREATE POLICY "service_role_generation_claims" ON public.generation_claims
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_dashboard_settings" ON public.dashboard_settings;
CREATE POLICY "service_role_dashboard_settings" ON public.dashboard_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_contacts" ON public.contacts;
CREATE POLICY "service_role_contacts" ON public.contacts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_events" ON public.events;
CREATE POLICY "service_role_events" ON public.events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_interactions" ON public.interactions;
CREATE POLICY "service_role_interactions" ON public.interactions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_tasks" ON public.tasks;
CREATE POLICY "service_role_tasks" ON public.tasks
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_user_plans" ON public.user_plans;
CREATE POLICY "service_role_user_plans" ON public.user_plans
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_profiles" ON public.profiles;
CREATE POLICY "service_role_profiles" ON public.profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_convites" ON public.convites;
CREATE POLICY "service_role_convites" ON public.convites
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_rsvp" ON public.rsvp;
CREATE POLICY "service_role_rsvp" ON public.rsvp
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_temas" ON public.temas;
CREATE POLICY "service_role_temas" ON public.temas
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_categories" ON public.categories;
CREATE POLICY "service_role_categories" ON public.categories
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_templates" ON public.templates;
CREATE POLICY "service_role_templates" ON public.templates
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_plans" ON public.plans;
CREATE POLICY "service_role_plans" ON public.plans
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 4. POLICIES PÚBLICAS (design público — convites/temas/rsvp)
--    Mantidas/recriadas explicitamente para acesso anon seguro.
DROP POLICY IF EXISTS "convites_public" ON public.convites;
CREATE POLICY "convites_public" ON public.convites
  FOR SELECT TO anon, authenticated
  USING (ativo = true AND status_pagamento = 'pago');

DROP POLICY IF EXISTS "temas_public" ON public.temas;
CREATE POLICY "temas_public" ON public.temas
  FOR SELECT TO anon, authenticated
  USING (ativo = true);

DROP POLICY IF EXISTS "rsvp_insert" ON public.rsvp;
CREATE POLICY "rsvp_insert" ON public.rsvp
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "rsvp_read" ON public.rsvp;
CREATE POLICY "rsvp_read" ON public.rsvp
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM convites c WHERE c.id = rsvp.convite_id AND c.ativo = true));

DROP POLICY IF EXISTS "plans_public" ON public.plans;
CREATE POLICY "plans_public" ON public.plans
  FOR SELECT TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "templates_public" ON public.templates;
CREATE POLICY "templates_public" ON public.templates
  FOR SELECT TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "categories_public" ON public.categories;
CREATE POLICY "categories_public" ON public.categories
  FOR SELECT TO anon, authenticated
  USING (true);

-- 5. GRANTS públicos mínimos (PostgREST anon/authenticated)
GRANT SELECT ON public.convites TO anon, authenticated;
GRANT SELECT ON public.temas   TO anon, authenticated;
GRANT SELECT, INSERT ON public.rsvp TO anon, authenticated;
GRANT SELECT ON public.plans       TO anon, authenticated;
GRANT SELECT ON public.templates   TO anon, authenticated;
GRANT SELECT ON public.categories  TO anon, authenticated;
-- rsvp INSERT precisa de nextval na sequence serial
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 6. GRANTS service_role (full) — documental, bypass RLS de qq forma
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- 7. FORCE RLS (não permitir dono bypassar)
ALTER TABLE public.users              FORCE ROW LEVEL SECURITY;
ALTER TABLE public.sessions           FORCE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys           FORCE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts    FORCE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_instances FORCE ROW LEVEL SECURITY;
ALTER TABLE public.settings           FORCE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings    FORCE ROW LEVEL SECURITY;
ALTER TABLE public.content_pipeline   FORCE ROW LEVEL SECURITY;
ALTER TABLE public.short_links        FORCE ROW LEVEL SECURITY;
ALTER TABLE public.leads              FORCE ROW LEVEL SECURITY;
ALTER TABLE public.promotions         FORCE ROW LEVEL SECURITY;
ALTER TABLE public.clientes           FORCE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos         FORCE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests      FORCE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assistant_memory FORCE ROW LEVEL SECURITY;
ALTER TABLE public.ai_vps_log          FORCE ROW LEVEL SECURITY;
ALTER TABLE public.ia_model_preference FORCE ROW LEVEL SECURITY;
ALTER TABLE public.generation_claims   FORCE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_settings  FORCE ROW LEVEL SECURITY;
ALTER TABLE public.contacts            FORCE ROW LEVEL SECURITY;
ALTER TABLE public.events              FORCE ROW LEVEL SECURITY;
ALTER TABLE public.interactions        FORCE ROW LEVEL SECURITY;
ALTER TABLE public.tasks               FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans          FORCE ROW LEVEL SECURITY;
ALTER TABLE public.profiles            FORCE ROW LEVEL SECURITY;
ALTER TABLE public.convites            FORCE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp                FORCE ROW LEVEL SECURITY;
ALTER TABLE public.temas               FORCE ROW LEVEL SECURITY;
ALTER TABLE public.categories          FORCE ROW LEVEL SECURITY;
ALTER TABLE public.templates           FORCE ROW LEVEL SECURITY;
ALTER TABLE public.plans               FORCE ROW LEVEL SECURITY;

COMMIT;