-- 1. Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_user_id VARCHAR(255) UNIQUE NOT NULL,
  instagram_handle VARCHAR(255),
  full_name VARCHAR(255),
  email VARCHAR(255),
  source_post_id UUID REFERENCES public.content_pipeline(id) ON DELETE SET NULL,
  is_following BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'following_verified', 'delivered'
  delivered_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy for Admin & Service Role
DROP POLICY IF EXISTS "Full access for admin on leads" ON public.leads;
CREATE POLICY "Full access for admin on leads" ON public.leads
  FOR ALL
  TO postgres, supabase_admin, service_role
  USING (true)
  WITH CHECK (true);

-- 4. Grant privileges
GRANT ALL ON public.leads TO postgres, supabase_admin, service_role;
