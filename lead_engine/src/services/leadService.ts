import { Pool } from 'pg';
import { Lead, LeadStats, DMEventPayload } from '../types/lead.types';
import crypto from 'crypto';

export class LeadService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'supabase_admin',
      host: process.env.DB_HOST || '10.0.1.20',
      database: process.env.DB_NAME || 'postgres',
      password: process.env.DB_PASSWORD || 'REDACTED_OLD_DB_PASSWORD',
      port: parseInt(process.env.DB_PORT || '5432', 10),
    });
  }

  // 1. Save or Update Lead from DM interaction
  async upsertLead(data: Partial<Lead>): Promise<Lead> {
    const query = `
      INSERT INTO public.leads (
        instagram_user_id, instagram_handle, full_name, email, 
        source_post_id, is_following, status, delivered_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (instagram_user_id) DO UPDATE SET
        instagram_handle = COALESCE(EXCLUDED.instagram_handle, public.leads.instagram_handle),
        full_name = COALESCE(EXCLUDED.full_name, public.leads.full_name),
        email = COALESCE(EXCLUDED.email, public.leads.email),
        source_post_id = COALESCE(EXCLUDED.source_post_id, public.leads.source_post_id),
        is_following = EXCLUDED.is_following,
        status = EXCLUDED.status,
        delivered_url = COALESCE(EXCLUDED.delivered_url, public.leads.delivered_url),
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      data.instagram_user_id,
      data.instagram_handle || null,
      data.full_name || null,
      data.email || null,
      data.source_post_id || null,
      data.is_following ?? false,
      data.status || 'pending',
      data.delivered_url || null
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // 2. Fetch all leads with post topic details
  async getLeads(): Promise<any[]> {
    const query = `
      SELECT 
        l.id, l.instagram_user_id, l.instagram_handle, l.full_name, 
        l.email, l.is_following, l.status, l.delivered_url, l.created_at,
        p.topic AS source_post_topic
      FROM public.leads l
      LEFT JOIN public.content_pipeline p ON l.source_post_id = p.id
      ORDER BY l.created_at DESC LIMIT 100;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  // 3. Get Lead Stats & Conversion Metrics
  async getLeadStats(): Promise<LeadStats> {
    const query = `
      SELECT 
        COUNT(*) AS total_leads,
        COUNT(CASE WHEN is_following = true THEN 1 END) AS followers_verified,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_count
      FROM public.leads;
    `;
    const result = await this.pool.query(query);
    const row = result.rows[0];
    const total = parseInt(row.total_leads || '0', 10);
    const delivered = parseInt(row.delivered_count || '0', 10);
    const rate = total > 0 ? ((delivered / total) * 100).toFixed(1) + '%' : '0%';

    return {
      total_leads: total,
      followers_verified: parseInt(row.followers_verified || '0', 10),
      delivered_count: delivered,
      conversion_rate: rate
    };
  }

  // 4. Generate Hashed DM Delivery URL for a lead
  async generateSecureDMUrl(originalUrl: string, postId?: string): Promise<string> {
    const hash = crypto.createHash('md5').update(originalUrl + Date.now()).digest('hex').substring(0, 8);
    const shortCode = `r_${hash}`;

    await this.pool.query(`
      INSERT INTO public.short_links (short_code, original_url, post_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (short_code) DO NOTHING;
    `, [shortCode, originalUrl, postId || null]);

    return `https://conteudos.icarodev.cloud/r/${shortCode}`;
  }
}
