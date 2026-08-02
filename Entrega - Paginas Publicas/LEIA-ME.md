# Páginas Públicas — Arx Content Factory

Estas são as páginas FORA do dashboard (site público). Edite à vontade e me avise que eu deploy.

## Arquivos
- `Landing.tsx` — página inicial (hero, features, steps, testimonials, CTA). Usa classes Tailwind do projeto (bg-surface-900, btn-accent, gradient-text, glass...)
- `Pricing.tsx` — planos e preços
- `Login.tsx` — tela de entrada (chama `api.login` e salva token)
- `Signup.tsx` — cadastro (chama `api.register`)
- `api.ts` — cliente da API (todas as chamadas reais ao backend)

## Como funciona o roteamento
O `main.tsx` monta o `App.tsx` (dashboard). As páginas públicas são gerenciadas por rotas no servidor:
- `/` → landing
- `/dashboard` → dashboard React (novo design)
- `/login`, `/signup` → auth

Se quiser mudar o visual, as cores/classes principais estão em `frontend/src/index.css`:
- `bg-surface-900` = fundo escuro (#0b0f19)
- `btn-accent` = botão primário (vermelho #c41230)
- `gradient-text`, `glass`, `card-glass`, `glass-input`

## Design novo (dashboard)
O dashboard novo está em `frontend/src/App.tsx` — tema violeta #8b5cf6, fundo aurora, glass cards.
