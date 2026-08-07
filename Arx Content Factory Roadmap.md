# 🚀 Roadmap de Produto: Arx Content Factory

> Plano aprovado pelo Icaro — todas as fases em andamento.

## Fase 1: O Núcleo (Custom Topic + Templates + UI/UX) ✅ COMPLETA

- [x] Input de "Tema Customizado" na aba Conteúdo (n8n prioriza o tema do usuário)
- [x] Catálogo de Templates (Clean Light, Dark Cyber, Minimal Tech)
- [x] Floating AI Chat Widget (DeepSeek via n8n, webhook content-factory-chat)
- [x] Redesign Visual estilo 21st.dev (dark premium, violeta, zinc-950, glass, aurora, glow, Geist)

## Fase 2: Expansão (Vídeo + Monetização) ✅ COMPLETA

- [x] Botão "🎬 Gerar Vídeo" no PostCard → endpoint → video_status → webhook n8n
- [x] Fluxo 6 - Gerador de Video (Reels/Shorts): webhook content-factory-video → slides → Replicate → video_url. Sem chave: pending_key
- [x] Prova de conceito: vídeo FLUX 3 gerado do slide real
- [x] Checkout Stripe (gera sessão quando stripe_secret_key existir) + webhook de assinatura público
- [x] Painel de Integrações no site (Stripe, vídeo, n8n, template padrão — system_settings, admin-only)

## Fase 3: Automação & Escala ✅ COMPLETA

- [x] **API pública v1** (agências): GET /api/v1/me, GET /api/v1/posts, POST /api/v1/generate, GET /api/v1/templates — auth via X-API-Key, chave gerada no painel (/api/me/api-key)
- [x] **Whitelabel**: admin cria cliente (email/senha/nome/nicho/plano) via /api/admin/users — conta + plano incluso
- [x] **Marketplace de Templates**: tabela templates (seed 3), GET/POST /api/templates (admin), UI de gestão com cor/badge
- [x] **Analytics avançado**: /api/analytics (posts por dia/status/canal) + gráfico "Produção últimos 14 dias" no Dashboard

## Próximos passos (opcional)

- [ ] Ativar Fluxo 3 (Publicador Instagram) no n8n
- [ ] Conectar Stripe real (chaves no painel)
- [ ] Conectar API de vídeo real (Replicate key no painel)
- [ ] Landing page refinar com cases/SEO

## Notas de Execução

- Configurações dinâmicas: system_settings + GET/PUT /api/settings (admin-only, máscara)
- Fluxos n8n: Fluxo 1 (geração), Fluxo 6 (vídeo), AI Chat Assistant — ativos
- IMPORTANTE: ao editar fluxos n8n via banco, atualizar SEMPRE workflow_entity E workflow_history (versão ativa)
- IMPORTANTE: webhook do Fluxo 1 é GET-only (o /api/v1/generate usa GET)
- API key admin: (ver tabela api_keys no DB / KEYS.md local — não commitar)
- Deploy: npx vite build + tar + scp + systemctl restart content-dashboard
- Commits: d5228e5, b6f3c3c, afea054, 4064674, c90e5a5
