import { useState, useRef, useEffect } from 'react'
import { api } from '../lib/api'

interface Msg { role: 'user' | 'assistant'; content: string }

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setError('')
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setLoading(true)
    try {
      const r = await api.aiChat(text, next.filter(m => m.content !== text).map(m => ({ role: m.role, content: m.content })))
      setMessages([...next, { role: 'assistant', content: r.reply }])
    } catch (e: any) {
      setError(e.message || 'Erro ao falar com o assistente')
      setMessages(next)
    } finally {
      setLoading(false)
    }
  }

  const SUGGESTIONS = [
    'Sugira 3 temas de post para meu nicho',
    'Melhore essa legenda de LinkedIn',
    'Ideia de carrossel de slides',
  ]

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-dark text-white text-2xl shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all"
        aria-label="Assistente IA"
        title="Assistente IA"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Painel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[70vh] rounded-2xl border border-glass-border bg-surface-900/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-glass-border bg-gradient-to-r from-accent/15 to-transparent flex items-center gap-3">
            <span className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center text-sm">🤖</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">Assistente de Conteúdo</div>
              <div className="text-[11px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
                Online · DeepSeek
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && !loading && (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">👋</div>
                <p className="text-sm text-gray-400 mb-4">Olá! Sou seu assistente de conteúdo.<br />Posso sugerir temas, melhorar textos e dar ideias de slides.</p>
                <div className="space-y-2">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setInput(s); }}
                      className="block w-full text-left text-xs bg-glass hover:bg-glass-hover border border-glass-border rounded-xl px-3 py-2.5 transition-all"
                    >
                      💡 {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-gradient-to-br from-accent to-accent-dark text-white rounded-br-md'
                    : 'bg-glass border border-glass-border rounded-bl-md'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-glass border border-glass-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-glass-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                placeholder="Pergunte algo sobre seu conteúdo..."
                className="flex-1 bg-glass border border-glass-border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-accent/50 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark text-white disabled:opacity-40 transition-all"
                aria-label="Enviar"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
