import { useState, useEffect } from 'react'

export default function WhatsAppModal({ post, onClose, onApprove }: {
  post: any
  onClose: () => void
  onApprove: (id: string) => void
}) {
  const [step, setStep] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    setStep('idle')
  }, [post])

  function handleApprove() {
    setStep('sending')
    setTimeout(() => {
      onApprove(post.id)
      setStep('sent')
    }, 2000)
  }

  if (!post) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="card-glass max-w-md w-full p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* WhatsApp Header */}
        <div className="bg-surface-800 px-5 py-4 flex items-center gap-3 border-b border-glass-border">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold">W</div>
          <div>
            <div className="font-semibold text-sm">Arx Factory Bot</div>
            <div className="text-xs text-gray-500">online</div>
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-[#0B141A] p-5 min-h-[300px] flex flex-col justify-end">
          <div className="bg-[#005C4B] text-white rounded-lg rounded-bl-none p-4 max-w-[85%] self-start mb-4 shadow">
            <p className="text-sm font-medium mb-1">📋 Novo conteúdo para revisão</p>
            <p className="text-sm opacity-90 mb-2">{post.topic}</p>
            <p className="text-xs opacity-70">Clique no botão abaixo para aprovar</p>
          </div>

          {step === 'sending' && (
            <div className="bg-[#005C4B] text-white rounded-lg rounded-bl-none p-4 max-w-[85%] self-start mb-4 shadow animate-pulse">
              <p className="text-sm">⏳ Publicando...</p>
            </div>
          )}

          {step === 'sent' && (
            <div className="bg-[#005C4B] text-white rounded-lg rounded-bl-none p-4 max-w-[85%] self-start mb-4 shadow">
              <p className="text-sm">✅ Conteúdo publicado com sucesso!</p>
              <p className="text-xs opacity-70 mt-1">LinkedIn + Instagram</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-surface-800 p-4 flex gap-3 border-t border-glass-border">
          <button onClick={handleApprove} disabled={step !== 'idle'}
            className="flex-1 bg-accent hover:bg-accent-light text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 text-sm">
            ✅ Aprovar e Publicar
          </button>
          <button onClick={onClose} disabled={step !== 'idle'}
            className="btn-ghost flex-1 text-sm disabled:opacity-50">
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
