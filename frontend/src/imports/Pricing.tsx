import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api'
import whatsappImg from './whatsapp-approval.png'

const FALLBACK_PLANS = [
  {
    name: 'Gratuito', slug: 'gratuito', price_monthly: 0, price_yearly: 0,
    description: 'Para começar a automatizar',
    highlighted: false,
    features: [
      { label: 'Posts por mês', value: '10' },
      { label: 'Plataformas', value: 'LinkedIn' },
      { label: 'Aprovação WhatsApp', value: false },
      { label: 'Templates IA', value: '3 básicos' },
      { label: 'Analytics', value: false },
      { label: 'Captura de leads', value: false },
      { label: 'Suporte', value: 'Email' },
    ],
  },
  {
    name: 'Pro', slug: 'pro', price_monthly: 97, price_yearly: 970,
    description: 'Para criadores e profissionais',
    highlighted: true,
    badge: 'Mais Popular',
    features: [
      { label: 'Posts por mês', value: '100' },
      { label: 'Plataformas', value: 'LinkedIn + Instagram' },
      { label: 'Aprovação WhatsApp', value: true },
      { label: 'Templates IA', value: 'Todos os templates' },
      { label: 'Analytics', value: true },
      { label: 'Captura de leads', value: false },
      { label: 'Suporte', value: 'Prioritário' },
    ],
  },
  {
    name: 'Enterprise', slug: 'enterprise', price_monthly: 297, price_yearly: 2970,
    description: 'Para equipes e agências',
    highlighted: false,
    features: [
      { label: 'Posts por mês', value: 'Ilimitado' },
      { label: 'Plataformas', value: 'LinkedIn + Instagram + GitHub' },
      { label: 'Aprovação WhatsApp', value: true },
      { label: 'Templates IA', value: 'Todos + personalizados' },
      { label: 'Analytics', value: true },
      { label: 'Captura de leads', value: true },
      { label: 'Suporte', value: 'Dedicado 24/7' },
    ],
  },
]

// SVG logos
const CheckIcon = ({ color = '#22c55e' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
)
const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
)

// Tilt card
function TiltCard({ children, glow = false, style: extra }: { children: React.ReactNode; glow?: boolean; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ x: 0, y: 0 })
  const [sh, setSh] = useState({ x: 50, y: 50 })
  const [hov, setHov] = useState(false)

  return (
    <div
      ref={ref}
      onMouseMove={e => {
        const r = ref.current!.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width
        const ny = (e.clientY - r.top) / r.height
        setT({ x: (ny - 0.5) * 12, y: (nx - 0.5) * -12 })
        setSh({ x: nx * 100, y: ny * 100 })
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setT({ x: 0, y: 0 }); setHov(false) }}
      style={{
        ...extra,
        transform: `perspective(800px) rotateX(${t.x}deg) rotateY(${t.y}deg) scale(${hov ? 1.015 : 1})`,
        transition: hov ? 'transform 0.08s ease' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Shine */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, background: `radial-gradient(circle at ${sh.x}% ${sh.y}%, rgba(255,255,255,0.07) 0%, transparent 55%)`, opacity: hov ? 1 : 0, transition: 'opacity 0.2s', borderRadius: 'inherit' }} />
      {/* Glow pulse on Pro */}
      {glow && <div style={{ position: 'absolute', inset: -1, borderRadius: 'inherit', background: 'linear-gradient(135deg, rgba(139,92,246,0.5), rgba(99,102,241,0.3), rgba(139,92,246,0.5))', backgroundSize: '200% 200%', animation: 'gradientShift 4s ease infinite', zIndex: 0 }} />}
      <div style={{ position: 'relative', zIndex: 2, background: glow ? '#0e0b1a' : '#0c0c0c', borderRadius: 'inherit', height: '100%' }}>{children}</div>
    </div>
  )
}

export default function Pricing({ onNavigate, user, plan: currentPlan }: {
  onNavigate: (p: string) => void
  user: any
  plan?: any
}) {
  const [plans, setPlans] = useState<any[]>([])
  const [annual, setAnnual] = useState(false)
  const [subscribing, setSubscribing] = useState<string | null>(null)

  useEffect(() => {
    api.plans().then(setPlans).catch(() => setPlans(FALLBACK_PLANS))
  }, [])

  const displayPlans = plans.length > 0 ? plans : FALLBACK_PLANS

  async function handleSubscribe(slug: string) {
    if (!user) { onNavigate('signup'); return }
    if (slug === 'gratuito') return
    setSubscribing(slug)
    try {
      await api.subscribe(slug, annual ? 'yearly' : 'monthly')
    } catch {}
    setSubscribing(null)
  }

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: '#fafafa', position: 'relative' }}>

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>Preços</span>
        <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(1.875rem,3vw,2.75rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Invista no seu crescimento
        </h2>
        <p style={{ margin: 0, color: '#71717a', fontSize: '1rem' }}>
          Comece grátis. Escale quando precisar.
        </p>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 48 }}>
        <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: !annual ? '#fafafa' : '#52525b', transition: 'color 0.2s' }}>Mensal</span>
        <button
          onClick={() => setAnnual(a => !a)}
          style={{ width: 48, height: 26, borderRadius: 9999, border: 'none', cursor: 'pointer', background: annual ? '#8b5cf6' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}
        >
          <span style={{ position: 'absolute', top: 3, left: annual ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
        </button>
        <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: annual ? '#fafafa' : '#52525b', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s' }}>
          Anual
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', padding: '2px 8px', borderRadius: 9999 }}>−17%</span>
        </span>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
        {displayPlans.map((p, i) => {
          const isCurrent = currentPlan?.slug === p.slug && currentPlan?.subscription_status === 'active'
          const price = annual ? p.price_yearly : p.price_monthly

          return (
            <TiltCard
              key={i}
              glow={p.highlighted}
              style={{
                borderRadius: 20,
                border: p.highlighted ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)',
                marginTop: p.highlighted ? 0 : 16,
              }}
            >
              <div style={{ padding: 28 }}>
                {/* Badge */}
                {p.badge && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', borderRadius: 9999, padding: '4px 12px', fontSize: '0.625rem', fontWeight: 800, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
                    ✦ {p.badge}
                  </div>
                )}
                {!p.badge && <div style={{ height: 28, marginBottom: 16 }} />}

                {/* Plan name */}
                <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em' }}>{p.name}</h3>
                <p style={{ margin: '0 0 24px', fontSize: '0.8125rem', color: '#71717a' }}>{p.description}</p>

                {/* Price */}
                <div style={{ marginBottom: 28 }}>
                  {p.price_monthly === 0 ? (
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fafafa', letterSpacing: '-0.04em', lineHeight: 1 }}>Grátis</div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: '0.875rem', color: '#71717a', marginBottom: 6 }}>R$</span>
                      <span style={{ fontSize: '2.75rem', fontWeight: 900, color: p.highlighted ? '#c4b5fd' : '#fafafa', letterSpacing: '-0.04em', lineHeight: 1 }}>{price}</span>
                      <span style={{ fontSize: '0.875rem', color: '#71717a', marginBottom: 6 }}>/{annual ? 'ano' : 'mês'}</span>
                    </div>
                  )}
                  {annual && p.price_monthly > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#52525b', marginTop: 4 }}>
                      equivale a R$ {Math.round(p.price_yearly / 12)}/mês
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSubscribe(p.slug)}
                  disabled={subscribing === p.slug || isCurrent}
                  style={{
                    width: '100%', padding: '13px 0', borderRadius: 12,
                    fontSize: '0.9375rem', fontWeight: 700, cursor: isCurrent ? 'default' : 'pointer',
                    fontFamily: 'Inter, sans-serif', marginBottom: 24, transition: 'all 0.2s',
                    background: isCurrent ? 'rgba(34,197,94,0.12)' : p.highlighted ? 'linear-gradient(135deg,#8b5cf6,#7c3aed)' : 'rgba(255,255,255,0.07)',
                    color: isCurrent ? '#22c55e' : p.highlighted ? '#fff' : '#a1a1aa',
                    boxShadow: p.highlighted && !isCurrent ? '0 4px 20px rgba(139,92,246,0.45)' : 'none',
                    border: isCurrent ? '1px solid rgba(34,197,94,0.25)' : p.highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  } as React.CSSProperties}
                >
                  {isCurrent ? '✓ Plano Atual' : subscribing === p.slug ? 'Ativando…' : p.price_monthly === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                </button>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20 }} />

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {(p.features || []).map((f: { label: string; value: string | boolean }, j: number) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ flexShrink: 0 }}>
                        {f.value === false ? <CrossIcon /> : <CheckIcon color={p.highlighted ? '#a78bfa' : '#22c55e'} />}
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: f.value === false ? '#3f3f46' : '#a1a1aa', flex: 1 }}>{f.label}</span>
                      {f.value !== true && f.value !== false && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: p.highlighted ? '#c4b5fd' : '#71717a', whiteSpace: 'nowrap' }}>{f.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          )
        })}
      </div>

      {/* Bottom social proof + phone mockup */}
      <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, overflow: 'hidden' }}>
        {/* Left text */}
        <div style={{ padding: '48px 48px 48px 48px' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#25d366', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 14 }}>Aprovação no WhatsApp</span>
          <h3 style={{ margin: '0 0 14px', fontSize: '1.625rem', fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            Aprove cada post<br />com um toque
          </h3>
          <p style={{ margin: '0 0 28px', color: '#71717a', lineHeight: 1.7, fontSize: '0.9375rem' }}>
            Antes de qualquer publicação, o conteúdo gerado pela IA chega no seu WhatsApp com preview completo. Você aprova, edita ou rejeita — sem abrir nenhum painel.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Preview visual com todos os slides', 'Aprovar ou rejeitar em 1 toque', 'Feedback por texto para ajustes', 'Disponível em todos os planos Pro+'].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.875rem', color: '#a1a1aa' }}>
                <span style={{ color: '#25d366', flexShrink: 0 }}><CheckIcon color="#25d366" /></span>
                {item}
              </div>
            ))}
          </div>
          {!user && (
            <button
              onClick={() => onNavigate('signup')}
              style={{ marginTop: 32, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(139,92,246,0.4)', fontFamily: 'Inter, sans-serif' }}
            >
              Começar Grátis →
            </button>
          )}
        </div>

        {/* Right — phone mockup image */}
        <div style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(139,92,246,0.2) 0%, transparent 65%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 32px 0', minHeight: 340 }}>
          <img
            src={whatsappImg}
            alt="WhatsApp approval flow — Social Media Bot showing post preview with Aprovar and Editar buttons"
            style={{ width: '100%', maxWidth: 280, objectFit: 'contain', filter: 'drop-shadow(0 24px 48px rgba(139,92,246,0.35))', animation: 'float 4s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* FAQ row */}
      <div style={{ marginTop: 48, textAlign: 'center' }}>
        {!user && (
          <p style={{ fontSize: '0.875rem', color: '#52525b' }}>
            Dúvidas?{' '}
            <button onClick={() => onNavigate('signup')} style={{ background: 'none', border: 'none', color: '#a78bfa', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
              Comece grátis e explore sem compromisso
            </button>
          </p>
        )}
        <p style={{ fontSize: '0.8125rem', color: '#3f3f46', marginTop: 8 }}>Cancele a qualquer momento • Sem taxa de setup • Suporte em português</p>
      </div>
    </div>
  )
}
