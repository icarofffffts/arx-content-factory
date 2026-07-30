export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'user'
  avatar_url?: string
  created_at: string
}

export interface Plan {
  id: string
  name: string
  slug: string
  price_monthly: number
  price_yearly: number
  description: string
  max_posts_month: number
  has_whatsapp_approval: boolean
  has_instagram: boolean
  has_linkedin: boolean
  has_github: boolean
  has_ai_suggestions: boolean
  has_lead_capture: boolean
  has_promo_hunter: boolean
  features: string[]
  highlighted: boolean
  sort_order: number
  subscription_status?: string
  billing_cycle?: string
  expires_at?: string
}

export interface Post {
  id: string
  topic: string
  slides_data: any
  media_paths: string[]
  instagram_media_paths: string[]
  status: string
  pdf_url?: string
  linkedin_caption?: string
  instagram_post_id?: string
  created_at: string
  scheduled_at?: string
  progress_percentage: number
}

export interface Metrics {
  total: number
  rendering: number
  scheduled: number
  paused: number
  posted_linkedin: number
  posted_instagram: number
  draft: number
  published: number
}

export interface Lead {
  id: string
  instagram_user_id: string
  instagram_handle: string
  full_name: string
  email: string
  is_following: boolean
  status: string
  delivered_url: string
  created_at: string
  source_post_topic: string
}

export interface Promo {
  id: string
  title: string
  original_price: number
  promo_price: number
  discount_percentage: number
  store_name: string
  original_url: string
  short_code: string
  short_url: string
  image_url: string
  clicks: number
  created_at: string
}

export interface ShortLink {
  id: string
  short_code: string
  original_url: string
  clicks: number
  created_at: string
  topic?: string
}
