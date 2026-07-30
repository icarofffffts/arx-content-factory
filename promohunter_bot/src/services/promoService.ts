import { Pool } from 'pg';
import { PromotionOffer, PromoBroadcastResult } from '../types/promo.types';
import crypto from 'crypto';
import fetch from 'node-fetch';

export class PromoService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'supabase_admin',
      host: '10.0.1.20',
      database: 'postgres',
      password: '635ddc870eca917c87aa2fcbf0abeef59fe5a4e5608f14b055d2884e7b163bfc',
      port: 5432,
    });
  }

  // 1. Calculate discount percentage
  calculateDiscount(original: number, promo: number): number {
    if (!original || original <= promo) return 0;
    return Math.round(((original - promo) / original) * 100);
  }

  // 2. Generate Hashed Short Link & Store Offer
  async createOffer(offerData: Partial<PromotionOffer>): Promise<PromotionOffer> {
    const origPrice = offerData.original_price || offerData.promo_price || 0;
    const promoPrice = offerData.promo_price || origPrice;
    const discountPct = this.calculateDiscount(origPrice, promoPrice);

    const hash = crypto.createHash('md5').update(offerData.original_url! + Date.now()).digest('hex').substring(0, 8);
    const shortCode = `promo_${hash}`;
    const shortUrl = `https://conteudos.icarodev.cloud/r/${shortCode}`;

    // Store in short_links table for click tracking
    await this.pool.query(`
      INSERT INTO public.short_links (short_code, original_url)
      VALUES ($1, $2) ON CONFLICT DO NOTHING;
    `, [shortCode, offerData.original_url]);

    // Store in promotions table
    const result = await this.pool.query(`
      INSERT INTO public.promotions (
        title, original_price, promo_price, discount_percentage,
        store_name, original_url, short_code, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `, [
      offerData.title,
      origPrice,
      promoPrice,
      discountPct,
      offerData.store_name || 'Loja Parceira',
      offerData.original_url,
      shortCode,
      offerData.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80'
    ]);

    const row = result.rows[0];
    return { ...row, short_url: shortUrl };
  }

  // 3. Generate Persuasive Copy for Telegram & WhatsApp
  generateCopy(offer: PromotionOffer): string {
    const discountBadge = offer.discount_percentage ? `🔥 ${offer.discount_percentage}% OFF!` : '⚡ SUPER OFERTA!';
    const origStr = offer.original_price && offer.original_price > offer.promo_price ? `~~R$ ${offer.original_price.toFixed(2)}~~ ➔ ` : '';

    return `
${discountBadge}
📦 *${offer.title}*

🛒 *Loja*: ${offer.store_name}
💰 *Preço Especial*: ${origStr}*R$ ${offer.promo_price.toFixed(2)}*

👉 *Garantir Desconto Agora*:
${offer.short_url}

⚠️ _Preço sujeito a alteração a qualquer momento. Corra!_
    `.trim();
  }

  // 4. Send to Telegram Channel API
  async sendTelegram(botToken: string, channelId: string, copy: string, imageUrl?: string): Promise<boolean> {
    try {
      if (!botToken || !channelId) return false;
      const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: channelId,
          photo: imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
          caption: copy,
          parse_mode: 'Markdown'
        })
      });
      const data = await res.json();
      return data.ok || false;
    } catch(e) {
      return false;
    }
  }

  // 5. Fetch all Active Promotions
  async getPromotions(): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT 
        p.id, p.title, p.original_price, p.promo_price, p.discount_percentage,
        p.store_name, p.original_url, p.short_code, p.image_url, p.created_at,
        COALESCE(s.clicks, 0) AS clicks
      FROM public.promotions p
      LEFT JOIN public.short_links s ON p.short_code = s.short_code
      ORDER BY p.created_at DESC LIMIT 50;
    `);
    return result.rows.map(r => ({
      ...r,
      short_url: `https://conteudos.icarodev.cloud/r/${r.short_code}`
    }));
  }
}
