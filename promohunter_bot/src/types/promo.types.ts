export interface PromotionOffer {
  id?: string;
  title: string;
  original_price?: number;
  promo_price: number;
  discount_percentage?: number;
  store_name: string; // 'Amazon', 'Mercado Livre', 'Kabum', 'Shopee'
  original_url: string;
  short_code?: string;
  short_url?: string;
  image_url?: string;
  telegram_channel_id?: string;
  whatsapp_group_id?: string;
  clicks?: number;
  created_at?: Date;
}

export interface PromoBroadcastResult {
  success: boolean;
  offer: PromotionOffer;
  telegram_sent: boolean;
  whatsapp_sent: boolean;
  short_url: string;
}
