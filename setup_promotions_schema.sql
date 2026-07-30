-- 1. Create Promotions Table
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  original_price NUMERIC(10, 2),
  promo_price NUMERIC(10, 2) NOT NULL,
  discount_percentage INT,
  store_name VARCHAR(100) NOT NULL, -- Amazon, Mercado Livre, Kabum, Shopee
  original_url TEXT NOT NULL,
  short_code VARCHAR(100) UNIQUE NOT NULL,
  image_url TEXT,
  telegram_message_id VARCHAR(100),
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy for Admin & Service Role
DROP POLICY IF EXISTS "Full access for admin on promotions" ON public.promotions;
CREATE POLICY "Full access for admin on promotions" ON public.promotions
  FOR ALL
  TO postgres, supabase_admin, service_role
  USING (true)
  WITH CHECK (true);

-- 4. Grant privileges
GRANT ALL ON public.promotions TO postgres, supabase_admin, service_role;
