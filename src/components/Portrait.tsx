import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { profile } from '../data/content'

/**
 * Monogram card: a gold initials monogram over a drifting gold glow, with a
 * light mouse parallax (monogram and glow drift in opposite directions) and
 * viewfinder corner ticks.
 */
export default function Portrait({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  // Cursor position normalized to [-0.5, 0.5] over the card.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 16 })
  const sy = useSpring(my, { stiffness: 120, damping: 16 })
  const monoX = useTransform(sx, (v) => v * 12)
  const monoY = useTransform(sy, (v) => v * 8)
  const glowX = useTransform(sx, (v) => v * -30)
  const glowY = useTransform(sy, (v) => v * -18)

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`group relative aspect-[4/5] overflow-hidden border border-line bg-ink-2 ${compact ? 'rounded-lg' : 'rounded-3xl'}`}
    >
      {/* Drifting gold glow */}
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        className="absolute -inset-10"
      >
        <div className="h-full w-full bg-[radial-gradient(55%_45%_at_50%_45%,rgba(232,195,122,0.18),transparent_70%)]" />
      </motion.div>

      {/* Initials monogram (the focal point) */}
      <motion.span
        aria-hidden
        style={{ x: monoX, y: monoY }}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display font-semibold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(232,195,122,0.35)] ${compact ? 'text-[6rem]' : 'text-[13rem]'}`}
      >
        {profile.initials}
      </motion.span>

      {/* Viewfinder corner ticks */}
      <span aria-hidden className="absolute left-4 top-4 h-4 w-4 border-l border-t border-gold/40" />
      <span aria-hidden className="absolute right-4 top-4 h-4 w-4 border-r border-t border-gold/40" />
      <span aria-hidden className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-gold/40" />
      <span aria-hidden className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-gold/40" />

      {!compact && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          {profile.name}
        </span>
      )}
    </div>
  )
}
