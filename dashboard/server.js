const express = require('express');
const { Pool } = require('pg');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const MASTER_USER = 'admin';
const MASTER_PASS = 'arx_secret_2026!';
const MASTER_TOKEN = crypto.createHmac('sha256', 'arx_master_secret_key_2026').update(`${MASTER_USER}:${MASTER_PASS}`).digest('hex');

// PostgreSQL Database Connection
const pool = new Pool({
  user: 'supabase_admin',
  host: '10.0.1.20',
  database: 'postgres',
  password: '635ddc870eca917c87aa2fcbf0abeef59fe5a4e5608f14b055d2884e7b163bfc',
  port: 5432,
});

// Helper: Parse Cookie Header
function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const key = parts.shift().trim();
      if (key) {
        try { list[key] = decodeURIComponent(parts.join('=')); } catch(e){ list[key] = parts.join('='); }
      }
    });
  }
  return list;
}

// 1. Login API Endpoint
app.post('/api/login', (req, res) => {
  const username = (req.body.username || '').trim().toLowerCase();
  const password = (req.body.password || '').trim();

  if (username === MASTER_USER && password === MASTER_PASS) {
    res.setHeader('Set-Cookie', `arx_token=${MASTER_TOKEN}; Path=/; SameSite=Lax; Max-Age=864000`);
    return res.json({ success: true, token: MASTER_TOKEN });
  }
  return res.status(401).json({ success: false, error: 'Usuário ou senha incorretos! Use: admin / arx_secret_2026!' });
});

// Logout Endpoint
app.post('/api/logout', (req, res) => {
  res.setHeader('Set-Cookie', `arx_token=; Path=/; Max-Age=0`);
  return res.json({ success: true });
});

// Auth Middleware — only protect /api/ and /dashboard/; React landing page is public
app.use((req, res, next) => {
  const isProtected = req.path.startsWith('/api/') || req.path.startsWith('/dashboard/');
  if (!isProtected) return next();

  if (req.path === '/api/login' || req.path === '/api/v2/auth/login'
      || req.path === '/api/v2/auth/register' || req.path === '/api/v2/plans') {
    return next();
  }

  const cookies = parseCookies(req);
  const token = req.headers['authorization']?.replace('Bearer ', '') || 
                req.headers['x-arx-token'] || 
                req.query.token || 
                cookies.arx_token;

  if (token && token === MASTER_TOKEN) {
    return next();
  }

  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }

  return res.status(401).json({ error: 'Não autorizado. Realize o login em /dashboard/ primeiro.' });
});

// Serve Static Dashboard Files AFTER Auth Middleware
app.use('/dashboard', express.static(path.join(__dirname, 'public')));

// 2. API: Get Pipeline Metrics
app.get('/api/metrics', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        COUNT(CASE WHEN status = 'rendering' THEN 1 END) AS rendering,
        COUNT(CASE WHEN status = 'scheduled' THEN 1 END) AS scheduled,
        COUNT(CASE WHEN status = 'paused' THEN 1 END) AS paused,
        COUNT(CASE WHEN status = 'posted_linkedin' THEN 1 END) AS posted_linkedin,
        COUNT(CASE WHEN status = 'posted_instagram' THEN 1 END) AS posted_instagram,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) AS draft,
        COUNT(CASE WHEN status = 'published' THEN 1 END) AS published
      FROM public.content_pipeline;
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. API: Get Posts List
app.get('/api/posts', async (req, res) => {
  try {
    const statusFilter = req.query.status;
    let query = `
      SELECT 
        id, topic, slides_data, media_paths, instagram_media_paths, status, 
        pdf_url, linkedin_caption, instagram_post_id, created_at, scheduled_at,
        CASE 
          WHEN status = 'rendering' THEN 25
          WHEN status = 'scheduled' THEN 75
          WHEN status = 'paused' THEN 50
          ELSE 100
        END AS progress_percentage
      FROM public.content_pipeline
    `;
    const params = [];

    if (statusFilter && statusFilter !== 'all') {
      query += ` WHERE status = $1`;
      params.push(statusFilter);
    }

    query += ` ORDER BY created_at DESC LIMIT 50;`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. API: Publish Post Immediately (Publicar Agora)
app.post('/api/posts/:id/publish-now', async (req, res) => {
  try {
    const postId = req.params.id;

    const postRes = await pool.query(`SELECT topic, status FROM public.content_pipeline WHERE id = $1;`, [postId]);
    if (postRes.rows.length === 0) {
      return res.status(404).json({ error: 'Post nao encontrado.' });
    }

    // Acelera o pipeline: status='scheduled' com scheduled_at=NOW()
    // Assim o cron do LinkedIn/Instagram/GitHub pega na proxima execucao
    await pool.query(`
      UPDATE public.content_pipeline 
      SET scheduled_at = NOW(), status = 'scheduled', updated_at = NOW() 
      WHERE id = $1;
    `, [postId]);

    // Trigger os 3 webhooks de publicacao em paralelo
    const triggers = [
      { path: '/webhook/linkedin-publish' },
      { path: '/webhook/instagram-publish' },
      { path: '/webhook/github-publish' }
    ];

    triggers.forEach(({ path: webhookPath }) => {
      const reqN8n = https.request({
        hostname: 'n8n.arxsolutions.cloud',
        port: 443,
        path: webhookPath,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, () => {});
      reqN8n.on('error', () => {});
      reqN8n.end(JSON.stringify({ post_id: postId }));
    });

    res.json({ success: true, message: 'Publicacao acionada em LinkedIn, Instagram e GitHub!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. API: Reschedule Post to Future Date/Time
app.patch('/api/posts/:id/reschedule', async (req, res) => {
  try {
    const postId = req.params.id;
    const { scheduled_at } = req.body;

    if (!scheduled_at) {
      return res.status(400).json({ error: 'A nova data e hora de agendamento são obrigatórias!' });
    }

    const targetDate = new Date(`${scheduled_at}:00-03:00`);

    await pool.query(`
      UPDATE public.content_pipeline 
      SET scheduled_at = $1, status = 'scheduled', updated_at = NOW() 
      WHERE id = $2;
    `, [targetDate, postId]);

    res.json({ success: true, message: 'Agendamento atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. API: Toggle Pause / Resume Post Schedule
app.patch('/api/posts/:id/toggle-pause', async (req, res) => {
  try {
    const postId = req.params.id;

    const currentRes = await pool.query(`SELECT status FROM public.content_pipeline WHERE id = $1;`, [postId]);
    if (currentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    const currentStatus = currentRes.rows[0].status;
    const newStatus = currentStatus === 'paused' ? 'scheduled' : 'paused';

    await pool.query(`
      UPDATE public.content_pipeline 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2;
    `, [newStatus, postId]);

    res.json({ success: true, status: newStatus, message: newStatus === 'paused' ? 'Post pausado com sucesso!' : 'Agendamento retomado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. API: Reorganize All Scheduled Posts based on Market Benchmark & Explicit BRT Timezone (Segunda a Sexta - Mon-Fri)
app.post('/api/posts/reorganize-schedule', async (req, res) => {
  try {
    const postsRes = await pool.query(`
      SELECT id, topic FROM public.content_pipeline 
      WHERE status = 'scheduled' 
      ORDER BY created_at ASC;
    `);

    const scheduledPosts = postsRes.rows;
    if (scheduledPosts.length === 0) {
      return res.json({ success: true, message: 'Nenhuma matéria agendada para reorganizar.' });
    }

    // Benchmark Peak Slots in Horário de Brasília (BRT / UTC-3)
    const BENCHMARK_PEAK_SLOTS = [
      { hour: '08', minute: '45', label: 'LinkedIn Manhã (08h45 BRT)' },
      { hour: '12', minute: '15', label: 'LinkedIn & Instagram Almoço (12h15 BRT)' },
      { hour: '17', minute: '15', label: 'Instagram Fim de Tarde (17h15 BRT)' },
      { hour: '19', minute: '45', label: 'Instagram Noite (19h45 BRT)' }
    ];

    const GOLDEN_DAYS = [1, 2, 3, 4, 5]; // Mon, Tue, Wed, Thu, Fri (Segunda a Sexta)
    
    // Start tomorrow in BRT
    let curr = new Date();
    curr.setDate(curr.getDate() + 1);

    // Skip weekends (Saturday=6, Sunday=0)
    while (curr.getDay() === 0 || curr.getDay() === 6) {
      curr.setDate(curr.getDate() + 1);
    }

    let slotIndex = 0;
    const updatedList = [];

    for (const post of scheduledPosts) {
      const slot = BENCHMARK_PEAK_SLOTS[slotIndex];
      const yyyy = curr.getFullYear();
      const mm = String(curr.getMonth() + 1).padStart(2, '0');
      const dd = String(curr.getDate()).padStart(2, '0');
      
      const isoStr = `${yyyy}-${mm}-${dd}T${slot.hour}:${slot.minute}:00-03:00`;
      const targetDate = new Date(isoStr);

      await pool.query(`
        UPDATE public.content_pipeline
        SET scheduled_at = $1, updated_at = NOW()
        WHERE id = $2;
      `, [targetDate, post.id]);

      updatedList.push({
        id: post.id,
        topic: post.topic,
        scheduled_at: targetDate,
        slot_label: slot.label,
        is_golden_day: GOLDEN_DAYS.includes(curr.getDay())
      });

      slotIndex++;
      if (slotIndex >= BENCHMARK_PEAK_SLOTS.length) {
        slotIndex = 0;
        curr.setDate(curr.getDate() + 1);
        while (curr.getDay() === 0 || curr.getDay() === 6) {
          curr.setDate(curr.getDate() + 1);
        }
      }
    }

    res.json({
      success: true,
      message: `${scheduledPosts.length} matérias reorganizadas com fuso horário ajustado para o Brasil (BRT / UTC-3) incluindo Segundas-feiras!`,
      updated_posts: updatedList
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. API: Delete Post and Cleanup Media
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    const fetchRes = await pool.query(`SELECT media_paths, instagram_media_paths, pdf_url FROM public.content_pipeline WHERE id = $1`, [postId]);
    if (fetchRes.rows.length > 0) {
      const row = fetchRes.rows[0];
      const allMedia = [...(row.media_paths || []), ...(row.instagram_media_paths || [])];
      for (const mediaUrl of allMedia) {
        if (mediaUrl && mediaUrl.includes('icarodev.cloud')) {
          const fname = mediaUrl.split('/').pop();
          const localPath = path.join('/opt/content_factory/media', fname);
          if (fs.existsSync(localPath)) {
            try { fs.unlinkSync(localPath); } catch(e){}
          }
        }
      }
    }

    await pool.query(`DELETE FROM public.content_pipeline WHERE id = $1`, [postId]);
    res.json({ success: true, message: 'Post excluído permanentemente!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. API: Get Promotions List & Click Metrics
app.get('/api/v1/promos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, p.title, p.original_price, p.promo_price, p.discount_percentage,
        p.store_name, p.original_url, p.short_code, p.image_url, p.created_at,
        COALESCE(s.clicks, 0) AS clicks
      FROM public.promotions p
      LEFT JOIN public.short_links s ON p.short_code = s.short_code
      ORDER BY p.created_at DESC LIMIT 50;
    `);
    const promos = result.rows.map(r => ({
      ...r,
      short_url: `https://conteudos.icarodev.cloud/r/${r.short_code}`
    }));
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. API: Broadcast New Promo Offer to Telegram & WhatsApp
app.post('/api/v1/promos/broadcast', async (req, res) => {
  try {
    const { title, original_price, promo_price, store_name, original_url, image_url } = req.body;
    if (!title || !promo_price || !original_url) {
      return res.status(400).json({ error: 'Título, Preço Promocional e URL Original são obrigatórios!' });
    }

    const origPrice = parseFloat(original_price || promo_price);
    const pPrice = parseFloat(promo_price);
    const discountPct = origPrice > pPrice ? Math.round(((origPrice - pPrice) / origPrice) * 100) : 0;

    const hash = crypto.createHash('md5').update(original_url + Date.now()).digest('hex').substring(0, 8);
    const shortCode = `promo_${hash}`;
    const shortUrl = `https://conteudos.icarodev.cloud/r/${shortCode}`;

    await pool.query(`
      INSERT INTO public.short_links (short_code, original_url)
      VALUES ($1, $2) ON CONFLICT DO NOTHING;
    `, [shortCode, original_url]);

    const result = await pool.query(`
      INSERT INTO public.promotions (
        title, original_price, promo_price, discount_percentage,
        store_name, original_url, short_code, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `, [title, origPrice, pPrice, discountPct, store_name || 'Loja Parceira', original_url, shortCode, image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80']);

    res.json({ success: true, promotion: result.rows[0], short_url: shortUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. API: Get Leads List
app.get('/api/v1/leads', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.id, l.instagram_user_id, l.instagram_handle, l.full_name, 
        l.email, l.is_following, l.status, l.delivered_url, l.created_at,
        p.topic AS source_post_topic
      FROM public.leads l
      LEFT JOIN public.content_pipeline p ON l.source_post_id = p.id
      ORDER BY l.created_at DESC LIMIT 100;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. API: Get Lead Statistics
app.get('/api/v1/leads/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total_leads,
        COUNT(CASE WHEN is_following = true THEN 1 END) AS followers_verified,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_count
      FROM public.leads;
    `);
    const row = result.rows[0];
    const total = parseInt(row.total_leads || '0', 10);
    const delivered = parseInt(row.delivered_count || '0', 10);
    const rate = total > 0 ? ((delivered / total) * 100).toFixed(1) + '%' : '0%';

    res.json({
      total_leads: total,
      followers_verified: parseInt(row.followers_verified || '0', 10),
      delivered_count: delivered,
      conversion_rate: rate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. API: Webhook for DM Lead Processing
app.post('/api/v1/leads/dm-webhook', async (req, res) => {
  try {
    const { sender_id, sender_handle, full_name, email, post_id, is_following, message_text } = req.body;
    if (!sender_id) return res.status(400).json({ error: 'sender_id é obrigatório' });

    let deliveredUrl = null;
    if (message_text) {
      const hash = crypto.createHash('md5').update(message_text + Date.now()).digest('hex').substring(0, 8);
      const shortCode = `r_${hash}`;
      await pool.query(`
        INSERT INTO public.short_links (short_code, original_url, post_id)
        VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;
      `, [shortCode, message_text, post_id || null]);
      deliveredUrl = `https://conteudos.icarodev.cloud/r/${shortCode}`;
    }

    const result = await pool.query(`
      INSERT INTO public.leads (
        instagram_user_id, instagram_handle, full_name, email,
        source_post_id, is_following, status, delivered_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (instagram_user_id) DO UPDATE SET
        instagram_handle = COALESCE(EXCLUDED.instagram_handle, public.leads.instagram_handle),
        full_name = COALESCE(EXCLUDED.full_name, full_name),
        email = COALESCE(EXCLUDED.email, email),
        source_post_id = COALESCE(EXCLUDED.source_post_id, post_id),
        is_following = EXCLUDED.is_following,
        status = EXCLUDED.status,
        delivered_url = COALESCE(EXCLUDED.delivered_url, deliveredUrl),
        updated_at = NOW()
      RETURNING *;
    `, [
      sender_id,
      sender_handle || null,
      full_name || null,
      email || null,
      post_id || null,
      is_following ?? true,
      is_following ? 'delivered' : 'pending',
      deliveredUrl
    ]);

    res.json({ success: true, lead: result.rows[0], delivered_url: deliveredUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14. API: Generate Secure Hashed Short Link
app.post('/api/shorten', async (req, res) => {
  try {
    const { original_url, post_id } = req.body;
    if (!original_url) return res.status(400).json({ error: 'A URL original é obrigatória!' });

    const hash = crypto.createHash('md5').update(original_url + Date.now()).digest('hex').substring(0, 8);
    const shortCode = `r_${hash}`;

    const result = await pool.query(`
      INSERT INTO public.short_links (short_code, original_url, post_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (short_code) DO UPDATE SET original_url = EXCLUDED.original_url
      RETURNING short_code, original_url, clicks;
    `, [shortCode, original_url, post_id || null]);

    const shortUrl = `https://conteudos.icarodev.cloud/r/${shortCode}`;
    res.json({ success: true, short_code: shortCode, short_url: shortUrl, original_url, clicks: result.rows[0].clicks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 15. API: Get All Hashed Short Links
app.get('/api/shortlinks', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.short_code, s.original_url, s.clicks, s.created_at, p.topic
      FROM public.short_links s
      LEFT JOIN public.content_pipeline p ON s.post_id = p.id
      ORDER BY s.created_at DESC LIMIT 50;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 16. Secure Hashed Link Resolver & Click Tracker (`/r/:code`)
app.get('/r/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const result = await pool.query(`
      UPDATE public.short_links 
      SET clicks = clicks + 1 
      WHERE short_code = $1 
      RETURNING original_url;
    `, [code]);

    if (result.rows.length === 0) {
      return res.status(404).send('<h2>Link seguro expirado ou não encontrado.</h2>');
    }

    const targetUrl = result.rows[0].original_url;
    res.redirect(targetUrl);
  } catch (err) {
    res.status(500).send('Erro ao redirecionar.');
  }
});

// 17. API: Trigger New Custom Content Generation with Schedule Options
app.post('/api/generate', async (req, res) => {
  try {
    const { topic, channel, publish_mode, scheduled_at } = req.body;
    if (!topic) return res.status(400).json({ error: 'O tema é obrigatório!' });

    const params = new URLSearchParams({
      topic,
      channel: channel || 'all',
      publish_mode: publish_mode || 'now'
    });
    if (scheduled_at) params.append('scheduled_at', `${scheduled_at}:00-03:00`);

    const reqN8n = https.get({
      hostname: 'n8n.arxsolutions.cloud',
      port: 443,
      path: `/webhook/content-factory?${params.toString()}`,
      headers: { 'Accept': 'application/json' }
    }, (resN8n) => {
      let data = '';
      resN8n.on('data', c => data += c);
      resN8n.on('end', () => res.json({ success: true, message: publish_mode === 'now' ? 'Geração e publicação imediata iniciadas!' : 'Matéria agendada com sucesso para a data solicitada!' }));
    });

    reqN8n.on('error', (e) => res.json({ success: true, message: 'Solicitação enviada para a fila de processamento!' }));
    reqN8n.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 18. API: Get Drafts for Review
app.get('/api/drafts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, topic, slides_data, media_paths, instagram_media_paths,
             pdf_url, linkedin_caption, created_at
      FROM public.content_pipeline
      WHERE status = 'draft'
      ORDER BY created_at DESC LIMIT 20;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 19. API: Approve Draft (draft -> scheduled)
app.post('/api/drafts/:id/approve', async (req, res) => {
  try {
    const postId = req.params.id;
    const postRes = await pool.query(`SELECT status FROM public.content_pipeline WHERE id = $1;`, [postId]);
    if (postRes.rows.length === 0) return res.status(404).json({ error: 'Post nao encontrado.' });

    await pool.query(`
      UPDATE public.content_pipeline
      SET status = 'scheduled', scheduled_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND status = 'draft';
    `, [postId]);

    res.json({ success: true, message: 'Draft aprovado e agendado para publicacao!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 20. API: Reject Draft (delete)
app.post('/api/drafts/:id/reject', async (req, res) => {
  try {
    const postId = req.params.id;
    await pool.query(`DELETE FROM public.content_pipeline WHERE id = $1 AND status = 'draft';`, [postId]);
    res.json({ success: true, message: 'Draft rejeitado e removido.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 21. API: Get Dashboard Settings
app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM public.dashboard_settings ORDER BY id DESC LIMIT 1;`);
    if (result.rows.length === 0) {
      return res.json({ daily_limit: 3, whatsapp_enabled: false, whatsapp_number: '', whatsapp_instance: 'arx_bot', whatsapp_instance_token: '' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 22. API: Update Dashboard Settings
app.put('/api/settings', async (req, res) => {
  try {
    const { daily_limit, whatsapp_enabled, whatsapp_number, whatsapp_instance, whatsapp_instance_token } = req.body;
    try {
      await pool.query(`
        UPDATE public.dashboard_settings
        SET daily_limit = $1, whatsapp_enabled = $2, whatsapp_number = $3,
            whatsapp_instance = $4, whatsapp_instance_token = $5, updated_at = NOW()
        WHERE id = (SELECT max(id) FROM public.dashboard_settings);
      `, [daily_limit ?? 3, whatsapp_enabled ?? false, whatsapp_number || '', whatsapp_instance || 'arx_bot', whatsapp_instance_token || '']);
    } catch (dbErr) {
      await pool.query(`
        UPDATE public.dashboard_settings
        SET daily_limit = $1, whatsapp_enabled = $2, whatsapp_number = $3,
            whatsapp_instance = $4, updated_at = NOW()
        WHERE id = (SELECT max(id) FROM public.dashboard_settings);
      `, [daily_limit ?? 3, whatsapp_enabled ?? false, whatsapp_number || '', whatsapp_instance || 'arx_bot']);
    }
    res.json({ success: true, message: 'Configuracoes salvas!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 23. API: Send Draft Preview to WhatsApp via Evolution Go
app.post('/api/drafts/:id/send-whatsapp', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await pool.query(`SELECT id, topic, slides_data FROM public.content_pipeline WHERE id = $1 AND status = 'draft';`, [postId]);
    if (post.rows.length === 0) return res.status(404).json({ error: 'Draft nao encontrado' });

    const settings = await pool.query(`SELECT * FROM public.dashboard_settings ORDER BY id DESC LIMIT 1;`);
    const s = settings.rows[0] || {};
    if (!s.whatsapp_enabled || !s.whatsapp_number) {
      return res.status(400).json({ error: 'WhatsApp nao configurado. Ative nas Configuracoes.' });
    }

    const instanceToken = s.whatsapp_instance_token || process.env.EVOLUTION_INSTANCE_TOKEN || '26cbfa77-76c5-489c-9c98-bd2ce4ed6e8d';
    const topic = post.rows[0].topic || 'Sem titulo';
    const slidesData = post.rows[0].slides_data;
    let slideText = '';
    if (slidesData) {
      const slides = typeof slidesData === 'string' ? JSON.parse(slidesData) : slidesData;
      if (Array.isArray(slides)) slideText = slides.map(s => s.title || s.content || '').join('\n');
    }

    const preview = `📋 *Novo Conteudo para Revisao!*\n\n*Topico:* ${topic}\n\n${slideText ? `*Slides:*\n${slideText.substring(0, 500)}\n\n` : ''}Para aprovar, acesse o Dashboard.`;

    const payload = JSON.stringify({
      number: s.whatsapp_number,
      text: preview,
      delay: 1000,
      quoted: { messageId: '', participant: '' }
    });

    const options = {
      hostname: '185.111.156.178',
      port: 9091,
      path: '/send/text',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instanceToken,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const evoReq = http.request(options, (evoRes) => {
      let body = '';
      evoRes.on('data', c => body += c);
      evoRes.on('end', () => {
        res.json({ success: true, message: 'Preview enviado via WhatsApp!', evolution_response: evoRes.statusCode, body });
      });
    });
    evoReq.on('error', (err) => res.status(500).json({ error: 'Erro Evolution Go: ' + err.message }));
    evoReq.write(payload);
    evoReq.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 24. API: Approve Draft with WhatsApp notification
app.post('/api/drafts/:id/approve-and-notify', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await pool.query(`UPDATE public.content_pipeline SET status = 'scheduled', scheduled_at = NOW() + INTERVAL '15 minutes' WHERE id = $1 AND status = 'draft' RETURNING topic;`, [postId]);
    if (post.rows.length === 0) return res.status(404).json({ error: 'Draft nao encontrado' });

    const settings = await pool.query(`SELECT * FROM public.dashboard_settings ORDER BY id DESC LIMIT 1;`);
    const s = settings.rows[0] || {};
    const instanceToken = s.whatsapp_instance_token || process.env.EVOLUTION_INSTANCE_TOKEN || '26cbfa77-76c5-489c-9c98-bd2ce4ed6e8d';

    if (s.whatsapp_enabled && s.whatsapp_number) {
      const confirmMsg = JSON.stringify({
        number: s.whatsapp_number,
        text: `✅ *Conteudo Aprovado!*\n\n"${post.rows[0].topic}" foi agendado para publicacao em 15 minutos.`,
        delay: 1000,
        quoted: { messageId: '', participant: '' }
      });
      const opts = {
        hostname: '185.111.156.178', port: 9091,
        path: '/send/text',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': instanceToken, 'Content-Length': Buffer.byteLength(confirmMsg) }
      };
      const r2 = http.request(opts);
      r2.on('error', () => {});
      r2.write(confirmMsg);
      r2.end();
    }

    res.json({ success: true, message: 'Draft aprovado! Publicacao em 15 minutos.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// V2 API — Auth & User Management
// ============================================================

// Helper: generate random token
function genToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Helper: hash password
function hashPassword(pw) {
  return crypto.createHmac('sha256', 'arx_user_salt_2026').update(pw).digest('hex');
}

// V2 Auth: Register
app.post('/api/v2/auth/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });
    if (password.length < 6) return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });

    const existing = await pool.query('SELECT id FROM public.users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Email já cadastrado' });

    const password_hash = hashPassword(password);
    const user = await pool.query(`
      INSERT INTO public.users (email, password_hash, full_name, role)
      VALUES ($1, $2, $3, 'user') RETURNING id, email, full_name, role, created_at
    `, [email.toLowerCase().trim(), password_hash, full_name || '']);

    // Assign Gratuito plan by default
    const plan = await pool.query(`SELECT id FROM public.plans WHERE slug = 'gratuito' LIMIT 1`);
    if (plan.rows.length > 0) {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 10); // "gratuito" never expires
      await pool.query(`
        INSERT INTO public.user_plans (user_id, plan_id, status, billing_cycle, expires_at)
        VALUES ($1, $2, 'active', 'monthly', $3)
      `, [user.rows[0].id, plan.rows[0].id, expires]);
    }

    const token = genToken();
    const tokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await pool.query(`
      INSERT INTO public.sessions (user_id, token, expires_at) VALUES ($1, $2, $3)
    `, [user.rows[0].id, token, tokenExpires]);

    res.json({ success: true, user: user.rows[0], token, expires_at: tokenExpires });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// V2 Auth: Login (with admin fallback)
app.post('/api/v2/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });

    // Fallback: hardcoded admin (email admin@arx.dev ou usuario 'admin')
    const cleanEmail = email.toLowerCase().trim();
    if ((cleanEmail === 'admin@arx.dev' || cleanEmail === MASTER_USER) && password === MASTER_PASS) {
      const token = genToken();
      const tokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return res.json({
        success: true,
        user: { id: 'admin', email: 'admin@arx.dev', full_name: 'Administrador', role: 'admin' },
        plan: { name: 'Enterprise', slug: 'enterprise', max_posts_month: 999999, has_whatsapp_approval: true, has_instagram: true, has_linkedin: true, has_github: true, has_ai_suggestions: true, has_lead_capture: true, has_promo_hunter: true },
        token,
        expires_at: tokenExpires
      });
    }

    const password_hash = hashPassword(password);
    const user = await pool.query(`
      SELECT id, email, full_name, role, avatar_url, created_at
      FROM public.users WHERE email = $1 AND password_hash = $2
    `, [email.toLowerCase().trim(), password_hash]);

    if (user.rows.length === 0) return res.status(401).json({ error: 'Email ou senha incorretos' });

    const token = genToken();
    const tokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await pool.query(`
      INSERT INTO public.sessions (user_id, token, expires_at) VALUES ($1, $2, $3)
    `, [user.rows[0].id, token, tokenExpires]);

    // Get active plan
    const plan = await pool.query(`
      SELECT pl.id, pl.name, pl.slug, pl.price_monthly, pl.max_posts_month,
             pl.has_whatsapp_approval, pl.has_instagram, pl.has_linkedin,
             pl.has_github, pl.has_ai_suggestions, pl.has_lead_capture, pl.has_promo_hunter,
             up.status AS subscription_status, up.billing_cycle, up.expires_at
      FROM public.user_plans up
      JOIN public.plans pl ON up.plan_id = pl.id
      WHERE up.user_id = $1 AND up.status = 'active'
      ORDER BY up.created_at DESC LIMIT 1
    `, [user.rows[0].id]);

    res.json({
      success: true,
      user: user.rows[0],
      plan: plan.rows[0] || null,
      token,
      expires_at: tokenExpires
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// V2 Auth: Logout
app.post('/api/v2/auth/logout', async (req, res) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-arx-token'];
    if (token) await pool.query('DELETE FROM public.sessions WHERE token = $1', [token]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// V2 Auth: Me (current user)
app.get('/api/v2/auth/me', async (req, res) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-arx-token'];
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    const session = await pool.query(`
      SELECT u.id, u.email, u.full_name, u.role, u.avatar_url, u.created_at
      FROM public.sessions s
      JOIN public.users u ON s.user_id = u.id
      WHERE s.token = $1 AND s.expires_at > NOW()
    `, [token]);

    if (session.rows.length === 0) return res.status(401).json({ error: 'Sessão expirada ou inválida' });

    const plan = await pool.query(`
      SELECT pl.id, pl.name, pl.slug, pl.price_monthly, pl.max_posts_month,
             pl.has_whatsapp_approval, pl.has_instagram, pl.has_linkedin,
             pl.has_github, pl.has_ai_suggestions, pl.has_lead_capture, pl.has_promo_hunter,
             up.status AS subscription_status, up.billing_cycle, up.expires_at
      FROM public.user_plans up
      JOIN public.plans pl ON up.plan_id = pl.id
      WHERE up.user_id = $1 AND up.status = 'active'
      ORDER BY up.created_at DESC LIMIT 1
    `, [session.rows[0].id]);

    res.json({ success: true, user: session.rows[0], plan: plan.rows[0] || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// V2: List Plans
app.get('/api/v2/plans', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, slug, price_monthly, price_yearly, description,
             max_posts_month, has_whatsapp_approval, has_instagram, has_linkedin,
             has_github, has_ai_suggestions, has_lead_capture, has_promo_hunter,
             features, highlighted, sort_order
      FROM public.plans WHERE active = TRUE ORDER BY sort_order ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// V2: Subscribe to plan
app.post('/api/v2/plans/subscribe', async (req, res) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-arx-token'];
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    const session = await pool.query(`
      SELECT user_id FROM public.sessions WHERE token = $1 AND expires_at > NOW()
    `, [token]);
    if (session.rows.length === 0) return res.status(401).json({ error: 'Sessão inválida' });

    const { plan_slug, billing_cycle } = req.body;
    if (!plan_slug) return res.status(400).json({ error: 'Plano obrigatório' });

    const plan = await pool.query('SELECT id FROM public.plans WHERE slug = $1 AND active = TRUE', [plan_slug]);
    if (plan.rows.length === 0) return res.status(404).json({ error: 'Plano não encontrado' });

    // Cancel old active subscriptions
    await pool.query(`
      UPDATE public.user_plans SET status = 'cancelled', cancelled_at = NOW()
      WHERE user_id = $1 AND status = 'active'
    `, [session.rows[0].user_id]);

    const expires = new Date();
    if (plan_slug === 'gratuito') {
      expires.setFullYear(expires.getFullYear() + 10);
    } else if (billing_cycle === 'yearly') {
      expires.setFullYear(expires.getFullYear() + 1);
    } else {
      expires.setMonth(expires.getMonth() + 1);
    }

    await pool.query(`
      INSERT INTO public.user_plans (user_id, plan_id, status, billing_cycle, expires_at)
      VALUES ($1, $2, 'active', $3, $4)
    `, [session.rows[0].user_id, plan.rows[0].id, billing_cycle || 'monthly', expires]);

    res.json({ success: true, message: 'Plano ativado com sucesso!', expires_at: expires });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// Serve React Frontend Build (se existir)
// ============================================================
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  // Serve static files from React build
  app.use(express.static(frontendDist));

  // SPA fallback: React routes serve index.html (exceto API, /r/)
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/') || req.path.startsWith('/r/')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

const PORT = 9878;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Arx Content Factory Master Dashboard running on port ${PORT}`);
});
