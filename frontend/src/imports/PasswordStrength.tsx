import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

// ─── Regras de senha ──────────────────────────────────────────────────────────

const COMMON = /^(?:password|passw0rd|qwerty|letmein|welcome|admin|iloveyou|monkey|dragon|abc123|111111|123123|123456)/i
const RUN = /(.)\1{3,}/
const RUN_UP = /(?:0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|qwer|wert|erty|asdf)/i
const SYMBOL = /[!-/:-@[-`{-~]/

const CELL = { type: 'spring', stiffness: 520, damping: 34, mass: 0.45 } as const
const CROSSFADE = { type: 'spring', stiffness: 260, damping: 34, mass: 0.8 } as const
const INSTANT = { duration: 0 } as const

export type PasswordRule = { id: string; label: string; test: (value: string) => boolean }
export type EvaluatedRule = PasswordRule & { met: boolean }

export const defaultPasswordRules: readonly PasswordRule[] = [
  { id: 'length', label: '12 caracteres ou mais', test: (v) => v.length >= 12 },
  { id: 'case', label: 'Maiúsculas e minúsculas', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { id: 'digit', label: 'Um número', test: (v) => /\d/.test(v) },
  { id: 'symbol', label: 'Um símbolo', test: (v) => SYMBOL.test(v) },
]

const defaultLabels = ['Vazia', 'Fraca', 'Razoável', 'Boa', 'Forte'] as const

export function usePasswordStrength(
  value: string,
  { rules = defaultPasswordRules, labels = defaultLabels, announceDelay = 700 }: {
    rules?: readonly PasswordRule[]
    labels?: readonly string[]
    announceDelay?: number
  } = {},
) {
  const state = useMemo(() => {
    const evaluated = rules.map((rule) => ({ ...rule, met: rule.test(value) }))
    const passed = evaluated.reduce((n, r) => n + (r.met ? 1 : 0), 0)
    const guessable = value.length > 0 && (COMMON.test(value) || RUN.test(value) || RUN_UP.test(value))
    const score = value.length === 0 ? 0 : guessable ? 1 : Math.min(rules.length, Math.max(1, passed))
    const label = labels[Math.min(score, labels.length - 1)] ?? ''
    const unmet = evaluated.filter((r) => !r.met)
    const announcement = value.length === 0 ? '' : [
      `Força da senha ${label.toLowerCase()}.`,
      guessable ? 'Padrão comumente adivinhado.' : '',
      unmet.length === 0 ? 'Todos os requisitos atendidos.' : `Faltam: ${unmet.map((r) => r.label.toLowerCase()).join(', ')}.`,
    ].filter(Boolean).join(' ')
    return { score, max: rules.length, label, rules: evaluated, guessable, announcement }
  }, [value, rules, labels])

  const [settled, setSettled] = useState('')
  useEffect(() => {
    if (state.announcement === '') { setSettled(''); return }
    const id = setTimeout(() => setSettled(state.announcement), announceDelay)
    return () => clearTimeout(id)
  }, [state.announcement, announceDelay])

  return { ...state, announcement: settled }
}

const TONES = {
  none: { bar: 'rgba(255,255,255,0.15)', text: '#71717a' },
  danger: { bar: '#ef4444', text: '#ef4444' },
  caution: { bar: '#f59e0b', text: '#f59e0b' },
  safe: { bar: '#22c55e', text: '#22c55e' },
} as const

function toneFor(score: number, max: number) {
  if (score === 0) return TONES.none
  const ratio = score / max
  if (ratio <= 0.34) return TONES.danger
  if (ratio <= 0.67) return TONES.caution
  return TONES.safe
}

export function PasswordStrength({ value, rules = defaultPasswordRules, labels = defaultLabels, showRules = true, className = '' }: {
  value: string
  rules?: readonly PasswordRule[]
  labels?: readonly string[]
  showRules?: boolean
  className?: string
}) {
  const { score, max, label, rules: evaluated, guessable } = usePasswordStrength(value, { rules, labels })
  const reduced = useReducedMotion()
  const tone = toneFor(score, max)

  return (
    <div className={className} style={{ width: '100%' }}>
      {/* Barras de força */}
      <div
        role="meter"
        aria-label="Força da senha"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={score}
        aria-valuetext={label}
        style={{ display: 'grid', gap: 6, gridTemplateColumns: `repeat(${max}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{ position: 'relative', height: 6, overflow: 'hidden', borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
            <motion.span
              style={{
                position: 'absolute', inset: 0, transformOrigin: 'left', borderRadius: 2, background: tone.bar,
                transition: 'background-color 0.2s',
              }}
              initial={false}
              animate={{ scaleX: i < score ? 1 : 0 }}
              transition={reduced ? INSTANT : { ...CELL, delay: i < score ? i * 0.03 : 0 }}
            />
          </div>
        ))}
      </div>

      {/* Label + aviso */}
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 20 }}>
        <span style={{ position: 'relative', display: 'inline-grid', fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.25 }}>
          {labels.map((text, i) => (
            <motion.span
              key={text}
              aria-hidden
              style={{ gridColumn: 1, gridRow: 1, whiteSpace: 'nowrap', color: tone.text, transition: 'color 0.2s' }}
              initial={false}
              animate={{ opacity: i === Math.min(score, labels.length - 1) ? 1 : 0 }}
              transition={reduced ? INSTANT : CROSSFADE}
            >
              {text}
            </motion.span>
          ))}
        </span>
        <motion.span
          aria-hidden
          style={{ whiteSpace: 'nowrap', fontSize: '0.6875rem', color: '#f59e0b' }}
          initial={false}
          animate={{ opacity: guessable ? 1 : 0 }}
          transition={reduced ? INSTANT : CROSSFADE}
        >
          Comum de adivinhar
        </motion.span>
      </div>

      {/* Regras */}
      {showRules && (
        <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
          {evaluated.map((rule) => (
            <li key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ position: 'relative', width: 14, height: 14, borderRadius: 4, border: '1px solid rgba(255,255,255,0.16)', display: 'grid', placeItems: 'center', flexShrink: 0, color: '#0f0f0f' }}>
                <motion.span
                  style={{ position: 'absolute', inset: 0, borderRadius: 3, background: '#22c55e' }}
                  initial={false}
                  animate={{ opacity: rule.met ? 1 : 0 }}
                  transition={reduced ? INSTANT : CROSSFADE}
                />
                <motion.svg
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                  style={{ position: 'relative', width: 9, height: 9 }}
                  initial={false}
                  animate={{ opacity: rule.met ? 1 : 0, scale: rule.met ? 1 : 0.6 }}
                  transition={reduced ? INSTANT : CELL}
                >
                  <path d="M2 6.2 4.7 8.9 10 3.3" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </span>
              <span style={{ fontSize: '0.75rem', lineHeight: 1.25, transition: 'color 0.2s', color: rule.met ? '#e4e4e7' : '#71717a' }}>
                {rule.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PasswordStrength
