---
version: alpha
name: Arx Content Factory
description: Dark premium dashboard for social content automation. 21st.dev style — violet accent, zinc-950 surfaces, glass cards, aurora mesh background.
colors:
  primary: "#8b5cf6"
  primary-light: "#a78bfa"
  primary-dark: "#6d28d9"
  primary-glow: "rgba(139,92,246,0.35)"
  surface-950: "#0a0a0a"
  surface-900: "#0f0f0f"
  surface-800: "#1a1a1a"
  surface-700: "#27272a"
  surface-600: "#3f3f46"
  border: "rgba(255,255,255,0.06)"
  border-accent: "rgba(139,92,246,0.3)"
  text-primary: "#fafafa"
  text-secondary: "#a1a1aa"
  text-muted: "#71717a"
  accent: "#8b5cf6"
  accent-light: "#a78bfa"
  success: "#22c55e"
  success-bg: "rgba(34,197,94,0.1)"
  warning: "#f59e0b"
  warning-bg: "rgba(245,158,11,0.1)"
  error: "#ef4444"
  error-bg: "rgba(239,68,68,0.1)"
  info: "#3b82f6"
  info-bg: "rgba(59,130,246,0.1)"
  bg-aurora: "#0a0a0a"
typography:
  font-family: "Inter, system-ui, sans-serif"
  font-mono: "JetBrains Mono, monospace"
  h1:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  h3:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 40px
components:
  card-glass:
    backgroundColor: "rgba(15,15,15,0.6)"
    borderColor: "rgba(255,255,255,0.06)"
    borderWidth: 1px
    borderStyle: solid
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    backdropFilter: "blur(12px)"
  btn-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    fontSize: "{typography.button.fontSize}"
    fontWeight: "{typography.button.fontWeight}"
    hoverBackgroundColor: "{colors.primary-dark}"
  btn-secondary:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "{colors.text-primary}"
    borderColor: "rgba(255,255,255,0.1)"
    borderWidth: 1px
    borderStyle: solid
    rounded: "{rounded.md}"
    padding: "10px 20px"
    fontSize: "{typography.button.fontSize}"
    fontWeight: "{typography.button.fontWeight}"
  btn-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    fontSize: "{typography.button.fontSize}"
    fontWeight: "{typography.button.fontWeight}"
  input:
    backgroundColor: "rgba(255,255,255,0.03)"
    borderColor: "rgba(255,255,255,0.1)"
    borderWidth: 1px
    borderStyle: solid
    rounded: "{rounded.md}"
    padding: "10px 14px"
    textColor: "{colors.text-primary}"
    fontSize: "{typography.body.fontSize}"
    focusBorderColor: "{colors.primary}"
  badge:
    fontSize: "0.625rem"
    fontWeight: 700
    padding: "3px 8px"
    rounded: 9999px
    textTransform: uppercase
  tab:
    fontSize: "{typography.caption.fontSize}"
    fontWeight: 500
    padding: "8px 16px"
    borderBottomWidth: 2px
    borderBottomStyle: solid
    borderBottomColor: "transparent"
    activeColor: "{colors.primary}"
    activeBorderColor: "{colors.primary}"
    inactiveColor: "{colors.text-muted}"
  avatar:
    rounded: 9999px
    borderWidth: 2px
    borderColor: "{colors.primary}"
  status-dot:
    width: 8px
    height: 8px
    rounded: 9999px
  glow:
    boxShadow: "0 0 20px {colors.primary-glow}"
  glass:
    backgroundColor: "rgba(255,255,255,0.03)"
    backdropFilter: "blur(8px)"
    borderColor: "rgba(255,255,255,0.06)"
    borderWidth: 1px
    borderStyle: solid
  gradient-aurora:
    background: "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.08) 0%, transparent 50%), {colors.surface-950}"
