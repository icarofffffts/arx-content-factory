import { useState } from 'react'
import { api } from '../lib/api'
import ArxLogo from './ArxLogo'

// Real platform SVG logos
const LogoLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)
const LogoInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="url(#ig)">
    <defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/><stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)
const LogoGitHub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#e6edf3"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
)
const LogoWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
)

export default function Login({ onLogin, onNavigate }: {
  onLogin: (token: string, user: any, plan: any) => void
  onNavigate: (p: string) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const r = await api.login(email, password)
      if (r.success) {
        onLogin(r.token!, r.user!, r.plan)
      } else {
        setError(r.error || 'Erro ao fazer login')
      }
    } catch {
      setError('Erro de conexão')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Left — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* Aurora */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(16,185,129,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Logo */}
          <button onClick={() => onNavigate('landing')} style={{ display: 'flex', alignItems: 'center', marginBottom: 44, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <ArxLogo size={36} glow />
          </button>

          <h1 style={{ margin: '0 0 6px', fontSize: '1.875rem', fontWeight: 900, color: '#fafafa', letterSpacing: '-0.03em' }}>Bem-vindo de volta</h1>
          <p style={{ margin: '0 0 36px', fontSize: '0.9375rem', color: '#71717a' }}>Acesse seu painel de automação</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 14px', fontSize: '0.8125rem', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 7 }}>E-mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" required
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: '#fafafa', fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 7 }}>Senha</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: '#fafafa', fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{ background: loading ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0', fontSize: '0.9375rem', fontWeight: 700, cursor: loading ? 'default' : 'pointer', boxShadow: '0 4px 20px rgba(16,185,129,0.4)', transition: 'opacity 0.2s', fontFamily: 'Inter, sans-serif', marginTop: 4 }}
            >
              {loading ? 'Entrando…' : 'Entrar →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: '#71717a' }}>
            Não tem conta?{' '}
            <button onClick={() => onNavigate('signup')} style={{ background: 'none', border: 'none', color: '#34d399', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
              Criar conta grátis
            </button>
          </p>

          <button
            onClick={() => { setEmail('admin@arx.dev'); setPassword('arx_secret_2026!') }}
            style={{ display: 'block', width: '100%', marginTop: 8, background: 'none', border: 'none', color: '#3f3f46', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Preencher credenciais de demo
          </button>

          {/* Platform logos */}
          <div style={{ marginTop: 44, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28 }}>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#3f3f46', marginBottom: 16, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Integra com</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
              {[
                { logo: <LogoLinkedIn />, name: 'LinkedIn' },
                { logo: <LogoInstagram />, name: 'Instagram' },
                { logo: <LogoGitHub />, name: 'GitHub' },
                { logo: <LogoWhatsApp />, name: 'WhatsApp' },
              ].map(p => (
                <div key={p.name} title={p.name} style={{ opacity: 0.65, transition: 'opacity 0.2s', cursor: 'default' }} onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.opacity = '1')} onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.opacity = '0.65')}>
                  {p.logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — visual panel */}
      <div style={{ width: '48%', background: 'rgba(15,15,15,0.95)', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
        {/* BG glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, rgba(16,185,129,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'radial-gradient(ellipse at 40% 100%, rgba(59,130,246,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Stats floating cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {[
              { icon: '⚡', label: 'Posts publicados hoje', value: '142', color: '#10b981' },
              { icon: '✅', label: 'Aprovados via WhatsApp', value: '98%', color: '#22c55e' },
              { icon: '📈', label: 'Engajamento médio', value: '6.4k', color: '#3b82f6' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 18px', backdropFilter: 'blur(10px)', textAlign: 'left', animation: `fadeInRight 0.5s ${i * 0.12}s ease both` }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.6 }}>
            840+ criadores já automatizando<br />conteúdo com Arx Factory
          </p>

          {/* Platform row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 28, opacity: 0.5 }}>
            <LogoLinkedIn /><LogoInstagram /><LogoGitHub /><LogoWhatsApp />
          </div>
        </div>
      </div>
    </div>
  )
}
