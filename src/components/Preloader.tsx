import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { PRELOAD_KEY as KEY, willPreload } from '../lib/preload'

/**
 * Once-per-session boot: a metric counting 0 → 100, then the curtain slides
 * up. Under 1.6s total — decoration, never delay. Skipped on reduced motion.
 */
export default function Preloader() {
  const reduced = usePrefersReducedMotion()
  const [shown] = useState(willPreload)
  const [count, setCount] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!shown || reduced) {
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* private mode */
      }
      return
    }
    let raf = 0
    let exitTimer: ReturnType<typeof setTimeout> | undefined
    const t0 = performance.now()
    const DURATION = 900
    const step = (t: number) => {
      const p = Math.min((t - t0) / DURATION, 1)
      setCount(Math.round(p * 100))
      if (p < 1) {
        raf = requestAnimationFrame(step)
      } else {
        try {
          sessionStorage.setItem(KEY, '1')
        } catch {
          /* private mode */
        }
        exitTimer = setTimeout(() => setExiting(true), 150)
      }
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(exitTimer)
    }
  }, [shown, reduced])

  if (!shown || reduced) return null

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[999] flex items-end justify-between bg-ink px-6 pb-8 md:px-10"
          aria-hidden
        >
          <span className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-muted">
            Aakash Shahani — loading instruments
          </span>
          <span className="font-display text-7xl font-semibold tabular-nums text-gradient-gold md:text-8xl">
            {count}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
