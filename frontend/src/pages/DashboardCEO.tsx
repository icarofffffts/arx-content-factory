import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { SocialAccount } from '../types'
import WhatsAppModal from '../components/WhatsAppModal'
import ConnectWhatsAppModal from '../components/ConnectWhatsAppModal'
import DemoRequestModal from '../components/DemoRequestModal'
import PostCard from '../components/PostCard'
import AIChatWidget from '../components/AIChatWidget'

type SubPage = 'dashboard' | 'content' | 'suggestions' | 'social' | 'settings'

const TEMPLATES = [
  { id: 'clean', name: 'Clean Light', desc: 'Fundo claro, tipografia limpa e minimalista', accent: 'from-white/10 to-blue-500/10', border: 'border-blue-400/30', dot: 'bg-blue-400', badge: 'Clássico' },
  { id: 'dark', name: 'Dark Cyber', desc: 'Fundo escuro com neon e grid futurista', accent: 'from-violet-500/20 to-cyan-500/10', border: 'border-violet-400/40', dot: 'bg-violet-400', badge: 'Tech' },
  { id: 'minimal', name: 'Minimal Tech', desc: 'Preto e branco, foco total no texto', accent: 'from-gray-400/10 to-gray-600/10', border: 'border-gray-400/30', dot: 'bg-gray-300', badge: 'Sóbrio' },
]

const DEMO_POST = {
  id: 'demo',
  topic: '5 Certificações Tech que Pagam +R$15k em 2026',
  created_at: new Date().toISOString(),
}

const NAV: { id: SubPage; icon: string; label: string }[] = [
  { id: 'dashboard', icon: 'D', label: 'Painel' },
  { id: 'content', icon: 'C', label: 'Conteúdo' },
  { id: 'suggestions', icon: 'IA', label: 'Sugestões IA' },
  { id: 'social', icon: 'S', label: 'Social Bot' },
  { id: 'settings', icon: '⚙', label: 'Configurações' },
]

function navActiveClass(id: SubPage, active: SubPage) {
  if (id !== active) return ''
  const map: Record<SubPage, string> = {
    dashboard: 'bg-gradient-to-r from-blue-500/20 to-blue-600/10',
    content: 'bg-gradient-to-r from-purple-500/20 to-purple-600/10',
    suggestions: 'bg-gradient-to-r from-accent/20 to-accent-dark/10',
    social: 'bg-gradient-to-r from-green-500/20 to-green-600/10',
    settings: 'bg-gradient-to-r from-gray-500/20 to-gray-600/10',
  }
  return map[id]
}

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
  const [instances, setInstances] = useState<any[]>([])
  const [instancesLoading, setInstancesLoading] = useState(false)
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([])
  const [socialLoading, setSocialLoading] = useState(false)
  const [socialError, setSocialError] = useState('')
  const [suggestions, setSuggestions] = useState<{ topic: string; score: number; reason: string }[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(true)
  const [suggestionsError, setSuggestionsError] = useState('')
  const [generatingTopic, setGeneratingTopic] = useState<string | null>(null)
  const [generateMsg, setGenerateMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [customTopic, setCustomTopic] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('clean')
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({})
  const [settingsIsAdmin, setSettingsIsAdmin] = useState<boolean | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [analytics, setAnalytics] = useState<{ by_day: any[]; by_status: any[]; by_channel: any[] } | null>(null)
  const [marketTemplates, setMarketTemplates] = useState<any[]>([])
  const [apiKeyInfo, setApiKeyInfo] = useState<any>(null)
  const [newClient, setNewClient] = useState({ email: '', password: '', full_name: '', plan_slug: 'pro', niche: '' })
  const [clientMsg, setClientMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [newTemplate, setNewTemplate] = useState({ name: '', slug: '', description: '', accent_color: '#8b5cf6', badge: 'Novo' })
  const [templateMsg, setTemplateMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [connectOpen, setConnectOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoFormOpen, setDemoFormOpen] = useState(false)
  const [demoReleased, setDemoReleased] = useState(() => localStorage.getItem('arx_demo_released') === '1')

  async function loadInstances() {
    setInstancesLoading(true)
    try {
      const r = await api.whatsappInstances()
      if (r.success) setInstances(r.instances)
    } catch (e) { /* ignore */ }
    finally { setInstancesLoading(false) }
  }

  async function loadSocialAccounts() {
    setSocialLoading(true); setSocialError('')
    try {
      const r = await api.socialAccounts()
      if (r.success) setSocialAccounts(r.accounts || [])
      else setSocialError(r.error || 'Erro ao carregar contas')
    } catch (e: any) {
      setSocialError(e.message || 'Erro ao carregar contas')
    }
    finally { setSocialLoading(false) }
  }

  async function handleConnect(platform: string) {
    try {
      const r = await api.socialConnect(platform)
      if (r.redirect_url) window.location.href = r.redirect_url
      else alert(r.error || 'Erro ao conectar')
    } catch (e: any) {
      alert(e.message || 'Erro ao conectar')
    }
  }

  async function handleRefreshToken(id: string) {
    try {
      const r = await api.refreshSocialAccount(id)
      if (!r.success) alert(r.error || 'Erro ao atualizar token')
      loadSocialAccounts()
    } catch (e: any) {
      alert(e.message || 'Erro ao atualizar token')
    }
  }

  async function handleDisconnect(id: string) {
    if (!confirm('Desconectar esta conta?')) return
    try {
      const r = await api.deleteSocialAccount(id)
      if (!r.success) alert(r.error || 'Erro ao desconectar')
      loadSocialAccounts()
    } catch (e: any) {
      alert(e.message || 'Erro ao desconectar')
    }
  }

  useEffect(() => {
    if (subPage === 'social') {
      loadInstances()
      loadSocialAccounts()
    }
  }, [subPage])

  useEffect(() => {
    if (demoReleased) localStorage.setItem('arx_demo_released', '1')
  }, [demoReleased])

  useEffect(() => {
    Promise.all([
      api.metrics().then(setMetrics).catch(() => {}),
      api.posts().then(setPosts).catch(() => {}),
      api.drafts().then(setDrafts).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    api.suggestions()
      .then(r => {
        setSuggestions(Array.isArray(r) ? r : (r.suggestions || []))
        setSuggestionsError('')
      })
      .catch((e: any) => setSuggestionsError(e.message || 'Erro ao carregar sugestões'))
      .finally(() => setSuggestionsLoading(false))
  }, [])

  async function refreshPosts() {
    const r = await api.posts(statusFilter === 'all' ? undefined : statusFilter).catch(() => [])
    setPosts(r)
    const m = await api.metrics().catch(() => EMPTY_METRICS)
    setMetrics(m)
  }

  async function handlePublish(id: string) { await api.publishNow(id); refreshPosts() }
  async function handlePause(id: string) { await api.togglePause(id); refreshPosts() }
  async function handleDelete(id: string) { if (confirm('Excluir post?')) { await api.deletePost(id); refreshPosts() } }
  async function handleGenerateVideo(id: string) {
    try {
      const r = await api.generateVideo(id)
      alert(r.message || 'Geração de vídeo iniciada!')
      refreshPosts()
    } catch (e: any) {
      alert(e.message || 'Erro ao gerar vídeo')
    }
  }
  async function handleReschedule(id: string) {
    const date = prompt('Nova data (YYYY-MM-DD HH:MM):')
    if (date) { await api.reschedule(id, date); refreshPosts() }
  }
  async function handleApproveDraft(id: string) {
    if (id === 'demo') { setWhatsappPost(null); return }
    await api.approveDraft(id); setWhatsappPost(null); refreshPosts()
  }
  function openDemo() {
    if (demoReleased) {
      setWhatsappPost(DEMO_POST)
    } else {
      setDemoFormOpen(true)
    }
  }
  function handleDemoSuccess() {
    setDemoReleased(true)
    setDemoFormOpen(false)
    setWhatsappPost(DEMO_POST)
  }
  async function handleReorganize() { await api.reorganize(); refreshPosts() }

  async function handleGenerate(topic: string) {
    setGeneratingTopic(topic)
    setGenerateMsg(null)
    try {
      const r = await api.generate(topic, 'all', 'now', selectedTemplate)
      setGenerateMsg({ ok: true, text: r.message || 'Geração iniciada!' })
      // Refresh drafts so the new post appears
      setTimeout(() => { api.drafts().then(setDrafts).catch(() => {}) }, 8000)
    } catch {
      setGenerateMsg({ ok: false, text: 'Erro ao iniciar geração. Tente novamente.' })
    } finally {
      setGeneratingTopic(null)
    }
  }

  async function handleGenerateCustom() {
    const topic = customTopic.trim()
    if (!topic) { setGenerateMsg({ ok: false, text: 'Digite um tema para gerar!' }); return }
    await handleGenerate(topic)
    setCustomTopic('')
  }

  async function loadSettings() {
    setSettingsLoading(true)
    try {
      const r = await api.getSettings()
      setSettings(r.settings || {})
      setSettingsIsAdmin(r.is_admin)
      // Pré-enche o form sem os segredos mascarados (deixa placeholder "mantém atual")
      const form: Record<string, string> = {}
      for (const [k, v] of Object.entries(r.settings || {})) {
        if (v && !v.startsWith('••••')) form[k] = v
      }
      setSettingsForm(form)
    } catch (e: any) {
      setSettingsIsAdmin(false)
    } finally {
      setSettingsLoading(false)
    }
  }

  async function handleSaveSettings() {
    setSettingsSaving(true)
    setSettingsMsg(null)
    try {
      const r = await api.saveSettings(settingsForm)
      setSettingsMsg({ ok: true, text: r.message || 'Configurações salvas!' })
      loadSettings()
    } catch (e: any) {
      setSettingsMsg({ ok: false, text: e.message || 'Erro ao salvar' })
    } finally {
      setSettingsSaving(false)
    }
  }

  const stripeConfigured = !!(settings.stripe_secret_key)
  const videoConfigured = !!(settings.video_api_key)

  async function loadAnalytics() {
    try {
      const r = await api.analytics()
      setAnalytics({ by_day: r.by_day || [], by_status: r.by_status || [], by_channel: r.by_channel || [] })
    } catch { /* ignore */ }
  }

  async function loadMarketTemplates() {
    try {
      const r = await api.templates()
      setMarketTemplates(r.templates || [])
    } catch { /* ignore */ }
  }

  async function loadApiKey() {
    try {
      const r = await api.myApiKey()
      setApiKeyInfo(r.api_key || null)
    } catch { /* ignore */ }
  }

  async function handleCreateClient() {
    if (!newClient.email || !newClient.password) { setClientMsg({ ok: false, text: 'Email e senha obrigatórios' }); return }
    setClientMsg(null)
    try {
      const r = await api.adminCreateUser(newClient)
      setClientMsg({ ok: true, text: r.message || 'Cliente criado!' })
      setNewClient({ email: '', password: '', full_name: '', plan_slug: 'pro', niche: '' })
    } catch (e: any) {
      setClientMsg({ ok: false, text: e.message || 'Erro ao criar cliente' })
    }
  }

  async function handleSaveTemplate() {
    if (!newTemplate.name || !newTemplate.slug) { setTemplateMsg({ ok: false, text: 'Nome e slug obrigatórios' }); return }
    setTemplateMsg(null)
    try {
      const r = await api.saveTemplate(newTemplate)
      setTemplateMsg({ ok: true, text: r.message || 'Template salvo!' })
      setNewTemplate({ name: '', slug: '', description: '', accent_color: '#8b5cf6', badge: 'Novo' })
      loadMarketTemplates()
    } catch (e: any) {
      setTemplateMsg({ ok: false, text: e.message || 'Erro ao salvar template' })
    }
  }

  useEffect(() => {
    if (subPage === 'settings') { loadSettings(); loadMarketTemplates(); loadApiKey() }
    if (subPage === 'dashboard') loadAnalytics()
  }, [subPage])

  const filteredPosts = statusFilter === 'all' ? posts : posts.filter(p => p.status === statusFilter)

  const STATS_CARDS = [
    { label: 'Total no Pipeline', value: metrics.total, color: 'from-violet-500 to-violet-700', icon: '📊' },
    { label: 'Agendados', value: metrics.scheduled, color: 'from-blue-500 to-blue-700', icon: '📅' },
    { label: 'Rascunhos', value: metrics.draft, color: 'from-amber-400 to-amber-600', icon: '📝' },
    { label: 'Pausados', value: metrics.paused, color: 'from-orange-400 to-orange-600', icon: '⏸' },
    { label: 'LinkedIn', value: metrics.posted_linkedin, color: 'from-sky-300 to-sky-500', icon: '💼' },
    { label: 'Instagram', value: metrics.posted_instagram, color: 'from-pink-400 to-pink-600', icon: '📸' },
    { label: 'Publicados', value: metrics.published, color: 'from-emerald-400 to-emerald-600', icon: '✅' },
  ]

  const FILTERS = [
    { key: 'all', label: 'Todos' },
    { key: 'scheduled', label: 'Agendados' },
    { key: 'draft', label: 'Rascunhos' },
    { key: 'paused', label: 'Pausados' },
    { key: 'published', label: 'Publicados' },
  ]

  const SOCIAL_PLATFORMS = [
    { platform: 'instagram', name: 'Instagram', icon: '📷', flag: 'has_instagram' },
    { platform: 'linkedin', name: 'LinkedIn', icon: '💼', flag: 'has_linkedin' },
    { platform: 'github', name: 'GitHub', icon: '🐙', flag: 'has_github' },
  ]
  const enabledPlatforms = SOCIAL_PLATFORMS.filter(p => plan?.[p.flag])

  function socialStatusLabel(status: string) {
    switch (status) {
      case 'expired': return 'Expirado'
      case 'revoked': return 'Revogado'
      default: return 'Ativo'
    }
  }
  const socialStatusColors: Record<string, string> = {
    active: 'bg-green-400/10 text-green-400',
    expired: 'bg-yellow-400/10 text-yellow-400',
    revoked: 'bg-red-400/10 text-red-400',
  }
  const socialDotColors: Record<string, string> = {
    active: 'bg-green-400 shadow-lg shadow-green-400/30',
    expired: 'bg-yellow-400 shadow-lg shadow-yellow-400/30',
    revoked: 'bg-red-400 shadow-lg shadow-red-400/30',
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-full bg-surface-900/70 border-r border-glass-border backdrop-blur-xl z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className="p-4 flex items-center justify-between border-b border-glass-border h-16">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-gradient-to-br from-accent-light to-accent-dark rounded-xl flex items-center justify-center font-black text-sm shadow-glow-sm">
              A
            </span>
            {!collapsed && <span className="font-bold text-sm tracking-tight">Arx Factory</span>}
          </div>
          <button onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-white text-xs p-1.5 rounded-lg hover:bg-glass-hover transition-all">
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="p-2 space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setSubPage(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                subPage === n.id
                  ? `${navActiveClass(n.id, subPage)} text-white shadow-sm border border-white/5`
                  : 'text-gray-400 hover:text-white hover:bg-glass-hover'
              }`}>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                subPage === n.id ? 'bg-gradient-to-br from-accent-light to-accent-dark text-white shadow-glow-sm' : 'bg-surface-600/50 text-gray-400'
              }`}>
                {n.icon}
              </span>
              {!collapsed && <span>{n.label}</span>}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-glass-border">
          {!collapsed && (
            <div className="px-3 py-2 mb-1">
              <div className="text-xs text-gray-500 truncate">{user?.full_name || user?.email}</div>
              {plan && (
                <div className="inline-block text-[10px] text-accent-light bg-accent/10 px-2 py-0.5 rounded-full mt-1">
                  {plan.name}
                </div>
              )}
            </div>
          )}
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-glass-hover transition-all">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-surface-600/50">✕</span>
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-56'}`}>
        <header className="h-16 border-b border-glass-border flex items-center justify-between px-6 bg-surface-900/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center text-sm font-bold text-accent">
              {NAV.find(n => n.id === subPage)?.icon}
            </span>
            <h1 className="font-bold text-lg">{NAV.find(n => n.id === subPage)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('pricing')} className="text-xs btn-ghost px-3 py-1.5">Planos</button>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </header>

        <div className="p-6">
          {subPage === 'dashboard' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                {STATS_CARDS.map((s, i) => (
                  <div key={i} className="card-glass p-4 card-hover relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`} />
                    <div className="relative">
                      <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                      <div className="flex items-end justify-between">
                        <div className="text-2xl font-black gradient-text">{s.value}</div>
                        <span className="text-sm opacity-40">{s.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analytics */}
              {analytics && analytics.by_day.length > 0 && (
                <div className="card-glass p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center text-xs">📊</span>
                    <h2 className="font-bold">Produção (últimos 14 dias)</h2>
                  </div>
                  <div className="flex items-end gap-1.5 h-28">
                    {[...analytics.by_day].reverse().map((d, i) => {
                      const max = Math.max(...analytics.by_day.map(x => Number(x.total) || 1), 1)
                      const h = Math.max(8, Math.round((Number(d.total) / max) * 100))
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                          <div className="text-[10px] text-gray-500">{d.total}</div>
                          <div className="w-full bg-gradient-to-t from-accent to-accent-light rounded-t-md transition-all duration-500 hover:from-accent-light hover:to-accent"
                            style={{ height: `${h}px` }} title={d.day} />
                          <div className="text-[9px] text-gray-600 truncate w-full text-center">{d.day.slice(5)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {drafts.length > 0 && (
                <div className="card-glass p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center text-xs">📋</span>
                    <h2 className="font-bold">Fila de Aprovação</h2>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full ml-auto">{drafts.length}</span>
                  </div>
                  <div className="space-y-2">
                    {drafts.slice(0, 5).map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-glass hover:bg-glass-hover transition-all group">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="text-sm font-medium truncate">{d.topic}</div>
                          <div className="text-xs text-gray-500">{new Date(d.created_at).toLocaleString('pt-BR')}</div>
                        </div>
                        <button onClick={() => setWhatsappPost(d)}
                          className="btn-accent text-xs px-4 py-2 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
                          ✅ Aprovar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-glass p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center text-xs">📈</span>
                  <h2 className="font-bold">Atividade Recente</h2>
                </div>
                <div className="space-y-1">
                  {posts.slice(0, 10).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm p-3 rounded-xl hover:bg-glass-hover transition-all">
                      <span className="text-gray-300 truncate mr-4">{p.topic}</span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(p.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                  ))}
                  {posts.length === 0 && !loading && (
                    <div className="text-center py-10 text-gray-500">Nenhuma atividade ainda</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {subPage === 'content' && (
            <div>
              {/* Gerador customizado */}
              <div className="card-glass p-6 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center text-xs">✨</span>
                    <h2 className="font-bold">Gerar novo conteúdo</h2>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 ml-8">Escolha um tema e o visual dos slides</p>

                  <div className="flex gap-2 mb-4 ml-8">
                    <input
                      value={customTopic}
                      onChange={e => setCustomTopic(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleGenerateCustom() }}
                      placeholder="Digite um tema, ex: Inteligência Artificial no marketing em 2026"
                      className="flex-1 bg-glass border border-glass-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-all"
                    />
                    <button
                      onClick={handleGenerateCustom}
                      disabled={generatingTopic !== null}
                      className="btn-accent text-sm px-6 py-2.5 whitespace-nowrap disabled:opacity-40"
                    >
                      {generatingTopic !== null ? 'Gerando...' : '🚀 Gerar conteúdo'}
                    </button>
                  </div>

                  {/* Seletor de templates */}
                  <div className="ml-8">
                    <div className="text-xs text-gray-500 mb-2">Template dos slides</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
                      {TEMPLATES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTemplate(t.id)}
                          className={`text-left p-3 rounded-xl border bg-glass transition-all ${
                            selectedTemplate === t.id
                              ? `${t.border} ring-2 ring-white/10 scale-[1.02]`
                              : 'border-glass-border hover:border-gray-600'
                          }`}
                        >
                          <div className={`h-14 rounded-lg bg-gradient-to-br ${t.accent} border border-white/5 mb-2 relative overflow-hidden`}>
                            <div className="absolute top-2 left-2 w-10 h-1.5 rounded-full bg-white/20" />
                            <div className="absolute top-5 left-2 w-14 h-1 rounded-full bg-white/10" />
                            <div className="absolute top-7 left-2 w-8 h-1 rounded-full bg-white/10" />
                            <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full ${t.dot}`} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.dot} text-black font-bold`}>{t.badge}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {generateMsg && (
                    <div className={`ml-8 mt-4 text-sm px-4 py-3 rounded-xl max-w-3xl ${generateMsg.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {generateMsg.text}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                {FILTERS.map(f => (
                  <button key={f.key} onClick={() => setStatusFilter(f.key)}
                    className={`text-sm px-4 py-2 rounded-xl transition-all font-medium ${
                      statusFilter === f.key
                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                        : 'bg-glass border border-glass-border text-gray-400 hover:text-white hover:border-gray-600'
                    }`}>
                    {f.label}
                  </button>
                ))}
                <button onClick={handleReorganize} className="btn-ghost text-sm px-4 py-2 ml-auto">
                  🔄 Reorganizar
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map(p => (
                  <PostCard key={p.id} post={p}
                    onPublish={handlePublish} onPause={handlePause}
                    onDelete={handleDelete} onReschedule={handleReschedule}
                    onGenerateVideo={handleGenerateVideo} />
                ))}
              </div>
              {filteredPosts.length === 0 && !loading && (
                <div className="text-center py-20 text-gray-500">Nenhum post encontrado</div>
              )}
            </div>
          )}

          {subPage === 'suggestions' && (
            <div className="card-glass p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center text-xs">🤖</span>
                <h2 className="font-bold">Sugestões de Conteúdo IA</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6 ml-8">Tópicos gerados por IA baseados nas tendências atuais</p>
              {generateMsg && (
                <div className={`ml-8 mb-4 text-sm px-4 py-3 rounded-xl ${generateMsg.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {generateMsg.text}
                </div>
              )}
              {suggestionsLoading ? (
                <div className="space-y-2">
                  <div className="loading-pulse h-16" />
                  <div className="loading-pulse h-16" />
                  <div className="loading-pulse h-16" />
                </div>
              ) : suggestionsError ? (
                <div className="text-center py-10 text-sm text-red-400">{suggestionsError}</div>
              ) : suggestions.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Nenhuma sugestão disponível ainda</div>
              ) : (
                suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-glass hover:bg-glass-hover transition-all mb-2 group">
                    <div className="relative">
                      <div className="text-2xl font-black text-accent">{s.score}%</div>
                      <div className="text-[10px] text-gray-600 text-center">score</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{s.topic}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.reason}</div>
                    </div>
                    <button
                      onClick={() => handleGenerate(s.topic)}
                      disabled={generatingTopic !== null}
                      className="btn-accent text-xs px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40"
                    >
                      {generatingTopic === s.topic ? 'Gerando...' : 'Gerar'}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {subPage === 'social' && (
            <div className="space-y-6">
              <div className="card-glass p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-lg">🔗</span>
                  <div className="flex-1">
                    <h2 className="font-bold">Contas conectadas</h2>
                    <p className="text-xs text-gray-500">Instagram, LinkedIn e GitHub para publicação automática</p>
                  </div>
                </div>

                {socialLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="loading-pulse h-32" />
                    <div className="loading-pulse h-32" />
                    <div className="loading-pulse h-32" />
                  </div>
                ) : socialError ? (
                  <div className="text-center py-10 text-sm text-red-400">{socialError}</div>
                ) : enabledPlatforms.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    Seu plano não inclui contas sociais conectadas.{' '}
                    <button onClick={() => onNavigate('pricing')} className="text-accent">Fazer upgrade</button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enabledPlatforms.map(p => {
                      const account = socialAccounts.find(a => a.platform === p.platform)
                      if (account) {
                        return (
                          <div key={p.platform} className="bg-glass hover:bg-glass-hover transition-all rounded-xl p-4 group">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-lg">{p.icon}</span>
                                <div className="min-w-0">
                                  <div className="font-semibold text-sm">{p.name}</div>
                                  <div className="text-[11px] text-gray-500 truncate">
                                    {account.handle ? `@${account.handle}` : (account.token_masked || account.account_id || 'conta conectada')}
                                  </div>
                                </div>
                              </div>
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${socialStatusColors[account.status] || 'bg-gray-400/10 text-gray-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${socialDotColors[account.status] || 'bg-gray-400'}`} />
                                {socialStatusLabel(account.status)}
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs text-gray-500 truncate">
                                {account.token_expires_at
                                  ? `Token expira ${new Date(account.token_expires_at).toLocaleDateString('pt-BR')}`
                                  : 'Token ativo'}
                              </span>
                              <div className="flex items-center gap-1 whitespace-nowrap">
                                <button
                                  onClick={() => handleRefreshToken(account.id)}
                                  className="text-xs text-blue-400/70 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-400/10 transition-all opacity-0 group-hover:opacity-100">
                                  Atualizar token
                                </button>
                                <button
                                  onClick={() => handleDisconnect(account.id)}
                                  className="text-xs text-red-400/60 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100">
                                  Desconectar
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return (
                        <div key={p.platform} className="card-glass p-4 card-hover flex flex-col">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-lg">{p.icon}</span>
                            <div>
                              <div className="font-semibold text-sm">{p.name}</div>
                              <div className="text-[11px] text-gray-500">Não conectado</div>
                            </div>
                          </div>
                          <button onClick={() => handleConnect(p.platform)} className="btn-accent text-xs px-4 py-2 mt-auto">
                            Conectar {p.name}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="card-glass p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-lg">💬</span>
                  <div className="flex-1">
                    <h2 className="font-bold">WhatsApp</h2>
                    <p className="text-xs text-gray-500">Números conectados para aprovação de conteúdo</p>
                  </div>
                  <button onClick={openDemo} className="btn-ghost text-sm px-4 py-2">
                    🎬 Ver demonstração
                  </button>
                  <button onClick={() => setConnectOpen(true)} className="btn-accent text-sm px-4 py-2">
                    + Conectar número
                  </button>
                </div>

                {instancesLoading ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="loading-pulse h-28" />
                    <div className="loading-pulse h-28" />
                  </div>
                ) : instances.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    Nenhum número conectado ainda. Clique em <span className="text-accent">+ Conectar número</span> para criar a primeira instância.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {instances.map((inst, i) => {
                      const ok = inst.connected || inst.status === 'connected'
                      return (
                        <div key={inst.id || i} className="bg-glass hover:bg-glass-hover transition-all rounded-xl p-4 group">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-lg">💬</span>
                              <div className="min-w-0">
                                <div className="font-semibold text-sm truncate">{inst.client_name}</div>
                                <div className="text-[11px] text-gray-500 font-mono truncate">{inst.instance_name}</div>
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              ok ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${ok ? 'bg-green-400 shadow-lg shadow-green-400/30' : 'bg-yellow-400 shadow-lg shadow-yellow-400/30'}`} />
                              {ok ? 'Conectado' : 'Desconectado'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {inst.number || (ok ? 'Número ativo' : 'Aguardando conexão')}
                            </span>
                            <button
                              onClick={async () => { if (confirm(`Remover instância de ${inst.client_name}?`)) { await api.deleteWhatsAppInstance(inst.instance_name); loadInstances() } }}
                              className="text-red-400/60 hover:text-red-300 text-xs px-2 py-1 rounded-lg hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100">
                              Remover
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'Instagram DM', icon: '📷', status: 'Parcial', color: 'yellow', desc: 'Resposta a comentários ativa. DM requer permissão Meta.' },
                  { name: 'Telegram', icon: '✈', status: 'Conectado', color: 'green', desc: 'Broadcast de promoções e ofertas' },
                  { name: 'GitHub', icon: '🐙', status: 'Ativo', color: 'green', desc: 'Arquivamento automático de conteúdo' },
                ].map((svc, i) => {
                  const statusColors: Record<string, string> = {
                    green: 'bg-green-400/10 text-green-400',
                    yellow: 'bg-yellow-400/10 text-yellow-400',
                  }
                  const dotColors: Record<string, string> = {
                    green: 'bg-green-400 shadow-lg shadow-green-400/30',
                    yellow: 'bg-yellow-400 shadow-lg shadow-yellow-400/30',
                  }
                  return (
                    <div key={i} className="card-glass p-6 card-hover">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-lg">{svc.icon}</span>
                          <h2 className="font-bold">{svc.name}</h2>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColors[svc.color] || 'bg-gray-400/10 text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${dotColors[svc.color] || 'bg-gray-400'}`} />
                          {svc.status}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{svc.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {subPage === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="card-glass p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-accent/20">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{user?.full_name || 'Usuário'}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-glass rounded-xl p-4">
                    <div className="text-gray-500 text-xs mb-1">Plano</div>
                    <div className="font-semibold text-accent">{plan?.name || 'Gratuito'}</div>
                  </div>
                  <div className="bg-glass rounded-xl p-4">
                    <div className="text-gray-500 text-xs mb-1">Limite mensal</div>
                    <div className="font-semibold">{plan?.max_posts_month || 10} posts</div>
                  </div>
                  <div className="bg-glass rounded-xl p-4 col-span-2">
                    <div className="text-gray-500 text-xs mb-2">Funções ativas</div>
                    <div className="flex flex-wrap gap-2">
                      {plan?.has_linkedin && <span className="text-xs bg-blue-400/10 text-blue-400 px-3 py-1 rounded-full">LinkedIn</span>}
                      {plan?.has_instagram && <span className="text-xs bg-pink-400/10 text-pink-400 px-3 py-1 rounded-full">Instagram</span>}
                      {plan?.has_github && <span className="text-xs bg-green-400/10 text-green-400 px-3 py-1 rounded-full">GitHub</span>}
                      {plan?.has_whatsapp_approval && <span className="text-xs bg-green-400/10 text-green-400 px-3 py-1 rounded-full">WhatsApp</span>}
                      {!plan?.has_linkedin && !plan?.has_instagram && !plan?.has_github && !plan?.has_whatsapp_approval && (
                        <span className="text-xs text-gray-500">Nenhuma função extra</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Painel de Integrações (admin) */}
              <div className="card-glass p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center text-xs">🔌</span>
                  <h2 className="font-bold">Integrações</h2>
                  {settingsIsAdmin === false && (
                    <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full ml-2">só admin</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-4 ml-8">Configure chaves de API de pagamento e geração de vídeo direto pelo painel</p>

                {settingsIsAdmin === false ? (
                  <div className="ml-8 text-sm text-gray-500 bg-glass rounded-xl p-4">
                    Apenas administradores podem alterar integrações.
                  </div>
                ) : (
                  <>
                    <div className="ml-8 space-y-4">
                      {/* Stripe */}
                      <div className="bg-glass rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm">💳</span>
                          <div>
                            <div className="font-semibold text-sm">Stripe (pagamentos)</div>
                            <div className="text-[11px] text-gray-500">Checkout de assinaturas Pro/Enterprise</div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ml-auto ${stripeConfigured ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                            {stripeConfigured ? 'Configurado' : 'Não configurado'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Secret Key (sk_live_... ou sk_test_...)</label>
                            <input
                              type="password"
                              value={settingsForm.stripe_secret_key || ''}
                              onChange={e => setSettingsForm(f => ({ ...f, stripe_secret_key: e.target.value }))}
                              placeholder={settings.stripe_secret_key ? '•••••••• (mantém atual)' : 'sk_live_...'}
                              className="glass-input w-full !py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Webhook Secret (whsec_...)</label>
                            <input
                              type="password"
                              value={settingsForm.stripe_webhook_secret || ''}
                              onChange={e => setSettingsForm(f => ({ ...f, stripe_webhook_secret: e.target.value }))}
                              placeholder={settings.stripe_webhook_secret ? '•••••••• (mantém atual)' : 'whsec_...'}
                              className="glass-input w-full !py-2 text-sm"
                            />
                          </div>
                          <div className="text-[11px] text-gray-600 bg-surface-900/60 rounded-lg px-3 py-2 font-mono">
                            Webhook URL: <span className="text-blue-400">https://conteudos.icarodev.cloud/api/v2/plans/webhook</span>
                          </div>
                        </div>
                      </div>

                      {/* Vídeo */}
                      <div className="bg-glass rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm">🎬</span>
                          <div>
                            <div className="font-semibold text-sm">Geração de Vídeo</div>
                            <div className="text-[11px] text-gray-500">API para criar Reels/Shorts dos slides</div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ml-auto ${videoConfigured ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                            {videoConfigured ? 'Configurado' : 'Não configurado'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Provedor (replicate / fal / runway)</label>
                            <input
                              value={settingsForm.video_api_provider || ''}
                              onChange={e => setSettingsForm(f => ({ ...f, video_api_provider: e.target.value }))}
                              placeholder="replicate"
                              className="glass-input w-full !py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">API Key do provedor</label>
                            <input
                              type="password"
                              value={settingsForm.video_api_key || ''}
                              onChange={e => setSettingsForm(f => ({ ...f, video_api_key: e.target.value }))}
                              placeholder={settings.video_api_key ? '•••••••• (mantém atual)' : 'r8_... ou fal key'}
                              className="glass-input w-full !py-2 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Extra */}
                      <div className="bg-glass rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm">⚙️</span>
                          <div className="font-semibold text-sm">Extras</div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Base do n8n (ex: n8n.arxsolutions.cloud)</label>
                            <input
                              value={settingsForm.n8n_webhook_base || ''}
                              onChange={e => setSettingsForm(f => ({ ...f, n8n_webhook_base: e.target.value }))}
                              placeholder="n8n.arxsolutions.cloud"
                              className="glass-input w-full !py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Template padrão (clean / dark / minimal)</label>
                            <select
                              value={settingsForm.default_template || 'clean'}
                              onChange={e => setSettingsForm(f => ({ ...f, default_template: e.target.value }))}
                              className="glass-input w-full !py-2 text-sm"
                            >
                              <option value="clean" className="bg-surface-900">Clean Light</option>
                              <option value="dark" className="bg-surface-900">Dark Cyber</option>
                              <option value="minimal" className="bg-surface-900">Minimal Tech</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {settingsMsg && (
                      <div className={`ml-8 mt-4 text-sm px-4 py-3 rounded-xl ${settingsMsg.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {settingsMsg.text}
                      </div>
                    )}
                    <div className="ml-8 mt-4">
                      <button onClick={handleSaveSettings} disabled={settingsSaving}
                        className="btn-accent text-sm disabled:opacity-40">
                        {settingsSaving ? 'Salvando...' : '💾 Salvar configurações'}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* API Key (agências) */}
              <div className="card-glass p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center text-xs">🔑</span>
                  <h2 className="font-bold">API Key (agências)</h2>
                </div>
                <p className="text-gray-500 text-sm mb-4 ml-8">Use a API pública para gerar conteúdo programaticamente</p>
                <div className="ml-8">
                  {apiKeyInfo ? (
                    <div className="bg-glass rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">Sua chave (use no header <code className="text-accent">X-API-Key</code>):</div>
                      <div className="font-mono text-sm text-accent break-all bg-surface-900/60 rounded-lg px-3 py-2 select-all">
                        {apiKeyInfo.key}
                      </div>
                      <div className="text-[11px] text-gray-600 mt-3 space-y-1">
                        <div><span className="text-gray-500">GET</span> <code className="text-blue-400">/api/v1/me</code> — identifica a chave</div>
                        <div><span className="text-gray-500">GET</span> <code className="text-blue-400">/api/v1/posts</code> — lista seus posts</div>
                        <div><span className="text-gray-500">POST</span> <code className="text-blue-400">/api/v1/generate</code> — gera conteúdo ({'{ topic, channel, template }'})</div>
                      </div>
                    </div>
                  ) : (
                    <button onClick={loadApiKey} className="btn-accent text-sm">🔑 Gerar minha API key</button>
                  )}
                </div>
              </div>

              {/* Whitelabel: criar cliente (admin) */}
              {settingsIsAdmin === true && (
                <div className="card-glass p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center text-xs">👥</span>
                    <h2 className="font-bold">Whitelabel — Criar cliente</h2>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 ml-8">Crie contas para clientes com plano incluso (eles gerem seu próprio conteúdo)</p>
                  <div className="ml-8 grid sm:grid-cols-2 gap-3">
                    <input value={newClient.email} onChange={e => setNewClient(f => ({ ...f, email: e.target.value }))}
                      placeholder="email do cliente" className="glass-input !py-2 text-sm" />
                    <input value={newClient.full_name} onChange={e => setNewClient(f => ({ ...f, full_name: e.target.value }))}
                      placeholder="Nome completo" className="glass-input !py-2 text-sm" />
                    <input value={newClient.password} onChange={e => setNewClient(f => ({ ...f, password: e.target.value }))}
                      placeholder="Senha" type="password" className="glass-input !py-2 text-sm" />
                    <input value={newClient.niche} onChange={e => setNewClient(f => ({ ...f, niche: e.target.value }))}
                      placeholder="Nicho (ex: marketing tech)" className="glass-input !py-2 text-sm" />
                    <select value={newClient.plan_slug} onChange={e => setNewClient(f => ({ ...f, plan_slug: e.target.value }))}
                      className="glass-input !py-2 text-sm">
                      <option value="pro" className="bg-surface-900">Pro (R$97)</option>
                      <option value="enterprise" className="bg-surface-900">Enterprise (R$297)</option>
                      <option value="gratuito" className="bg-surface-900">Gratuito</option>
                    </select>
                    <button onClick={handleCreateClient} className="btn-accent text-sm">👥 Criar cliente</button>
                  </div>
                  {clientMsg && (
                    <div className={`ml-8 mt-3 text-sm px-4 py-3 rounded-xl ${clientMsg.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {clientMsg.text}
                    </div>
                  )}
                </div>
              )}

              {/* Marketplace de Templates (admin) */}
              {settingsIsAdmin === true && (
                <div className="card-glass p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center text-xs">🎨</span>
                    <h2 className="font-bold">Marketplace de Templates</h2>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 ml-8">Gerencie os estilos de slide disponíveis para todos os clientes</p>
                  <div className="ml-8 grid sm:grid-cols-3 gap-3 mb-4">
                    {marketTemplates.map(t => (
                      <div key={t.slug} className="bg-glass rounded-xl p-3">
                        <div className="h-10 rounded-lg mb-2 border border-white/5" style={{ background: `linear-gradient(135deg, ${t.accent_color}22, transparent)` }} />
                        <div className="text-sm font-medium flex items-center justify-between">
                          {t.name}
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-black" style={{ background: t.accent_color }}>{t.badge}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{t.description}</div>
                      </div>
                    ))}
                  </div>
                  <div className="ml-8 grid sm:grid-cols-2 gap-3">
                    <input value={newTemplate.name} onChange={e => setNewTemplate(f => ({ ...f, name: e.target.value }))}
                      placeholder="Nome (ex: Neon Nights)" className="glass-input !py-2 text-sm" />
                    <input value={newTemplate.slug} onChange={e => setNewTemplate(f => ({ ...f, slug: e.target.value }))}
                      placeholder="slug (ex: neon)" className="glass-input !py-2 text-sm" />
                    <input value={newTemplate.description} onChange={e => setNewTemplate(f => ({ ...f, description: e.target.value }))}
                      placeholder="Descrição" className="glass-input !py-2 text-sm" />
                    <div className="flex gap-2">
                      <input type="color" value={newTemplate.accent_color} onChange={e => setNewTemplate(f => ({ ...f, accent_color: e.target.value }))}
                        className="w-12 h-10 rounded-lg bg-glass border border-glass-border cursor-pointer" />
                      <input value={newTemplate.badge} onChange={e => setNewTemplate(f => ({ ...f, badge: e.target.value }))}
                        placeholder="Badge (ex: Premium)" className="glass-input flex-1 !py-2 text-sm" />
                    </div>
                    <button onClick={handleSaveTemplate} className="btn-accent text-sm">🎨 Salvar template</button>
                  </div>
                  {templateMsg && (
                    <div className={`ml-8 mt-3 text-sm px-4 py-3 rounded-xl ${templateMsg.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {templateMsg.text}
                    </div>
                  )}
                </div>
              )}

              <div className="card-glass p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-bold">Quer mais?</h2>
                  <p className="text-sm text-gray-500 mt-1">Desbloqueie todos os recursos</p>
                </div>
                <button onClick={() => onNavigate('pricing')} className="btn-accent text-sm">
                  ⬆ Fazer Upgrade
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {whatsappPost && (
        <WhatsAppModal post={whatsappPost} onClose={() => setWhatsappPost(null)} onApprove={handleApproveDraft} />
      )}
      {connectOpen && (
        <ConnectWhatsAppModal onClose={() => setConnectOpen(false)} onConnected={loadInstances} />
      )}
      {demoFormOpen && (
        <DemoRequestModal onClose={() => setDemoFormOpen(false)} onSuccess={handleDemoSuccess} />
      )}
      <AIChatWidget />
    </div>
  )
}
