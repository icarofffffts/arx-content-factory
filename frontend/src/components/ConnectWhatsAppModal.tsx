import { useState } from 'react'
import { api } from '../lib/api'

export default function ConnectWhatsAppModal({ onClose, onConnected }: {
  onClose: () => void
  onConnected: () => void
}) {
  const [step, setStep] = useState<'name' | 'qr'>('name')
  const [clientName, setClientName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [qr, setQr] = useState<{ base64: string; code: string; instance_name: string } | null>(null)
  const [connected, setConnected] = useState(false)

  async function handleCreate() {
    const name = clientName.trim()
    if (!name) { setError('Informe o nome do cliente'); return }
    setBusy(true); setError('')
    try {
      const r = await api.createWhatsAppInstance(name)
      if (!r.success) { setError(r.error || 'Erro ao criar instância'); return }
      const qrRes = await api.whatsappInstanceQr(r.instance.instance_name)
      if (!qrRes.success) { setError(qrRes.error || 'Erro ao gerar QR code'); return }
      setQr({ base64: qrRes.base64, code: qrRes.code, instance_name: qrRes.instance_name })
      setStep('qr')
      pollStatus(qrRes.instance_name)
    } catch (e: any) {
      setError(e.message || 'Erro ao criar instância')
    } finally {
      setBusy(false)
    }
  }

  function pollStatus(name: string) {
    const timer = setInterval(async () => {
      try {
        const r = await api.whatsappInstanceStatus(name)
        if (r.connected) {
          clearInterval(timer)
          setConnected(true)
          onConnected()
        }
      } catch (e) { /* keep polling */ }
    }, 3000)
    setTimeout(() => clearInterval(timer), 120000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => { if (!busy) onClose() }}>
      <div className="card-glass max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-lg">💬</span>
          <div>
            <h2 className="font-bold">Conectar WhatsApp</h2>
            <p className="text-xs text-gray-500">Crie uma instância e escaneie o QR</p>
          </div>
        </div>

        {step === 'name' && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nome do cliente</label>
            <input
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="Ex: Icaro Dev, Loja da Maria..."
              className="glass-input w-full"
            />
            <p className="text-xs text-gray-600 mt-2">A instância será criada com o nome: {clientName.trim() ? clientName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) : '...'}</p>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            <div className="flex gap-3 mt-5">
              <button onClick={onClose} disabled={busy} className="btn-ghost flex-1 text-sm disabled:opacity-50">Cancelar</button>
              <button onClick={handleCreate} disabled={busy} className="btn-accent flex-1 text-sm disabled:opacity-50">
                {busy ? 'Criando...' : 'Criar instância'}
              </button>
            </div>
          </div>
        )}

        {step === 'qr' && qr && (
          <div>
            {connected ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-green-400">WhatsApp conectado!</p>
                <p className="text-xs text-gray-500 mt-1">Instância {qr.instance_name} ativa.</p>
                <button onClick={onClose} className="btn-accent text-sm w-full mt-5">Concluir</button>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-white p-3 rounded-2xl inline-block mb-4">
                  <img src={`data:image/png;base64,${qr.base64}`} alt="QR Code" className="w-56 h-56" />
                </div>
                {qr.code && (
                  <div className="bg-green-500/10 text-green-400 text-xs font-mono px-4 py-2 rounded-xl inline-block mb-4">
                    Código de pareamento: {qr.code}
                  </div>
                )}
                <p className="text-sm text-gray-400 animate-pulse">
                  Abra o WhatsApp no celular → Configurações → Aparelhos conectados → Conectar aparelho
                </p>
                {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
