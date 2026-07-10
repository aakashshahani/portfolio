import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/**
 * A decorative chess clock. White's side ticks (it's White's move all game);
 * purely for flavor. Pauses under reduced-motion.
 */
export default function ChessClock() {
  const reduced = usePrefersReducedMotion()
  const [white, setWhite] = useState(377) // 6:17
  const [black] = useState(298) // 4:58

  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setWhite((w) => (w <= 0 ? 377 : w - 1)), 1000)
    return () => clearInterval(t)
  }, [reduced])

  return (
    <div className="glass inline-flex items-stretch overflow-hidden rounded-xl text-center font-mono">
      <div className="flex flex-col items-center bg-white/5 px-3 py-1.5">
        <span className="text-[9px] uppercase tracking-wider text-muted">White</span>
        <span className="text-sm font-bold text-gold">{fmt(white)}</span>
      </div>
      <div className="flex flex-col items-center px-3 py-1.5 opacity-50">
        <span className="text-[9px] uppercase tracking-wider text-muted">Black</span>
        <span className="text-sm font-bold text-fg">{fmt(black)}</span>
      </div>
    </div>
  )
}
