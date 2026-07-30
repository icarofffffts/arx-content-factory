CREATE TABLE IF NOT EXISTS public.dashboard_settings (
  id serial primary key,
  daily_limit int default 3,
  whatsapp_instance text default 'arx_bot',
  whatsapp_number text default '',
  whatsapp_enabled boolean default false,
  updated_at timestamp default now()
);
INSERT INTO public.dashboard_settings (daily_limit) VALUES (3) ON CONFLICT DO NOTHING;
