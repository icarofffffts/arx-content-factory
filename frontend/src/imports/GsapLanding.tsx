import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/**
 * GSAP animation layer for the Landing page.
 * - Hero entrance timeline (stagger, lines slide-up)
 * - Floating mockup float
 * - GSAP marquee (replaces CSS ticker animation)
 * - ScrollTrigger batch reveals on [data-reveal] sections
 * - Parallax drift on [data-parallax] elements
 * - SplitText line reveals on .split-lines headings
 * Respects prefers-reduced-motion.
 */
export function useGsapLanding(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const q = gsap.utils.selector(el)

      // ── NAV entrance ──
      gsap.from(q('.gs-nav'), { y: -26, opacity: 0, duration: 0.7, ease: 'power3.out' })

      // ── HERO timeline ──
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(q('.gs-badge'), { y: -18, opacity: 0, duration: 0.5 })
        .from(
          q('.gs-hero-line'),
          { yPercent: 70, opacity: 0, duration: 0.75, stagger: 0.12 },
          '-=0.2'
        )
        .from(q('.gs-hero-sub'), { y: 26, opacity: 0, duration: 0.6 }, '-=0.45')
        .from(q('.gs-hero-cta > *'), { y: 18, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.4')
        .from(q('.gs-hero-trust'), { y: 14, opacity: 0, duration: 0.5 }, '-=0.3')
        .from(q('.gs-hero-mock'), { scale: 0.9, y: 36, opacity: 0, duration: 0.9, ease: 'power2.out' }, '-=0.55')

      // ── Mockup gentle float ──
      gsap.to(q('.gs-hero-mock-inner'), {
        y: -12,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      // ── Marquee ticker (GSAP) ──
      const track = q('.ticker-track')[0] as HTMLElement | undefined
      if (track) {
        const tween = gsap.to(track, { xPercent: -50, duration: 20, ease: 'none', repeat: -1 })
        const wrap = track.parentElement
        wrap?.addEventListener('mouseenter', () => tween.pause())
        wrap?.addEventListener('mouseleave', () => tween.play())
      }

      // ── Scroll reveals ──
      q('[data-reveal]').forEach((sec) => {
        const targets = (sec as HTMLElement).children.length
          ? Array.from((sec as HTMLElement).children)
          : [sec]
        gsap.from(targets, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: sec, start: 'top 82%', once: true },
        })
      })

      // ── Parallax drift ──
      q('[data-parallax]').forEach((p) => {
        gsap.to(p, {
          yPercent: -16,
          ease: 'none',
          scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      // ── SplitText headings ──
      const splits: SplitText[] = []
      q('.split-lines').forEach((h) => {
        const split = SplitText.create(h as HTMLElement, {
          type: 'lines',
          linesClass: 'split-line',
        })
        splits.push(split)
        gsap.from(split.lines, {
          yPercent: 115,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: h as HTMLElement, start: 'top 85%', once: true },
        })
      })

      return () => {
        splits.forEach((s) => s.revert())
      }
    },
    { scope: root }
  )
}