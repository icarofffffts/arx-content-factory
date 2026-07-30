-- 1. Enable Row Level Security on content_pipeline
ALTER TABLE public.content_pipeline ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy for supabase_admin and postgres full access
DROP POLICY IF EXISTS "Full access for admin" ON public.content_pipeline;
CREATE POLICY "Full access for admin" ON public.content_pipeline
  FOR ALL
  TO postgres, supabase_admin, service_role
  USING (true)
  WITH CHECK (true);

-- 3. Create Short Links table for secure hashed DM links
CREATE TABLE IF NOT EXISTS public.short_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(32) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  post_id UUID REFERENCES public.content_pipeline(id) ON DELETE CASCADE,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS on short_links
ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Full access for admin on short_links" ON public.short_links;
CREATE POLICY "Full access for admin on short_links" ON public.short_links
  FOR ALL
  TO postgres, supabase_admin, service_role
  USING (true)
  WITH CHECK (true);

-- Grant privileges
GRANT ALL ON public.content_pipeline TO postgres, supabase_admin, service_role;
GRANT ALL ON public.short_links TO postgres, supabase_admin, service_role;
