# Arx Content Factory — Guia Completo do Projeto

> Dashboard de automação de conteúdo para redes sociais (LinkedIn, Instagram, Twitter/X).
> IA gera o conteúdo, você aprova, publica automático. Tudo em um painel dark premium.

**Produção:** https://conteudos.icarodev.cloud
**Status:** funcional de ponta a ponta (dados reais, não mockados)

---

## 1. O que o sistema faz

| Fluxo | Como funciona |
|---|---|
| **Geração de conteúdo** | Você digita um tema → IA (DeepSeek) gera slides, legenda e hashtags |
| **Aprovação** | Posts ficam como draft/pending → você aprova ou rejeita |
| **Publicação** | Automática por canal (LinkedIn, Instagram) nos melhores horários |
| **Agendamento** | Calendário semanal com posts programados |
| **Analytics** | Contadores por status, posts por dia, canais, top posts |
| **IA Assistente** | Chat no painel que escreve hooks, scripts de carrossel, legendas |
| **API pública** | Key própria para integração externa (`/api/v1/*`) |

---

## 2. Páginas / Áreas do sistema

### 2.1 Site público (pré-login)
| Página | Arquivo | Conteúdo |
|---|---|---|
| Landing | `frontend/src/pages/Landing.tsx` | Hero, features, steps, testimonials, CTA |
| Preços | `frontend/src/pages/Pricing.tsx` | Planos e valores |
| Login | `frontend/src/pages/Login.tsx` | Entrada com email/senha |
| Signup | `frontend/src/pages/Signup.tsx` | Cadastro |

### 2.2 Dashboard (pós-login) — `frontend/src/App.tsx`
| Aba | Função | API real |
|---|---|---|
| **Dashboard** | Stats (publicados/agendados/drafts), gráfico de produção, fila de aprovação, atividade recente | `/api/metrics`, `/api/analytics`, `/api/posts` |
| **Content** | Grid de posts com busca, filtro por status, ações Publish/Delete/Generate Video | `/api/posts`, `/api/posts/:id/publish-now`, `/api/posts/:id/video` |
| **Templates** | Templates de carrossel/vídeo com preview | `/api/templates` |
| **Schedule** | Calendário semanal com posts agendados | `/api/posts` |
| **Analytics** | Total, publicados, drafts, breakdown por canal, top posts | `/api/analytics`, `/api/posts` |
| **New Post** | Modal 3 passos (título → legenda/data → confirmação) | `/api/generate` (→ n8n) |
| **AI Assistant** | Chat lateral com sugestões rápidas | `/api/ai/chat` (DeepSeek) |
| **Settings** | Integrações, API key, defaults (template, Instagram ID, toggles) | `/api/settings`, `/api/me/api-key` |
| **User Panel** | Editar nome, trocar senha, logout | `/api/v2/auth/profile`, `/api/v2/auth/password` |

---

## 3. Cores (design tokens)

### 3.1 Paleta principal
| Token | Hex | Uso |
|---|---|---|
| `primary` | `#8b5cf6` | **Violeta** — acentos, botões principais, destaques |
| `primary-light` | `#a78bfa` | Hover/estados claros do violeta |
| `primary-dark` | `#6d28d9` | Gradientes profundos |
| `primary-glow` | `rgba(139,92,246,0.35)` | Brilho/glow em cards e avatares |

### 3.2 Superfícies (zinc escuro)
| Token | Hex | Uso |
|---|---|---|
| `surface-950` | `#0a0a0a` | Fundo do app (aurora-bg) |
| `surface-900` | `#0f0f0f` | Sidebar, painéis laterais |
| `surface-800` | `#1a1a1a` | Cards elevados |
| `surface-700` | `#27272a` | Elementos hover |
| `surface-600` | `#3f3f46` | Ícones muted |

### 3.3 Texto
| Token | Hex | Uso |
|---|---|---|
| `text-primary` | `#fafafa` | Títulos e texto principal |
| `text-secondary` | `#a1a1aa` | Descrições |
| `text-muted` | `#71717a` | Labels, timestamps |

### 3.4 Status / semântica
| Token | Hex | Uso |
|---|---|---|
| `success` | `#22c55e` | Published, aprovações, "+" |
| `warning` | `#f59e0b` | Processing, pending |
| `error` | `#ef4444` | Delete, danger zone |
| `info` | `#3b82f6` | Scheduled, links |

### 3.5 Canais sociais
| Canal | Cor |
|---|---|
| Instagram | `#e1306c` |
| LinkedIn | `#0a66c2` |
| Twitter/X | `#1da1f2` |

---

## 4. Tipografia

| Nível | Fonte | Tamanho | Peso |
|---|---|---|---|
| H1 | Inter | 1.5rem | 700 |
| H2 | Inter | 1.125rem | 600 |
| H3 | Inter | 0.9375rem | 600 |
| Body | Inter | 0.8125rem | 400 |
| Caption | Inter | 0.6875rem | 500 |
| Mono (datas/código) | **JetBrains Mono** | 0.625–0.75rem | — |

Fontes: `Inter, system-ui, sans-serif` · Mono: `JetBrains Mono, monospace`

---

## 5. Componentes visuais

| Componente | Classe/Estilo | Descrição |
|---|---|---|
| Card | `.glass-card` | Fundo translúcido, borda `rgba(255,255,255,0.06)`, radius 16px |
| Botão primário | `.btn-primary` | Violeta `#8b5cf6`, texto branco |
| Botão secundário | `.btn-secondary` | Outline sutil |
| Botão ghost | `.btn-ghost` | Transparente, hover sutil |
| Input | `.input-field` | Fundo `rgba(255,255,255,0.04)`, borda 0.1 |
| Badge de status | `.badge` | Fundo colorido 15%, texto cor do status |
| Sidebar item | `.sidebar-item.active` | Violeta 15% quando ativo |
| Tab | `.tab-item.active` | Sublinhado violeta |
| Avatar | gradiente `#8b5cf6 → #3b82f6` | Iniciais do usuário |
| Toggle | switch 36×20 | Violeta quando ativo |
| SlidePanel | painel direito 380–440px | Notificações, usuário, settings, chat |
| Aurora bg | `.aurora-bg` | Fundo escuro com mesh suave |
| StatusDot | `.pulse-glow` | Bolinha animada em Processing |

### Estados dos posts (badges)
| Status | Label | Cor |
|---|---|---|
| `scheduled` | Scheduled | azul `#3b82f6` |
| `draft` | Draft | cinza `#71717a` |
| `processing` | Processing (bolinha animada) | âmbar `#f59e0b` |
| `published` | Published | verde `#22c55e` |
| `pending` | Pending | âmbar `#f59e0b` |

---

## 6. Arquitetura técnica

```
Navegador (React SPA)
   │  https://conteudos.icarodev.cloud
   ▼
Cloudflare (CDN/HTTPS)
   ▼
Coolify/Traefik (coolify-proxy)
   ▼
nginx container (content_media_server)
   ▼
Express API (:9878) — systemd content-dashboard
   ├─ /api/* → Supabase Postgres (content_pipeline, users, sessions, plans)
   ├─ /api/generate → n8n webhook (Fluxo 1) → gera conteúdo
   ├─ /api/ai/chat → DeepSeek (via n8n Chat Assistant)
   └─ serve dist/ (React build)
```

### Stack
- **Frontend:** React 19 + Vite + Tailwind v4 (`@tailwindcss/vite`)
- **Backend:** Node.js + Express (porta 9878)
- **Banco:** Supabase Postgres (container `supabase-db`, db `postgres`)
- **Orquestração:** n8n (container, workflows no Postgres `n8n`)
- **Servidor:** VPS `arxdevsvps` (root@185.111.156.178)

### Credenciais / acesso
| Item | Valor |
|---|---|
| Admin login | email `admin` / senha `arx_secret_2026!` |
| Auth header | `x-arx-token: <token>` (sessões em `public.sessions`, 30 dias) |
| n8n | https://n8n.arxsolutions.cloud |
| Fluxo 1 (gerador) | workflow `dQnhyh8LbQsiBhxq` — webhook público `/webhook/content-factory?topic=&channel=&publish_mode=&template=` |

---

## 7. Endpoints principais (API real)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v2/auth/login` | Login → token |
| POST | `/api/v2/auth/register` | Cadastro |
| POST | `/api/v2/auth/logout` | Encerra sessão |
| GET | `/api/v2/auth/me` | Usuário + plano ativo |
| PUT | `/api/v2/auth/profile` | Atualizar nome/avatar |
| PUT | `/api/v2/auth/password` | Trocar senha |
| GET | `/api/metrics` | Contadores por status |
| GET | `/api/posts` | Lista posts (com `slides_data` → `image_url`) |
| POST | `/api/posts/:id/publish-now` | Publicar imediato |
| POST | `/api/posts/:id/video` | Gerar vídeo do carrossel |
| POST | `/api/posts/:id/reschedule` | Reagendar |
| GET | `/api/drafts` | Drafts para revisão |
| POST | `/api/generate` | Gera conteúdo (envia ao n8n) |
| GET | `/api/templates` | Templates |
| GET | `/api/analytics` | by_day / by_status / by_channel |
| POST | `/api/ai/chat` | Chat com IA (DeepSeek) |
| GET/PUT | `/api/settings` | Configurações do sistema |
| POST | `/api/me/api-key` | Gera/lista API key |
| GET | `/api/v1/posts` | API pública v1 |

---

## 8. Estrutura de dados (content_pipeline)

Cada post no banco tem:

```json
{
  "id": "uuid",
  "topic": "Título do post",
  "status": "draft | scheduled | published | paused | processing | pending",
  "channel": "all | instagram | linkedin | twitter",
  "scheduled_at": "timestamp",
  "slides_data": [
    {
      "slide_number": 1,
      "title": "Título do slide",
      "body": "Conteúdo do slide",
      "quote": "Citação opcional",
      "image_url": "https://...imagem real...",
      "total_slides": 8
    }
  ]
}
```

> As thumbnails do dashboard vêm de `slides_data[0].image_url` — imagem real do post.

---

## 9. Deploy (como publicar mudanças)

```bash
# 1. Build do frontend (na pasta frontend/)
cd frontend
npm run build        # → gera dist/

# 2. Empacotar e enviar
cd ..
tar -czf /tmp/arx-frontend.tar.gz -C frontend dist
scp /tmp/arx-frontend.tar.gz arxdevsvps:/tmp/

# 3. Extrair e reiniciar no VPS
ssh arxdevsvps "rm -rf /opt/content_factory/frontend/dist && \
  tar -xzf /tmp/arx-frontend.tar.gz -C /opt/content_factory/frontend/ && \
  systemctl restart content-dashboard"
```

> ⚠️ Backend (server.js) fica em `/opt/content_factory/dashboard/server.js` no VPS. Mudanças nele: editar via SSH + `systemctl restart content-dashboard`. Fazer backup antes: `cp server.js server.js.bak`.

---

## 10. Notas importantes

- **Tailwind v4** usa o plugin `@tailwindcss/vite` no `vite.config.ts` — não existe `postcss.config.js` funcional (foi esvaziado de propósito).
- **Mocks**: o `App.tsx` ainda tem arrays de fallback (posts/templates/chartData) usados **só enquanto a API carrega** ou se falhar. Os dados reais vêm da API.
- **Eventos globais**: os cards disparam `arx-publish`, `arx-delete`, `arx-video` via `window.dispatchEvent` — o App principal escuta e chama a API + refresh.
- **n8n**: o Fluxo 1 está ativo. Workflows com Gmail Trigger podem ter erro `bad decrypt` (credencial antiga) — não afeta o gerador de conteúdo.
- **Imagens**: posts sem `image_url` caem num fallback determinístico (Unsplash por hash do título).
- **Login**: o dashboard exige token. Sem token → mostra LoginView. Com token inválido → volta pro login.
