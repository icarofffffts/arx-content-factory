import { useState, useEffect, useRef } from 'react'
import Pricing from './Pricing'
import ArxLogo from './ArxLogo'
import { api } from '../lib/api'

// ─── Real SVG logos ───────────────────────────────────────────────────────────

const SvgLinkedIn = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)
const SvgInstagram = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs><linearGradient id="ig2" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs>
    <path fill="url(#ig2)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)
const SvgGitHub = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#e6edf3"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
)
const SvgWhatsApp = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
)
const SvgTwitterX = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#e7e9ea"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)
const SvgYouTube = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
)

// ─── Mouse aurora that follows cursor ────────────────────────────────────────

function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.3 })
  const current = useRef({ x: 0.5, y: 0.3 })
  const raf = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      current.current.x += (mouse.current.x - current.current.x) * 0.06
      current.current.y += (mouse.current.y - current.current.y) * 0.06
      if (ref.current) {
        const x = current.current.x * 100
        const y = current.current.y * 100
        ref.current.style.background = `
          radial-gradient(ellipse at ${x}% ${y}%, rgba(16,185,129,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at ${100 - x}% ${100 - y}%, rgba(59,130,246,0.10) 0%, transparent 50%),
          radial-gradient(ellipse at ${x * 0.4}% ${y * 0.6 + 40}%, rgba(16,185,129,0.07) 0%, transparent 45%),
          #0a0a0a
        `
      }
      raf.current = requestAnimationFrame(tick)
    }
    tick()
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current) }
  }, [])

  return (
    <div ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, transition: 'none', pointerEvents: 'none' }}>
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
    </div>
  )
}

// ─── Particle field ───────────────────────────────────────────────────────────

function ParticleField() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    let w = c.width = window.innerWidth
    let h = c.height = window.innerHeight

    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight }
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { mouse.current = { x: -1000, y: -1000 } }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    const count = 90
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const mx = mouse.current.x, my = mouse.current.y

      for (const p of pts) {
        // mouse repel
        const dx = p.x - mx, dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.4
          p.vy += (dy / dist) * force * 0.4
        }
        p.vx *= 0.98; p.vy *= 0.98
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0

        const dToMouse = Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2)
        const alpha = dToMouse < 200 ? 0.5 : 0.15
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(16,185,129,${alpha})`
        ctx.fill()
      }

      // lines between close pts
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(16,185,129,${0.08 * (1 - d / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={canvas} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.7 }} />
}

// ─── Magnetic button ──────────────────────────────────────────────────────────

function MagneticBtn({ children, onClick, primary = false, large = false }: { children: React.ReactNode; onClick?: () => void; primary?: boolean; large?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    setPos({ x: (e.clientX - cx) * 0.35, y: (e.clientY - cy) * 0.35 })
  }
  const onLeave = () => { setPos({ x: 0, y: 0 }); setHovered(false) }

  const pad = large ? '16px 36px' : '10px 22px'
  const fs = large ? '1.0625rem' : '0.875rem'

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: hovered ? 'transform 0.1s ease' : 'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
        background: primary ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)',
        color: primary ? '#fff' : '#a1a1aa',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
        padding: pad,
        fontSize: fs,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: primary ? `0 0 ${hovered ? 32 : 16}px rgba(16,185,129,${hovered ? 0.6 : 0.35})` : 'none',
        fontFamily: 'Inter, sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </button>
  )
}

// ─── 3D tilt card ─────────────────────────────────────────────────────────────

function TiltCard({ children, accent = '#10b981', style: extraStyle }: { children: React.ReactNode; accent?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [shine, setShine] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    setTilt({ x: (ny - 0.5) * 16, y: (nx - 0.5) * -16 })
    setShine({ x: nx * 100, y: ny * 100 })
  }
  const onLeave = () => { setTilt({ x: 0, y: 0 }); setHovered(false) }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        ...extraStyle,
        background: 'rgba(12,12,12,0.8)',
        border: `1px solid ${hovered ? accent + '45' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 20,
        backdropFilter: 'blur(14px)',
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
        transition: hovered ? 'transform 0.08s ease, border-color 0.2s, box-shadow 0.2s' : 'transform 0.5s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px ${accent}20, inset 0 1px 0 rgba(255,255,255,0.07)` : '0 4px 16px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Shine layer */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s',
      }} />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  )
}

// ─── Typewriter hero ──────────────────────────────────────────────────────────

function Typewriter({ words }: { words: string[] }) {
  const [wi, setWi] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    if (pause) { const t = setTimeout(() => setPause(false), 1400); return () => clearTimeout(t) }
    const target = words[wi]
    if (!deleting) {
      if (text.length < target.length) {
        const t = setTimeout(() => setText(target.slice(0, text.length + 1)), 72)
        return () => clearTimeout(t)
      } else { setPause(true); setDeleting(true) }
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), 38)
        return () => clearTimeout(t)
      } else { setDeleting(false); setWi((wi + 1) % words.length) }
    }
  }, [text, deleting, pause, wi, words])

  return (
    <span style={{ background: 'linear-gradient(135deg, #34d399, #10b981, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {text}
      <span style={{ WebkitTextFillColor: '#10b981', animation: 'blink 0.9s step-end infinite' }}>|</span>
    </span>
  )
}

// ─── Scroll progress bar ──────────────────────────────────────────────────────

function ScrollBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 200, background: 'rgba(255,255,255,0.06)' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #10b981, #34d399)', transition: 'width 0.1s linear', boxShadow: '0 0 8px rgba(16,185,129,0.8)' }} />
    </div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const start = Date.now(), dur = 1600
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1)
          const eased = 1 - (1 - p) ** 3
          setV(+(target * eased).toFixed(target % 1 ? 1 : 0))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{v}{suffix}</span>
}

// ─── Interactive platform ticker ─────────────────────────────────────────────

function Ticker() {
  const items: { label: string; logo: React.ReactNode }[] = [
    { label: 'LinkedIn',   logo: <SvgLinkedIn size={18} /> },
    { label: 'Instagram',  logo: <SvgInstagram size={18} /> },
    { label: 'GitHub',     logo: <SvgGitHub size={18} /> },
    { label: 'WhatsApp',   logo: <SvgWhatsApp size={18} /> },
    { label: 'Twitter / X',logo: <SvgTwitterX size={18} /> },
    { label: 'YouTube',    logo: <SvgYouTube size={18} /> },
  ]
  const all = [...items, ...items]
  const [paused, setPaused] = useState(false)
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 0', position: 'relative', cursor: 'default' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(90deg, #0a0a0a, transparent)', zIndex: 1 }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(-90deg, #0a0a0a, transparent)', zIndex: 1 }} />
      <div style={{ display: 'flex', gap: 48, width: 'max-content', animation: paused ? 'none' : 'ticker 22s linear infinite' }}>
        {all.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.9375rem', color: '#3f3f46', fontWeight: 600, whiteSpace: 'nowrap', transition: 'color 0.2s', opacity: 0.6 }} onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.opacity = '1'; (e.currentTarget as HTMLSpanElement).style.color = '#fafafa' }} onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.opacity = '0.6'; (e.currentTarget as HTMLSpanElement).style.color = '#3f3f46' }}>
            {item.logo} {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Dashboard live mockup ────────────────────────────────────────────────────

function LiveMockup() {
  const [slide, setSlide] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % 3), 3000)
    return () => clearInterval(t)
  }, [])

  const screens = [
    {
      label: 'Dashboard',
      body: (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
            {[{ l: 'Posts', v: '142', c: '#10b981' }, { l: 'Agendados', v: '28', c: '#3b82f6' }, { l: 'Engajamento', v: '6.4k', c: '#22c55e' }, { l: 'Templates', v: '9', c: '#f59e0b' }].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '7px 9px', border: `1px solid ${s.c}20` }}>
                <div style={{ fontSize: 7.5, color: '#71717a', marginBottom: 3 }}>{s.l}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 8, color: '#71717a', marginBottom: 6 }}>Produção — 14 dias</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 44 }}>
              {[3,5,2,7,4,6,8,3,9,5,11,7,13,9].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${(h/13)*100}%`, background: i === 13 ? '#10b981' : `rgba(16,185,129,${0.15 + (h/13)*0.5})`, borderRadius: '2px 2px 0 0', transition: 'height 0.4s ease' }} />
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Conteúdo',
      body: (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { title: '5 Growth Hacks para SaaS', s: 'Agendado', c: '#3b82f6' },
            { title: 'Q3 Roadmap Reveal', s: 'Processando', c: '#f59e0b' },
            { title: 'Como Escalamos 10k Users', s: 'Publicado', c: '#22c55e' },
            { title: 'Meet the Team: Design', s: 'Rascunho', c: '#71717a' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: hovered === i ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '7px 9px', border: `1px solid ${hovered === i ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.2s', cursor: 'default' }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: `${p.c}18`, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              </div>
              <span style={{ fontSize: 7, fontWeight: 700, color: p.c, background: `${p.c}18`, padding: '2px 6px', borderRadius: 9999 }}>{p.s}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      label: 'Modelos',
      body: (
        <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { name: 'Tech Growth', c: '#10b981', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=68&fit=crop&auto=format' },
            { name: 'Brand Story', c: '#3b82f6', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=100&h=68&fit=crop&auto=format' },
            { name: 'Product Launch', c: '#22c55e', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=68&fit=crop&auto=format' },
            { name: 'Finance Data', c: '#f59e0b', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=68&fit=crop&auto=format' },
          ].map(t => (
            <div key={t.name} style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${t.c}30` }}>
              <div style={{ height: 40, position: 'relative' }}>
                <img src={t.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${t.c}50,transparent)` }} />
              </div>
              <div style={{ padding: '4px 7px', background: 'rgba(0,0,0,0.5)' }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#fafafa' }}>{t.name}</div>
              </div>
            </div>
          ))}
        </div>
      )
    },
  ]

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
      {/* Glow */}
      <div style={{ position: 'absolute', inset: -60, background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Browser frame */}
      <div style={{ position: 'relative', zIndex: 1, background: '#0c0c0c', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 48px 96px rgba(0,0,0,0.65), 0 0 0 1px rgba(16,185,129,0.12)' }}>
        {/* Titlebar */}
        <div style={{ height: 36, background: '#080808', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6 }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          <div style={{ flex: 1, margin: '0 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, color: '#3f3f46', fontFamily: 'monospace' }}>app.arxfactory.io</span>
          </div>
        </div>

        <div style={{ display: 'flex', height: 210 }}>
          {/* Sidebar mini */}
          <div style={{ width: 42, background: '#080808', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}>A</div>
            {['⊞', '☰', '▣', '◷'].map((icon, i) => (
              <div key={i} onClick={() => setSlide(Math.min(i, 2))} style={{ width: 28, height: 28, borderRadius: 7, background: i === slide ? 'rgba(16,185,129,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: i === slide ? '#34d399' : '#3f3f46', cursor: 'pointer', transition: 'all 0.2s' }}>
                {icon}
              </div>
            ))}
          </div>

          {/* Content area */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: 30, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 12px', background: 'rgba(8,8,8,0.9)' }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#fafafa' }}>{screens[slide].label}</span>
              <div style={{ flex: 1 }} />
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#3b82f6)' }} />
            </div>
            <div style={{ position: 'relative', height: 180 }}>
              {screens.map((sc, i) => (
                <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === slide ? 1 : 0, transform: `translateY(${i === slide ? 0 : 8}px)`, transition: 'opacity 0.4s, transform 0.4s', pointerEvents: i === slide ? 'auto' : 'none' }}>
                  {sc.body}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div style={{ position: 'absolute', top: -14, right: -16, background: 'linear-gradient(135deg, #10b981, #14b8a6)', borderRadius: 10, padding: '6px 13px', fontSize: 11, fontWeight: 700, color: '#fff', boxShadow: '0 4px 24px rgba(16,185,129,0.55)', zIndex: 2, animation: 'float 3s ease-in-out infinite' }}>
        ✦ AI Powered
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        {screens.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 22 : 6, height: 6, borderRadius: 9999, background: i === slide ? '#10b981' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.35s', padding: 0 }} />
        ))}
      </div>
    </div>
  )
}

// ─── WhatsApp animated chat ───────────────────────────────────────────────────

function WAChat() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(true)
  useEffect(() => {
    if (!running) return
    if (step < 3) { const t = setTimeout(() => setStep(s => s + 1), 2000); return () => clearTimeout(t) }
    else { const t = setTimeout(() => { setStep(0) }, 3500); return () => clearTimeout(t) }
  }, [step, running])

  const msgs = [
    { from: 'bot', text: '🤖 *Arx AI* gerou um novo post!' },
    { from: 'bot', text: '📊 *5 Hacks de Growth para SaaS*\n\nSlide 1: O erro que 90% dos founders cometem…\n\n_Aprovar ou rejeitar?_' },
    { from: 'user', text: '✅ Aprovar' },
    { from: 'bot', text: '🚀 Publicado no LinkedIn! 4.2k impressões em 10 min 📈' },
  ]

  return (
    <div
      style={{ width: 210, background: '#111b21', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', cursor: 'default' }}
      onMouseEnter={() => setRunning(false)}
      onMouseLeave={() => setRunning(true)}
    >
      <div style={{ background: '#1f2c34', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #25d366, #128c7e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#e9edef' }}>Arx Bot</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#25d366', display: 'inline-block' }} />
            <span style={{ fontSize: 8, color: '#8696a0' }}>online</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 8px', minHeight: 170, background: '#0b141a', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {msgs.slice(0, step + 1).map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', animation: 'msgIn 0.22s ease' }}>
            <div style={{ maxWidth: '82%', background: m.from === 'user' ? '#005c4b' : '#1f2c34', borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', padding: '7px 10px' }}>
              <div style={{ fontSize: 9, color: '#e9edef', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.text}</div>
              <div style={{ fontSize: 7, color: '#8696a0', textAlign: 'right', marginTop: 2 }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {m.from === 'user' && <span style={{ color: '#53bdeb', marginLeft: 3 }}>✓✓</span>}
              </div>
            </div>
          </div>
        ))}
        {step < msgs.length - 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#1f2c34', borderRadius: '12px 12px 12px 2px', padding: '8px 12px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#8696a0', display: 'inline-block', animation: `bounce 1s ease ${i * 0.18}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: '#1f2c34', padding: '7px 8px', display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, background: '#2a3942', borderRadius: 18, padding: '4px 10px', fontSize: 8.5, color: '#8696a0' }}>Mensagem</div>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🎤</div>
      </div>
    </div>
  )
}

// ─── Feature section ──────────────────────────────────────────────────────────

const FEATURES = [
  { icon: '🧠', title: 'Geração com IA', desc: 'DeepSeek analisa feeds ao vivo e cria scripts, slides e legendas contextualizados em segundos.', accent: '#10b981' },
  { icon: '📱', title: 'Aprovação no WhatsApp', desc: 'Cada post chega no seu celular com preview visual. Toque para aprovar ou rejeitar — sem abrir o dashboard.', accent: '#25d366' },
  { icon: '🗓️', title: 'Calendário Inteligente', desc: 'O sistema detecta os melhores horários de postagem para cada plataforma e agenda automaticamente.', accent: '#3b82f6' },
  { icon: '📊', title: 'Analytics em Tempo Real', desc: 'Impressões, engajamento e leads capturados dos comentários. Tudo em um painel unificado.', accent: '#f59e0b' },
  { icon: '🎨', title: 'Templates Premium', desc: '9+ templates de carrossel e vídeo desenvolvidos por designers. Personalize em segundos.', accent: '#ec4899' },
  { icon: '🔗', title: 'Integrações Nativas', desc: 'LinkedIn, Instagram, GitHub, n8n e webhooks. Conecte sua stack existente sem fricção.', accent: '#14b8a6' },
]

const STATS = [
  { value: 12400, suffix: '+', label: 'posts publicados' },
  { value: 98, suffix: '%', label: 'taxa de aprovação' },
  { value: 3.2, suffix: 'h', label: 'economizados por dia' },
  { value: 840, suffix: '+', label: 'criadores ativos' },
]

const TESTIMONIALS = [
  { name: 'Carlos Silva', role: 'CEO · TechGrowth', av: 'CS', text: 'Reduzi meu tempo de criação de conteúdo de 4 horas para 15 minutos. A aprovação pelo WhatsApp mudou tudo.', stars: 5 },
  { name: 'Ana Oliveira', role: 'Marketing Lead · DevHub', av: 'AO', text: 'O conteúdo que a IA gera é impressionante. Parece que um especialista sênior escreveu cada post.', stars: 5 },
  { name: 'Rafael Costa', role: 'Founder · StartupLab', av: 'RC', text: 'O agendamento inteligente nos dá 3× mais engajamento. Melhor ROI que já tive em uma ferramenta.', stars: 5 },
]

// ─── Landing ──────────────────────────────────────────────────────────────────

export default function Landing({ onNavigate, user, initialPricing }: { onNavigate: (p: string) => void; user: any; initialPricing?: boolean }) {
  const [showPricing, setShowPricing] = useState(!!initialPricing)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    api.metrics()
      .then((data) => {
        setMetrics(data)
      })
      .catch((err) => {
        console.error('Failed to fetch metrics:', err)
      })
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fafafa', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>
      <AuroraBackground />
      <ParticleField />
      <ScrollBar />

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 2, width: '100%', zIndex: 100, background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ArxLogo size={32} glow />
            <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: 9999, border: '1px solid rgba(16,185,129,0.25)' }}>BETA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <NavLink onClick={() => setShowPricing(!showPricing)}>Preços</NavLink>
            {user ? (
              <MagneticBtn primary onClick={() => onNavigate('dashboard')}>Dashboard →</MagneticBtn>
            ) : (
              <>
                <NavLink onClick={() => onNavigate('login')}>Entrar</NavLink>
                <MagneticBtn primary onClick={() => onNavigate('signup')}>Começar Grátis</MagneticBtn>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '132px 24px 80px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 9999, padding: '7px 16px', fontSize: '0.75rem', color: '#34d399', fontWeight: 600, marginBottom: 28, animation: 'fadeInDown 0.6s ease both' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'blink 1.5s ease-in-out infinite' }} />
              840+ criadores automatizando conteúdo agora
            </div>

            <h1 style={{ margin: '0 0 22px', fontSize: 'clamp(2.5rem,4.5vw,3.75rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.035em', animation: 'fadeInUp 0.6s 0.1s ease both' }}>
              Seu conteúdo<br />
              no piloto<br />
              <Typewriter words={['automático.', 'inteligente.', 'aprovado.', 'publicado.']} />
            </h1>

            <p style={{ margin: '0 0 36px', fontSize: '1.125rem', color: '#71717a', lineHeight: 1.72, maxWidth: 460, animation: 'fadeInUp 0.6s 0.2s ease both' }}>
              IA gera posts para <strong style={{ color: '#c4b5fd' }}>LinkedIn</strong>, <strong style={{ color: '#c4b5fd' }}>Instagram</strong> e <strong style={{ color: '#c4b5fd' }}>GitHub</strong>. Você aprova pelo WhatsApp em segundos. Zero esforço manual.
            </p>

            <div style={{ display: 'flex', gap: 14, animation: 'fadeInUp 0.6s 0.3s ease both' }}>
              <MagneticBtn primary large onClick={() => onNavigate('signup')}>Começar Grátis →</MagneticBtn>
              <MagneticBtn large onClick={() => setShowPricing(true)}>Ver Planos</MagneticBtn>
            </div>

            <div style={{ display: 'flex', gap: 22, marginTop: 28, fontSize: '0.8125rem', color: '#3f3f46', animation: 'fadeInUp 0.6s 0.4s ease both' }}>
              {['🚀 Sem cartão', '✅ Cancele quando quiser', '⚡ 5 min de setup'].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', animation: 'fadeInRight 0.9s 0.15s ease both' }}>
            <LiveMockup />
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ position: 'relative', zIndex: 1 }}><Ticker /></div>

      {/* ── STATS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'rgba(255,255,255,0.03)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          {(metrics ? [
            { value: metrics.total_posts || 0, suffix: '+', label: 'posts publicados' },
            { value: metrics.total_videos || 0, suffix: '+', label: 'vídeos gerados' },
            { value: metrics.total_users || 0, suffix: '+', label: 'usuários ativos' },
            { value: 3.2, suffix: 'h', label: 'economizados por dia' },
          ] : STATS).map((s, i) => (
            <div key={i} style={{ padding: '32px 20px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'background 0.2s' }} onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(16,185,129,0.05)')} onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg,#fafafa,#a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#52525b', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHATSAPP SECTION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#25d366', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 14 }}>Aprovação Instantânea</span>
            <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              Você toca.<br />
              <span style={{ color: '#25d366' }}>A IA publica.</span>
            </h2>
            <p style={{ margin: '0 0 32px', color: '#71717a', fontSize: '1.0625rem', lineHeight: 1.7 }}>
              Cada post gerado chega no seu WhatsApp antes de publicar. Um toque para aprovar, outro para rejeitar. Controle total sem abrir nenhum dashboard.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['✦', 'Preview visual completo com todos os slides'],
                ['✦', 'Aprovar ou rejeitar em um toque'],
                ['✦', 'Solicitar nova versão com feedback por texto'],
                ['✦', 'Agendamento automático no melhor horário'],
              ].map(([dot, text]) => (
                <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.9375rem', color: '#a1a1aa' }}>
                  <span style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }}>{dot}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(circle, rgba(37,211,102,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
              <WAChat />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 14 }}>Recursos</span>
            <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>Construído para escala</h2>
            <p style={{ margin: 0, color: '#71717a', fontSize: '1rem' }}>Tudo que você precisa para publicar em volume sem perder qualidade</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {FEATURES.map((f, i) => (
              <TiltCard key={i} accent={f.accent} style={{ padding: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.accent}15`, border: `1px solid ${f.accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ margin: '0 0 10px', fontSize: '0.9375rem', fontWeight: 700, color: '#fafafa' }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#71717a', lineHeight: 1.65 }}>{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENSHOT STRIP ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 0 80px', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', padding: '64px 24px 32px' }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 900, letterSpacing: '-0.025em' }}>Interface feita para produtividade</h2>
        </div>
        <div style={{ display: 'flex', gap: 20, animation: 'scrollLeft 28s linear infinite', width: 'max-content', padding: '4px 20px' }}>
          {[
            { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=420&h=268&fit=crop&auto=format', label: 'Análises' },
            { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=420&h=268&fit=crop&auto=format', label: 'Calendário' },
            { url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=420&h=268&fit=crop&auto=format', label: 'Performance' },
            { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=420&h=268&fit=crop&auto=format', label: 'Modelos' },
            { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=420&h=268&fit=crop&auto=format', label: 'Geração com IA' },
            { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=420&h=268&fit=crop&auto=format', label: 'Análises' },
            { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=420&h=268&fit=crop&auto=format', label: 'Calendário' },
            { url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=420&h=268&fit=crop&auto=format', label: 'Performance' },
          ].map((img, i) => (
            <div key={i} style={{ flexShrink: 0, width: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', transition: 'transform 0.3s, border-color 0.3s' }} onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'scale(1.03)'; d.style.borderColor = 'rgba(16,185,129,0.35)' }} onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'none'; d.style.borderColor = 'rgba(255,255,255,0.08)' }}>
              <img src={img.url} alt={img.label} style={{ width: '100%', height: 230, objectFit: 'cover', display: 'block', filter: 'brightness(0.65) saturate(0.8)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.75))' }} />
              <div style={{ position: 'absolute', bottom: 14, left: 16, fontSize: '0.8125rem', fontWeight: 700, color: '#fafafa' }}>{img.label}</div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 28, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 5, background: 'rgba(0,0,0,0.4)' }}>
                {['#ef4444','#f59e0b','#22c55e'].map((c, j) => <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      {showPricing && (
        <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Pricing onNavigate={onNavigate} user={user} plan={null} />
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>Quem usa, aprova</h2>
            <p style={{ margin: 0, color: '#71717a', fontSize: '1rem' }}>Sem post patrocinado. Feedback real de usuários reais.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <TiltCard key={i} accent="#10b981" style={{ padding: 28 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: t.stars }).map((_, j) => <span key={j} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ margin: '0 0 22px', color: '#a1a1aa', lineHeight: 1.72, fontSize: '0.9375rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#fff', border: '2px solid rgba(16,185,129,0.4)' }}>{t.av}</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fafafa' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#52525b' }}>{t.role}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 110px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <TiltCard accent="#10b981" style={{ padding: '60px 48px', textAlign: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 60%)', pointerEvents: 'none', borderRadius: 20 }} />
            <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(1.75rem,3vw,2.75rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>
              Pronto para publicar<br />no piloto automático?
            </h2>
            <p style={{ margin: '0 0 36px', color: '#71717a', fontSize: '1.0625rem', lineHeight: 1.65 }}>
              Comece grátis. Publique seu primeiro post automatizado em menos de 5 minutos.
            </p>
            <MagneticBtn primary large onClick={() => onNavigate('signup')}>
              Criar Conta Gratuita →
            </MagneticBtn>
            <p style={{ margin: '14px 0 0', fontSize: '0.75rem', color: '#3f3f46' }}>Sem cartão de crédito • Cancele quando quiser</p>
          </TiltCard>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
            {/* Marca */}
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <ArxLogo size={30} glow />
              </div>
              <p style={{ margin: 0, color: '#52525b', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                IA gera posts para LinkedIn, Instagram e GitHub. Você aprova pelo WhatsApp em segundos.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                {[
                  { label: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z' },
                  { label: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                  { label: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                ].map(s => (
                  <a key={s.label} href="#" aria-label={s.label} style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', transition: 'all 0.2s' }}
                     onMouseEnter={e => { const d = e.currentTarget; d.style.color = '#10b981'; d.style.borderColor = 'rgba(16,185,129,0.4)'; d.style.background = 'rgba(16,185,129,0.1)' }}
                     onMouseLeave={e => { const d = e.currentTarget; d.style.color = '#71717a'; d.style.borderColor = 'rgba(255,255,255,0.08)'; d.style.background = 'rgba(255,255,255,0.05)' }}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fafafa', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Produto</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <FooterLink onClick={() => setShowPricing(true)}>Preços</FooterLink>
                  <FooterLink onClick={() => onNavigate('signup')}>Começar Grátis</FooterLink>
                  <FooterLink onClick={() => onNavigate('login')}>Entrar</FooterLink>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fafafa', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recursos</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <FooterLink onClick={() => setShowPricing(true)}>Geração com IA</FooterLink>
                  <FooterLink onClick={() => setShowPricing(true)}>Aprovação WhatsApp</FooterLink>
                  <FooterLink onClick={() => setShowPricing(true)}>Templates</FooterLink>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fafafa', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legal</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <FooterLink onClick={() => alert('Termos de Uso — em breve.')}>Termos de Uso</FooterLink>
                  <FooterLink onClick={() => alert('Política de Privacidade — em breve.')}>Privacidade</FooterLink>
                  <FooterLink onClick={() => alert('Contato: contato@arxfactory.io')}>Contato</FooterLink>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: '0.75rem', color: '#3f3f46' }}>© 2026 Arx Content Factory. Todos os direitos reservados.</span>
            <span style={{ fontSize: '0.75rem', color: '#3f3f46' }}>Feito com 💜 no Brasil</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

function NavLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: 'none', border: 'none', color: h ? '#fafafa' : '#71717a', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500, transition: 'color 0.15s', fontFamily: 'Inter, sans-serif' }}>
      {children}
    </button>
  )
}

function FooterLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: 'none', border: 'none', color: h ? '#a1a1aa' : '#3f3f46', cursor: 'pointer', transition: 'color 0.15s', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem' }}>
      {children}
    </button>
  )
}
