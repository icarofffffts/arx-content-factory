# 📝 Sessão: IA ArxDevs — do WhatsApp ao Telegram (2026-08-03)

> Registro completo da sessão de implementação da IA pessoal do Ícaro.

## Contexto

- Objetivo: transformar o workflow n8n `IA ArxDevs` (Rmzd9Pwvwhye3ZUg) numa IA da empresa com:
  - Todo o conhecimento da Arx + Obsidian (incluindo KEYS.md)
  - Acesso total à VPS (criar serviços, docker, systemctl, nginx)
  - Acesso restrito: somente o dono (WhatsApp 5531995398002 → Telegram 7723580176)
  - Copiloto de ideias de projetos (estilo gist do Claude)
- Estado inicial: workflow n8n era esqueleto (agente sem system prompt, node de envio desabilitado).

## O que foi feito

### 1. Exploração
- Workflow `IA ArxDevs` exportado do n8n (via `docker exec n8n n8n export:workflow`) — 5.7KB, 6 nodes.
- Instância Evolution `IAArxdevs` (5516981800504) já existia, conectada, webhook → n8n.
- Vault Obsidian localizado em `Desktop/Automacoes de Posts/` (repo git, .obsidian ignorado).
- KEYS.md com todas as credenciais (DB, admin, Evolution, APIs).
- server.js do backend (106KB, 2399 linhas) baixado e analisado: `/api/whatsapp/webhook` (aprovação SIM/NAO),
  `/api/ai/chat` (proxy n8n), worker de aprovação, `sendEvolutionText`.

### 2. Knowledge base
- Criado `/opt/content_factory/ai-knowledge/` na VPS com 10 docs do vault:
  EXPLICATIVO.md, Roadmap, KEYS.md, DESIGN.md, Completing Content Factory VPS.md,
  CONTEXTO-POS-LOGIN.md, ENTREGA-PAGINAS-PUBLICAS.md, LEIA-ME.md, figma-prompt.md,
  Fixing Duplicate Approval Message Issue.md.

### 3. Backend (assistant.js)
- Módulo CommonJS novo em `/opt/content_factory/dashboard/assistant.js`.
- **Allowlist**: só o dono tem acesso a KEYS + VPS + ações; outros números recebem bloqueio.
- **Validação de origem**: inicialmente via CF-Connecting-IP = 185.111.156.178 (removida na versão Telegram).
- **Memória por conversa**: tabela `ai_assistant_memory` (phone, role, content, created_at).
- **Log VPS**: tabela `ai_vps_log` (phone, kind, detail).
- **Knowledge base**: lida no boot, KEYS.md separado (só via tool get_keys, owner-only).
- **Tools (function calling DeepSeek)**: get_metrics, get_recent_posts, search_posts, get_drafts,
  get_analytics, get_system_status, generate_content, get_post_content, send_draft_preview,
  approve_post, reject_post, get_keys, vps_run, vps_write_file.
- **vps_run**: executa comando shell (timeout 90s, maxBuffer 2MB, shell /bin/bash), bloqueia
  padrões destrutivos (rm -rf /, mkfs, dd, shutdown, DROP TABLE...) exigindo `confirm="sim"`.
- **vps_write_file**: grava arquivos na VPS (mkdir -p automático).
- **send_draft_preview**: envia conteúdo formatado com opção SIM/NAO.

### 4. Integração server.js
- `const assistant = require('./assistant');` no topo.
- Rota `POST /api/assistant/webhook` antes do app.listen.
- `/api/assistant/webhook` adicionado à allowlist pública do auth middleware (linha ~261).

### 5. Deploy
- Drop-in systemd `/etc/systemd/system/content-dashboard.service.d/ia-arxdevs.conf` com envs.
- `systemctl daemon-reload && systemctl restart content-dashboard`.
- Backup: server.js.bak-ia.

### 6. Webhook Evolution → backend
- Rotas Evolution Go são diferentes do Evolution JS: `/instance/all`, `/instance/qr`,
  `/instance/pair`, `GET,PUT /instance/{id}/advanced-settings` (404 em outros paths).
- advanced-settings NÃO mexe no webhook. Webhook fica na tabela `instances` do banco
  `evogo_users` (coluna `webhook`). Atualizado via SQL direto.
- Workflow n8n desativado: `n8n update:workflow --id=Rmzd9Pwvwhye3ZUg --active=false` + restart n8n.

### 7. Restrição WhatsApp da Meta
- Ao tentar parear a IAArxdevs, WhatsApp exibiu "conta restrita" (spam/automação).
- Sessão derrubada: 401 logged out, QRCode pedido de novo.
- **Decisão**: migrar para Telegram (canal oficial de bots, zero risco de banimento).

### 8. Migração Telegram
- Bot criado no @BotFather: `@arxdevsIABOT` (token `8638497845:AA***`).
- assistant.js reescrito: `handleTelegramWebhook` (webhook Telegram), `tgSendText`
  (com fallback Markdown→texto puro), `tgSendTyping`, `setWebhook`, `getBotInfo`.
- Allowlist: Telegram ID `7723580176` (só dono).
- Webhook Telegram: `setWebhook` → https://conteudos.icarodev.cloud/api/assistant/webhook.

### 9. Debugs importantes
- **Bug 1 — Auth middleware**: `/api/assistant/webhook` não estava na allowlist do auth
  (linha ~261) → retornava SPA HTML em vez do JSON. Fix: adicionar à lista.
- **Bug 2 — Credencial n8n DeepSeek**: tentei descriptografar (AES-256-CBC com
  N8N_ENCRYPTION_KEY, formato Salted__), mas credencial tinha formato legacy
  (iv+ct concatenado, 17+64 bytes). Chave DeepSeek obtida do Ícaro diretamente.
- **Bug 3 — TG_BOT_TOKEN sem aspa final**: após edição do drop-in, linha
  `Environment="TG_BOT_TOKEN=...` sem `"` final → systemd descarta a env silenciosamente
  → bot não envia (log mostra "respondido" mas nada chega). Fix: corrigir aspas +
  validar `/proc/<pid>/environ`.
- **Bug 4 — get_system_status**: `pingHttp` usava `https.get` até pra URL HTTP
  (Evolution localhost:9091) → "erro de protocolo". Fix: escolher http/https pela URL.

## Testes realizados
- POST local no webhook: número não-autorizado → `{"success":true,"action":"blocked"}`.
- Dono sem chave: `{"error":"DEEPSEEK_API_KEY não configurada no servidor."}`.
- curl público (origem externa): 403 forbidden origin (validação CF-Connecting-IP).
- vps_run direto: docker ps real ✅, destrutivo bloqueado ✅, non-owner bloqueado ✅.
- Webhook Telegram: resposta real de 1018 chars → entregue no Telegram do Ícaro ✅.
- Teste final: IA respondeu métricas reais do banco (21 publicados, 8 drafts, 4 LinkedIn). ✅

## Estado final
- ✅ Bot Telegram @arxdevsIABOT respondendo com IA + tools + acesso VPS.
- ✅ Knowledge base com 10 docs + KEYS.md (só dono via get_keys).
- ✅ Tools: VPS (run/write), conteúdo (generate/preview/approve/reject), consultas, analytics.
- ✅ Env no drop-in: DEEPSEEK_API_KEY, DEEPSEEK_MODEL, TG_BOT_TOKEN, TG_OWNER_ID.
- ⚠️ Instância WhatsApp IAArxdevs restrita pela Meta — aguardando liberação (ou descartada).

## Comandos úteis
```bash
# Logs da IA
journalctl -u content-dashboard -n 20 | grep ia-arxdevs

# Validar envs carregadas
cat /proc/$(systemctl show content-dashboard -p MainPID --value)/environ | tr '\0' '\n' | grep -E '^(TG_|DEEPSEEK)'

# Reiniciar
systemctl daemon-reload && systemctl restart content-dashboard

# Editar envs
nano /etc/systemd/system/content-dashboard.service.d/ia-arxdevs.conf
```

## 🔧 Sessão de correção (2026-08-03 ~23h-00h30)

### Sintoma
- IA respondia sempre "Não consegui processar isso agora. Tente de novo." (49 chars = fallback do loop).

### Causa raiz (diagnóstico instrumentado)
1. **Loop infinito de tool_calls**: modelo `deepseek-v4-flash` (raciocínio, gasta tokens em `reasoning_content`)
   decidia "investigar a causa raiz" e chamava `vps_run` em loop — 6 iterações (~37s) sem nunca produzir
   `content` final → `finalText` vazio → fallback. Memória poluída com "Porque sempre dá erro?" alimentava isso.
2. **max_tokens: 1200 baixo demais** para modelo de raciocínio com prompt de ~9-16k tokens:
   cada iteração gastava 230-1150 tokens só pensando (reasoning_content).
3. Confirmado com repro instrumentado (repro9.js): iter 1-6 todas `finish=tool_calls`, FINAL="" | toolCalls: 6.

### Fix aplicado em assistant.js (backup: assistant.js.bak-looptool)
- `chatCompletion`: max_tokens 1200 → **4000**; aceita `toolChoice` (`auto`/`none`).
- `runAgent`: loop 6 → **8** iterações; após **3 rodadas de tools**, força `tool_choice: 'none'`
  (modelo obrigado a sintetizar resposta final, sem novas tools). Se `content` vazio, tenta 1 chamada
  forçada antes do fallback.
- Memória do owner limpa (DELETE ai_assistant_memory phone=7723580176) — contexto de debug removido.

### Pós-fix (testado)
- runAgent: "Sim"→338 chars (drafts reais), "Ola"→246, "Me passa suas logs"→1315 (vps_run real). ✅
- Webhook público: POST simulado owner → `{"ok":true}` + resposta real no Telegram (277 chars,
  "Funcionando sim ✅ ... 21 publicados, 8 drafts, 2 aguardando aprovação, 4 LinkedIn"). ✅

### Lição
- Modelo de raciocínio + function calling = sempre forçar resposta final após N rodadas de tools,
  senão ele investiga até esgotar o loop e cai no fallback. Monitorar `journalctl | grep ia-arxdevs`
  (respostas de 49 chars = loop de novo).
