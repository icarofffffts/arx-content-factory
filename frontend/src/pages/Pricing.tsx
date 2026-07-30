import { useState, useEffect } from 'react'
import { api } from '../lib/api'

const FALLBACK_PLANS = [
  { name: 'Gratuito', slug: 'gratuito', price_monthly: 0, price_yearly: 0, description: 'Para criadores iniciantes', max_posts_month: 10, features: ['Até 10 posts/mês', 'Acesso ao dashboard básico', 'Suporte por email'], highlighted: false },
  { name: 'Pro', slug: 'pro', price_monthly: 97, price_yearly: 970, description: 'Para profissionais de marketing', max_posts_month: 100, features: ['Até 100 posts/mês', 'Aprovação via WhatsApp', 'LinkedIn + Instagram', 'Sugestões de conteúdo IA', 'Suporte prioritário'], highlighted: true },
  { name: 'Enterprise', slug: 'enterprise', price_monthly: 297, price_yearly: 2970, description: 'Para equipes e agências', max_posts_month: 999999, features: ['Posts ilimitados', 'Aprovação via WhatsApp', 'LinkedIn + Instagram + GitHub', 'Sugestões de conteúdo IA', 'Captura de leads', 'Suporte dedicado 24/7'], highlighted: false },
]

export default function Pricing({ onNavigate, user, plan: currentPlan }: {
  onNavigate: (p: string) => void
  user: any
  plan: any
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
      alert('✅ Plano ativado com sucesso!')
    } catch { alert('❌ Erro ao ativar plano') }
    setSubscribing(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Planos</h2>
        <p className="text-gray-400">Escolha o plano ideal para seu negócio</p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm ${!annual ? 'text-white' : 'text-gray-500'}`}>Mensal</span>
        <button onClick={() => setAnnual(!annual)}
          className={`w-14 h-7 rounded-full transition-colors relative ${annual ? 'bg-accent' : 'bg-gray-600'}`}>
          <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${annual ? 'left-8' : 'left-1'}`} />
        </button>
        <span className={`text-sm ${annual ? 'text-white' : 'text-gray-500'}`}>Anual <span className="text-accent">−17%</span></span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {displayPlans.map((p, i) => {
          const isCurrent = currentPlan?.slug === p.slug && currentPlan?.subscription_status === 'active'
          const price = annual ? p.price_yearly : p.price_monthly
          const periodLabel = annual ? '/ano' : '/mês'

          return (
            <div key={i} className={`card-glass p-8 flex flex-col ${p.highlighted ? 'border-accent/50 ring-1 ring-accent/30' : ''} ${p.highlighted ? 'scale-105' : ''}`}>
              {p.highlighted && <div className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">Mais Popular</div>}
              <h3 className="text-xl font-bold mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{p.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-black">R$ {price}</span>
                <span className="text-gray-500 text-sm"> {periodLabel}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f: string, j: number) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="text-accent mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSubscribe(p.slug)} disabled={subscribing === p.slug}
                className={`w-full py-3 rounded-xl font-semibold transition-all text-sm
                  ${isCurrent ? 'bg-green-600/20 text-green-400 border border-green-600/30 cursor-default'
                    : p.highlighted ? 'btn-accent' : 'btn-ghost'}`}>
                {isCurrent ? '✓ Plano Atual' : subscribing === p.slug ? 'Ativando...' : p.price_monthly === 0 ? 'Começar Grátis' : 'Assinar Agora'}
              </button>
            </div>
          )
        })}
      </div>

      {!user && (
        <p className="text-center text-sm text-gray-500 mt-8">
          Todas as funcionalidades em {' '}
          <button onClick={() => onNavigate('signup')} className="text-accent hover:underline">cadastro gratuito</button>
        </p>
      )}
    </div>
  )
}
