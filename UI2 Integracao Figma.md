# UI2 — Integração Figma (Landing + Login + Signup + Logo)

> Status: ✅ Integrado e no ar (commits `23b94fc`, `00e5d25`, `dda704c`)
> Origem: pasta `Social Media Automation UI2/` (Figma Make)

## O que veio do Figma

A pasta `Social Media Automation UI2/` gerada pelo Figma Make continha:

| Arquivo | O que é |
|---|---|
| `src/imports/Landing.tsx` (841 linhas) | **Landing nova** — aurora que segue o mouse, partículas, SVGs reais de redes (LinkedIn/IG/GitHub/WhatsApp/X/YouTube), botões magnéticos, mockup do app, seção WhatsApp com Arx Bot, features, depoimentos, CTA |
| `src/imports/Login.tsx` (172) | Login novo "Bem-vindo de volta" + botão "Preencher credenciais de demo" |
| `src/imports/Signup.tsx` (349) | Cadastro novo com steps |
| `src/imports/Pricing.tsx` (288) | Planos (usa imagem `whatsapp-approval.png`) |
| `src/imports/ArxLogo.tsx` (121) | **Logo ARX nova** — "A" estilizado com gradiente violeta→índigo + tagline "publish" |
| `src/imports/index.css` | Animações da landing (fadeInUp, float, blink, bounce, msgIn...) |
| `src/imports/whatsapp-approval.png` | Screenshot do fluxo de aprovação WhatsApp |
| `src/imports/Gemini_Generated_Image_*.png` | Imagem gerada (não usada no build final) |

## Como foi integrado

1. **Copiados** para `frontend/src/imports/` (Landing, Login, Signup, Pricing, ArxLogo, imagens, CSS)
2. **`frontend/src/index.css`**: adicionado `@import './imports/index.css'` (animações) + peso 800/900 da Inter
3. **`frontend/src/vite-env.d.ts`**: criado com `/// <reference types="vite/client" />` (necessário pro import de PNG do Pricing)
4. **`frontend/src/App.tsx`** (que já estava conectado à API):
   - Imports novos: `Landing`, `Login`, `Signup`, `ArxLogo`
   - Estado `route`: `'landing' | 'login' | 'signup' | 'dashboard'`
   - Auth gate sem token: `landing` → `login` → `signup` (via `onNavigate`)
   - **Sidebar**: logo trocada por `<ArxLogo size={34} glow />`
   - Toda a integração de API anterior preservada (posts reais, metrics, analytics, IA chat, settings, perfil, senha)

## Roteamento

```
/ (sem token)  → Landing (páginas novas do Figma)
  ├─ "Preços"  → scroll pra Pricing dentro da landing
  ├─ "Entrar"  → Login (novo)
  └─ "Começar Grátis" → Signup (novo)
(dashboard)    → dashboard com logo ARX no sidebar
```

## Verificado em produção

- [x] Landing renderiza (hero "Seu conteúdo no piloto automático", 840+ criadores)
- [x] Login novo "Bem-vindo de volta" + credenciais demo
- [x] Login admin → dashboard com logo ARX no sidebar
- [x] Dashboard com dados reais (21 publicados, 11 drafts)
- [x] Build passa (38 módulos)

## Admin Dashboard (commit `dda704c`)

- **Aba "Admin"** no sidebar — só aparece para `role === 'admin'` (cliente não vê)
- **Rotas novas no backend** (server.js, antes da FASE 3):
  - `GET /api/admin/stats` — usuários, admins, clientes, posts, planos, sessões ativas
  - `GET /api/admin/users` — lista usuários com plano/status/expiração
  - `GET /api/admin/clientes` — tabela clientes (nome, email, telefone)
  - `GET /api/admin/plans` — planos com contagem de assinantes ativos
- **Tabs do Admin**: Visão Geral (stats + criar cliente whitelabel), Usuários, Clientes, Planos
- **Criar cliente**: usa `POST /api/admin/users` existente (whitelabel)

## Logout visível

- Botão **"Sair"** vermelho no sidebar (abaixo de Settings) — chama `handleLogout` (limpa token, volta pra landing)
- Avatar/usuário no sidebar agora é clicável → abre o UserPanel
- UserPanel mantém "Sign Out" interno também

## Notas

- A Landing usa **100% estilos inline** (sem classes Tailwind custom) — funciona em qualquer projeto React
- `ArxLogo` aceita props `size` e `glow` — reutilizável (sidebar, login, landing)
- Botão "Preencher credenciais de demo" preenche admin@arx.dev — senha real é `arx_secret_2026!`
- Deploy: mesmo fluxo de sempre (build → tar → scp → restart content-dashboard)

## Links

- [[Arx Content Factory Roadmap]]
- [[EXPLICATIVO]] — guia completo do projeto
