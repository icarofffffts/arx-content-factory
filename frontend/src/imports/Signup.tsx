import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api'
import ArxLogo from './ArxLogo'

const LogoLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)
const LogoInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="url(#sig)">
    <defs><linearGradient id="sig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)
const LogoTwitterX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#e7e9ea"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)
const LogoYouTube = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
)
const LogoWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
)

const FEATURES = [
  { icon: '⚡', title: 'Automação com IA', desc: 'Gere e agende conteúdo automaticamente' },
  { icon: '📊', title: 'Analytics em tempo real', desc: 'Veja o desempenho de cada publicação' },
  { icon: '🗓️', title: 'Calendário editorial', desc: 'Planeje semanas inteiras em minutos' },
  { icon: '🔗', title: '6 redes sociais', desc: 'LinkedIn, Instagram, X, YouTube e mais' },
]

function PasswordStrength({ password }: { password: string }) {
  const score = (() => {
    let s = 0
    if (password.length >= 6) s++
    if (password.length >= 10) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()
  if (!password) return null
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#8b5cf6']
  const labels = ['Muito fraca', 'Fraca', 'Média', 'Boa', 'Forte']
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= score ? colors[score - 1] : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ fontSize: '0.75rem', color: colors[score - 1] || '#52525b' }}>{labels[score - 1] || ''}</div>
    </div>
  )
}

function OrbField() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', top: '-80px', right: '-80px', animation: 'orb1 12s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)', bottom: '60px', left: '-60px', animation: 'orb2 15s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)', top: '50%', left: '40%', animation: 'orb3 9s ease-in-out infinite' }} />
    </div>
  )
}

function PlatformBadge({ logo, name, metric }: { logo: React.ReactNode, name: string, metric: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, background: hov ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${hov ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '10px 14px', cursor: 'default', transition: 'all 0.25s' }}>
      {logo}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fafafa' }}>{name}</div>
        <div style={{ fontSize: '0.6875rem', color: '#71717a' }}>{metric}</div>
      </div>
    </div>
  )
}

function AnimatedCounter({ target, suffix = '' }: { target: number, suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0
      const step = () => {
        start += Math.ceil((target - start) * 0.08) || 1
        setVal(Math.min(start, target))
        if (start < target) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val.toLocaleString('pt-BR')}{suffix}</span>
}

export default function Signup({ onLogin, onNavigate }: {
  onLogin: (token: string, user: any, plan: any) => void
  onNavigate: (p: string) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Senha deve ter no mínimo 6 caracteres'); return }
    if (!agreed) { setError('Aceite os termos para continuar'); return }
    setLoading(true)
    try {
      const r = await api.register(email, password, name)
      if (r.success) {
        setStep('success')
        setTimeout(() => onLogin(r.token!, r.user!, null), 1800)
      } else {
        setError(r.error || 'Erro ao criar conta')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div
      ref={containerRef}
      style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}
    >
      {/* Mouse-tracking glow */}
      <div style={{ position: 'fixed', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`, transition: 'transform 0.4s ease-out' }} />

      {/* ─── LEFT: Form ──────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.1) 0%, transparent 55%)', pointerEvents: 'none' }} />

        {step === 'success' ? (
          <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease forwards' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✓</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem', fontWeight: 800, color: '#fafafa' }}>Conta criada!</h2>
            <p style={{ margin: 0, color: '#71717a', fontSize: '0.9375rem' }}>Entrando no seu painel...</p>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: 400 }}>
            {/* Logo nav */}
            <button onClick={() => onNavigate('landing')} style={{ display: 'flex', alignItems: 'center', marginBottom: 40, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <ArxLogo size={36} glow />
            </button>

            <div style={{ marginBottom: 32 }}>
              <h1 style={{ margin: '0 0 6px', fontSize: '2rem', fontWeight: 900, color: '#fafafa', letterSpacing: '-0.035em', lineHeight: 1.1 }}>Crie sua conta</h1>
              <p style={{ margin: 0, fontSize: '0.9375rem', color: '#71717a' }}>Grátis por 14 dias, sem cartão de crédito</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '11px 14px', fontSize: '0.8125rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15 }}>⚠</span> {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 7 }}>Nome completo</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Seu nome" required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: '#fafafa', fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 7 }}>E-mail</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com" required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: '#fafafa', fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#a1a1aa', marginBottom: 7 }}>Senha</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres" required minLength={6}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: '#fafafa', fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                <PasswordStrength password={password} />
              </div>

              {/* Terms */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                <div
                  onClick={() => setAgreed(a => !a)}
                  style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${agreed ? '#8b5cf6' : 'rgba(255,255,255,0.2)'}`, background: agreed ? '#8b5cf6' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: 1 }}
                >
                  {agreed && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#71717a', lineHeight: 1.5 }}>
                  Concordo com os{' '}
                  <span style={{ color: '#a78bfa', cursor: 'pointer' }}>Termos de Serviço</span>
                  {' '}e a{' '}
                  <span style={{ color: '#a78bfa', cursor: 'pointer' }}>Política de Privacidade</span>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px', background: loading ? 'rgba(139,92,246,0.5)' : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', border: 'none', borderRadius: 11, color: '#fff', fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 20px rgba(139,92,246,0.4)', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(139,92,246,0.55)' } }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(139,92,246,0.4)' }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Criando sua conta...
                  </>
                ) : 'Criar conta grátis →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#52525b', margin: '4px 0 0' }}>
                Já tem uma conta?{' '}
                <button type="button" onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: '#a78bfa', fontWeight: 600, cursor: 'pointer', fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif', padding: 0 }}>
                  Entrar
                </button>
              </p>
            </form>
          </div>
        )}
      </div>

      {/* ─── RIGHT: Visual panel ──────────────────────────────────── */}
      <div style={{ width: '46%', background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 44px' }}>
        <OrbField />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Headline */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '5px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.04em', marginBottom: 16, textTransform: 'uppercase' }}>
              ✦ Plano gratuito
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: '1.625rem', fontWeight: 900, color: '#fafafa', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
              Tudo que você precisa para crescer nas redes sociais
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#71717a', lineHeight: 1.6 }}>
              Automatize, analise e publique com inteligência artificial em todas as plataformas.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
            {FEATURES.map((f, i) => (
              <FeatureRow key={i} icon={f.icon} title={f.title} desc={f.desc} delay={i * 80} />
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 36 }}>
            {[
              { n: 12400, s: '+', label: 'usuários ativos' },
              { n: 98, s: '%', label: 'satisfação' },
              { n: 3200000, s: '', label: 'posts publicados' },
            ].map((st, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '-0.02em' }}>
                  <AnimatedCounter target={st.n} suffix={st.s} />
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#52525b', marginTop: 3, fontWeight: 500 }}>{st.label}</div>
              </div>
            ))}
          </div>

          {/* Platform badges */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Conecte suas contas</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <PlatformBadge logo={<LogoLinkedIn />} name="LinkedIn" metric="Carrossel + texto" />
              <PlatformBadge logo={<LogoInstagram />} name="Instagram" metric="Reels + carrossel" />
              <PlatformBadge logo={<LogoTwitterX />} name="X / Twitter" metric="Thread + mídia" />
              <PlatformBadge logo={<LogoYouTube />} name="YouTube" metric="Shorts + títulos" />
            </div>
          </div>

          {/* Trust line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {['#f59e0b','#22c55e','#8b5cf6','#3b82f6','#ec4899'].map((c, i) => (
                <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: '2px solid #0a0a0a', marginLeft: i === 0 ? 0 : -8, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{String.fromCharCode(65+i)}</div>
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#52525b' }}><span style={{ color: '#a1a1aa', fontWeight: 600 }}>+12.400</span> criadores de conteúdo confiam</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureRow({ icon, title, desc, delay }: { icon: string, title: string, desc: string, delay: number }) {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay + 100)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div
      ref={ref}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(16px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fafafa', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: '0.8125rem', color: '#71717a', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  )
}
