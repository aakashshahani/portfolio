import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { play } from '../lib/sound'

const KEY = 'as-booted'

/**
 * A short "shuffle & deal" intro that plays once per session before the lobby.
 * Skipped entirely under reduced motion or on repeat visits.
 */
export default function BootSequence() {
  const reduced = usePrefersReducedMotion()
  const [show, setShow] = useState(false)

  useEffect(() => {
    let booted = false
    try {
      booted = sessionStorage.getItem(KEY) === '1'
    } catch {
      /* ignore */
    }
    if (booted || reduced) return
    setShow(true)
    play('deal')
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* ignore */
      }
      setShow(false)
    }, 1900)
    return () => clearTimeout(t)
  }, [reduced])

  const cards = ['♠', '♥', '♦', '♣', '♠']

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="felt-bg fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
        >
          {/* deck fanning out (pixel-based centering so framer interpolates cleanly) */}
          <div className="relative mb-8 h-32 w-64">
            {cards.map((s, i) => {
              const spread = (i - 2) * 42
              const red = s === '♥' || s === '♦'
              return (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 flex h-28 w-20 items-center justify-center rounded-xl border border-gold/30 bg-white shadow-2xl"
                  initial={{ x: -40, y: -56, rotate: 0, opacity: 0, scale: 0.7 }}
                  animate={{
                    x: -40 + spread,
                    y: -56,
                    rotate: (i - 2) * 8,
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 120, damping: 14 }}
                >
                  <span className={`text-3xl ${red ? 'text-card-red' : 'text-ink'}`}>{s}</span>
                </motion.div>
              )
            })}
          </div>

          <motion.p
            className="font-display text-2xl font-black tracking-[0.3em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <span className="text-gradient-gold">AAKASH SHAHANI</span>
          </motion.p>
          <motion.p
            className="mt-2 font-mono text-xs uppercase tracking-[0.4em] text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            shuffling the deck…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
