import { useState, useEffect, type ReactNode } from 'react'
import { api } from './lib/api'
import Landing from './imports/Landing'
import Login from './imports/Login'
import Signup from './imports/Signup'
import ArxLogo from './imports/ArxLogo'
import PasswordStrength from './imports/PasswordStrength'

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icon = ({ d, size = 16, className = '' }: { d: string; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
)

const icons = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  content: 'M4 6h16M4 10h16M4 14h8',
  templates: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
  schedule: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  analytics: 'M18 20V10M12 20V4M6 20v-6',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  plus: 'M12 5v14M5 12h14',
  video: 'M15 10l4.553-2.069A1 1 0 0121 8.876V15.124a1 1 0 01-1.447.895L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
  image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  check: 'M20 6L9 17l-5-5',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  calendar: 'M8 2v3M16 2v3M3.5 9.5h17M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
  spark: 'M12 3l1.09 3.26L16.5 6l-2.27 2.5 1.09 3.26L12 9.75 8.68 11.76l1.09-3.26L7.5 6l3.41-.74L12 3z',
  play: 'M5 3l14 9-14 9V3z',
  carousel: 'M2 7h20M2 12h20M2 17h20',
  instagram: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z',
  twitter: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z',
  copy: 'M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  close: 'M18 6L6 18M6 6l12 12',
  chevronRight: 'M9 18l6-6-6-6',
  chevronDown: 'M6 9l6 6 6-6',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  key: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  moon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  sun: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 100 14A7 7 0 0012 5z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  globe: 'M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20',
  creditCard: 'M1 4h22v16H1zM1 10h22',
  toggle: 'M9 12a3 3 0 100-6 3 3 0 000 6zM2 9h2m14 0h2M9 12V6',
  info: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 8v4M12 16h.01',
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = 'dashboard' | 'content' | 'templates' | 'schedule' | 'analytics' | 'admin'
type PostStatus = 'scheduled' | 'draft' | 'processing' | 'published' | 'pending'
type ContentType = 'carousel' | 'video' | 'image'

interface Post {
  id: string
  title: string
  type: ContentType
  status: PostStatus
  channels: string[]
  date: string
  engagement?: string
  thumbnail: string
}

interface Template {
  id: string
  name: string
  category: string
  type: ContentType
  slides?: number
  duration?: string
  color: string
  accent: string
  rating: number
  uses: number
  tags: string[]
  preview: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const posts: Post[] = [
  { id: '1', title: '5 Growth Hacks for SaaS Startups', type: 'carousel', status: 'scheduled', channels: ['instagram', 'linkedin'], date: 'Aug 5, 10:00 AM', engagement: '—', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&auto=format' },
  { id: '2', title: 'Q3 Product Roadmap Reveal', type: 'video', status: 'processing', channels: ['twitter', 'linkedin'], date: 'Aug 6, 2:30 PM', engagement: '—', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop&auto=format' },
  { id: '3', title: 'How We Scaled to 10k Users', type: 'carousel', status: 'published', channels: ['instagram'], date: 'Aug 3, 9:00 AM', engagement: '4.2k', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop&auto=format' },
  { id: '4', title: 'Behind the Scenes: Our Office', type: 'video', status: 'draft', channels: ['instagram', 'twitter'], date: '—', engagement: '—', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop&auto=format' },
  { id: '5', title: 'Weekly Market Insights #12', type: 'carousel', status: 'pending', channels: ['linkedin'], date: 'Aug 7, 8:00 AM', engagement: '—', thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop&auto=format' },
  { id: '6', title: 'Meet the Team: Design Edition', type: 'image', status: 'scheduled', channels: ['instagram', 'linkedin'], date: 'Aug 8, 11:00 AM', engagement: '—', thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&auto=format' },
]

const templates: Template[] = [
  { id: 't1', name: 'Tech Startup Growth', category: 'Business', type: 'carousel', slides: 8, color: '#0f0f1a', accent: '#8b5cf6', rating: 4.9, uses: 1240, tags: ['SaaS', 'Growth', 'B2B'], preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=260&fit=crop&auto=format' },
  { id: 't2', name: 'Cinematic Brand Story', category: 'Video', type: 'video', duration: '0:45', color: '#0a0f1a', accent: '#3b82f6', rating: 4.8, uses: 876, tags: ['Brand', 'Story', 'Premium'], preview: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=260&fit=crop&auto=format' },
  { id: 't3', name: 'Product Launch Sequence', category: 'Marketing', type: 'carousel', slides: 10, color: '#0f1a0f', accent: '#22c55e', rating: 4.7, uses: 2103, tags: ['Product', 'Launch', 'E-commerce'], preview: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=260&fit=crop&auto=format' },
  { id: 't4', name: 'Finance Data Breakdown', category: 'Finance', type: 'carousel', slides: 6, color: '#1a0f0f', accent: '#f59e0b', rating: 4.6, uses: 654, tags: ['Finance', 'Data', 'Charts'], preview: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=260&fit=crop&auto=format' },
  { id: 't5', name: 'Thought Leadership Reel', category: 'Personal Brand', type: 'video', duration: '0:30', color: '#0f0f0f', accent: '#ec4899', rating: 4.9, uses: 3210, tags: ['Personal', 'Thought', 'Expert'], preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=260&fit=crop&auto=format' },
  { id: 't6', name: 'Agency Portfolio Swipe', category: 'Creative', type: 'carousel', slides: 12, color: '#0a0a0f', accent: '#a78bfa', rating: 4.8, uses: 1567, tags: ['Agency', 'Portfolio', 'Creative'], preview: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=260&fit=crop&auto=format' },
  { id: 't7', name: 'Wellness & Lifestyle', category: 'Lifestyle', type: 'carousel', slides: 7, color: '#0f1a18', accent: '#14b8a6', rating: 4.5, uses: 892, tags: ['Wellness', 'Lifestyle', 'Health'], preview: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=260&fit=crop&auto=format' },
  { id: 't8', name: 'Event Highlight Reel', category: 'Events', type: 'video', duration: '1:00', color: '#1a0a0a', accent: '#ef4444', rating: 4.7, uses: 432, tags: ['Events', 'Recap', 'Promo'], preview: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=260&fit=crop&auto=format' },
  { id: 't9', name: 'Minimal Dark Intro', category: 'Personal Brand', type: 'carousel', slides: 5, color: '#050505', accent: '#6366f1', rating: 4.9, uses: 2890, tags: ['Minimal', 'Dark', 'Premium'], preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=260&fit=crop&auto=format' },
]

const chartData = [
  { day: 'Jul 20', posts: 3 }, { day: 'Jul 21', posts: 5 }, { day: 'Jul 22', posts: 2 },
  { day: 'Jul 23', posts: 7 }, { day: 'Jul 24', posts: 4 }, { day: 'Jul 25', posts: 6 },
  { day: 'Jul 26', posts: 8 }, { day: 'Jul 27', posts: 3 }, { day: 'Jul 28', posts: 9 },
  { day: 'Jul 29', posts: 5 }, { day: 'Jul 30', posts: 11 }, { day: 'Jul 31', posts: 7 },
  { day: 'Aug 1', posts: 13 }, { day: 'Aug 2', posts: 9 },
]

const maxPosts = Math.max(...chartData.map(d => d.posts))

// ─── Real Data Hooks (API) ────────────────────────────────────────────────────
// These replace the mock data above with live data from the backend.
// Mocks above remain as fallback while the API loads / on failure.

type RealPost = {
  id: string
  title?: string
  topic?: string
  status?: string
  channel?: string
  channels?: string[]
  type?: string
  scheduled_at?: string
  created_at?: string
  thumbnail?: string
  engagement?: string
  slides_data?: any[]
}

function mapPost(p: RealPost): Post {
  const raw = p.title || p.topic || 'Untitled post'
  const channels = Array.isArray(p.channels) && p.channels.length ? p.channels
    : p.channel ? [p.channel] : ['all']
  const type = (p.type === 'video' || p.type === 'image') ? p.type : 'carousel'
  const status = (['scheduled', 'draft', 'processing', 'published', 'pending'].includes(p.status || '') ? p.status : 'draft') as PostStatus
  const date = p.scheduled_at || p.created_at || ''
  const d = date ? new Date(date) : null
  const dateStr = d ? `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '—'
  // Real thumbnail from slides_data[0].image_url when available
  const slides: any[] = Array.isArray((p as any).slides_data) ? (p as any).slides_data : []
  const realImg = slides[0]?.image_url || slides[0]?.image || ''
  return {
    id: p.id,
    title: raw,
    type,
    status,
    channels,
    date: dateStr,
    engagement: p.engagement || '—',
    thumbnail: realImg || p.thumbnail || `https://images.unsplash.com/photo-${Math.abs([...raw].reduce((a, c) => a + c.charCodeAt(0), 0)) % 20 + 1000}?w=200&h=200&fit=crop&auto=format`,
  }
}

function usePosts() {
  const [items, setItems] = useState<Post[]>(posts)
  useEffect(() => {
    let alive = true
    api.posts()
      .then((r: any) => { if (alive && Array.isArray(r)) setItems(r.map(mapPost)) })
      .catch(() => {})
    return () => { alive = false }
  }, [])
  return { items, setItems }
}

function useMetrics() {
  const [m, setM] = useState<any>(null)
  useEffect(() => {
    let alive = true
    api.metrics().then(r => { if (alive) setM(r) }).catch(() => {})
    return () => { alive = false }
  }, [])
  return m
}

function useAnalytics() {
  const [a, setA] = useState<any>(null)
  useEffect(() => {
    let alive = true
    api.analytics().then(r => { if (alive) setA(r) }).catch(() => {})
    return () => { alive = false }
  }, [])
  return a
}

function useTemplates() {
  const [items, setItems] = useState<Template[]>(templates)
  useEffect(() => {
    let alive = true
    api.templates()
      .then((r: any) => {
        if (!alive) return
        const list = Array.isArray(r) ? r : (r && r.templates) || []
        if (list.length) setItems(list.map((t: any) => ({
          id: t.id || String(Math.random()),
          name: t.name || t.title || 'Template',
          category: t.category || 'Custom',
          type: (t.type === 'video' || t.type === 'image') ? t.type : 'carousel',
          slides: t.slides,
          duration: t.duration,
          color: t.color || '#0f0f1a',
          accent: t.accent || '#8b5cf6',
          rating: t.rating || 4.5,
          uses: t.uses || 0,
          tags: t.tags || [],
          preview: t.preview || '',
        })))
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])
  return items
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PostStatus }) {
  const map: Record<PostStatus, { label: string; bg: string; color: string }> = {
    scheduled: { label: 'Scheduled', bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
    draft:     { label: 'Draft',     bg: 'rgba(113,113,122,0.15)', color: '#71717a' },
    processing:{ label: 'Processing',bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    published: { label: 'Published', bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    pending:   { label: 'Pending',   bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  }
  const s = map[status]
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {status === 'processing' && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: s.color, marginRight: 4, animation: 'pulse-glow 1.5s infinite' }} />}
      {s.label}
    </span>
  )
}

function TypeIcon({ type }: { type: ContentType }) {
  const map: Record<ContentType, { icon: string; color: string }> = {
    carousel: { icon: icons.layers, color: '#8b5cf6' },
    video:    { icon: icons.video,  color: '#3b82f6' },
    image:    { icon: icons.image,  color: '#14b8a6' },
  }
  const t = map[type]
  return (
    <span style={{ color: t.color, display: 'flex', alignItems: 'center' }}>
      <Icon d={t.icon} size={13} />
    </span>
  )
}

function ChannelTag({ channel }: { channel: string }) {
  const map: Record<string, { icon: string; color: string }> = {
    instagram: { icon: icons.instagram, color: '#e1306c' },
    twitter:   { icon: icons.twitter,   color: '#1da1f2' },
    linkedin:  { icon: icons.linkedin,  color: '#0a66c2' },
  }
  const c = map[channel] || { icon: icons.bell, color: '#8b5cf6' }
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '2px 7px', color: c.color }}>
      <Icon d={c.icon} size={11} />
      <span style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'capitalize' }}>{channel}</span>
    </span>
  )
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function Dashboard() {
  const metrics = useMetrics()
  const { items: realPosts } = usePosts()
  const analytics = useAnalytics()

  const stats = [
    { label: 'Posts Published', value: metrics ? String(metrics.published ?? metrics.total ?? 0) : '—', delta: '+12%', color: '#8b5cf6' },
    { label: 'Scheduled', value: metrics ? String(metrics.scheduled ?? 0) : '—', delta: '+3', color: '#3b82f6' },
    { label: 'Drafts', value: metrics ? String(metrics.draft ?? 0) : '—', delta: 'awaiting', color: '#f59e0b' },
    { label: 'Processing', value: metrics ? String(metrics.processing ?? 0) : '—', delta: 'in queue', color: '#22c55e' },
  ]

  const chartData2 = analytics?.by_day?.length
    ? analytics.by_day.map((d: any) => ({ day: String(d.day || d.date || ''), posts: Number(d.total ?? d.count ?? d.posts ?? 0) }))
    : chartData

  const maxP = Math.max(1, ...chartData2.map((d: { posts: number }) => d.posts))

  const pending = realPosts.filter(p => p.status === 'pending' || p.status === 'draft').slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
              <span style={{ fontSize: '0.625rem', fontWeight: 600, color: s.color, background: `${s.color}20`, padding: '2px 8px', borderRadius: 9999 }}>{s.delta}</span>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart + Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        {/* Production Chart */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Content Production</h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#71717a' }}>Posts per day</p>
            </div>
            <span style={{ fontSize: '0.6875rem', color: '#22c55e', fontWeight: 600, background: 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: 9999 }}>Live data</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
            {chartData2.map((d: { day: string; posts: number }, i: number) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${(d.posts / maxP) * 100}%`,
                    background: i === chartData2.length - 1 ? '#8b5cf6' : 'rgba(139,92,246,0.3)',
                    borderRadius: '4px 4px 2px 2px',
                    transition: 'height 0.3s ease',
                    position: 'relative',
                    cursor: 'default',
                  }}
                  title={`${d.posts} posts`}
                />
                {i % 3 === 0 && <span style={{ fontSize: '0.5rem', color: '#52525b', whiteSpace: 'nowrap', transform: 'rotate(-30deg)', marginBottom: -2 }}>{String(d.day).slice(4)}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Approval Queue */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Approval Queue</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <img src={p.thumbnail} alt={p.title} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fafafa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
            {pending.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: '#52525b', fontSize: '0.8125rem' }}>No posts awaiting approval 🎉</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {realPosts.slice(0, 5).map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${p.status === 'published' ? '#22c55e' : '#8b5cf6'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: p.status === 'published' ? '#22c55e' : '#8b5cf6' }}>
                <Icon d={p.status === 'published' ? icons.check : icons.spark} size={14} />
              </div>
              <span style={{ flex: 1, fontSize: '0.8125rem', color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>"{p.title}" · <span style={{ textTransform: 'capitalize' }}>{p.status}</span></span>
              <span style={{ fontSize: '0.6875rem', color: '#52525b', whiteSpace: 'nowrap' }}>{p.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContentPage() {
  const [filter, setFilter] = useState<'all' | PostStatus>('all')
  const [search, setSearch] = useState('')
  const { items: realPosts, setItems: setRealPosts } = usePosts()
  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'draft', label: 'Drafts' },
    { key: 'processing', label: 'Processing' },
    { key: 'published', label: 'Published' },
    { key: 'pending', label: 'Pending' },
  ]
  const filtered = realPosts.filter(p => {
    const matchStatus = filter === 'all' || p.status === filter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  async function refresh() {
    const r: any = await api.posts().catch(() => [])
    if (Array.isArray(r)) setRealPosts(r.map(mapPost))
  }

  async function handlePublish(id: string) {
    await api.publishNow(id).catch(() => {})
    refresh()
  }
  async function handleDelete(id: string) {
    await api.deletePost(id).catch(() => {})
    refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input className="input-field" placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
        <div style={{ flex: 1 }} />
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem' }}>
          <Icon d={icons.filter} size={13} /> Filter
        </button>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon d={icons.plus} size={14} /> New Post
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 0 }}>
        {tabs.map(t => (
          <button key={t.key} className={`tab-item ${filter === t.key ? 'active' : ''}`} onClick={() => setFilter(t.key as typeof filter)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filtered.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: 48, textAlign: 'center', color: '#52525b', fontSize: '0.875rem' }}>
            No posts match your filters.
          </div>
        )}
      </div>
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="glass-card animate-fade-in"
      style={{ overflow: 'hidden', cursor: 'default', transition: 'border-color 0.2s, box-shadow 0.2s', borderColor: hovered ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.06)', boxShadow: hovered ? '0 0 24px rgba(139,92,246,0.12)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 140, background: '#111' }}>
        <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))' }} />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <StatusBadge status={post.status} />
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <TypeIcon type={post.type} />
          <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#fafafa', textTransform: 'capitalize' }}>{post.type}</span>
        </div>
        {post.status === 'processing' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 32, height: 32, border: '2px solid rgba(245,158,11,0.3)', borderTop: '2px solid #f59e0b', borderRadius: '50%' }} className="animate-spin-slow" />
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 8px', fontSize: '0.8125rem', fontWeight: 600, color: '#fafafa', lineHeight: 1.4 }}>{post.title}</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
          {post.channels.map(c => <ChannelTag key={c} channel={c} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#71717a', fontSize: '0.6875rem' }}>
            <Icon d={icons.clock} size={11} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{post.date}</span>
          </div>
          {post.engagement !== '—' && (
            <span style={{ fontSize: '0.6875rem', color: '#22c55e', fontFamily: 'JetBrains Mono, monospace' }}>♡ {post.engagement}</span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(post.status === 'draft' || post.status === 'pending') && (
            <button className="btn-primary" style={{ flex: 1, padding: '7px 0', fontSize: '0.75rem' }} onClick={() => window.dispatchEvent(new CustomEvent('arx-publish', { detail: post.id }))}>
              Publish
            </button>
          )}
          {post.status === 'scheduled' && <button className="btn-secondary" style={{ flex: 1, padding: '7px 0', fontSize: '0.75rem' }}>Reschedule</button>}
          {post.status === 'processing' && <button className="btn-secondary" style={{ flex: 1, padding: '7px 0', fontSize: '0.75rem', opacity: 0.6 }} disabled>Rendering…</button>}
          {post.status === 'published' && <button className="btn-secondary" style={{ flex: 1, padding: '7px 0', fontSize: '0.75rem' }}>Boost</button>}
          {post.type === 'carousel' && post.status !== 'published' && (
            <button className="btn-ghost" style={{ padding: '7px 10px', color: '#8b5cf6', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }} title="Generate Video" onClick={() => window.dispatchEvent(new CustomEvent('arx-video', { detail: post.id }))}>
              <Icon d={icons.play} size={13} />
            </button>
          )}
          <button className="btn-ghost" style={{ padding: '7px 10px' }} title="Edit">
            <Icon d={icons.edit} size={13} />
          </button>
          <button className="btn-ghost" style={{ padding: '7px 10px', color: '#ef444480' }} title="Delete" onClick={() => window.dispatchEvent(new CustomEvent('arx-delete', { detail: post.id }))}>
            <Icon d={icons.trash} size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function TemplatesPage({ onUseTemplate }: { onUseTemplate: (t: Template) => void }) {
  const [typeFilter, setTypeFilter] = useState<'all' | ContentType>('all')
  const [catFilter, setCatFilter] = useState('All')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [search, setSearch] = useState('')
  const realTemplates = useTemplates()

  const categories = ['All', 'Business', 'Marketing', 'Finance', 'Creative', 'Personal Brand', 'Lifestyle', 'Events', 'Video']

  const filtered = realTemplates.filter(t => {
    const matchType = typeFilter === 'all' || t.type === typeFilter
    const matchCat = catFilter === 'All' || t.category === catFilter || (catFilter === 'Video' && t.type === 'video')
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || (t.tags || []).some(g => g.toLowerCase().includes(search.toLowerCase()))
    return matchType && matchCat && matchSearch
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input className="input-field" placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'carousel', 'video'] as const).map(type => (
            <button key={type} onClick={() => setTypeFilter(type)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s', background: typeFilter === type ? 'rgba(139,92,246,0.15)' : 'transparent', borderColor: typeFilter === type ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)', color: typeFilter === type ? '#a78bfa' : '#71717a' }}>
              {type === 'carousel' && <Icon d={icons.layers} size={12} />}
              {type === 'video' && <Icon d={icons.video} size={12} />}
              {type === 'all' && <Icon d={icons.grid} size={12} />}
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '0.75rem', color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}>{filtered.length} templates</span>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)} style={{ padding: '5px 12px', borderRadius: 9999, fontSize: '0.6875rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s', background: catFilter === cat ? '#8b5cf6' : 'transparent', borderColor: catFilter === cat ? '#8b5cf6' : 'rgba(255,255,255,0.1)', color: catFilter === cat ? '#fff' : '#71717a' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filtered.map(t => (
          <TemplateCard key={t.id} template={t} onSelect={() => setSelectedTemplate(t)} onUse={() => onUseTemplate(t)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: 48, textAlign: 'center', color: '#52525b', fontSize: '0.875rem' }}>
            No templates match your search.
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <TemplateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} onUse={() => { onUseTemplate(selectedTemplate); setSelectedTemplate(null) }} />
      )}
    </div>
  )
}

function TemplateCard({ template: t, onSelect, onUse }: { template: Template; onSelect: () => void; onUse: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="glass-card animate-fade-in"
      style={{ overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s', borderColor: hovered ? t.accent + '55' : 'rgba(255,255,255,0.06)', transform: hovered ? 'translateY(-2px)' : 'none', boxShadow: hovered ? `0 8px 32px ${t.accent}20` : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview */}
      <div style={{ position: 'relative', height: 148, background: t.color }}>
        <img src={t.preview} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${t.color}cc 0%, transparent 100%)` }} />

        {/* Type pill */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '4px 9px', backdropFilter: 'blur(8px)' }}>
          <span style={{ color: t.accent }}><Icon d={t.type === 'video' ? icons.video : icons.layers} size={11} /></span>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#fafafa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.type}</span>
          {t.slides && <span style={{ fontSize: '0.6rem', color: '#a1a1aa', fontFamily: 'JetBrains Mono, monospace' }}>{t.slides} slides</span>}
          {t.duration && <span style={{ fontSize: '0.6rem', color: '#a1a1aa', fontFamily: 'JetBrains Mono, monospace' }}>{t.duration}</span>}
        </div>

        {/* Rating */}
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '4px 8px', backdropFilter: 'blur(8px)' }}>
          <span style={{ color: '#f59e0b', fontSize: 10 }}>★</span>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#fafafa', fontFamily: 'JetBrains Mono, monospace' }}>{t.rating}</span>
        </div>

        {/* Hover overlay */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: hovered ? 1 : 0, background: 'rgba(0,0,0,0.45)', transition: 'opacity 0.2s' }}>
          <button className="btn-secondary" onClick={e => { e.stopPropagation(); onSelect() }} style={{ padding: '7px 14px', fontSize: '0.75rem', display: 'flex', gap: 5, alignItems: 'center' }}>
            <Icon d={icons.eye} size={12} /> Preview
          </button>
          <button className="btn-primary" onClick={e => { e.stopPropagation(); onUse() }} style={{ padding: '7px 14px', fontSize: '0.75rem', display: 'flex', gap: 5, alignItems: 'center' }}>
            <Icon d={icons.plus} size={12} /> Use
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 14px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h4 style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: '#fafafa', lineHeight: 1.3 }}>{t.name}</h4>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {t.tags.map(tag => (
            <span key={tag} style={{ fontSize: '0.5625rem', fontWeight: 600, color: '#71717a', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: '2px 6px' }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.6875rem', color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}>{t.uses.toLocaleString()} uses</span>
          <span style={{ fontSize: '0.6875rem', color: t.accent, fontWeight: 600 }}>{t.category}</span>
        </div>
      </div>
    </div>
  )
}

function TemplateModal({ template: t, onClose, onUse }: { template: Template; onClose: () => void; onUse: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 640, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ position: 'relative', height: 260, background: t.color }}>
          <img src={t.preview} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${t.color}ee)` }} />
          <button className="btn-ghost" onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.4)', padding: '6px 8px', color: '#a1a1aa' }}>
            <Icon d={icons.close} size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: 16, left: 20 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 700, color: '#fafafa' }}>{t.name}</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.6875rem', color: t.accent, fontWeight: 600, background: `${t.accent}20`, padding: '2px 8px', borderRadius: 9999 }}>{t.category}</span>
              <span style={{ fontSize: '0.6875rem', color: '#a1a1aa', fontFamily: 'JetBrains Mono, monospace' }}>★ {t.rating} · {t.uses.toLocaleString()} uses</span>
            </div>
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Type', value: t.type.charAt(0).toUpperCase() + t.type.slice(1) },
              { label: t.slides ? 'Slides' : 'Duration', value: t.slides ? `${t.slides} slides` : t.duration },
              { label: 'Best for', value: t.tags.join(', ') },
              { label: 'Category', value: t.category },
            ].map(row => (
              <div key={row.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.625rem', color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontSize: '0.8125rem', color: '#fafafa', fontWeight: 500 }}>{row.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" style={{ flex: 1, padding: '11px 0' }} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={{ flex: 2, padding: '11px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={onUse}>
              <Icon d={icons.spark} size={14} /> Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SchedulePage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM']
  const { items: realPosts } = usePosts()

  const scheduled = realPosts
    .filter(p => p.status === 'scheduled' && p.date !== '—')
    .map(p => {
      const d = new Date(p.date)
      const day = (d.getDay() + 6) % 7
      const hour = Math.min(6, Math.max(0, Math.floor(d.getHours() / 2) - 3))
      return { id: p.id, day, hour, title: p.title, type: p.type, channel: p.channels[0] || 'instagram' }
    })
    .slice(0, 30)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>This week</h3>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '0.75rem', color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}>{scheduled.length} scheduled</span>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon d={icons.plus} size={14} /> Schedule Post
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '64px repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: '10px 0' }} />
          {days.map((d, i) => (
            <div key={d} style={{ padding: '10px 8px', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#71717a' }}>{d}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: i === 0 ? '#8b5cf6' : '#fafafa', marginTop: 2 }}>{i + 4}</div>
            </div>
          ))}
        </div>

        {/* Time rows */}
        {hours.map((hour, hi) => (
          <div key={hour} style={{ display: 'grid', gridTemplateColumns: '64px repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ padding: '14px 10px 14px 16px', fontSize: '0.625rem', fontWeight: 500, color: '#52525b', fontFamily: 'JetBrains Mono, monospace', textAlign: 'right', alignSelf: 'start', paddingTop: 16 }}>{hour}</div>
            {days.map((_, di) => {
              const item = scheduled.find(s => s.day === di && s.hour === hi)
              return (
                <div key={di} style={{ borderLeft: '1px solid rgba(255,255,255,0.04)', padding: 4, minHeight: 56, position: 'relative' }}>
                  {item && (
                    <div style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', transition: 'background 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                        <TypeIcon type={item.type} />
                        <span style={{ fontSize: '0.5625rem', fontWeight: 600, color: '#a78bfa', textTransform: 'capitalize' }}>{item.type}</span>
                      </div>
                      <div style={{ fontSize: '0.625rem', fontWeight: 600, color: '#fafafa', lineHeight: 1.3 }}>{item.title}</div>
                      <div style={{ fontSize: '0.5rem', color: '#71717a', marginTop: 2, textTransform: 'capitalize' }}>{item.channel}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsPage() {
  const analytics = useAnalytics()
  const { items: realPosts } = usePosts()

  const byStatus = (analytics?.by_status || []).reduce((acc: Record<string, number>, s: any) => {
    acc[s.status || s.name || 'unknown'] = Number(s.total ?? s.count ?? s.value ?? 0)
    return acc
  }, {} as Record<string, number>)

  const totalPosts = realPosts.length
  const published = byStatus['published'] ?? realPosts.filter(p => p.status === 'published').length
  const scheduled = byStatus['scheduled'] ?? realPosts.filter(p => p.status === 'scheduled').length
  const drafts = byStatus['draft'] ?? realPosts.filter(p => p.status === 'draft').length
  const processing = byStatus['processing'] ?? realPosts.filter(p => p.status === 'processing').length

  const metrics = [
    { label: 'Total Posts', value: String(totalPosts), delta: 'all time', color: '#8b5cf6' },
    { label: 'Published', value: String(published), delta: 'live', color: '#22c55e' },
    { label: 'Scheduled', value: String(scheduled), delta: 'queued', color: '#3b82f6' },
    { label: 'Drafts', value: String(drafts), delta: processing ? `${processing} rendering` : 'waiting', color: '#f59e0b' },
  ]

  const byChannel = (analytics?.by_channel || []).map((c: any) => ({
    name: String(c.channel || c.name || 'all').charAt(0).toUpperCase() + String(c.channel || c.name || 'all').slice(1),
    reach: Number(c.total ?? c.count ?? c.posts ?? 0),
    engagement: Number(c.total ?? c.count ?? c.posts ?? 0),
    color: c.channel === 'instagram' ? '#e1306c' : c.channel === 'linkedin' ? '#0a66c2' : c.channel === 'twitter' ? '#1da1f2' : '#8b5cf6',
  }))

  const channelData = byChannel.length ? byChannel : []

  const topPosts = [...realPosts]
    .filter(p => p.status === 'published')
    .slice(0, 4)
    .map(p => ({ title: p.title, type: p.type, reach: '—', eng: '—', rate: '—' }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {metrics.map(m => (
          <div key={m.label} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</span>
              <span style={{ fontSize: '0.625rem', color: m.color, background: `${m.color}20`, padding: '2px 8px', borderRadius: 9999, fontWeight: 600 }}>{m.delta}</span>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em' }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Channel Breakdown */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Channel Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {channelData.length ? channelData.map((ch: { name: string; reach: number; engagement: number; color: string }) => {
              const maxReach = Math.max(...channelData.map((c: { reach: number }) => c.reach))
              return (
                <div key={ch.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.8125rem', color: '#fafafa', fontWeight: 500 }}>{ch.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'JetBrains Mono, monospace' }}>{ch.reach} posts</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(ch.reach / maxReach) * 100}%`, background: ch.color, borderRadius: 9999, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            }) : (
              <div style={{ padding: 24, textAlign: 'center', color: '#52525b', fontSize: '0.8125rem' }}>No channel data yet</div>
            )}
          </div>
        </div>

        {/* Top Posts */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Top Performing Posts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topPosts.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: i === 0 ? '#8b5cf6' : '#52525b', flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fafafa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                  <div style={{ fontSize: '0.6rem', color: '#52525b', textTransform: 'capitalize', marginTop: 1 }}>{p.type} · published</div>
                </div>
              </div>
            ))}
            {topPosts.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: '#52525b', fontSize: '0.8125rem' }}>No published posts yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── New Post Modal ───────────────────────────────────────────────────────────

function NewPostModal({ template, onClose }: { template: Template | null; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [postTitle, setPostTitle] = useState(template ? `New post with "${template.name}"` : '')
  const [postType, setPostType] = useState<ContentType>(template?.type || 'carousel')
  const [channels, setChannels] = useState<string[]>(['instagram'])
  const [caption, setCaption] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('10:00')
  const [hashtags, setHashtags] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const toggleChannel = (c: string) => {
    setChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  async function submit() {
    if (!postTitle.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const r: any = await api.generate(postTitle.trim(), channels[0] || 'all', scheduleDate ? 'scheduled' : 'now', template?.name || 'clean')
      if (r?.success) {
        setStep(3)
      } else {
        setError(r?.message || r?.error || 'Falha ao gerar post')
      }
    } catch (e: any) {
      setError(e?.message || 'Erro ao gerar post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 520, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fafafa' }}>Create New Post</h2>
            {template && <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#8b5cf6' }}>Using "{template.name}" template</p>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ width: 24, height: 3, borderRadius: 9999, background: step >= s ? '#8b5cf6' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
              ))}
            </div>
            <button className="btn-ghost" onClick={onClose} style={{ padding: '5px 6px' }}><Icon d={icons.close} size={16} /></button>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Post Title</label>
                <input className="input-field" value={postTitle} onChange={e => setPostTitle(e.target.value)} placeholder="e.g. 5 Tips for Growing on LinkedIn…" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 8 }}>Content Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['carousel', 'video', 'image'] as ContentType[]).map(type => (
                    <button key={type} onClick={() => setPostType(type)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 10px', borderRadius: 12, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', background: postType === type ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)', borderColor: postType === type ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)' }}>
                      <span style={{ color: postType === type ? '#8b5cf6' : '#52525b', transition: 'color 0.15s' }}>
                        <Icon d={type === 'carousel' ? icons.layers : type === 'video' ? icons.video : icons.image} size={20} />
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: postType === type ? '#fafafa' : '#71717a', textTransform: 'capitalize' }}>{type}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 8 }}>Channels</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['instagram', 'twitter', 'linkedin'] as const).map(c => (
                    <button key={c} onClick={() => toggleChannel(c)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 10px', borderRadius: 10, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', background: channels.includes(c) ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)', borderColor: channels.includes(c) ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.08)' }}>
                      <ChannelTag channel={c} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Caption / Script</label>
                <textarea className="input-field" placeholder="Write your caption or paste an AI-generated script here…" rows={5} style={{ resize: 'none' }} value={caption} onChange={e => setCaption(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Schedule Date</label>
                  <input className="input-field" type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Time</label>
                  <input className="input-field" type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Hashtags</label>
                <input className="input-field" placeholder="#socialmedia #automation #growth" value={hashtags} onChange={e => setHashtags(e.target.value)} />
              </div>
              {error && <div style={{ fontSize: '0.75rem', color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 12px', borderRadius: 8 }}>{error}</div>}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '8px 0 16px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                <Icon d={icons.check} size={28} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 600, color: '#fafafa' }}>Post Created!</h3>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#71717a' }}>"{postTitle || 'Your post'}" has been added to the queue and will be published at the scheduled time.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
                {[{ icon: icons.layers, label: postType, detail: postType === 'carousel' ? '8 slides' : '0:30 video' },
                  { icon: icons.calendar, label: 'Scheduled', detail: 'Aug 8 at 10:00 AM' }].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: '#8b5cf6' }}><Icon d={item.icon} size={16} /></span>
                    <div>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#fafafa', textTransform: 'capitalize' }}>{item.label}</div>
                      <div style={{ fontSize: '0.625rem', color: '#52525b' }}>{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
          {step > 1 && step < 3 && <button className="btn-secondary" style={{ flex: 1, padding: '11px 0' }} onClick={() => setStep(s => s - 1)}>← Back</button>}
          {step < 3 && (
            <button className="btn-primary" style={{ flex: 2, padding: '11px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => { if (step === 2) submit(); else setStep(s => s + 1) }} disabled={submitting}>
              {step === 2 ? <>{submitting ? 'Generating…' : <><Icon d={icons.spark} size={14} /> Create Post</>}</> : 'Continue →'}
            </button>
          )}
          {step === 3 && <button className="btn-primary" style={{ flex: 1, padding: '11px 0' }} onClick={onClose}>Done</button>}
        </div>
      </div>
    </div>
  )
}

// ─── Slide Panel Shell ────────────────────────────────────────────────────────

function SlidePanel({ open, onClose, width = 380, children }: { open: boolean; onClose: () => void; width?: number; children: ReactNode }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 201,
          width,
          background: '#0f0f0f',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          transform: open ? 'translateX(0)' : `translateX(${width}px)`,
          transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </>
  )
}

// ─── Notifications Panel ──────────────────────────────────────────────────────

const notifications = [
  { id: 1, type: 'success', icon: icons.check, title: '"Growth Hacks" published', body: 'Your post went live on Instagram · 4.2k impressions so far', time: '2h ago', unread: true },
  { id: 2, type: 'info', icon: icons.zap, title: 'Video render complete', body: '"Q3 Roadmap Reveal" is ready to schedule or publish', time: '4h ago', unread: true },
  { id: 3, type: 'warning', icon: icons.info, title: 'Post pending approval', body: '"Weekly Market Insights #12" is waiting for your review', time: '5h ago', unread: true },
  { id: 4, type: 'success', icon: icons.spark, title: 'AI scripts generated', body: '3 new carousel scripts ready in your drafts', time: 'Yesterday', unread: false },
  { id: 5, type: 'info', icon: icons.calendar, title: 'Schedule reminder', body: '"Team Spotlight" is scheduled for tomorrow at 11:00 AM', time: 'Yesterday', unread: false },
  { id: 6, type: 'success', icon: icons.analytics, title: 'Analytics milestone', body: 'Your reach this week surpassed 100k — best week yet 🎉', time: '2 days ago', unread: false },
  { id: 7, type: 'info', icon: icons.creditCard, title: 'Billing renewed', body: 'Pro Plan — $49/mo billed successfully for Aug 2026', time: '3 days ago', unread: false },
]

function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState(notifications)
  const typeColor: Record<string, string> = { success: '#22c55e', info: '#3b82f6', warning: '#f59e0b', error: '#ef4444' }
  const unreadCount = items.filter(n => n.unread).length

  const markAll = () => setItems(prev => prev.map(n => ({ ...n, unread: false })))
  const dismiss = (id: number) => setItems(prev => prev.filter(n => n.id !== id))

  return (
    <SlidePanel open={open} onClose={onClose} width={380}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Notifications</h2>
            {unreadCount > 0 && (
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#fff', background: '#8b5cf6', padding: '2px 7px', borderRadius: 9999 }}>{unreadCount}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {unreadCount > 0 && (
              <button className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '4px 10px', color: '#8b5cf6' }} onClick={markAll}>Mark all read</button>
            )}
            <button className="btn-ghost" style={{ padding: '5px 6px' }} onClick={onClose}><Icon d={icons.close} size={15} /></button>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#52525b' }}>Activity from the last 7 days</p>
      </div>

      {/* List */}
      <div style={{ flex: 1, padding: '8px 0' }}>
        {items.map((n, i) => (
          <div
            key={n.id}
            style={{
              display: 'flex', gap: 12, padding: '14px 20px',
              background: n.unread ? 'rgba(139,92,246,0.04)' : 'transparent',
              borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.15s',
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `${typeColor[n.type]}14`, border: `1px solid ${typeColor[n.type]}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: typeColor[n.type] }}>
              <Icon d={n.icon} size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fafafa', lineHeight: 1.3 }}>{n.title}</span>
                {n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8b5cf6', flexShrink: 0, marginTop: 3 }} />}
              </div>
              <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#71717a', lineHeight: 1.4 }}>{n.body}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.625rem', color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}>{n.time}</span>
                <button className="btn-ghost" style={{ padding: '2px 6px', fontSize: '0.625rem', color: '#52525b' }} onClick={() => dismiss(n.id)}>Dismiss</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
            <p style={{ margin: 0, color: '#52525b', fontSize: '0.875rem' }}>All caught up!</p>
          </div>
        )}
      </div>
    </SlidePanel>
  )
}

// ─── User Panel ───────────────────────────────────────────────────────────────

function UserPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [editingName, setEditingName] = useState(false)
  const [displayName, setDisplayName] = useState('Usuário')
  const [nameInput, setNameInput] = useState('Usuário')
  const [userEmail, setUserEmail] = useState('')
  const [planName, setPlanName] = useState('Free')
  const [postCount, setPostCount] = useState('0')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState(true)
  const [pwModal, setPwModal] = useState(false)
  const [pwCur, setPwCur] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    api.me().then((r: any) => {
      if (r?.user) {
        const n = r.user.full_name || r.user.name || 'Usuário'
        setDisplayName(n)
        setNameInput(n)
        setUserEmail(r.user.email || '')
        setPlanName((r.plan && (r.plan.name || r.plan.slug)) || r.user.plan_name || r.user.plan || 'Free')
      }
    }).catch(() => {})
    api.metrics().then((m: any) => { if (m) setPostCount(String(m.total ?? m.published ?? 0)) }).catch(() => {})
  }, [open])

  async function handleLogout() {
    await api.logout().catch(() => {})
    localStorage.removeItem('arx_token')
    window.location.reload()
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 36, height: 20, borderRadius: 9999, border: 'none', cursor: 'pointer',
        background: value ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: value ? 18 : 3,
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }} />
    </button>
  )

  return (
    <SlidePanel open={open} onClose={onClose} width={360}>
      {/* Profile hero */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, rgba(139,92,246,0.07) 0%, transparent 100%)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', border: '2.5px solid rgba(139,92,246,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
            {displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'U'}
          </div>
          <button className="btn-ghost" style={{ padding: '5px 6px' }} onClick={onClose}><Icon d={icons.close} size={15} /></button>
        </div>

        {editingName ? (
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <input
              className="input-field"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              style={{ fontSize: '0.875rem', padding: '6px 10px' }}
              autoFocus
            />
            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', flexShrink: 0 }} onClick={async () => {
              const n = nameInput.trim()
              if (!n) return
              const r: any = await api.updateProfile(n).catch(() => null)
              if (r?.success) {
                setDisplayName(n)
                setEditingName(false)
                localStorage.setItem('arx_user_name', n)
                window.location.reload()
              }
            }}>Save</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fafafa' }}>{displayName}</h2>
            <button className="btn-ghost" style={{ padding: '3px 5px', color: '#52525b' }} onClick={() => setEditingName(true)}>
              <Icon d={icons.edit} size={12} />
            </button>
          </div>
        )}
        <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: '#71717a' }}>{userEmail || '—'}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#8b5cf6', background: 'rgba(139,92,246,0.15)', padding: '3px 10px', borderRadius: 9999, border: '1px solid rgba(139,92,246,0.25)' }}>{planName.toUpperCase()} PLAN</span>
          <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 10px', borderRadius: 9999 }}>● Active</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {[{ label: 'Posts', value: postCount }, { label: 'Plan', value: planName.charAt(0).toUpperCase() + planName.slice(1) }, { label: 'Status', value: 'Active' }].map((s, i) => (
          <div key={s.label} style={{ padding: '14px 0', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fafafa', letterSpacing: '-0.01em' }}>{s.value}</div>
            <div style={{ fontSize: '0.625rem', color: '#52525b', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div style={{ flex: 1, padding: '12px 0' }}>
        {/* Account */}
        <div style={{ padding: '8px 20px 4px' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Account</span>
        </div>
        {[
          { icon: icons.user, label: 'Edit Profile', sub: 'Name, photo, bio', action: () => setEditingName(true) },
          { icon: icons.key, label: 'Change Password', sub: 'Update your login password', action: () => { setPwCur(''); setPwNew(''); setPwMsg(''); setPwErr(''); setPwModal(true) } },
          { icon: icons.creditCard, label: 'Billing & Plan', sub: `${planName} · Active`, action: () => {} },
          { icon: icons.globe, label: 'Connected Accounts', sub: 'Instagram, LinkedIn, Twitter', action: () => {} },
        ].map(item => (
          <button key={item.label} className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderRadius: 0, textAlign: 'left' }} onClick={item.action}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={item.icon} size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#fafafa' }}>{item.label}</div>
              <div style={{ fontSize: '0.6875rem', color: '#52525b' }}>{item.sub}</div>
            </div>
            <Icon d={icons.chevronRight} size={14} />
          </button>
        ))}

        {/* Notifications */}
        <div style={{ padding: '16px 20px 4px' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notifications</span>
        </div>
        {[
          { label: 'Email Notifications', sub: 'Publish confirmations & reports', value: emailNotifs, set: setEmailNotifs },
          { label: 'Push Alerts', sub: 'Pending approvals & errors', value: pushNotifs, set: setPushNotifs },
          { label: 'AI Suggestions', sub: 'Weekly content ideas', value: aiSuggestions, set: setAiSuggestions },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#fafafa' }}>{item.label}</div>
              <div style={{ fontSize: '0.6875rem', color: '#52525b' }}>{item.sub}</div>
            </div>
            <Toggle value={item.value} onChange={item.set} />
          </div>
        ))}

        {/* Logout */}
        <div style={{ padding: '16px 20px 8px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 8 }}>
          <button className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', color: '#ef4444' }} onClick={handleLogout}>
            <Icon d={icons.logout} size={15} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {pwModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }} onClick={() => setPwModal(false)}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 380, padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Change Password</h3>
              <button className="btn-ghost" style={{ padding: '5px 6px' }} onClick={() => setPwModal(false)}><Icon d={icons.close} size={15} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Current Password</label>
                <input className="input-field" type="password" value={pwCur} onChange={e => setPwCur(e.target.value)} placeholder="••••••••" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Nova Senha</label>
                <input className="input-field" type="password" value={pwNew} onChange={e => setPwNew(e.target.value)} placeholder="Min. 6 caracteres" style={{ width: '100%' }} />
                {pwNew.length > 0 && <PasswordStrength value={pwNew} className="mt-3" />}
              </div>
              {pwErr && <div style={{ fontSize: '0.75rem', color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '9px 11px', borderRadius: 8 }}>{pwErr}</div>}
              {pwMsg && <div style={{ fontSize: '0.75rem', color: '#22c55e', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', padding: '9px 11px', borderRadius: 8 }}>{pwMsg}</div>}
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '11px 0', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                disabled={pwSaving || !pwCur || pwNew.length < 6}
                onClick={async () => {
                  setPwSaving(true); setPwErr(''); setPwMsg('')
                  try {
                    const r: any = await api.changePassword(pwCur, pwNew)
                    if (r?.success) {
                      setPwMsg('Senha atualizada com sucesso!')
                      setPwCur(''); setPwNew('')
                      setTimeout(() => setPwModal(false), 1200)
                    } else {
                      setPwErr(r?.error || 'Erro ao trocar senha')
                    }
                  } catch {
                    setPwErr('Erro de conexão')
                  } finally {
                    setPwSaving(false)
                  }
                }}
              >
                {pwSaving ? 'Salvando…' : <><Icon d={icons.key} size={13} /> Update Password</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </SlidePanel>
  )
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'integrations' | 'apikey' | 'defaults' | 'danger'>('integrations')
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  const [webhookUrl, setWebhookUrl] = useState('')
  const [defaultTemplate, setDefaultTemplate] = useState('')
  const [igBusinessId, setIgBusinessId] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (!open) return
    api.myApiKey().then((r: any) => { if (r?.api_key) setApiKey(r.api_key) }).catch(() => {})
    api.settings().then((r: any) => {
      if (r?.settings) {
        const s = r.settings
        if (s.n8n_webhook_base) setWebhookUrl(s.n8n_webhook_base)
        if (s.default_template) setDefaultTemplate(s.default_template)
        if (s.instagram_business_id) setIgBusinessId(s.instagram_business_id)
        setAutoPublish(s.auto_publish === 'true' || s.auto_publish === true)
        setAiCaption(s.ai_caption === 'true' || s.ai_caption === true)
        setWatermark(s.watermark === 'true' || s.watermark === true)
      }
    }).catch(() => {})
  }, [open])

  async function saveSettings(patch: Record<string, string>) {
    try {
      const r: any = await api.updateSettings({ settings: patch })
      if (r?.success) { setSaveMsg('Configurações salvas!'); setTimeout(() => setSaveMsg(''), 2500) }
    } catch { setSaveMsg('Erro ao salvar'); setTimeout(() => setSaveMsg(''), 2500) }
  }

  const copy = () => {
    navigator.clipboard.writeText(apiKey).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  async function regenerateKey() {
    const r: any = await api.myApiKey().catch(() => null)
    if (r?.api_key) setApiKey(r.api_key)
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} style={{ width: 36, height: 20, borderRadius: 9999, border: 'none', cursor: 'pointer', background: value ? '#8b5cf6' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: value ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
    </button>
  )

  const [autoPublish, setAutoPublish] = useState(false)
  const [aiCaption, setAiCaption] = useState(true)
  const [watermark, setWatermark] = useState(false)

  const settingsTabs = [
    { key: 'integrations', label: 'Integrations' },
    { key: 'apikey', label: 'API Key' },
    { key: 'defaults', label: 'Defaults' },
    { key: 'danger', label: 'Danger Zone' },
  ] as const

  return (
    <SlidePanel open={open} onClose={onClose} width={420}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <Icon d={icons.settings} size={14} />
            </div>
            <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Settings</h2>
          </div>
          <button className="btn-ghost" style={{ padding: '5px 6px' }} onClick={onClose}><Icon d={icons.close} size={15} /></button>
        </div>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {settingsTabs.map(t => (
            <button key={t.key} className={`tab-item ${tab === t.key ? 'active' : ''}`} style={{ color: t.key === 'danger' && tab !== 'danger' ? '#ef444470' : undefined, borderBottomColor: t.key === 'danger' && tab === 'danger' ? '#ef4444' : undefined }} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Integrations ── */}
        {tab === 'integrations' && (
          <>
            {[
              { name: 'Instagram', icon: icons.instagram, color: '#e1306c', status: 'Connected', account: '@arxfactory' },
              { name: 'LinkedIn', icon: icons.linkedin, color: '#0a66c2', status: 'Connected', account: 'Arx Factory' },
              { name: 'Twitter / X', icon: icons.twitter, color: '#1da1f2', status: 'Connected', account: '@arxfactory' },
            ].map(soc => (
              <div key={soc.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${soc.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: soc.color, flexShrink: 0 }}>
                  <Icon d={soc.icon} size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fafafa' }}>{soc.name}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}>{soc.account}</div>
                </div>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 9px', borderRadius: 9999 }}>{soc.status}</span>
                <button className="btn-ghost" style={{ padding: '5px 8px', fontSize: '0.6875rem', color: '#71717a' }}>Disconnect</button>
              </div>
            ))}

            <div style={{ borderRadius: 12, border: '1px dashed rgba(255,255,255,0.1)', padding: '16px', textAlign: 'center' }}>
              <button className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem' }}>
                <Icon d={icons.plus} size={13} /> Connect Another Account
              </button>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 10 }}>Webhook / n8n</div>
              <input className="input-field" placeholder="https://n8n.arxsolutions.cloud/webhook/…" style={{ marginBottom: 8 }} value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} />
              <button className="btn-secondary" style={{ width: '100%', padding: '9px 0', fontSize: '0.8125rem' }} onClick={() => saveSettings({ n8n_webhook_base: webhookUrl })}>Save Webhook URL</button>
              {saveMsg && <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: 8, textAlign: 'center' }}>{saveMsg}</div>}
            </div>
          </>
        )}

        {/* ── API Key ── */}
        {tab === 'apikey' && (
          <>
            <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a78bfa', marginBottom: 8 }}>Your API Key</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <code style={{ flex: 1, fontSize: '0.75rem', color: '#fafafa', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {apiKeyVisible ? apiKey : '•'.repeat(apiKey.length)}
                </code>
                <button className="btn-ghost" style={{ padding: '7px 9px', flexShrink: 0 }} onClick={() => setApiKeyVisible(v => !v)}>
                  <Icon d={icons.eye} size={14} />
                </button>
                <button className="btn-ghost" style={{ padding: '7px 9px', flexShrink: 0, color: copied ? '#22c55e' : '#a1a1aa' }} onClick={copy}>
                  <Icon d={copied ? icons.check : icons.copy} size={14} />
                </button>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.8125rem' }} onClick={regenerateKey}>
              <Icon d={icons.key} size={13} /> Regenerate Key
            </button>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 10 }}>Endpoints</div>
              {[
                { method: 'GET', path: '/v1/posts', desc: 'List all posts' },
                { method: 'POST', path: '/v1/posts', desc: 'Create a post' },
                { method: 'GET', path: '/v1/templates', desc: 'List templates' },
                { method: 'POST', path: '/v1/render/video', desc: 'Trigger video render' },
              ].map(ep => (
                <div key={ep.method + ep.path} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 9, marginBottom: 6 }}>
                  <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: ep.method === 'GET' ? '#22c55e' : '#8b5cf6', background: ep.method === 'GET' ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.12)', padding: '2px 6px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>{ep.method}</span>
                  <code style={{ flex: 1, fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'JetBrains Mono, monospace' }}>{ep.path}</code>
                  <span style={{ fontSize: '0.6875rem', color: '#52525b' }}>{ep.desc}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Defaults ── */}
        {tab === 'defaults' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Default Template</label>
              <select className="input-field" style={{ appearance: 'none', cursor: 'pointer' }} value={defaultTemplate} onChange={e => setDefaultTemplate(e.target.value)}>
                <option value="">Selecionar template padrão…</option>
                {templates.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Instagram Business ID</label>
              <input className="input-field" placeholder="Ex: 17841400000000000" value={igBusinessId} onChange={e => setIgBusinessId(e.target.value)} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Best Time to Post</label>
              <input className="input-field" type="time" defaultValue="10:00" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
              {[
                { label: 'Auto-publish approved posts', sub: 'No manual confirmation required', value: autoPublish, set: setAutoPublish },
                { label: 'AI caption generation', sub: 'Suggest captions for new posts', value: aiCaption, set: setAiCaption },
                { label: 'Add watermark to videos', sub: 'Arx branding overlay', value: watermark, set: setWatermark },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#fafafa' }}>{item.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#52525b' }}>{item.sub}</div>
                  </div>
                  <Toggle value={item.value} onChange={item.set} />
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '11px 0', marginTop: 4 }} onClick={() => saveSettings({
              default_template: defaultTemplate,
              instagram_business_id: igBusinessId,
              auto_publish: String(autoPublish),
              ai_caption: String(aiCaption),
              watermark: String(watermark),
            })}>Save Defaults</button>
            {saveMsg && <div style={{ fontSize: '0.75rem', color: '#22c55e', textAlign: 'center' }}>{saveMsg}</div>}
          </>
        )}

        {/* ── Danger Zone ── */}
        {tab === 'danger' && (
          <>
            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>⚠ Danger Zone</div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#71717a', lineHeight: 1.5 }}>These actions are irreversible. Please be absolutely sure before proceeding.</p>
            </div>
            {[
              { label: 'Export All Data', desc: 'Download a JSON archive of all posts, templates, and analytics', btn: 'Export', btnColor: '#3b82f6' },
              { label: 'Delete All Drafts', desc: 'Permanently remove all unpublished draft posts', btn: 'Delete Drafts', btnColor: '#f59e0b' },
              { label: 'Reset API Key', desc: 'Invalidates the current key. All integrations will break.', btn: 'Reset Key', btnColor: '#ef4444' },
              { label: 'Delete Account', desc: 'Permanently delete your account and all associated data', btn: 'Delete Account', btnColor: '#ef4444' },
            ].map(item => (
              <div key={item.label} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fafafa' }}>{item.label}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#71717a', marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
                </div>
                <button style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${item.btnColor}40`, background: `${item.btnColor}12`, color: item.btnColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s' }}>
                  {item.btn}
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </SlidePanel>
  )
}

// ─── AI Chat Panel ────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  text: string
  time: string
}

const seedMessages: ChatMessage[] = [
  { id: 1, role: 'ai', text: "Hi! I'm your Arx AI assistant. I can help you write carousel scripts, video hooks, captions, hashtag sets, and content strategies. What would you like to create today?", time: '10:02 AM' },
  { id: 2, role: 'user', text: 'Write me a 6-slide carousel script about growing a SaaS to $10k MRR', time: '10:03 AM' },
  { id: 3, role: 'ai', text: "Here's a 6-slide carousel script:\n\n**Slide 1 — Hook**\n\"We hit $10k MRR in 9 months. Here's exactly what worked.\"\n\n**Slide 2 — The Problem**\nMost founders chase features. We chased conversations. 47 customer calls in month 1.\n\n**Slide 3 — Insight**\nThe product didn't sell itself — the story did. One positioning change doubled our trial-to-paid rate.\n\n**Slide 4 — Turning Point**\nMonth 6: launched an affiliate program. 30% of new MRR came from partners, not ads.\n\n**Slide 5 — What We'd Do Different**\nStart pricing experiments on day 1. We left $3k/mo on the table for 4 months.\n\n**Slide 6 — CTA**\n\"Save this for your SaaS journey. Follow for weekly growth breakdowns.\"", time: '10:03 AM' },
]

const aiResponses = [
  "Great idea! Here's a hook for that: \"Most people get this completely wrong — and it's costing them thousands.\" Opening with a bold claim drives 3× more saves on carousels.",
  "For a video script on that topic, I'd open with a pattern interrupt: show the end result first, then rewind. Viewers are 40% more likely to watch to the end when they know the payoff upfront.",
  "Here are 10 hashtags optimized for reach on that niche: #SaaSGrowth #FounderLife #StartupTips #ProductLed #B2BSaaS #GrowthHacking #MRR #SaaSMarketing #TechFounder #BootstrappedSaaS",
  "Suggested caption: \"The thing nobody tells you about scaling to 10k users → it's not about the product. It's about the story you tell. Here's the framework we used 👇\" — Want me to continue with the full thread?",
  "For your carousel CTA slide, try: \"If this helped, save it for later — you'll need it. And follow for a new growth breakdown every week.\" Saves signal the algorithm more than likes.",
  "Content strategy suggestion: post 3 carousels and 1 video per week. Peak engagement windows for your niche (B2B SaaS) are Tuesday–Thursday, 9–11 AM and 6–8 PM in your audience's timezone.",
]

function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = { current: null as HTMLDivElement | null }
  const history = { current: [] as { role: string; content: string }[] }

  const send = async () => {
    const text = input.trim()
    if (!text) return
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    history.current.push({ role: 'user', content: text })
    try {
      const r: any = await api.aiChat(text, history.current, 'dashboard')
      const reply = r?.reply || 'Desculpe, não consegui processar isso agora.'
      history.current.push({ role: 'assistant', content: reply })
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: 'Falha ao conectar com o assistente. Tente novamente.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } finally {
      setTyping(false)
    }
  }

  const suggestions = ['Write a carousel hook', 'Generate hashtags', 'Video script intro', 'Caption for LinkedIn']

  return (
    <SlidePanel open={open} onClose={onClose} width={440}>
      {/* Header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-pulse-glow">
              <Icon d={icons.spark} size={16} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Arx AI</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontSize: '0.6875rem', color: '#52525b' }}>Online · GPT-4o powered</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-ghost" style={{ padding: '5px 8px', fontSize: '0.6875rem', color: '#52525b' }} onClick={() => setMessages(seedMessages)}>Clear</button>
            <button className="btn-ghost" style={{ padding: '5px 6px' }} onClick={onClose}><Icon d={icons.close} size={15} /></button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>
            {msg.role === 'ai' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={icons.spark} size={10} />
                </div>
                <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#71717a' }}>Arx AI</span>
              </div>
            )}
            <div style={{
              maxWidth: '88%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
              background: msg.role === 'user' ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.8125rem',
              color: '#fafafa',
              lineHeight: 1.55,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.text}
            </div>
            <span style={{ fontSize: '0.5625rem', color: '#3f3f46', fontFamily: 'JetBrains Mono, monospace' }}>{msg.time}</span>
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.spark} size={10} />
              </div>
              <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#71717a' }}>Arx AI</span>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block', animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={el => { bottomRef.current = el }} />
      </div>

      {/* Quick suggestions */}
      <div style={{ padding: '8px 16px 0', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => setInput(s)} style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#a78bfa', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 9999, padding: '4px 11px', cursor: 'pointer', transition: 'background 0.15s', whiteSpace: 'nowrap' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 10px 10px 16px', transition: 'border-color 0.15s' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask Arx AI to write a script, caption, hooks…"
            rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: '#fafafa', fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || typing}
            style={{ width: 34, height: 34, borderRadius: 9, background: input.trim() && !typing ? '#8b5cf6' : 'rgba(255,255,255,0.06)', border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', color: input.trim() && !typing ? '#fff' : '#3f3f46', transition: 'background 0.15s, color 0.15s', flexShrink: 0 }}
          >
            <Icon d={icons.play} size={13} />
          </button>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '0.5625rem', color: '#3f3f46', textAlign: 'center' }}>Press Enter to send · Shift+Enter for new line</p>
      </div>
    </SlidePanel>
  )
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

function AdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [tab, setTab] = useState<'overview' | 'users' | 'clientes' | 'plans'>('overview')
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.adminStats().then(r => { if (r?.stats) setStats(r.stats) }).catch(() => {})
    api.adminUsers().then(r => { if (r?.users) setUsers(r.users) }).catch(() => {})
    api.adminClientes().then(r => { if (r?.clientes) setClientes(r.clientes) }).catch(() => {})
    api.adminPlans().then(r => { if (r?.plans) setPlans(r.plans) }).catch(() => {})
  }, [])

  async function createUser() {
    if (!newUser.email || !newUser.password) return
    const r: any = await api.adminCreateUser(newUser).catch(() => null)
    if (r?.success) {
      setMsg('Cliente criado!')
      setNewUser({ email: '', password: '', full_name: '' })
      api.adminUsers().then(x => { if (x?.users) setUsers(x.users) }).catch(() => {})
      setTimeout(() => setMsg(''), 2500)
    } else {
      setMsg(r?.error || 'Erro ao criar cliente')
      setTimeout(() => setMsg(''), 3500)
    }
  }

  const tabs = [
    { key: 'overview', label: 'Visão Geral' },
    { key: 'users', label: 'Usuários' },
    { key: 'clientes', label: 'Clientes' },
    { key: 'plans', label: 'Planos' },
  ] as const

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Painel de Administração</h3>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '0.6875rem', color: '#8b5cf6', background: 'rgba(139,92,246,0.15)', padding: '4px 10px', borderRadius: 9999, fontWeight: 600 }}>ADMIN</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 0, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} className={`tab-item ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)} style={{ whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Usuários', value: stats?.total_users ?? '—', color: '#8b5cf6' },
              { label: 'Posts no sistema', value: stats?.total_posts ?? '—', color: '#3b82f6' },
              { label: 'Planos', value: stats?.total_plans ?? '—', color: '#22c55e' },
              { label: 'Sessões ativas', value: stats?.active_sessions ?? '—', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: 20 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{s.label}</div>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Usuários por role</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Administradores', value: stats?.total_admins ?? 0, color: '#8b5cf6' },
                  { label: 'Clientes (users)', value: stats?.total_clients ?? 0, color: '#3b82f6' },
                  { label: 'Clientes (tabela clientes)', value: stats?.total_clientes_table ?? 0, color: '#22c55e' },
                ].map(r => (
                  <div key={r.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.8125rem', color: '#fafafa', fontWeight: 500 }}>{r.label}</span>
                      <span style={{ fontSize: '0.8125rem', color: r.color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{r.value}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, (Number(r.value) / Math.max(1, Number(stats?.total_users || 1))) * 100)}%`, background: r.color, borderRadius: 9999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>Criar cliente (whitelabel)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input className="input-field" placeholder="Nome completo" value={newUser.full_name} onChange={e => setNewUser({ ...newUser, full_name: e.target.value })} />
                <input className="input-field" type="email" placeholder="email@cliente.com" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                <input className="input-field" type="password" placeholder="Senha (min. 6)" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                {msg && <div style={{ fontSize: '0.75rem', color: msg.includes('erro') || msg.includes('Erro') ? '#ef4444' : '#22c55e', padding: '9px 11px', borderRadius: 8, background: msg.includes('erro') || msg.includes('Erro') ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)' }}>{msg}</div>}
                <button className="btn-primary" style={{ padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={createUser}>
                  <Icon d={icons.plus} size={13} /> Criar cliente
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Users ── */}
      {tab === 'users' && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8125rem', fontWeight: 600, color: '#fafafa' }}>
            Usuários do sistema ({users.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {users.map((u, i) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.role === 'admin' ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {(u.full_name || u.email || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fafafa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.full_name || '—'}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#52525b' }}>{u.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: u.role === 'admin' ? '#8b5cf6' : '#3b82f6', background: u.role === 'admin' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.12)', padding: '3px 9px', borderRadius: 9999, textTransform: 'capitalize' }}>{u.role}</span>
                  <div style={{ fontSize: '0.625rem', color: '#52525b', marginTop: 3 }}>{u.plan_name || 'Sem plano'} · {fmtDate(u.created_at)}</div>
                </div>
              </div>
            ))}
            {users.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#52525b', fontSize: '0.8125rem' }}>Nenhum usuário</div>}
          </div>
        </div>
      )}

      {/* ── Clientes ── */}
      {tab === 'clientes' && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8125rem', fontWeight: 600, color: '#fafafa' }}>
            Clientes ({clientes.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {clientes.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < clientes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: '#8b5cf6', flexShrink: 0 }}>
                  {(c.nome || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fafafa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nome}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#52525b' }}>{c.email}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.6875rem', color: '#52525b' }}>
                  <div>{c.telefone || '—'}</div>
                  <div>{fmtDate(c.created_at)}</div>
                </div>
              </div>
            ))}
            {clientes.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#52525b', fontSize: '0.8125rem' }}>Nenhum cliente</div>}
          </div>
        </div>
      )}

      {/* ── Plans ── */}
      {tab === 'plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {plans.map(p => (
            <div key={p.id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fafafa', marginBottom: 12 }}>
                R$ {Number(p.price_monthly).toFixed(2).replace('.', ',')}
                <span style={{ fontSize: '0.6875rem', color: '#52525b', fontWeight: 500 }}>/mês</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Anual: R$ {Number(p.price_yearly).toFixed(2).replace('.', ',')}</div>
              <div style={{ marginTop: 12, padding: '9px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>
                {p.active_subscribers} assinantes ativos
              </div>
            </div>
          ))}
          {plans.length === 0 && <div style={{ gridColumn: '1/-1', padding: 40, textAlign: 'center', color: '#52525b' }}>Nenhum plano</div>}
        </div>
      )}
    </div>
  )
}

// ─── Login View ───────────────────────────────────────────────────────────────

function LoginView({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const r: any = await api.login(email, password)
      if (r?.success && r?.token) {
        onLogin(r.token, r.user)
      } else {
        setError(r?.error || 'Erro ao fazer login')
      }
    } catch {
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="aurora-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 380, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-pulse-glow">
            <Icon d={icons.spark} size={17} />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fafafa' }}>Arx</div>
            <div style={{ fontSize: '0.5625rem', color: '#52525b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Content Factory</div>
          </div>
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700, color: '#fafafa' }}>Entrar</h1>
        <p style={{ margin: '0 0 24px', fontSize: '0.8125rem', color: '#71717a' }}>Acesse seu painel de controle</p>

        {error && <div style={{ fontSize: '0.75rem', color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 12px', borderRadius: 8, marginBottom: 14 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Email</label>
            <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>Senha</label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%' }} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '11px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
            {loading ? 'Entrando…' : <><Icon d={icons.spark} size={14} /> Entrar</>}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [newPostModal, setNewPostModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [route, setRoute] = useState<'landing' | 'login' | 'signup' | 'dashboard'>('landing')
  const unreadNotifs = 3

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('arx_token')
    if (!token) {
      setAuthed(false)
      return
    }
    api.me()
      .then((r: any) => {
        if (r?.user) {
          setUser({ ...r.user, plan_name: (r.plan && (r.plan.name || r.plan.slug)) || r.user.plan_name || 'Free' })
          setAuthed(true)
        }
        else setAuthed(false)
      })
      .catch(() => setAuthed(false))
  }, [])

  function handleLogin(token: string, userData: any) {
    localStorage.setItem('arx_token', token)
    setUser(userData)
    setAuthed(true)
  }

  function handleLogout() {
    localStorage.removeItem('arx_token')
    setAuthed(false)
    setUser(null)
  }

  // Global actions dispatched by PostCard buttons
  useEffect(() => {
    const onPublish = (e: Event) => {
      const id = (e as CustomEvent).detail
      api.publishNow(id).then(() => setRefreshKey(k => k + 1)).catch(() => {})
    }
    const onDelete = (e: Event) => {
      const id = (e as CustomEvent).detail
      if (confirm('Excluir este post?')) {
        api.deletePost(id).then(() => setRefreshKey(k => k + 1)).catch(() => {})
      }
    }
    const onVideo = (e: Event) => {
      const id = (e as CustomEvent).detail
      api.generateVideo(id).then(() => setRefreshKey(k => k + 1)).catch(() => {})
    }
    window.addEventListener('arx-publish', onPublish)
    window.addEventListener('arx-delete', onDelete)
    window.addEventListener('arx-video', onVideo)
    return () => {
      window.removeEventListener('arx-publish', onPublish)
      window.removeEventListener('arx-delete', onDelete)
      window.removeEventListener('arx-video', onVideo)
    }
  }, [])

  const userName = user?.full_name || user?.name || 'Usuário'
  const userEmail = user?.email || ''
  const planName = user?.plan_name || user?.plan || 'Free'
  const initials = userName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  // Auth gate: sem token → landing/login/signup (páginas novas do Figma)
  if (authed === false) {
    if (route === 'login') {
      return <Login onLogin={handleLogin} onNavigate={(p: string) => setRoute(p as typeof route)} />
    }
    if (route === 'signup') {
      return <Signup onLogin={handleLogin} onNavigate={(p: string) => setRoute(p as typeof route)} />
    }
    return <Landing onNavigate={(p: string) => setRoute(p as typeof route)} user={null} />
  }
  if (authed === null) {
    return (
      <div className="aurora-bg" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid rgba(139,92,246,0.3)', borderTop: '2px solid #8b5cf6', borderRadius: '50%' }} className="animate-spin-slow" />
      </div>
    )
  }

  const closeAll = () => { setNotifOpen(false); setUserOpen(false); setSettingsOpen(false); setChatOpen(false) }

  const isAdmin = user?.role === 'admin'

  const navItems: { key: Page; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { key: 'content', label: 'Content', icon: icons.content },
    { key: 'templates', label: 'Templates', icon: icons.templates },
    { key: 'schedule', label: 'Schedule', icon: icons.schedule },
    { key: 'analytics', label: 'Analytics', icon: icons.analytics },
    ...(isAdmin ? [{ key: 'admin' as Page, label: 'Admin', icon: icons.shield }] : []),
  ]

  const pageTitles: Record<Page, string> = {
    dashboard: 'Dashboard',
    content: 'Content',
    templates: 'Templates',
    schedule: 'Schedule',
    analytics: 'Analytics',
    admin: 'Admin',
  }

  const handleUseTemplate = (t: Template) => {
    setSelectedTemplate(t)
    setNewPostModal(true)
    setPage('content')
  }

  return (
    <div className="aurora-bg" style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: '#0f0f0f', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '0 12px' }}>
        {/* Logo */}
        <div style={{ padding: '16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
          <ArxLogo size={34} glow />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
          {navItems.map(item => (
            <button key={item.key} className={`sidebar-item ${page === item.key ? 'active' : ''}`} onClick={() => setPage(item.key)} style={{ border: 'none', width: '100%', textAlign: 'left' }}>
              <Icon d={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
          <button className={`sidebar-item ${chatOpen ? 'active' : ''}`} style={{ border: 'none', width: '100%', textAlign: 'left', marginBottom: 2 }} onClick={() => { closeAll(); setChatOpen(true) }}>
            <Icon d={icons.spark} size={16} />
            <span>AI Assistant</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.5rem', fontWeight: 700, color: '#8b5cf6', background: 'rgba(139,92,246,0.15)', padding: '2px 6px', borderRadius: 9999 }}>AI</span>
          </button>
          <button className="sidebar-item" style={{ border: 'none', width: '100%', textAlign: 'left' }} onClick={() => { closeAll(); setSettingsOpen(true) }}>
            <Icon d={icons.settings} size={16} />
            <span>Settings</span>
          </button>
          <button className="sidebar-item" style={{ border: 'none', width: '100%', textAlign: 'left', color: '#ef4444' }} onClick={handleLogout}>
            <Icon d={icons.logout} size={16} />
            <span>Sair</span>
          </button>
          <button onClick={() => { closeAll(); setUserOpen(true) }} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', border: '2px solid rgba(139,92,246,0.5)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: '#fff' }}>{initials || 'A'}</div>
            <div style={{ minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fafafa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
              <div style={{ fontSize: '0.625rem', color: '#52525b' }}>{planName} Plan</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ height: 56, flexShrink: 0, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 10 }}>
          <h1 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>{pageTitles[page]}</h1>
          <div style={{ flex: 1 }} />
          <button className="btn-primary" onClick={() => { setSelectedTemplate(null); setNewPostModal(true) }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon d={icons.plus} size={14} /> New Post
          </button>
          <button className="btn-ghost" style={{ padding: '6px 8px', position: 'relative' }} onClick={() => { setNotifOpen(true); setUserOpen(false); setSettingsOpen(false); setChatOpen(false) }}>
            <Icon d={icons.bell} size={17} />
            {unreadNotifs > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: '#8b5cf6', fontSize: '0.5rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifs}</span>}
          </button>
          <button onClick={() => { setUserOpen(true); setNotifOpen(false); setSettingsOpen(false); setChatOpen(false) }} style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', border: '2px solid rgba(139,92,246,0.5)', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.625rem', fontWeight: 700 }}>
            {initials || 'A'}
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {page === 'dashboard' && <Dashboard key={refreshKey} />}
          {page === 'content' && <ContentPage key={refreshKey} />}
          {page === 'templates' && <TemplatesPage onUseTemplate={handleUseTemplate} />}
          {page === 'schedule' && <SchedulePage key={refreshKey} />}
          {page === 'analytics' && <AnalyticsPage key={refreshKey} />}
          {page === 'admin' && <AdminPage key={refreshKey} />}
        </main>
      </div>

      {/* Modals */}
      {newPostModal && (
        <NewPostModal
          template={selectedTemplate}
          onClose={() => { setNewPostModal(false); setSelectedTemplate(null) }}
        />
      )}

      {/* Panels */}
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <UserPanel open={userOpen} onClose={() => setUserOpen(false)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
