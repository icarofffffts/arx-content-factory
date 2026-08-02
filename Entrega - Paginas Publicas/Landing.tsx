import { useState } from 'react'
import Pricing from './Pricing'

const STEPS = [
  { icon: '🤖', title: 'Geração com IA', desc: 'DeepSeek analisa feeds TechCrunch, VentureBeat, HackerNews e cria conteúdo relevante em segundos.' },
  { icon: '✅', title: 'Aprovação via WhatsApp', desc: 'Receba o preview no WhatsApp. Aprove ou rejeite com um clique. Nada é publicado sem seu ok.' },
  { icon: '🚀', title: 'Publicação Automática', desc: 'LinkedIn, Instagram e GitHub. Cada plataforma no melhor horário. Tudo automático.' },
]

const FEATURES = [
  { icon: '🧠', title: 'Geração Automática', desc: 'IA seleciona tópicos quentes, cria slides e legendas prontas para publicação.' },
  { icon: '📱', title: 'Aprovação WhatsApp', desc: 'Preview visual com botões Aprovar/Rejeitar. Controle total antes de publicar.' },
  { icon: '💼', title: 'LinkedIn Carrossel', desc: 'Posts em formato carrossel com imagens reais. Agendamento nos melhores horários.' },
  { icon: '📸', title: 'Instagram Carrossel', desc: 'Publicação automática no Instagram com suporte a múltiplos slides.' },
  { icon: '📊', title: 'Analytics & Leads', desc: 'Capture leads dos comentários, rastreie cliques em links e monitore resultados.' },
  { icon: '📦', title: 'GitHub Archive', desc: 'Todo conteúdo arquivado automaticamente no GitHub como portfólio público.' },
]

const TESTIMONIALS = [
  { name: 'Carlos Silva', role: 'CEO, TechGrowth', avatar: 'CS', text: 'Reduzi meu tempo de criação de conteúdo de 4 horas para 15 minutos por dia. A aprovação via WhatsApp mudou meu fluxo.' },
  { name: 'Ana Oliveira', role: 'Marketing Lead, DevHub', avatar: 'AO', text: 'A qualidade do conteúdo que a IA gera é impressionante. Parece que foi escrito por um especialista.' },
  { name: 'Rafael Costa', role: 'Founder, StartupLab', avatar: 'RC', text: 'O sistema de agendamento inteligente nos gives 3x mais engajamento. Melhor investimento do ano.' },
]

export default function Landing({ onNavigate, user }: { onNavigate: (p: string) => void; user: any }) {
  const [showPricing, setShowPricing] = useState(false)

  return (
    <div className="min-h-screen bg-surface-900">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-surface-900/80 backdrop-blur-xl border-b border-glass-border">
        <div className="max-w-app mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-sm">A</span>
            <span className="font-semibold text-lg">Arx Factory</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowPricing(!showPricing)} className="text-sm text-gray-400 hover:text-white transition-colors">Preços</button>
            {user ? (
              <button onClick={() => onNavigate('dashboard')} className="btn-accent text-sm">Dashboard</button>
            ) : (
              <>
                <button onClick={() => onNavigate('login')} className="text-sm text-gray-400 hover:text-white transition-colors">Entrar</button>
                <button onClick={() => onNavigate('signup')} className="btn-accent text-sm">Começar Grátis</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,18,48,0.12)_0%,transparent_60%)]" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass border border-glass-border text-sm text-gray-400 mb-8">
            🔥 Automação Inteligente de Conteúdo
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Conteúdo <span className="gradient-text">Automatizado</span><br />
            com Aprovação <span className="text-accent">Humana</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            IA gera posts para LinkedIn, Instagram e GitHub. Você aprova pelo WhatsApp.
            Publique em escala sem perder o controle.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => onNavigate('signup')} className="btn-accent text-lg px-8 py-4">
              Começar Grátis
            </button>
            <button onClick={() => setShowPricing(true)} className="btn-ghost text-lg px-8 py-4">
              Ver Planos
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span>🚀 Sem cartão de crédito</span>
            <span>✅ Cancele quando quiser</span>
            <span>⚡ 5 min de setup</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6">
        <div className="max-w-app mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Como Funciona</h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            Três passos simples para automatizar seu conteúdo
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="card-glass p-8 card-hover text-center">
                <span className="text-5xl mb-4 block">{s.icon}</span>
                <div className="text-accent text-sm font-mono mb-3">Passo {i + 1}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-surface-800/50">
        <div className="max-w-app mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Tudo que Você Precisa</h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            Ferramentas completas para criar, aprovar e publicar conteúdo
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-glass p-6 card-hover">
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING (inline) */}
      {showPricing && (
        <section className="py-20 px-6">
          <Pricing onNavigate={onNavigate} user={user} plan={null} />
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-20 px-6">
        <div className="max-w-app mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Quem Usa Aprova</h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            O que nossos usuários estão dizendo
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-glass p-8 card-hover">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center font-bold text-accent">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center card-glass p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para Automatizar?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Comece grátis hoje. Publique seu primeiro post em minutos.
          </p>
          <button onClick={() => onNavigate('signup')} className="btn-accent text-lg px-10 py-4">
            Criar Conta Gratuita
          </button>
          <p className="text-gray-600 text-sm mt-4">Sem cartão de crédito • Cancele quando quiser</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-glass-border py-12 px-6">
        <div className="max-w-app mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-accent rounded flex items-center justify-center font-bold text-xs">A</span>
            <span className="text-sm text-gray-400">Arx Content Factory</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>© 2026 Arx Solutions</span>
            <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">Entrar</button>
            <button onClick={() => setShowPricing(true)} className="hover:text-white transition-colors">Preços</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
