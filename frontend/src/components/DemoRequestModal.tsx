import { useState } from 'react'
import { api } from '../lib/api'

export default function DemoRequestModal({ onClose, onSuccess }: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!form.name.trim()) { setError('Informe seu nome'); return }
    if (!form.email.trim() || !form.email.includes('@')) { setError('Informe um e-mail válido'); return }
    setBusy(true); setError('')
    try {
      const r = await api.requestDemo(form)
      if (!r.success) { setError(r.error || 'Erro ao agendar demonstração'); return }
      onSuccess()
    } catch (e: any) {
      setError(e.message || 'Erro ao agendar demonstração')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => { if (!busy) onClose() }}>
      <div className="card-glass max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-lg">🎬</span>
          <div>
            <h2 className="font-bold">Agendar Demonstração</h2>
            <p className="text-xs text-gray-500">Deixe seus contatos e libere a demo agora</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nome completo</label>
            <input className="glass-input w-full" placeholder="Seu nome"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">E-mail</label>
            <input className="glass-input w-full" type="email" placeholder="voce@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">WhatsApp</label>
              <input className="glass-input w-full" placeholder="(11) 99999-9999"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Empresa</label>
              <input className="glass-input w-full" placeholder="Sua empresa"
                value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <p className="text-[11px] text-gray-600">
            Ao enviar, você receberá um e-mail de boas-vindas e a demonstração será liberada automaticamente.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} disabled={busy} className="btn-ghost flex-1 text-sm disabled:opacity-50">Voltar</button>
            <button onClick={handleSubmit} disabled={busy} className="btn-accent flex-1 text-sm disabled:opacity-50">
              {busy ? 'Enviando...' : 'Liberar demonstração'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
