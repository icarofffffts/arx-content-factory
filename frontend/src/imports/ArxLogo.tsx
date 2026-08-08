import { useId } from 'react'

interface ArxLogoProps {
  size?: number
  showWordmark?: boolean
  wordmarkColor?: string
  glow?: boolean
}

// AP monogram — same geometric interlocking language as the Arx Developers "AD" logo.
// Structure: bold orange "A" triangle on top; white thick diagonal left-leg, white vertical
// right-leg (doubles as P's stem); white crossbar that notches into the P bowl;
// orange P-bowl (ring shape via evenodd) sitting flush with the A on the right.
export default function ArxLogo({
  size = 32,
  showWordmark = true,
  wordmarkColor = '#F2EFE8',
  glow = false,
}: ArxLogoProps) {
  const raw = useId()
  const uid = raw.replace(/:/g, '')

  // viewBox is 108 × 100 (slightly wider than tall to fit the P bowl)
  const svgW = size
  const svgH = Math.round(size * (100 / 108))

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.32, flexShrink: 0 }}>
      <svg
        width={svgW}
        height={svgH}
        viewBox="0 0 108 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          display: 'block',
          filter: glow
            ? 'drop-shadow(0 0 6px rgba(147,102,57,0.8)) drop-shadow(0 0 14px rgba(147,102,57,0.4))'
            : 'none',
        }}
      >
        <defs>
          {/* Orange gradient — top-left light to bottom-right deep */}
          <linearGradient id={`ap-g-${uid}`} x1="0" y1="0" x2="108" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A68A64" />
            <stop offset="55%" stopColor="#936639" />
            <stop offset="100%" stopColor="#7F4F24" />
          </linearGradient>
        </defs>

        {/* ── A triangle (orange fill) ─────────────────────────── */}
        {/* Apex at (46, 6); base spans (8, 65) → (88, 65) — same bold proportions as AD mark */}
        <polygon
          points="46,6 8,65 88,65"
          fill={`url(#ap-g-${uid})`}
        />

        {/* ── P bowl (orange ring via evenodd) ─────────────────── */}
        {/* Outer arc: x 72→108, y 12→64; Inner arc (hole): x 78→100, y 20→56  */}
        {/* The bowl shares its left edge (x 72-88) with the A's right-base region. */}
        <path
          fillRule="evenodd"
          d={[
            // Outer: top-left → right → down-curve → back-left  (clockwise)
            'M72,12 L88,12',
            'Q108,12 108,38',
            'Q108,64 88,64',
            'L72,64 Z',
            // Inner hole: bottom-left → right → up-curve → back-left  (also clockwise → evenodd creates hole)
            'M78,56 L86,56',
            'Q100,56 100,38',
            'Q100,20 86,20',
            'L78,20 Z',
          ].join(' ')}
          fill={`url(#ap-g-${uid})`}
        />

        {/* ── Left leg — thick white diagonal (like A's left stroke in AD logo) */}
        {/* Goes from A base-left (8,65) down-left to bottom edge */}
        <polygon points="8,65 25,65 15,98 -1,98" fill="white" />

        {/* ── Right leg / P stem — thick white vertical */}
        {/* Shared spine for both the A's right side and the P's vertical stroke */}
        <polygon points="72,65 88,65 88,98 72,98" fill="white" />

        {/* ── Crossbar — white horizontal bar */}
        {/* Connects the two legs; right edge (x=81) cuts into the P bowl creating the interlock notch */}
        <rect x="3" y="73" width="78" height="11" fill="white" />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: size * 0.1, lineHeight: 1 }}>
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 900,
              fontSize: size * 0.53,
              color: wordmarkColor,
              letterSpacing: '-0.03em',
            }}
          >
            arx
          </span>
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 400,
              fontSize: size * 0.44,
              color: wordmarkColor,
              opacity: 0.6,
              letterSpacing: '0.01em',
            }}
          >
            publish
          </span>
        </div>
      )}
    </div>
  )
}
