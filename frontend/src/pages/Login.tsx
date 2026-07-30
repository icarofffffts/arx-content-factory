import { useState } from 'react'
import { api } from '../lib/api'

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
        onLogin(r.token, r.user, r.plan)
      } else {
        setError(r.error || 'Erro ao fazer login')
      }
    } catch {
      setError('Erro de conexão')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4">A</div>
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-gray-500 mt-2">Acesse seu painel de controle</p>
        </div>

        <form onSubmit={handleSubmit} className="card-glass p-8 space-y-5">
          {error && <div className="text-red-400 text-sm bg-red-400/10 px-4 py-3 rounded-xl">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="glass-input w-full" placeholder="seu@email.com" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="glass-input w-full" placeholder="••••••" required />
          </div>

          <button type="submit" disabled={loading}
            className="btn-accent w-full py-3 disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Não tem conta?{' '}
            <button type="button" onClick={() => onNavigate('signup')}
              className="text-accent hover:underline">Criar conta</button>
          </p>

          <p className="text-center text-xs text-gray-600">
            Admin: <button type="button" onClick={() => { setEmail('admin@arx.dev'); setPassword('arx_secret_2026!') }}
              className="hover:text-gray-400">preencher credenciais</button>
          </p>
        </form>
      </div>
    </div>
  )
}
