import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import WhatsAppModal from '../components/WhatsAppModal'
import PostCard from '../components/PostCard'

type SubPage = 'dashboard' | 'content' | 'suggestions' | 'social' | 'settings'

const NAV: { id: SubPage; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'content', icon: '📰', label: 'Conteúdo' },
  { id: 'suggestions', icon: '🤖', label: 'Sugestões IA' },
  { id: 'social', icon: '📱', label: 'Social Bot' },
  { id: 'settings', icon: '⚙️', label: 'Configurações' },
]

// Stats card data shape
interface Metrics { total: number; scheduled: number; paused: number; draft: number; posted_linkedin: number; posted_instagram: number; published: number }

const EMPTY_METRICS: Metrics = { total: 0, scheduled: 0, paused: 0, draft: 0, posted_linkedin: 0, posted_instagram: 0, published: 0 }

export default function DashboardCEO({ user, plan, onLogout, onNavigate }: {
  user: any; plan: any; onLogout: () => void; onNavigate: (p: string) => void
}) {
  const [subPage, setSubPage] = useState<SubPage>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS)
  const [posts, setPosts] = useState<any[]>([])
  const [drafts, setDrafts] = useState<any[]>([])
  const [whatsappPost, setWhatsappPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Load data
  useEffect(() => {
    Promise.all([
      api.metrics().then(setMetrics).catch(() => {}),
      api.posts().then(setPosts).catch(() => {}),
      api.drafts().then(setDrafts).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  async function refreshPosts() {
    const r = await api.posts(statusFilter === 'all' ? undefined : statusFilter).catch(() => [])
    setPosts(r)
    const m = await api.metrics().catch(() => EMPTY_METRICS)
    setMetrics(m)
  }

  // Actions
  async function handlePublish(id: string) { await api.publishNow(id); refreshPosts() }
  async function handlePause(id: string) { await api.togglePause(id); refreshPosts() }
  async function handleDelete(id: string) { if (confirm('Excluir post?')) { await api.deletePost(id); refreshPosts() } }
  async function handleReschedule(id: string) {
    const date = prompt('Nova data (YYYY-MM-DD HH:MM):')
    if (date) { await api.reschedule(id, date); refreshPosts() }
  }
  async function handleApproveDraft(id: string) { await api.approveDraft(id); setWhatsappPost(null); refreshPosts() }
  async function handleReorganize() { await api.reorganize(); refreshPosts() }

  // Filter posts
  const filteredPosts = statusFilter === 'all' ? posts : posts.filter(p => p.status === statusFilter)

  const STATS_CARDS = [
    { label: 'Total no Pipeline', value: metrics.total, color: 'from-blue-500 to-blue-700' },
    { label: 'Agendados', value: metrics.scheduled, color: 'from-blue-400 to-blue-600' },
    { label: 'Rascunhos', value: metrics.draft, color: 'from-yellow-400 to-yellow-600' },
    { label: 'Pausados', value: metrics.paused, color: 'from-orange-400 to-orange-600' },
    { label: 'LinkedIn', value: metrics.posted_linkedin, color: 'from-blue-300 to-blue-500' },
    { label: 'Instagram', value: metrics.posted_instagram, color: 'from-pink-400 to-pink-600' },
    { label: 'Publicados', value: metrics.published, color: 'from-green-400 to-green-600' },
  ]

  return (
    <div className="min-h-screen bg-surface-900 flex">
      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-full bg-surface-800/80 border-r border-glass-border backdrop-blur-xl z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className="p-4 flex items-center justify-between border-b border-glass-border h-16">
          {!collapsed && <span className="font-bold text-sm">Arx Factory</span>}
          <button onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-white text-sm p-1 rounded-lg hover:bg-glass-hover transition-all">
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="p-2 space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setSubPage(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                subPage === n.id ? 'bg-accent/20 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-glass-hover'
              }`}>
              <span className="text-lg">{n.icon}</span>
              {!collapsed && <span>{n.label}</span>}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-glass-border">
          {!collapsed && (
            <div className="px-3 py-2 mb-1">
              <div className="text-xs text-gray-500">{user?.full_name || user?.email}</div>
              {plan && <div className="text-xs text-accent">{plan.name}</div>}
            </div>
          )}
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-glass-hover transition-all">
            <span>🚪</span>
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-56'}`}>
        {/* Header */}
        <header className="h-16 border-b border-glass-border flex items-center justify-between px-6 bg-surface-900/80 backdrop-blur-xl sticky top-0 z-30">
          <h1 className="font-bold text-lg">
            {NAV.find(n => n.id === subPage)?.icon} {NAV.find(n => n.id === subPage)?.label}
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('pricing')} className="text-xs btn-ghost px-3 py-1.5">Planos</button>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </header>

        <div className="p-6">
          {subPage === 'dashboard' && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                {STATS_CARDS.map((s, i) => (
                  <div key={i} className="card-glass p-4 text-center card-hover">
                    <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                    <div className="text-2xl font-black gradient-text">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Drafts queue */}
              {drafts.length > 0 && (
                <div className="card-glass p-6 mb-8">
                  <h2 className="font-bold mb-4">📋 Fila de Aprovação ({drafts.length})</h2>
                  <div className="space-y-3">
                    {drafts.slice(0, 5).map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-glass hover:bg-glass-hover transition-all">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="text-sm font-medium truncate">{d.topic}</div>
                          <div className="text-xs text-gray-500">{new Date(d.created_at).toLocaleString('pt-BR')}</div>
                        </div>
                        <button onClick={() => setWhatsappPost(d)}
                          className="btn-accent text-xs px-4 py-2 whitespace-nowrap">
                          ✅ Aprovar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="card-glass p-6">
                <h2 className="font-bold mb-4">📈 Atividade Recente</h2>
                <div className="space-y-2">
                  {posts.slice(0, 10).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-glass-hover transition-all">
                      <span className="text-gray-300 truncate mr-4">{p.topic}</span>
                      <span className="text-xs text-gray-500">{new Date(p.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {subPage === 'content' && (
            <div>
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {['all', 'scheduled', 'draft', 'paused', 'published'].map(f => (
                  <button key={f} onClick={() => setStatusFilter(f)}
                    className={`text-sm px-4 py-2 rounded-xl transition-all ${
                      statusFilter === f ? 'bg-accent text-white' : 'bg-glass border border-glass-border text-gray-400 hover:text-white'
                    }`}>
                    {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <button onClick={handleReorganize} className="btn-ghost text-sm px-4 py-2 ml-auto">
                  🔄 Reorganizar Fila
                </button>
              </div>

              {/* Post grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map(p => (
                  <PostCard key={p.id} post={p}
                    onPublish={handlePublish} onPause={handlePause}
                    onDelete={handleDelete} onReschedule={handleReschedule} />
                ))}
              </div>
              {filteredPosts.length === 0 && !loading && (
                <div className="text-center py-20 text-gray-500">Nenhum post encontrado</div>
              )}
            </div>
          )}

          {subPage === 'suggestions' && (
            <div className="card-glass p-6">
              <h2 className="font-bold mb-2">🤖 Sugestões de Conteúdo IA</h2>
              <p className="text-gray-500 text-sm mb-6">Tópicos gerados por IA baseados nas tendências atuais</p>
              {[
                { topic: '5 Certificações Tech que Pagam +R$15k em 2026', score: 95, reason: 'Alta demanda + salário alto' },
                { topic: 'React 20 vs Next.js 18: Qual Escolher em 2026?', score: 88, reason: 'Comparativo popular' },
                { topic: 'Stack Analysis: Crise no Brasil e Carreira Dev', score: 82, reason: 'Tema quente do momento' },
                { topic: '10 Ferramentas DevOps que Todo Sênior Usa', score: 79, reason: 'Utilitário evergreen' },
                { topic: 'Como Negociar Salário como Dev em 2026', score: 76, reason: 'Alto engajamento garantido' },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-glass-hover transition-all mb-2">
                  <div className="text-2xl font-black text-accent">{s.score}%</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{s.topic}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.reason}</div>
                  </div>
                  <button className="btn-accent text-xs px-3 py-1.5">Gerar</button>
                </div>
              ))}
            </div>
          )}

          {subPage === 'social' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-glass p-6">
                <h2 className="font-bold mb-4">📱 WhatsApp</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/30"></div>
                  <span className="text-sm text-green-400">Conectado</span>
                </div>
                <p className="text-sm text-gray-500">Número registrado para aprovação de conteúdo</p>
              </div>
              <div className="card-glass p-6">
                <h2 className="font-bold mb-4">💬 Instagram DM</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30"></div>
                  <span className="text-sm text-yellow-400">Parcial</span>
                </div>
                <p className="text-sm text-gray-500">Resposta a comentários ativa. DM requer permissão Meta.</p>
              </div>
              <div className="card-glass p-6">
                <h2 className="font-bold mb-4">📨 Telegram</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/30"></div>
                  <span className="text-sm text-green-400">Conectado</span>
                </div>
                <p className="text-sm text-gray-500">Broadcast de promoções e ofertas</p>
              </div>
              <div className="card-glass p-6">
                <h2 className="font-bold mb-4">🐙 GitHub</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/30"></div>
                  <span className="text-sm text-green-400">Ativo</span>
                </div>
                <p className="text-sm text-gray-500">Arquivamento automático de conteúdo</p>
              </div>
            </div>
          )}

          {subPage === 'settings' && (
            <div className="max-w-2xl">
              <div className="card-glass p-6 mb-6">
                <h2 className="font-bold mb-1">Perfil</h2>
                <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
                <div className="text-sm text-gray-400">
                  <div><span className="text-gray-500">Plano:</span> {plan?.name || 'Gratuito'}</div>
                  <div><span className="text-gray-500">Limite mensal:</span> {plan?.max_posts_month || 10} posts</div>
                  <div><span className="text-gray-500">Funções:</span> {plan?.has_linkedin ? 'LinkedIn ' : ''}{plan?.has_instagram ? 'Instagram ' : ''}{plan?.has_github ? 'GitHub ' : ''}{plan?.has_whatsapp_approval ? 'WhatsApp' : ''}</div>
                </div>
              </div>
              <div className="card-glass p-6">
                <h2 className="font-bold mb-4">Ações</h2>
                <button onClick={() => onNavigate('pricing')} className="btn-accent text-sm">
                  ⬆ Fazer Upgrade
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* WhatsApp Modal */}
      {whatsappPost && (
        <WhatsAppModal post={whatsappPost} onClose={() => setWhatsappPost(null)} onApprove={handleApproveDraft} />
      )}
    </div>
  )
}
