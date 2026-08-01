# 🚀 Roadmap de Produto: Arx Content Factory

> Plano aprovado pelo Icaro — iniciar todas as fases em paralelo, UI pode ser refinada depois.

## Fase 1: O Núcleo (Custom Topic + Templates + UI/UX) ✅ COMPLETA

- [x] Input de "Tema Customizado" na aba Conteúdo (substitui sugestões fixas) — n8n prioriza o tema do usuário
- [x] Catálogo de Templates (grid de previews clicáveis: Clean Light, Dark Cyber, Minimal Tech)
- [x] Floating AI Chat Widget (assistente contextual via DeepSeek/n8n) — webhook content-factory-chat
- [x] Redesign Visual estilo 21st.dev (dark premium, violeta #8b5cf6, zinc-950, glass, aurora bg, glow, font Geist)

## Fase 2: Expansão (Vídeo + Monetização) 🚧 EM ANDAMENTO

- [x] Botão "🎬 Gerar Vídeo" no PostCard → endpoint /api/posts/:id/video → video_status no Supabase → webhook n8n
- [x] Prova de conceito: vídeo FLUX 3 gerado do slide real (8s, 3:4, com áudio) — ~/Downloads/video.mp4
- [x] Checkout Stripe: estrutura pronta (gera sessão quando stripe_secret_key existir; hoje ativa direto)
- [x] Webhook de assinatura: POST /api/v2/plans/webhook público (valida assinatura, ativa plano)
- [x] **Painel de Integrações no site** (aba Configurações → Integrações): admin configura Stripe (sk + whsec), vídeo (provedor + key), n8n base e template padrão via system_settings — sem SSH
- [ ] Fluxo n8n `content-factory-video` (busca slides → gera via API → salva video_url)
- [ ] Conectar Stripe de verdade: colar chaves no painel + registrar webhook na Stripe

## Fase 3: Automação & Escala

- [ ] Whitelabel/Multi-conta (clientes conectam contas e pagam mensalidade)
- [ ] API pública para agências
- [ ] Marketplace de templates (criadores vendem templates)
- [ ] Analytics avançado (engajamento por post, melhor horário)

## Notas de Execução

- Backend: Express (`dashboard/server.js`) + Supabase (10.0.1.20, user supabase_admin) + n8n (webhooks públicos em n8n.arxsolutions.cloud)
- Configurações dinâmicas: tabela `system_settings` (key/value) com GET/PUT /api/settings (admin-only, máscara p/ não-admin) + fallback para env vars
- Tabelas novas: `system_settings`, `dashboard_settings` (legado WhatsApp), colunas `video_status`/`video_url` em content_pipeline
- Deploy: `npx vite build` + tar + scp + `systemctl restart content-dashboard`
- Bugs corrigidos: refs com acento "Conteúdo Inédito" (workflow_entity + workflow_history), rotas /api/settings duplicadas (removido legado daily_limit), webhook Stripe na whitelist do auth gate, express.json com verify rawBody
- Commits Fase 2: d5228e5 (vídeo+stripe), b6f3c3c (whitelist webhook), afea054 (painel Integrações)
