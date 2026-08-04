// ============================================================
// IA ArxDevs — Assistente Telegram da Arx Content Factory
// Bot Telegram com acesso total à VPS, conhecimento do Obsidian
// e ao sistema da Arx. Só responde ao Ícaro (OWNER_ID).
// ============================================================
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'supabase_admin',
  host: process.env.DB_HOST || '10.0.1.20',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// ─── Config ────────────────────────────────────────────────
const OWNER_ID = parseInt(process.env.TG_OWNER_ID || '5531995398002'); // Telegram user_id do dono
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || '';
const KB_DIR = '/opt/content_factory/ai-knowledge';
const TG_API = `https://api.telegram.org/bot${TG_BOT_TOKEN}`;
const MAX_REPLY = 4000; // limite por mensagem Telegram

// ─── Knowledge base (carregada uma vez no boot) ────────────
let KB_SYSTEM = '';
let KB_KEYS = '';

function loadKnowledge() {
  try {
    if (!fs.existsSync(KB_DIR)) return;
    const files = fs.readdirSync(KB_DIR).filter(f => f.endsWith('.md'));
    const parts = [];
    for (const f of files) {
      const full = path.join(KB_DIR, f);
      let content = fs.readFileSync(full, 'utf8');
      if (content.length > 40000) content = content.slice(0, 40000) + '\n...[TRUNCADO]';
      parts.push(`### Fonte: ${f}\n${content}`);
    }
    KB_SYSTEM = parts.join('\n\n---\n\n');
    const keysPath = path.join(KB_DIR, 'KEYS.md');
    if (fs.existsSync(keysPath)) KB_KEYS = fs.readFileSync(keysPath, 'utf8');
    console.log(`[ia-arxdevs] knowledge base: ${files.length} arquivos carregados`);
  } catch (e) {
    console.error('[ia-arxdevs] loadKnowledge error:', e.message);
  }
}

// ─── Memória por conversa (Telegram user_id) ───────────────
async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.ai_assistant_memory (
      id BIGSERIAL PRIMARY KEY,
      phone TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_ai_memory_phone ON public.ai_assistant_memory (phone, created_at);
  `).catch(e => console.error('[ia-arxdevs] ensureTables:', e.message));
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.ia_model_preference (
      user_id TEXT PRIMARY KEY,
      model TEXT NOT NULL DEFAULT 'deepseek-v4-flash',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `).catch(e => console.error('[ia-arxdevs] ensureTables model_preference:', e.message));
}

async function getUserModel(userId) {
  const r = await pool.query(
    `SELECT model FROM public.ia_model_preference WHERE user_id = $1`,
    [String(userId)]
  ).catch(e => ({ rows: [] }));
  return r.rows[0]?.model || process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
}

async function setUserModel(userId, model) {
  await pool.query(
    `INSERT INTO public.ia_model_preference (user_id, model, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id) DO UPDATE SET model = $2, updated_at = NOW()`,
    [String(userId), model]
  ).catch(e => console.error('[ia-arxdevs] setUserModel:', e.message));
}

async function getMemory(userId, limit = 16) {
  // NOVO: prioriza system_summary + últimas 10 msgs normais
  const userIdStr = String(userId);
  
  // 1. Buscar system_summary (se existir)
  const summaryRes = await pool.query(
    `SELECT role, content FROM public.ai_assistant_memory
     WHERE phone = $1 AND role = 'system_summary'
     ORDER BY created_at DESC LIMIT 1`,
    [userIdStr]
  );
  
  // 2. Buscar últimas 10 msgs normais (user/assistant, excluindo system_summary)
  const normalRes = await pool.query(
    `SELECT role, content FROM public.ai_assistant_memory
     WHERE phone = $1 AND role IN ('user', 'assistant')
     ORDER BY created_at DESC LIMIT 10`,
    [userIdStr]
  );
  
  const normalMsgs = normalRes.rows.reverse();
  
  // 3. Montar array: [summary?, ...last10]
  const result = [];
  if (summaryRes.rows.length > 0) {
    result.push({ role: 'system', content: summaryRes.rows[0].content });
  }
  result.push(...normalMsgs.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })));
  
  return result;
}

// NOVO: Sumariza mensagens antigas quando conversa passa de 20 msgs
async function summarizeOldMessages(userId) {
  const userIdStr = String(userId);
  
  try {
    // Contar total de msgs normais (user/assistant)
    const countRes = await pool.query(
      `SELECT COUNT(*)::int AS total FROM public.ai_assistant_memory
       WHERE phone = $1 AND role IN ('user', 'assistant')`,
      [userIdStr]
    );
    
    const total = countRes.rows[0].total;
    
    // Só sumarizar se passou de 20 msgs
    if (total <= 20) return false;
    
    // Buscar as 10 mais antigas (excluindo as últimas 10 recentes)
    const oldRes = await pool.query(
      `SELECT id, role, content FROM public.ai_assistant_memory
       WHERE phone = $1 AND role IN ('user', 'assistant')
       ORDER BY created_at ASC
       LIMIT $2`,
      [userIdStr, Math.max(0, total - 10)]
    );
    
    if (oldRes.rows.length === 0) return false;
    
    // Montar contexto pra sumarizar
    const contextLines = oldRes.rows.map(r => `${r.role}: ${r.content}`).join('\n');
    const prompt = `Resuma em 3 bullets o contexto desta conversa:\n\n${contextLines}`;
    
    // Chamar DeepSeek pra sumarizar
    const summaryRes = await chatCompletionWithFallback(
      [{ role: 'user', content: prompt }],
      null,
      'none',
      'deepseek-v4-flash'
    );
    
    const summary = (summaryRes.choices && summaryRes.choices[0] && summaryRes.choices[0].message && summaryRes.choices[0].message.content) 
      ? summaryRes.choices[0].message.content.trim() 
      : '';
    
    if (!summary) {
      console.error('[ia-arxdevs] summarizeOldMessages: DeepSeek retornou summary vazio');
      return false;
    }
    
    // Salvar como system_summary (substituir anterior se existir)
    await pool.query(
      `DELETE FROM public.ai_assistant_memory WHERE phone = $1 AND role = 'system_summary'`,
      [userIdStr]
    );
    await pool.query(
      `INSERT INTO public.ai_assistant_memory (phone, role, content)
       VALUES ($1, 'system_summary', $2)`,
      [userIdStr, summary.slice(0, 1000)]
    );
    
    // Opcional: deletar msgs antigas que foram sumarizadas (limpar espaço)
    const oldIds = oldRes.rows.map(r => r.id);
    if (oldIds.length > 0) {
      await pool.query(
        `DELETE FROM public.ai_assistant_memory
         WHERE id = ANY($1) AND role IN ('user', 'assistant')`,
        [oldIds]
      );
    }
    
    console.log(`[ia-arxdevs] memória sumarizada para user ${userId}: ${oldRes.rows.length} msgs antigas → 1 summary`);
    return true;
  } catch (e) {
    console.error('[ia-arxdevs] summarizeOldMessages error:', e.message);
    return false;
  }
}

async function saveMemory(userId, role, content) {
  if (!content) return;
  await pool.query(
    `INSERT INTO public.ai_assistant_memory (phone, role, content) VALUES ($1, $2, $3)`,
    [String(userId), role, String(content).slice(0, 6000)]
  ).catch(e => console.error('[ia-arxdevs] saveMemory:', e.message));
}

// ── Envio via Telegram API ────────────────────────────────
function tgSendText(chatId, text) {
  return new Promise((resolve) => {
    if (!TG_BOT_TOKEN) return resolve({ status: 0, body: 'TG_BOT_TOKEN não configurada' });

    const send = (payload) => new Promise((res2) => {
      const body = JSON.stringify(payload);
      const req = https.request(`${TG_API}/sendMessage`, {
        method: 'POST', timeout: 15000,
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => res2({ status: res.statusCode, body: data }));
      });
      req.on('error', (err) => res2({ status: 0, body: err.message }));
      req.on('timeout', () => { req.destroy(); res2({ status: 0, body: 'timeout' }); });
      req.write(body);
      req.end();
    });

    (async () => {
      // 1ª tentativa: com Markdown (negrito/listas bonitos)
      let r = await send({ chat_id: chatId, text, parse_mode: 'Markdown', disable_web_page_preview: true });
      // Se falhou por parse de entidades → reenvia em texto puro
      if (r.status !== 200) {
        r = await send({ chat_id: chatId, text, disable_web_page_preview: true });
      }
      resolve(r);
    })();
  });
}

function tgSendTyping(chatId) {
  const body = JSON.stringify({ chat_id: chatId, action: 'typing' });
  https.request(`${TG_API}/sendChatAction`, {
    method: 'POST', timeout: 5000,
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  }, (r) => r.resume()).end(body);
}

// Responde callback_query (remove o "loading" do botão)
function tgAnswerCallback(callbackQueryId, text) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ callback_query_id: callbackQueryId, text: String(text || '').slice(0, 200) });
    https.request(`${TG_API}/answerCallbackQuery`, {
      method: 'POST', timeout: 8000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (r) => { r.resume(); r.on('end', () => resolve({ status: r.statusCode })); })
      .on('error', () => resolve({ status: 0 }))
      .end(body);
  });
}

// Envia mensagem com botões inline (callback_data)
function tgSendKeyboard(chatId, text, buttons) {
  return new Promise((resolve) => {
    if (!TG_BOT_TOKEN) return resolve({ status: 0, body: 'TG_BOT_TOKEN não configurada' });
    const keyboard = { inline_keyboard: [buttons.map(b => ({ text: b.text, callback_data: b.data }))] };
    const payload = { chat_id: chatId, text, parse_mode: 'Markdown', disable_web_page_preview: true, reply_markup: JSON.stringify(keyboard) };
    const body = JSON.stringify(payload);
    const req = https.request(`${TG_API}/sendMessage`, {
      method: 'POST', timeout: 15000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', (err) => resolve({ status: 0, body: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    req.write(body);
    req.end();
  });
}

// ─── Access log da VPS ─────────────────────────────────────
async function logVps(userId, kind, detail) {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS public.ai_vps_log (
        id BIGSERIAL PRIMARY KEY, phone TEXT NOT NULL, kind TEXT NOT NULL,
        detail TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
    );
    await pool.query(
      `INSERT INTO public.ai_vps_log (phone, kind, detail) VALUES ($1, $2, $3)`,
      [String(userId), kind, String(detail).slice(0, 2000)]
    );
  } catch (e) { console.error('[ia-arxdevs] logVps:', e.message); }
}

// ─── VPS: executa comando ──────────────────────────────────
const DESTRUCTIVE_PATTERNS = [
  /\brm\s+-rf\s+(\/|\/\*|\*)/, /\bmkfs/, /\bdd\s+if=/, /\bshutdown/, /\bpoweroff/,
  /\breboot/, /\binit\s+0/, /\bDROP\s+(TABLE|DATABASE)/, /\bTRUNCATE\s+/, /\b:\(\)\s*\{/,
  /\bchmod\s+-R\s+777\s+\//, />\s*\/dev\/(sda|sdb|nvme)/, /\bgit\s+push\s+.*--force/,
  /\bcurl\s+.*\|\s*(ba)?sh/, /systemctl\s+(stop|disable|mask)\s+(content-dashboard|postgres|supabase)/,
];
function isDestructive(cmd) { return DESTRUCTIVE_PATTERNS.some(re => re.test(cmd)); }

async function vpsRun(command, confirm, userId) {
  if (!command || !String(command).trim()) return 'Comando vazio.';
  const cmd = String(command).trim();
  if (isDestructive(cmd) && confirm !== 'sim') {
    return '️ Comando potencialmente destrutivo detectado. Para confirmar que realmente quer rodar, responda com: *confirmar* e eu executo: `' + cmd.slice(0, 120) + '`';
  }
  await logVps(userId, 'run', cmd);
  return new Promise((resolve) => {
    exec(cmd, { timeout: 90000, maxBuffer: 2 * 1024 * 1024, shell: '/bin/bash' }, (err, stdout, stderr) => {
      const out = String(stdout || '').trim();
      const errOut = String(stderr || '').trim();
      let result = '';
      if (out) result += out.slice(0, 3500);
      if (errOut) result += (result ? '\n' : '') + '⚠️ stderr: ' + errOut.slice(0, 1000);
      if (!result) result = err ? `(exit ${err.code || '?'}) sem output` : '(sem output)';
      resolve(result.slice(0, 4000) || '(sem output)');
    });
  });
}

async function vpsWriteFile(filePath, content, userId) {
  if (!filePath) return 'Caminho obrigatório.';
  const target = String(filePath);
  await logVps(userId, 'write', `${target} (${String(content || '').length} bytes)`);
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, String(content || ''), 'utf8');
    return `✅ Arquivo gravado em \`${target}\` (${String(content || '').length} bytes)`;
  } catch (e) { return '❌ Erro ao gravar: ' + e.message; }
}

// ── Tools: acesso ao sistema de conteúdo ──────────────────
async function getMetrics() {
  const r = await pool.query(`SELECT status, COUNT(*)::int AS total FROM public.content_pipeline GROUP BY status ORDER BY total DESC`).catch(e => ({ rows: [{ error: e.message }] }));
  return JSON.stringify(r.rows);
}
async function getRecentPosts(limit = 5) {
  const r = await pool.query(`SELECT id, topic, status, channel, scheduled_at, created_at FROM public.content_pipeline ORDER BY created_at DESC LIMIT $1`, [Math.min(parseInt(limit) || 5, 20)]).catch(e => ({ rows: [{ error: e.message }] }));
  return JSON.stringify(r.rows);
}
async function searchPosts(query = '', limit = 5) {
  const r = await pool.query(`SELECT id, topic, status, channel, created_at FROM public.content_pipeline WHERE topic ILIKE '%' || $1 || '%' ORDER BY created_at DESC LIMIT $2`, [String(query || ''), Math.min(parseInt(limit) || 5, 20)]).catch(e => ({ rows: [{ error: e.message }] }));
  return JSON.stringify(r.rows);
}
async function getDrafts() {
  const r = await pool.query(`SELECT id, topic, channel, created_at, wa_status FROM public.content_pipeline WHERE status = 'draft' OR status = 'pending' ORDER BY created_at DESC LIMIT 10`).catch(e => ({ rows: [{ error: e.message }] }));
  return JSON.stringify(r.rows);
}
async function getAnalytics(days = 14) {
  const r = await pool.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'published')::int AS published, COUNT(*) FILTER (WHERE status = 'draft')::int AS drafts, COUNT(DISTINCT channel)::int AS canais FROM public.content_pipeline WHERE created_at > NOW() - ($1 || ' days')::interval`, [Math.min(parseInt(days) || 14, 90)]).catch(e => ({ rows: [{ error: e.message }] }));
  return JSON.stringify(r.rows);
}
async function getSystemStatus() {
  const checks = [];
  try { const r = await pool.query('SELECT 1'); checks.push({ db: r.rows.length ? 'ok' : 'erro' }); } catch (e) { checks.push({ db: 'erro: ' + e.message }); }
  checks.push({ n8n: await pingHttp('https://n8n.arxsolutions.cloud/healthz') });
  checks.push({ evolution: await pingHttp('http://localhost:9091/instance/status') });
  return JSON.stringify(checks);
}
function pingHttp(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 6000 }, (res) => { resolve(res.statusCode < 500 ? 'ok' : 'http ' + res.statusCode); res.resume(); });
    req.on('error', () => resolve('offline'));
    req.on('timeout', () => { req.destroy(); resolve('timeout'); });
  });
}
async function generateContent(topic, channel = 'all', template = '', publishMode = 'draft') {
  const mode = String(publishMode || 'draft') === 'now' ? 'now' : 'draft';
  const params = new URLSearchParams({ topic: String(topic || ''), channel, publish_mode: mode });
  if (template) params.set('template', template);
  const n8nReply = await new Promise((resolve) => {
    const req = https.get({ hostname: 'n8n.arxsolutions.cloud', port: 443, path: '/webhook/content-factory?' + params.toString(), timeout: 120000 }, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d.slice(0, 800) }));
    });
    req.on('error', (e) => resolve({ status: 0, body: 'erro: ' + e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: 'timeout (geração pode seguir em background)' }); });
  });
  let created = null;
  try {
    const r = await pool.query(`SELECT id, topic, status, channel, slides_data FROM public.content_pipeline WHERE topic ILIKE '%' || $1 || '%' OR topic = $1 ORDER BY created_at DESC LIMIT 1`, [String(topic).slice(0, 60)]);
    if (r.rows.length) created = r.rows[0];
  } catch (e) { /* não bloqueia */ }
  if (created) {
    let slidesCount = 0;
    try { const sd = typeof created.slides_data === 'string' ? JSON.parse(created.slides_data) : created.slides_data; if (Array.isArray(sd)) slidesCount = sd.length; } catch (_) {}
    return `✅ Conteúdo CRIADO!\nID: ${created.id}\nTópico: ${created.topic}\nStatus: ${created.status}\nCanal: ${created.channel}\nSlides: ${slidesCount}`;
  }
  return `🤔 Chamei o n8n para gerar "${topic}" (HTTP ${n8nReply.status}), mas ainda não localizei o post no banco.`;
}
async function getPostContent(id) {
  const r = await pool.query(`SELECT id, topic, status, channel, slides_data, linkedin_caption FROM public.content_pipeline WHERE id = $1`, [id]).catch(e => ({ rows: [{ error: e.message }] }));
  if (!r.rows.length) return 'Post não encontrado com esse ID.';
  const p = r.rows[0];
  if (p.error) return 'Erro: ' + p.error;
  let slidesText = '';
  try {
    const sd = typeof p.slides_data === 'string' ? JSON.parse(p.slides_data) : p.slides_data;
    if (Array.isArray(sd)) slidesText = sd.map((s, i) => `${i + 1}. ${s.title || ''}\n   ${s.body || ''}${s.quote ? `\n   💬 ${s.quote}` : ''}`).join('\n');
  } catch (_) {}
  const cap = p.linkedin_caption ? `\n\nLegenda: ${String(p.linkedin_caption).slice(0, 600)}` : '';
  return `📄 *${p.topic}*\nStatus: ${p.status} | Canal: ${p.channel}\n\n${slidesText.slice(0, 3000)}${cap}`;
}
async function sendDraftPreview(id, userId) {
  const content = await getPostContent(id);
  if (content.startsWith('Post não encontrado') || content.startsWith('Erro')) return content;
  const msg = ` *Preview do conteúdo criado*\n\n${content}\n\nToca no botão pra **aprovar** (agenda em 15 min) ou **rejeitar** (remove o draft):`;
  const res = await tgSendKeyboard(userId, msg.slice(0, 4000), [
    { text: '✅ Aprovar', data: `approve_${id}` },
    { text: '❌ Rejeitar', data: `reject_${id}` },
  ]);
  return res.status === 200 ? `📤 Preview enviado no Telegram com botões de aprovação! Resumo: ${content.split('\n')[0]}` : `❌ Falha ao enviar preview (HTTP ${res.status}).`;
}
async function approvePost(id) {
  const r = await pool.query(`UPDATE public.content_pipeline SET status = 'scheduled', scheduled_at = NOW() + INTERVAL '15 minutes' WHERE id = $1 RETURNING topic`, [id]).catch(e => ({ rows: [{ error: e.message }] }));
  if (!r.rows.length) return 'Post não encontrado ou não aprovável.';
  return `✅ Post aprovado e agendado para publicação em 15 min: "${r.rows[0].topic || id}"`;
}
async function rejectPost(id) {
  const r = await pool.query(`DELETE FROM public.content_pipeline WHERE id = $1 RETURNING topic`, [id]).catch(e => ({ rows: [{ error: e.message }] }));
  if (!r.rows.length) return 'Post não encontrado.';
  return `🗑️ Post removido: "${r.rows[0].topic || id}"`;
}
function getKeys(userId) {
  if (String(userId) !== String(OWNER_ID)) return '⛔ Acesso negado. As chaves de acesso são restritas ao dono do sistema.';
  if (!KB_KEYS) return 'Arquivo KEYS.md não encontrado na knowledge base.';
  return `🔐 Chaves e credenciais da Arx:\n\n${KB_KEYS.slice(0, 3500)}`;
}

// ─── Tool catalog (function calling) ──────────────────────
const TOOLS = [
  { type: 'function', function: { name: 'get_metrics', description: 'Contadores de posts por status (published, draft, scheduled, pending...)', parameters: { type: 'object', properties: {} } } },
  { type: 'function', function: { name: 'get_recent_posts', description: 'Lista os posts mais recentes', parameters: { type: 'object', properties: { limit: { type: 'integer', description: 'quantidade (default 5)' } } } } },
  { type: 'function', function: { name: 'search_posts', description: 'Busca posts por palavra-chave no tópico', parameters: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'integer' } }, required: ['query'] } } },
  { type: 'function', function: { name: 'get_drafts', description: 'Lista drafts/posts aguardando aprovação', parameters: { type: 'object', properties: {} } } },
  { type: 'function', function: { name: 'get_analytics', description: 'Resumo analítico de produção (total, publicados, drafts) nos últimos N dias', parameters: { type: 'object', properties: { days: { type: 'integer' } } } } },
  { type: 'function', function: { name: 'get_system_status', description: 'Status dos serviços (banco, n8n, Evolution)', parameters: { type: 'object', properties: {} } } },
  { type: 'function', function: { name: 'generate_content', description: 'CRIA conteúdo de verdade: dispara o gerador da Arx (n8n Fluxo 1) para um tópico e retorna o post criado. publish_mode="now" publica direto; "draft" (default) deixa como rascunho aguardando aprovação.', parameters: { type: 'object', properties: { topic: { type: 'string' }, channel: { type: 'string', enum: ['all', 'instagram', 'linkedin', 'twitter'] }, template: { type: 'string' }, publish_mode: { type: 'string', enum: ['draft', 'now'], description: '"now" = publicar imediatamente, "draft" = criar rascunho' } }, required: ['topic'] } } },
  { type: 'function', function: { name: 'get_post_content', description: 'Busca o conteúdo completo (slides, legenda) de um post pelo ID', parameters: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } } },
  { type: 'function', function: { name: 'send_draft_preview', description: 'Envia o preview do conteúdo criado no Telegram com opção de aprovar (SIM) ou rejeitar (NAO)', parameters: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } } },
  { type: 'function', function: { name: 'approve_post', description: 'Aprova um draft e agenda publicação (15 min)', parameters: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } } },
  { type: 'function', function: { name: 'reject_post', description: 'Rejeita/remove um draft', parameters: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } } },
  { type: 'function', function: { name: 'get_keys', description: 'Retorna as chaves e credenciais da Arx (RESTRITO ao dono)', parameters: { type: 'object', properties: {} } } },
  { type: 'function', function: { name: 'vps_run', description: 'EXECUTA QUALQUER comando shell na VPS da Arx (docker, systemctl, nginx, apt...). Acesso DevOps total.', parameters: { type: 'object', properties: { command: { type: 'string' }, confirm: { type: 'string', description: 'coloque "sim" apenas se o comando for destrutivo e o dono já confirmou' } }, required: ['command'] } } },
  { type: 'function', function: { name: 'vps_write_file', description: 'Cria ou edita um arquivo na VPS (docker-compose.yml, systemd unit, nginx conf, scripts, .env...)', parameters: { type: 'object', properties: { filePath: { type: 'string' }, content: { type: 'string' } }, required: ['filePath', 'content'] } } },
  { type: 'function', function: { name: 'list_models', description: 'Lista os modelos de IA disponíveis (DeepSeek V4 Flash e V4 Pro) com descrições', parameters: { type: 'object', properties: {} } } },
  { type: 'function', function: { name: 'set_model', description: 'Altera o modelo de IA preferido para as próximas mensagens do usuário', parameters: { type: 'object', properties: { model: { type: 'string', enum: ['deepseek-v4-flash', 'deepseek-v4-pro'], description: 'ID do modelo a usar' } }, required: ['model'] } } },
  { type: 'function', function: { name: 'get_current_model', description: 'Retorna qual modelo está sendo usado atualmente nas conversas', parameters: { type: 'object', properties: {} } } },
];

async function runTool(name, args, userId) {
  const a = args || {};
  try {
    switch (name) {
      case 'get_metrics': return await getMetrics();
      case 'get_recent_posts': return await getRecentPosts(a.limit);
      case 'search_posts': return await searchPosts(a.query, a.limit);
      case 'get_drafts': return await getDrafts();
      case 'get_analytics': return await getAnalytics(a.days);
      case 'get_system_status': return await getSystemStatus();
      case 'generate_content': return await generateContent(a.topic, a.channel, a.template, a.publish_mode);
      case 'get_post_content': return await getPostContent(a.id);
      case 'send_draft_preview': return String(userId) === String(OWNER_ID) ? await sendDraftPreview(a.id, userId) : '⛔ Apenas o dono.';
      case 'approve_post': return String(userId) === String(OWNER_ID) ? await approvePost(a.id) : ' Apenas o dono.';
      case 'reject_post': return String(userId) === String(OWNER_ID) ? await rejectPost(a.id) : '⛔ Apenas o dono.';
      case 'get_keys': return getKeys(userId);
      case 'vps_run': return String(userId) === String(OWNER_ID) ? await vpsRun(a.command, a.confirm, userId) : '⛔ Apenas o dono.';
      case 'vps_write_file': return String(userId) === String(OWNER_ID) ? await vpsWriteFile(a.filePath, a.content, userId) : ' Apenas o dono.';
      case 'list_models': return AVAILABLE_MODELS.map(m => `• *${m.name}* (\`${m.id}\`) — ${m.description}`).join('\n');
      case 'set_model': {
        const valid = AVAILABLE_MODELS.find(m => m.id === a.model);
        if (!valid) return `❌ Modelo inválido. Use: ${AVAILABLE_MODELS.map(m => m.id).join(', ')}`;
        await setUserModel(userId, a.model);
        return `✅ Modelo alterado para *${valid.name}*.`;
      }
      case 'get_current_model': {
        const current = await getUserModel(userId);
        const info = AVAILABLE_MODELS.find(m => m.id === current);
        return info ? `Modelo atual: *${info.name}* (\`${info.id}\`)` : `Modelo atual: \`${current}\``;
      }
      default: return 'Tool desconhecida: ' + name;
    }
  } catch (e) { return 'Erro na tool ' + name + ': ' + e.message; }
}

// ─── DeepSeek (OpenAI-compatible) ──────────────────────────
const AVAILABLE_MODELS = [
  { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', description: 'Rápido e econômico (padrão)' },
  { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', description: 'Mais inteligente, ideal para tarefas complexas' },
];

function chatCompletion(messages, tools, toolChoice, model) {
  return new Promise((resolve, reject) => {
    const key = process.env.DEEPSEEK_API_KEY || '';
    if (!key) return reject(new Error('DEEPSEEK_API_KEY não configurada no servidor.'));
    const body = JSON.stringify({ model: model || 'deepseek-v4-flash', messages, tools, tool_choice: toolChoice || 'auto', max_tokens: 4000 });
    const req = https.request({ hostname: 'api.deepseek.com', port: 443, path: '/chat/completions', method: 'POST', timeout: 60000,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key, 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { const j = JSON.parse(data); if (j.error) return reject(new Error(j.error.message || 'erro DeepSeek')); resolve(j); }
        catch (e) { reject(new Error('resposta inválida DeepSeek: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('DeepSeek timeout')); });
    req.write(body);
    req.end();
  });
}

async function chatCompletionWithFallback(messages, tools, toolChoice, preferredModel) {
  try {
    return await chatCompletion(messages, tools, toolChoice, preferredModel);
  } catch (e) {
    console.error(`[ia-arxdevs] falha com ${preferredModel}: ${e.message}, tentando fallback...`);
    // Fallback: tentar o outro modelo
    const fallbackModel = preferredModel === 'deepseek-v4-pro' ? 'deepseek-v4-flash' : 'deepseek-v4-pro';
    try {
      const result = await chatCompletion(messages, tools, toolChoice, fallbackModel);
      result._usedFallback = true;
      result._fallbackModel = fallbackModel;
      return result;
    } catch (e2) {
      throw new Error(`Ambos os modelos falharam: ${preferredModel} (${e.message}) e ${fallbackModel} (${e2.message})`);
    }
  }
}

// ─── System prompt ─────────────────────────────────────────
function buildSystemPrompt(userId) {
  const isOwner = String(userId) === String(OWNER_ID);
  return `Você é a IA ArxDevs, a inteligência artificial oficial da Arx Solutions — empresa do Ícaro (dono).
Você conversa com ele pelo Telegram, como copiloto técnico e de produto.

PERSONALIDADE: direta, técnica, amigável em PT-BR, tom casual porém profissional. Responde curto (a menos que peça detalhes), usa markdown simples (*negrito*, listas) e emojis com moderação.

SEU CONHECIMENTO (base da Arx):
${KB_SYSTEM.slice(0, 20000)}

REGRAS DE ACESSO:
- O dono do sistema é o usuário Telegram ID ${OWNER_ID}. ${isOwner ? 'Você está falando com o DONO: acesso total, incluindo KEYS.' : 'Você está falando com um usuário NÃO autorizado: não revele nenhuma chave, credencial, senha ou dado sensível. Responda que o acesso é restrito.'}
- NUNCA revele chaves, tokens, senhas ou credenciais para quem não for o dono.
- Dados de clientes são confidenciais.

COMO AJUDAR:
1. Copiloto de ideias: quando o Ícaro jogar ideias de projetos, avalie com base no que existe na Arx (infra, roadmap, fluxos n8n, API v1, whitelabel, marketplace). Sugira o que dá pra fazer reusando o que já existe, estime esforço, aponte riscos e proponha próximos passos concretos.
2. DevOps com acesso TOTAL à VPS (arxdevsvps, root@185.111.156.178): você pode EXECUTAR QUALQUER comando via vps_run (docker ps/up/down/logs, systemctl, nginx, apt, criar pastas) e CRIAR ARQUIVOS via vps_write_file (docker-compose.yml, systemd units, nginx confs, .env, scripts). Quando o Ícaro pedir para "criar um serviço", "subir algo", "instalar X", "ver os logs de Y", use essas tools DE VERDADE e reporte o resultado real. Inspecione antes de agir. Nunca invente output — se um comando falhou, diga que falhou. Comandos destrutivos exigem confirmação do Ícaro antes.
3. Acesso ao sistema de conteúdo: use as tools para consultar métricas, posts, drafts, status, analytics. Quando o Ícaro mandar "cria um post sobre X": chame generate_content (publish_mode='draft'), depois SEMPRE envie o preview com botões (send_draft_preview) e, se ele aprovar, use approve_post. Quando ele mandar "posta"/"publica um post sobre X": use generate_content com publish_mode='now' (publicação IMEDIATA, sem pedir aprovação).
4. Conhecimento: responda dúvidas sobre a plataforma, arquitetura, roadmap e documentação.

FORMATO: no Telegram, respostas objetivas. Para listas use linhas com - ou números. Se precisar de dados do sistema, chame a tool ANTES de responder.`;
}

// ─── Agente (loop function calling) ────────────────────────
async function runAgent(userId, userName, userText) {
  const memory = await getMemory(userId);
  const preferredModel = await getUserModel(userId);
  const messages = [
    { role: 'system', content: buildSystemPrompt(userId) },
    ...memory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userText },
  ];

  let finalText = '';
  let toolCalls = 0;
  let msgs = messages;
  let usedModel = preferredModel;

  while (toolCalls < 8) {
    // Depois de 3 rodadas de tools, força o modelo a responder (sem novas tools),
    // evitando loop infinito de investigação que engole tokens e cai no fallback.
    const forceAnswer = toolCalls >= 3;
    const res = await chatCompletionWithFallback(msgs, TOOLS, forceAnswer ? 'none' : 'auto', preferredModel);
    if (res._usedFallback) usedModel = res._fallbackModel;
    const choice = res.choices && res.choices[0];
    if (!choice) throw new Error('DeepSeek sem resposta');
    const msg = choice.message;

    if (msg.tool_calls && msg.tool_calls.length && !forceAnswer) {
      toolCalls++;
      msgs.push({ role: 'assistant', content: msg.content || '', tool_calls: msg.tool_calls });
      for (const tc of msg.tool_calls) {
        let result;
        try {
          const args = JSON.parse(tc.function.arguments || '{}');
          result = await runTool(tc.function.name, args, userId);
        } catch (e) { result = 'Erro ao executar tool: ' + e.message; }
        msgs.push({ role: 'tool', tool_call_id: tc.id, content: String(result) });
      }
      continue;
    }
    finalText = msg.content || '';
    if (finalText.trim()) break;
    // content vazio (ex.: reasoning engoliu max_tokens): força uma resposta final curta
    const forced = await chatCompletionWithFallback(msgs, TOOLS, 'none', preferredModel);
    const fmsg = forced.choices && forced.choices[0] && forced.choices[0].message;
    finalText = (fmsg && fmsg.content) ? fmsg.content : 'Não consegui processar isso agora. Tente de novo.';
    break;
  }

  if (!finalText) finalText = 'Não consegui processar isso agora. Tente de novo.';
  if (usedModel !== preferredModel) {
    console.log(`[ia-arxdevs] fallback: ${preferredModel} -> ${usedModel} para user ${userId}`);
  }
  return finalText;
}

// ─── Webhook handler ──────────────────────────────────────
async function handleTelegramWebhook(req, res) {
  try {
    const body = req.body || {};
    const update = body;
    const msg = update.message || update.edited_message || update.callback_query;
    if (!msg) return res.json({ ok: true });

    const chatId = msg.chat ? msg.chat.id : (msg.from ? msg.from.id : null);
    const userId = msg.from ? msg.from.id : null;
    let text = msg.text || '';
    const name = msg.from ? (msg.from.first_name || '') : '';

    // Callback query (botões)
    if (update.callback_query && update.callback_query.data) {
      const cb = update.callback_query;
      const cbData = cb.data;
      const cbChatId = cb.message ? cb.message.chat.id : chatId;
      const cbUserId = cb.from ? cb.from.id : null;
      // Só o dono pode aprovar/rejeitar
      if (String(cbUserId) !== String(OWNER_ID)) {
        await tgAnswerCallback(cb.id, '⛔ Acesso restrito ao dono.');
        return res.json({ ok: true });
      }
      let result = '';
      if (cbData.startsWith('approve_')) {
        const postId = cbData.replace('approve_', '');
        result = await approvePost(postId);
        await tgAnswerCallback(cb.id, '✅ Aprovado!');
        await tgSendText(cbChatId, result);
        return res.json({ ok: true });
      }
      if (cbData.startsWith('reject_')) {
        const postId = cbData.replace('reject_', '');
        result = await rejectPost(postId);
        await tgAnswerCallback(cb.id, '🗑️ Removido');
        await tgSendText(cbChatId, result);
        return res.json({ ok: true });
      }
    }

    if (!chatId || !userId || !text.trim()) return res.json({ ok: true });

    // Allowlist: só o dono tem acesso, outros recebem aviso
    if (String(userId) !== String(OWNER_ID)) {
      await tgSendText(chatId, '⛔ Este bot da Arx é privado e tem acesso restrito. Se você é cliente, fale com o suporte pelo painel.');
      console.log(`[ia-arxdevs] bloqueado user ${userId} (${name})`);
      return res.json({ ok: true });
    }

    // Comandos diretos (sem passar pela IA)
    if (text.startsWith('/modelo')) {
      const parts = text.trim().split(/\s+/);
      if (parts.length === 1) {
        // Lista modelos disponíveis
        const current = await getUserModel(userId);
        const list = AVAILABLE_MODELS.map(m => `• *${m.name}* (\`${m.id}\`) — ${m.description}${m.id === current ? ' ← *atual*' : ''}`).join('\n');
        await tgSendText(chatId, `*Modelos disponíveis:*\n\n${list}\n\nUse: */modelo <id>* para trocar.`);
        return res.json({ ok: true });
      }
      const newModel = parts[1];
      const valid = AVAILABLE_MODELS.find(m => m.id === newModel);
      if (!valid) {
        await tgSendText(chatId, `❌ Modelo inválido. Use: /modelo <id>\n\nDisponíveis: ${AVAILABLE_MODELS.map(m => m.id).join(', ')}`);
        return res.json({ ok: true });
      }
      await setUserModel(userId, newModel);
      await tgSendText(chatId, `✅ Modelo alterado para *${valid.name}*.\nPróximas mensagens usarão este modelo.`);
      console.log(`[ia-arxdevs] user ${userId} trocou modelo para ${newModel}`);
      return res.json({ ok: true });
    }

    if (text === '/meumodelo' || text === '/model') {
      const current = await getUserModel(userId);
      const info = AVAILABLE_MODELS.find(m => m.id === current);
      const name = info ? info.name : current;
      await tgSendText(chatId, `Modelo atual: *${name}* (\`${current}\`)\n\nUse /modelo pra ver as opções ou trocar.`);
      return res.json({ ok: true });
    }

    text = text.trim();
    await saveMemory(userId, 'user', text);
    tgSendTyping(chatId);

    const reply = await runAgent(userId, name || 'Icaro', text);
    await saveMemory(userId, 'assistant', reply);

    // NOVO: Após cada resposta, verificar se precisa sumarizar memória antiga
    summarizeOldMessages(userId).catch(e => console.error('[ia-arxdevs] summarize error:', e.message));

    // Dividir mensagem se necessário (Telegram: ~4096 chars por msg)
    const chunks = [];
    let rest = reply;
    while (rest.length > MAX_REPLY) {
      let cut = rest.lastIndexOf('\n', MAX_REPLY);
      if (cut < MAX_REPLY * 0.5) cut = MAX_REPLY;
      chunks.push(rest.slice(0, cut));
      rest = rest.slice(cut);
    }
    chunks.push(rest);

    for (const chunk of chunks) {
      if (chunk.trim()) await tgSendText(chatId, chunk.trim());
    }

    console.log(`[ia-arxdevs] respondido para user ${userId} (${reply.length} chars, ${chunks.length} msgs)`);
    res.json({ ok: true });
  } catch (e) {
    console.error('[ia-arxdevs] webhook error:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
}

// ─── Bot info / set webhook ────────────────────────────────
async function setWebhook(webhookUrl) {
  return new Promise((resolve) => {
    if (!TG_BOT_TOKEN) return resolve({ ok: false, error: 'TG_BOT_TOKEN não configurada' });
    const body = JSON.stringify({ url: webhookUrl, allowed_updates: ['message', 'edited_message', 'callback_query'] });
    const req = https.request(`${TG_API}/setWebhook`, {
      method: 'POST', timeout: 10000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data || '{}')));
    });
    req.on('error', (err) => resolve({ ok: false, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }); });
    req.write(body);
    req.end();
  });
}

async function getBotInfo() {
  return new Promise((resolve) => {
    if (!TG_BOT_TOKEN) return resolve({ ok: false, error: 'TG_BOT_TOKEN não configurada' });
    https.get(`${TG_API}/getMe`, { timeout: 5000 }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data || '{}')));
    }).on('error', (e) => resolve({ ok: false, error: e.message }));
  });
}

// ─── Boot ──────────────────────────────────────────────────
loadKnowledge();
ensureTables().then(() => console.log('[ia-arxdevs] tabelas prontas'));

module.exports = { handleTelegramWebhook, runAgent, tgSendText, setWebhook, getBotInfo, runTool };
