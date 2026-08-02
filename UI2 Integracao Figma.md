# UI2 — Integração Figma (Landing + Login + Signup + Logo)

> Status: ✅ Integrado e no ar (commit `23b94fc`, 2026-08-02)
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

## Notas

- A Landing usa **100% estilos inline** (sem classes Tailwind custom) — funciona em qualquer projeto React
- `ArxLogo` aceita props `size` e `glow` — reutilizável (sidebar, login, landing)
- Botão "Preencher credenciais de demo" preenche admin@arx.dev — senha real é `arx_secret_2026!`
- Deploy: mesmo fluxo de sempre (build → tar → scp → restart content-dashboard)

## Links

- [[Arx Content Factory Roadmap]]
- [[EXPLICATIVO]] — guia completo do projeto
