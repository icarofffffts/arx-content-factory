# QA — Arx Content Factory

Suíte de QA canônica e versionada no repo. Substitui os scripts ad-hoc anteriores.

## Estrutura
```
qa/
├── run.py            # orquestrador: roda tudo, gera report
├── backend_smoke.py  # smoke de TODAS as rotas /api (auth gate + JSON + no-HTML)
├── build_check.py    # tsc + vite build limpo
├── e2e_browser.py    # fluxo completo no navegador (Playwright)
├── report.md         # último report (gerado)
└── report.json       # último report (gerado)
```

## Como rodar
```bash
# Tudo (prod por padrão)
python qa/run.py

# Só backend + build (sem navegador)
python qa/run.py --skip-e2e

# Contra staging local
python qa/run.py --base http://localhost:9878

# Com token explícito (pula login)
python qa/run.py --token SEU_TOKEN
```

## Pré-requisitos
- **Backend/prod:** acesso à URL base (precisa estar no ar).
- **build_check:** Node + npm no PATH.
- **e2e_browser:** `pip install playwright && playwright install chromium`
  (se não houver, o E2E é SKIP — não quebra a suíte).

## O que cada suíte cobre

### backend_smoke.py
- Login admin → token.
- `GET` protegidas (metrics, posts, analytics, templates, drafts, settings,
  social, suggestions, whatsapp, shortlinks, v2/auth/me, v2/plans, v1/leads/stats,
  admin/stats, admin/users, admin/clientes, admin/plans).
- `POST` protegidas (me/api-key, generate, ai/chat, demo/request, social/connect,
  shorten, v2/plans/subscribe).
- **Auth gate:** rotas protegidas SEM token → 401/403 (JSON, não HTML).
- **No-HTML leak:** nenhuma rota de API pode servir o SPA HTML.
- `GET /` serve SPA (esperado).

### build_check.py
- `npm run build` (tsc --noEmit + vite build) passa.
- `dist/index.html` gerado.
- Bundle JS cresceu (libs motion/number-flow/lucide presentes).

### e2e_browser.py (Playwright)
1. Landing hero.
2. Preços: 3 cards (Gratuito/Pro/Enterprise) com nomes corretos.
3. Switch Anual altera preços.
4. Login → dashboard.
5. Dashboard mostra posts públicos reais (> 0).
6. Aba Admin visível (role=admin) + stats.
7. Botão Sair visível + logout → landing.

## Report
`qa/run.py` gera `qa/report.md` e `qa/report.json` com timestamp, base e status
de cada suíte. Exit code 0 = tudo passou.

## Cobertura atual
- Backend: 100% das rotas `/api/*` mapeadas.
- Frontend: build + principais fluxos E2E.
- Pendente (fora do escopo core): testes unitários de componentes (vitest),
  QA de pagamentos reais (Stripe/MP precisam de chaves), notificações (sino mock).
