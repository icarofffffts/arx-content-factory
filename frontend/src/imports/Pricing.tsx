import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api'
import { motion } from 'motion/react'
import NumberFlow, { styles as numberFlowStyles } from 'number-flow'

// Registra o custom element <number-flow> e injeta os estilos uma única vez
if (typeof window !== 'undefined') {
  // O pacote se auto-registra; injetamos os estilos manualmente
  if (numberFlowStyles && numberFlowStyles.length && !document.getElementById('number-flow-styles')) {
    const styleEl = document.createElement('style')
    styleEl.id = 'number-flow-styles'
    styleEl.textContent = numberFlowStyles.join('')
    document.head.appendChild(styleEl)
  }
  if (!customElements.get('number-flow')) {
    customElements.define('number-flow', NumberFlow as any)
  }
}

// Declara o custom element para o JSX/TS
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'number-flow': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: number | string
        locales?: string
      }
    }
  }
}

// ─── Planos reais do backend (com fallback) ───────────────────────────────────

const FALLBACK_PLANS = [
  {
    name: 'Gratuito', slug: 'gratuito', price_monthly: 0, price_yearly: 0,
    description: 'Para começar a automatizar',
    highlighted: false,
    features: [
      { text: '10 posts por mês', icon: 'layers' },
      { text: 'LinkedIn', icon: 'linkedin' },
      { text: '3 templates IA', icon: 'spark' },
      { text: 'Suporte por email', icon: 'mail' },
    ],
    includes: ['Inclui:', 'Agendamento básico', 'Sem marca d\'água'],
  },
  {
    name: 'Pro', slug: 'pro', price_monthly: 97, price_yearly: 970,
    description: 'Para criadores e profissionais',
    highlighted: true, badge: 'Mais Popular',
    features: [
      { text: '100 posts por mês', icon: 'layers' },
      { text: 'LinkedIn + Instagram', icon: 'instagram' },
      { text: 'Todos os templates IA', icon: 'spark' },
      { text: 'Aprovação WhatsApp', icon: 'whatsapp' },
      { text: 'Analytics completo', icon: 'chart' },
      { text: 'Suporte prioritário', icon: 'mail' },
    ],
    includes: ['Tudo do Gratuito, mais:', 'Captura de leads', 'Agendamento inteligente', 'Sem marca d\'água'],
  },
  {
    name: 'Enterprise', slug: 'enterprise', price_monthly: 297, price_yearly: 2970,
    description: 'Para equipes e agências',
    highlighted: false,
    features: [
      { text: 'Posts ilimitados', icon: 'layers' },
      { text: 'LinkedIn + Instagram + GitHub', icon: 'github' },
      { text: 'Templates personalizados', icon: 'spark' },
      { text: 'Aprovação WhatsApp', icon: 'whatsapp' },
      { text: 'Captura de leads', icon: 'leads' },
      { text: 'Suporte dedicado 24/7', icon: 'mail' },
    ],
    includes: ['Tudo do Pro, mais:', 'API pública', 'White-label', 'Multi-contas'],
  },
]

const PLAN_ICONS: Record<string, React.ReactNode> = {
  layers: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
  linkedin: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  instagram: <svg width="20" height="20" viewBox="0 0 24 24"><defs><linearGradient id="igp" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433" /><stop offset="50%" stopColor="#dc2743" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs><path fill="url(#igp)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>,
  whatsapp: <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
  spark: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.09 3.26L16.5 6l-2.27 2.5 1.09 3.26L12 9.75 8.68 11.76l1.09-3.26L7.5 6l3.41-.74L12 3z" /></svg>,
  chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>,
  mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6" /></svg>,
  github: <svg width="20" height="20" viewBox="0 0 24 24" fill="#e6edf3"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,
  leads: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 11a5 5 0 10-7.54.54M14 14l4 4M21 15l-3 3M15 21l-3-3M9 8a2 2 0 100-4 2 2 0 000 4zM3 20v-2a4 4 0 014-4h2" /></svg>,
}

// ─── Pricing Switch ───────────────────────────────────────────────────────────

function PricingSwitch({ onSwitch }: { onSwitch: (value: string) => void }) {
  const [selected, setSelected] = useState('0')
  const handleSwitch = (value: string) => { setSelected(value); onSwitch(value) }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', zIndex: 50, display: 'flex', width: 'fit-content', borderRadius: 9999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 4 }}>
        <button
          onClick={() => handleSwitch('0')}
          style={{
            position: 'relative', zIndex: 10, height: 44, padding: '6px 24px', borderRadius: 9999, border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem',
            color: selected === '0' ? '#fff' : '#71717a',
          }}
        >
          {selected === '0' && (
            <motion.span
              layoutId="pricing-switch"
              style={{ position: 'absolute', top: 0, left: 0, height: 44, width: '100%', borderRadius: 9999, background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.4)' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span style={{ position: 'relative' }}>Mensal</span>
        </button>
        <button
          onClick={() => handleSwitch('1')}
          style={{
            position: 'relative', zIndex: 10, height: 44, padding: '6px 24px', borderRadius: 9999, border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem', flexShrink: 0,
            color: selected === '1' ? '#fff' : '#71717a',
          }}
        >
          {selected === '1' && (
            <motion.span
              layoutId="pricing-switch"
              style={{ position: 'absolute', top: 0, left: 0, height: 44, width: '100%', borderRadius: 9999, background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.4)' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
            Anual
            <span style={{ borderRadius: 9999, background: 'rgba(16,185,129,0.15)', padding: '2px 8px', fontSize: '0.6875rem', fontWeight: 600, color: '#34d399' }}>
              Economize 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

// ─── PriceFlow (wrapper React do custom element <number-flow>) ───────────────

function PriceFlow({ value }: { value: number }) {
  const ref = useRef<any>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    try {
      // O custom element só expõe getter para value; update(value) seta e renderiza
      if (typeof el.update === 'function') {
        el.update(value)
      } else {
        el.value = value
      }
    } catch { /* custom element ainda não conectado */ }
  }, [value])
  return (
    <number-flow
      ref={ref}
      style={{ fontSize: '2.5rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.02em' }}
      locales="pt-BR"
    />
  )
}

// ─── Pricing Section ──────────────────────────────────────────────────────────

export default function Pricing({ onNavigate, user, plan }: { onNavigate?: (p: string) => void; user?: any; plan?: any }) {
  const [isYearly, setIsYearly] = useState(false)
  const [plans, setPlans] = useState<any[]>(FALLBACK_PLANS)
  const [loading, setLoading] = useState(true)
  const pricingRef = useRef<HTMLDivElement>(null)

  // Carrega planos reais do backend
  useEffect(() => {
    let alive = true
    api.plans().then((r: any) => {
      if (!alive) return
      const list = Array.isArray(r) ? r : (r && r.plans) || []
      if (list.length) {
        const mapped = list.map((p: any, i: number) => ({
          name: p.name || 'Plano',
          slug: p.slug,
          price_monthly: Number(p.price_monthly || 0),
          price_yearly: Number(p.price_yearly || 0) || Number(p.price_monthly || 0) * 10,
          description: p.description || '',
          highlighted: i === 1 || p.slug === 'pro',
          badge: p.slug === 'pro' ? 'Mais Popular' : undefined,
          features: [{ text: `Até ${p.max_posts_month ?? '—'} posts/mês`, icon: 'layers' }].concat(
            p.has_whatsapp_approval ? [{ text: 'Aprovação WhatsApp', icon: 'whatsapp' as string }] : [],
            p.has_instagram ? [{ text: 'Instagram', icon: 'instagram' as string }] : [],
            p.has_linkedin ? [{ text: 'LinkedIn', icon: 'linkedin' as string }] : [],
            p.has_github ? [{ text: 'GitHub', icon: 'github' as string }] : [],
            p.has_ai_suggestions ? [{ text: 'Sugestões IA', icon: 'spark' as string }] : [],
            p.has_lead_capture ? [{ text: 'Captura de leads', icon: 'leads' as string }] : [],
          ),
          includes: ['Inclui:', 'Agendamento inteligente', 'Analytics'],
        }))
        setPlans(mapped)
      }
    }).catch(() => {}).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  const togglePricingPeriod = (value: string) => setIsYearly(Number.parseInt(value) === 1)

  const formatBRL = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <div ref={pricingRef} style={{ position: 'relative', padding: '80px 16px 40px', margin: '0 auto', maxWidth: 1280 }}>
      {/* Glow de fundo */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', width: '80%', height: '100%', zIndex: 0,
        backgroundImage: 'radial-gradient(circle at center, rgba(16,185,129,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24, maxWidth: 768, margin: '0 auto 24px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.02em' }}>
          Planos que funcionam para o seu{' '}
          <span style={{ border: '1px dashed rgba(16,185,129,0.6)', padding: '2px 10px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', color: '#34d399', display: 'inline-block' }}>
            negócio
          </span>
        </h2>
        <p style={{ margin: '0 auto', fontSize: '1rem', color: '#71717a', maxWidth: '70%' }}>
          Confiado por criadores e agências. Explore qual opção é ideal para você.
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginBottom: 8 }}>
        <PricingSwitch onSwitch={togglePricingPeriod} />
      </div>

      {/* Grid de planos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '24px 0', position: 'relative', zIndex: 1 }}>
        {plans.map((plan, index) => {
          const price = isYearly ? plan.price_yearly : plan.price_monthly
          return (
            <motion.div
              key={plan.slug || plan.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
            >
              <div
                className="glass-card"
                style={{
                  position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  border: plan.highlighted ? '1px solid rgba(16,185,129,0.45)' : '1px solid rgba(255,255,255,0.06)',
                  background: plan.highlighted ? 'rgba(16,185,129,0.05)' : undefined,
                  boxShadow: plan.highlighted ? '0 0 40px rgba(16,185,129,0.12)' : undefined,
                }}
              >
                <div style={{ padding: '24px 24px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: '#fafafa' }}>{plan.name}</h3>
                    {plan.highlighted && (
                      <span style={{ background: '#10b981', color: '#fff', padding: '4px 12px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {plan.badge || 'Popular'}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0 0 16px', fontSize: '0.8125rem', color: '#71717a' }}>{plan.description}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 16 }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.02em' }}>R$</span>
                    <PriceFlow value={price} />
                    <span style={{ color: '#71717a', marginLeft: 4, fontSize: '0.875rem' }}>/{isYearly ? 'ano' : 'mês'}</span>
                  </div>
                </div>

                <div style={{ padding: '0 24px' }}>
                  <button
                    onClick={() => { if (onNavigate) onNavigate('signup') }}
                    style={{
                      width: '100%', marginBottom: 24, padding: 16, borderRadius: 12, border: 'none', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#fff',
                      background: plan.highlighted ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #27272a, #3f3f46)',
                      boxShadow: plan.highlighted ? '0 8px 24px rgba(16,185,129,0.35)' : 'none',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    Começar Grátis
                  </button>
                </div>

                <div style={{ padding: '0 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(plan.features || []).map((f: any, fi: number) => (
                      <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          {typeof f.icon === 'string' ? (PLAN_ICONS[f.icon] || PLAN_ICONS.layers) : f.icon}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: '#a1a1aa' }}>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.includes && plan.includes.length > 0 && (
                    <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 16 }}>
                      <h4 style={{ margin: '0 0 10px', fontSize: '0.9375rem', fontWeight: 500, color: '#fafafa' }}>{plan.includes[0]}</h4>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {plan.includes.slice(1).map((inc: string, ii: number) => (
                          <li key={ii} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ width: 22, height: 22, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#22c55e' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                            </span>
                            <span style={{ fontSize: '0.8125rem', color: '#a1a1aa' }}>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
