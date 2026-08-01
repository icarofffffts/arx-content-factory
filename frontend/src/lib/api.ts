import type { SocialAccount } from '../types'

const API = ''

function getToken(): string | null {
  return localStorage.getItem('arx_token')
}

export function setToken(token: string) {
  localStorage.setItem('arx_token', token)
}

export function clearToken() {
  localStorage.removeItem('arx_token')
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  }
  if (token) headers['x-arx-token'] = token

  const res = await fetch(`${API}${path}`, { ...opts, headers })
  if (res.status === 401) {
    clearToken()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  return res.json()
}

// Auth
export const api = {
  login: (email: string, password: string) =>
    request<{ success: boolean; user?: any; token?: string; plan?: any; error?: string }>('/api/v2/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password })
    }),

  register: (email: string, password: string, full_name?: string) =>
    request<{ success: boolean; user?: any; token?: string; error?: string }>('/api/v2/auth/register', {
      method: 'POST', body: JSON.stringify({ email, password, full_name })
    }),

  logout: () =>
    request<{ success: boolean }>('/api/v2/auth/logout', { method: 'POST' }),

  me: () =>
    request<{ success: boolean; user: any; plan: any }>('/api/v2/auth/me'),

  plans: () =>
    request<any[]>('/api/v2/plans'),

  subscribe: (plan_slug: string, billing_cycle: string) =>
    request<{ success: boolean }>('/api/v2/plans/subscribe', {
      method: 'POST', body: JSON.stringify({ plan_slug, billing_cycle })
    }),

  // Dashboard
  metrics: () =>
    request<{ total: number; scheduled: number; paused: number; draft: number;
              posted_linkedin: number; posted_instagram: number; published: number }>('/api/metrics'),

  posts: (status?: string) =>
    request<any[]>(`/api/posts${status ? `?status=${status}` : ''}`),

  drafts: () =>
    request<any[]>('/api/drafts'),

  generate: (topic: string, channel?: string, publish_mode?: string, template?: string) =>
    request<{ success: boolean; message: string }>('/api/generate', {
      method: 'POST', body: JSON.stringify({ topic, channel: channel || 'all', publish_mode: publish_mode || 'now', template: template || 'clean' })
    }),

  publishNow: (id: string) =>
    request<{ success: boolean }>(`/api/posts/${id}/publish-now`, { method: 'POST' }),

  reschedule: (id: string, scheduled_at: string) =>
    request<{ success: boolean }>(`/api/posts/${id}/reschedule`, {
      method: 'PATCH', body: JSON.stringify({ scheduled_at })
    }),

  togglePause: (id: string) =>
    request<{ success: boolean; status: string }>(`/api/posts/${id}/toggle-pause`, { method: 'PATCH' }),

  deletePost: (id: string) =>
    request<{ success: boolean }>(`/api/posts/${id}`, { method: 'DELETE' }),

  reorganize: () =>
    request<{ success: boolean }>('/api/posts/reorganize-schedule', { method: 'POST' }),

  approveDraft: (id: string) =>
    request<{ success: boolean }>(`/api/drafts/${id}/approve`, { method: 'POST' }),

  rejectDraft: (id: string) =>
    request<{ success: boolean }>(`/api/drafts/${id}/reject`, { method: 'POST' }),

  // Marketing
  leads: () =>
    request<any[]>('/api/v1/leads'),

  leadsStats: () =>
    request<{ total_leads: number; followers_verified: number; delivered_count: number; conversion_rate: string }>('/api/v1/leads/stats'),

  promos: () =>
    request<any[]>('/api/v1/promos'),

  shortlinks: () =>
    request<any[]>('/api/shortlinks'),

  shorten: (url: string) =>
    request<{ success: boolean; short_url: string }>('/api/shorten', {
      method: 'POST', body: JSON.stringify({ original_url: url })
    }),

  // Settings
  settings: () =>
    request<any>('/api/settings'),

  updateSettings: (data: any) =>
    request<{ success: boolean }>('/api/settings', {
      method: 'PUT', body: JSON.stringify(data)
    }),

  // WhatsApp Instances (Evolution)
  whatsappInstances: () =>
    request<{ success: boolean; instances: any[] }>('/api/whatsapp/instances'),

  createWhatsAppInstance: (client_name: string) =>
    request<{ success: boolean; instance?: any; error?: string }>('/api/whatsapp/instances', {
      method: 'POST', body: JSON.stringify({ client_name })
    }),

  whatsappInstanceQr: (name: string) =>
    request<{ success: boolean; base64: string; code: string; instance_name: string; error?: string }>(`/api/whatsapp/instances/${encodeURIComponent(name)}/qr`),

  whatsappInstanceStatus: (name: string) =>
    request<{ success: boolean; connected: boolean; status: string; number?: string }>(`/api/whatsapp/instances/${encodeURIComponent(name)}/status`),

  deleteWhatsAppInstance: (name: string) =>
    request<{ success: boolean }>(`/api/whatsapp/instances/${encodeURIComponent(name)}`, { method: 'DELETE' }),

  // Demo request (contact form + welcome email)
  requestDemo: (data: { name: string; email: string; phone?: string; company?: string }) =>
    request<{ success: boolean; message: string; email_sent?: boolean; error?: string }>('/api/demo/request', {
      method: 'POST', body: JSON.stringify(data)
    }),

  // Social accounts (Instagram / LinkedIn / GitHub)
  socialAccounts: () =>
    request<{ success: boolean; accounts: SocialAccount[]; error?: string }>('/api/social/accounts'),

  socialConnect: (platform: string) =>
    request<{ success?: boolean; redirect_url?: string; error?: string }>(`/api/social/connect/${encodeURIComponent(platform)}`),

  deleteSocialAccount: (id: string) =>
    request<{ success: boolean; error?: string }>(`/api/social/accounts/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  refreshSocialAccount: (id: string) =>
    request<{ success: boolean; error?: string }>(`/api/social/refresh/${encodeURIComponent(id)}`, { method: 'POST' }),

  // AI Suggestions
  suggestions: () =>
    request<{ success?: boolean; suggestions?: { topic: string; score: number; reason: string }[]; error?: string } | { topic: string; score: number; reason: string }[]>('/api/suggestions'),
}
