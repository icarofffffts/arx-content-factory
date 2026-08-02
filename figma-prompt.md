# Arx Content Factory — Prompt para Figma AI / Subframe / IAs de Design

## 📋 Resumo do Projeto
Dashboard admin dark premium para automação de posts em redes sociais. Estilo 21st.dev — violeta (#8b5cf6), zinc-950, glass cards, aurora mesh background.

## 🎨 Design Tokens

### Cores Principais
| Token | Valor | Uso |
|---|---|---|
| primary | #8b5cf6 | Accent, botões primários, tabs ativas |
| primary-light | #a78bfa | Hover states, gradientes |
| primary-dark | #6d28d9 | Botões primários hover |
| primary-glow | rgba(139,92,246,0.35) | Sombras glow |
| surface-950 | #0a0a0a | Background principal |
| surface-900 | #0f0f0f | Cards, sidebar |
| surface-800 | #1a1a1a | Inputs, hover |
| surface-700 | #27272a | Borders subtis |
| surface-600 | #3f3f46 | Texto secundário |
| border | rgba(255,255,255,0.06) | Borders de cards |
| border-accent | rgba(139,92,246,0.3) | Borders de foco |
| text-primary | #fafafa | Texto principal |
| text-secondary | #a1a1aa | Texto secundário |
| text-muted | #71717a | Labels, captions |
| success | #22c55e | Status success |
| warning | #f59e0b | Status warning |
| error | #ef4444 | Status error |
| info | #3b82f6 | Status info |

### Tipografia
- Font family: Inter, system-ui, sans-serif
- Font mono: JetBrains Mono, monospace
- H1: 1.5rem / 700 / -0.02em tracking / 1.2 line-height
- H2: 1.125rem / 600 / -0.01em tracking / 1.3 line-height
- H3: 0.9375rem / 600 / 1.4 line-height
- Body: 0.8125rem / 400 / 1.5 line-height
- Caption: 0.6875rem / 500 / 1.4 line-height
- Button: 0.8125rem / 600 / 1.4 line-height

### Espaçamento
- xs: 4px | sm: 8px | md: 12px | lg: 16px | xl: 20px | 2xl: 24px | 3xl: 32px | 4xl: 40px

### Border Radius
- sm: 6px | md: 10px | lg: 16px | xl: 24px | full: 9999px

## 🧩 Componentes a Criar

### 1. Card (glass)
- Background: rgba(15,15,15,0.6)
- Border: 1px solid rgba(255,255,255,0.06)
- Border radius: 16px
- Padding: 16px (spacing.lg)
- Backdrop filter: blur(12px)

### 2. Button Primary
- Background: #8b5cf6
- Text color: #ffffff
- Border radius: 10px
- Padding: 10px 20px
- Font: 0.8125rem / 600 / Inter
- Hover background: #6d28d9

### 3. Button Secondary
- Background: rgba(255,255,255,0.05)
- Text color: #fafafa
- Border: 1px solid rgba(255,255,255,0.1)
- Border radius: 10px
- Padding: 10px 20px

### 4. Button Ghost
- Background: transparent
- Text color: #a1a1aa
- Border radius: 10px
- Padding: 8px 12px

### 5. Input
- Background: rgba(255,255,255,0.03)
- Border: 1px solid rgba(255,255,255,0.1)
- Border radius: 10px
- Padding: 10px 14px
- Text color: #fafafa
- Focus border: #8b5cf6

### 6. Badge
- Font size: 0.625rem / 700
- Padding: 3px 8px
- Border radius: 9999px
- Text transform: uppercase

### 7. Tab
- Font size: 0.6875rem / 500
- Padding: 8px 16px
- Bottom border: 2px solid transparent
- Active: color #8b5cf6, border-color #8b5cf6
- Inactive: color #71717a

### 8. Sidebar
- Width: 220px (expanded) / 64px (collapsed)
- Background: #0f0f0f
- Border right: 1px solid rgba(255,255,255,0.06)
- Items: icon + label, padding 8px 12px, border radius 10px
- Active item: background rgba(139,92,246,0.1), color #8b5cf6

### 9. Header
- Position: sticky top
- Height: 56px
- Background: rgba(10,10,10,0.95) + blur(12px)
- Border bottom: 1px solid rgba(255,255,255,0.06)
- Contains: hamburger menu, page title, flex-1 spacer, notification bell, avatar + dropdown

### 10. Avatar
- Size: 32px x 32px
- Border radius: 9999px
- Border: 2px solid #8b5cf6

### 11. Status Dot
- Size: 8px x 8px
- Border radius: 9999px
- Colors: success (#22c55e), warning (#f59e0b), error (#ef4444), info (#3b82f6)

### 12. Glow Effect
- Box shadow: 0 0 20px rgba(139,92,246,0.35)

### 13. Glass Panel
- Background: rgba(255,255,255,0.03)
- Backdrop filter: blur(8px)
- Border: 1px solid rgba(255,255,255,0.06)

### 14. Gradient Aurora (Background)
- Radial gradient layers sobre #0a0a0a:
  - 20% 50%: rgba(139,92,246,0.15) → transparent 50%
  - 80% 20%: rgba(59,130,246,0.1) → transparent 50%
  - 50% 80%: rgba(139,92,246,0.08) → transparent 50%

## 📐 Páginas / Frames

### Frame 1: Dashboard
- Background: gradient aurora
- Top: header com "Dashboard" title
- Stats cards row (4 cards glass com números)
- Gráfico de barras (produção últimos 14 dias)
- Fila de aprovação (lista de cards com status)
- Atividade recente (feed de posts)

### Frame 2: Conteúdo
- Header com "Conteúdo" title + botão "Gerar"
- Filtros de status (Todos, Agendados, Rascunhos, Pausados, Publicados)
- Grid de posts (cada post = card glass com: thumbnail, título, status badge, canal tags, botões ação)
- PostCard states: default, hover, processing (spinner), pending_key (amarelo), published (verde)

### Frame 3: Sugestões IA
- Chat interface flutuante (bottom-right corner)
- Input field no topo
- Mensagens do usuário (bg primary) e respostas IA (bg surface-800)
- Botão "Assistente IA" flutuante

### Frame 4: Social Bot
- Lista de itens pendentes de aprovação
- Cada item: preview do post, botões "Aprovar" (verde) e "Rejeitar" (vermelho)
- Modal de preview do WhatsApp

### Frame 5: Configurações
- Tabs de configuração
- Seção Integrações: Stripe (sk, whsec), Vídeo (provedor + key), n8n base URL, template padrão
- Seção API Key: botão "Gerar", display da chave, endpoints documentados
- Seção Whitelabel: formulário criar cliente (email, senha, nome, nicho, plano)
- Seção Marketplace de Templates: grid de templates com cor/badge, formulário criar novo
- Seção Analytics: gráfico de produção

## 🔤 Variantes de PostCard
1. **Default** — card glass normal com título, status badge, canal tags, botões "Publicar", "Retomar", "Reagendar", "🎬 Gerar Vídeo", "🗑"
2. **Processing** — com spinner animado no lugar do botão "🎬 Gerar Vídeo", badge "processing" amarelo
3. **Pending Key** — badge "pending_key" amarelo, botão "⚙ Configurar" no lugar de "🎬 Gerar Vídeo"
4. **Published** — badge "published" verde, botão "📅 Reagendar"

## 📦 Estrutura de Nodes Figma Sugerida
```
Arx Content Factory (File)
├── Dashboard
│   ├── Header
│   ├── Stats Row (4 metric cards)
│   ├── Production Chart (14 days)
│   ├── Approval Queue
│   └── Recent Activity
├── Content
│   ├── Header + Generate button
│   ├── Status filters
│   └── Posts grid
│       └── PostCard (component with variants)
├── AI Suggestions
│   ├── Chat interface
│   └── Floating button
├── Social Bot
│   ├── Pending items list
│   └── Approval modal
└── Settings
    ├── Integrations section
    ├── API Key section
    ├── Whitelabel section
    ├── Templates marketplace
    └── Analytics section
```

## 💡 Prompt para Subframe / Figma AI
Cole este prompt no campo de texto da IA de design:

"Crie um dashboard admin dark premium para um sistema de automação de posts em redes sociais. Use os seguintes tokens:

- Background: #0a0a0a com gradiente aurora (violeta + blue glows)
- Cards: glass morphism (rgba(15,15,15,0.6) + blur 12px + border rgba(255,255,255,0.06))
- Accent: #8b5cf6 (violeta) para botões primários, tabs ativas, borders de foco
- Font: Inter para UI, JetBrains Mono para code/monospace
- Border radius: 10px para botões/inputs, 16px para cards, 9999px para badges/avatars
- Spacing: 4/8/12/16/20/24/32/40px scale
- Font sizes: H1=1.5rem, H2=1.125rem, H3=0.9375rem, Body=0.8125rem, Caption=0.6875rem
- Buttons: Primary (#8b5cf6 white text), Secondary (transparent bg + border), Ghost (transparent)
- Inputs: rgba(255,255,255,0.03) bg + rgba(255,255,255,0.1) border + #8b5cf6 focus
- Sidebar: 220px wide, #0f0f0f bg, icons + labels, active state with violet tint
- Header: sticky top, rgba(10,10,10,0.95) + blur(12px)
- 5 pages: Dashboard (stats + chart + queue), Content (post grid with status filters), AI Chat (floating chat), Social Bot (approval queue), Settings (integrations + API key + whitelabel + templates + analytics)

Crie componentes reutilizáveis para: Card, Button (3 variants), Input, Badge, Tab, Sidebar, Header, Avatar, Status Dot, PostCard (4 variants: default/processing/pending_key/published)."
EOF
echo "Prompt criado com sucesso"
wc -l "/c/Users/Administrator/Desktop/Automacoes de Posts/figma-prompt.md"