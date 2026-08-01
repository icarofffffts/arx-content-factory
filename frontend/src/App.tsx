import { useState, useEffect } from 'react'
import { api, setToken, clearToken } from './lib/api'
import type { User, Plan } from './types'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DashboardCEO from './pages/DashboardCEO'
import Pricing from './pages/Pricing'

export default function App() {
  // Read URL to decide initial page (supports /dashboard, /login, /signup, /pricing)
  const [page, setPage] = useState<string>(() => {
    const p = window.location.pathname
    if (p.startsWith('/dashboard')) return 'dashboard'
    if (p.startsWith('/login')) return 'login'
    if (p.startsWith('/signup')) return 'signup'
    if (p.startsWith('/pricing')) return 'pricing'
    return 'landing'
  })
  const [user, setUser] = useState<User | null>(null)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('arx_token')
    if (token) {
      api.me().then(r => {
        if (r.success) {
          setUser(r.user)
          setPlan(r.plan)
          const savedPage = sessionStorage.getItem('app_page') || 'dashboard'
          setPage(savedPage)
        } else {
          clearToken()
        }
        setLoading(false)
      }).catch(() => {
        clearToken()
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  function handleLogin(token: string, user: User, plan: Plan) {
    setToken(token)
    setUser(user)
    setPlan(plan)
    setPage('dashboard')
    sessionStorage.setItem('app_page', 'dashboard')
    window.history.pushState({}, '', '/dashboard')
  }

  function handleLogout() {
    api.logout().catch(() => {})
    clearToken()
    setUser(null)
    setPlan(null)
    setPage('landing')
    sessionStorage.removeItem('app_page')
    window.history.pushState({}, '', '/')
  }

  function navigateTo(p: string) {
    setPage(p)
    sessionStorage.setItem('app_page', p)
    const path = p === 'landing' ? '/' : `/${p}`
    window.history.pushState({}, '', path)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="animate-pulse text-accent font-mono text-lg">carregando...</div>
      </div>
    )
  }

  if (page === 'landing') return <Landing onNavigate={navigateTo} user={user} />
  if (page === 'login') return <Login onLogin={handleLogin} onNavigate={navigateTo} />
  if (page === 'signup') return <Signup onLogin={handleLogin} onNavigate={navigateTo} />
  if (page === 'pricing') return <Pricing onNavigate={navigateTo} user={user} plan={plan} />
  if (page === 'dashboard' && user) {
    return <DashboardCEO user={user} plan={plan} onLogout={handleLogout} onNavigate={navigateTo} />
  }
  if (page === 'dashboard' && !user) {
    // Not logged in: show login instead of falling through to landing
    return <Login onLogin={handleLogin} onNavigate={navigateTo} />
  }

  return <Landing onNavigate={navigateTo} user={user} />
}
