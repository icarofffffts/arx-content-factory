-- ============================================================
-- NOVAS TABELAS: Users, Plans, Subscriptions & Sessions
-- ============================================================

-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PLANOS
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  max_posts_month INT DEFAULT 10,
  has_whatsapp_approval BOOLEAN DEFAULT FALSE,
  has_instagram BOOLEAN DEFAULT FALSE,
  has_linkedin BOOLEAN DEFAULT FALSE,
  has_github BOOLEAN DEFAULT FALSE,
  has_ai_suggestions BOOLEAN DEFAULT FALSE,
  has_lead_capture BOOLEAN DEFAULT FALSE,
  has_promo_hunter BOOLEAN DEFAULT FALSE,
  features JSONB DEFAULT '[]',
  highlighted BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ASSINATURA DO USUARIO
CREATE TABLE IF NOT EXISTS public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id),
  status VARCHAR(50) DEFAULT 'active',
  billing_cycle VARCHAR(10) DEFAULT 'monthly',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SESSOES / TOKENS
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEEDS: Planos padrao
-- ============================================================
INSERT INTO public.plans (name, slug, price_monthly, price_yearly, description, max_posts_month, has_whatsapp_approval, has_instagram, has_linkedin, has_ai_suggestions, features, highlighted, sort_order, active)
VALUES
  ('Gratuito', 'gratuito', 0, 0, 'Para criadores iniciantes', 10, FALSE, FALSE, FALSE, FALSE,
   '["Até 10 posts/mês","Acesso ao dashboard básico","Suporte por email"]',
   FALSE, 1, TRUE),
  ('Pro', 'pro', 97, 970, 'Para profissionais de marketing', 100, TRUE, TRUE, TRUE, TRUE,
   '["Até 100 posts/mês","Aprovação via WhatsApp","LinkedIn + Instagram","Sugestões de conteúdo IA","Suporte prioritário","Agendamento inteligente"]',
   TRUE, 2, TRUE),
  ('Enterprise', 'enterprise', 297, 2970, 'Para equipes e agências', 999999, TRUE, TRUE, TRUE, TRUE,
   '["Posts ilimitados","Aprovação via WhatsApp","LinkedIn + Instagram + GitHub","Sugestões de conteúdo IA","Captura de leads automática","PromoHunter integrado","Suporte dedicado 24/7","Onboarding personalizado"]',
   FALSE, 3, TRUE)
ON CONFLICT (slug) DO NOTHING;
