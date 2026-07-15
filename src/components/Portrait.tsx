import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { profile } from '../data/content'

/**
 * Layered portrait card: gold glow + watermark behind the cutout headshot,
 * with a light mouse parallax (image and glow drift in opposite directions)
 * and a grayscale→color reveal on hover. The bottom fade anchors the cutout
 * into the card.
 */
export default function Portrait({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  // Cursor position normalized to [-0.5, 0.5] over the card.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 16 })
  const sy = useSpring(my, { stiffness: 120, damping: 16 })
  const imgX = useTransform(sx, (v) => v * 16)
  const imgY = useTransform(sy, (v) => v * 10)
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
        <div className="h-full w-full bg-[radial-gradient(55%_45%_at_50%_38%,rgba(232,195,122,0.16),transparent_70%)]" />
      </motion.div>

      {/* Watermark initials */}
      <span
        aria-hidden
        className={`absolute left-1/2 top-6 -translate-x-1/2 select-none font-display font-semibold leading-none text-transparent [-webkit-text-stroke:1px_rgba(232,195,122,0.14)] ${compact ? 'text-[5rem]' : 'text-[11rem]'}`}
      >
        {profile.initials}
      </span>

      {/* Portrait */}
      <motion.img
        src="/portrait.webp"
        alt={`${profile.name} — portrait`}
        style={{ x: imgX, y: imgY }}
        className="absolute bottom-0 left-1/2 w-[82%] -translate-x-1/2 object-contain grayscale-[35%] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-[filter,transform] duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
      />

      {/* Anchor the cutout into the card */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-2 via-ink-2/60 to-transparent" />

      {/* Viewfinder corner ticks */}
      <span aria-hidden className="absolute left-4 top-4 h-4 w-4 border-l border-t border-gold/40" />
      <span aria-hidden className="absolute right-4 top-4 h-4 w-4 border-r border-t border-gold/40" />
      <span aria-hidden className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-gold/40" />
      <span aria-hidden className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-gold/40" />

      {!compact && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          {profile.name} · {profile.location}
        </span>
      )}
    </div>
  )
}
