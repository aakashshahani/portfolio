import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { play } from '../lib/sound'

const CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
]

/** Konami code → it rains a royal flush. A little reward for the curious. */
export default function KonamiEgg() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    let idx = 0
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      idx = k === CODE[idx] ? idx + 1 : k === CODE[0] ? 1 : 0
      if (idx === CODE.length) {
        idx = 0
        setActive(true)
        play('win')
        setTimeout(() => setActive(false), 4000)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const suits = Array.from({ length: 40 }, (_, i) => ({
    s: ['♠', '♥', '♦', '♣'][i % 4],
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    dur: 2.5 + Math.random() * 2,
    size: 1 + Math.random() * 1.8,
  }))

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[250] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* dark scrim so the effect reads clearly over any section */}
          <div
            aria-hidden
            className="absolute inset-0 backdrop-blur-[2px]"
            style={{
              background:
                'radial-gradient(60% 50% at 50% 50%, rgba(0,0,0,0.72), rgba(0,0,0,0.45))',
            }}
          />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <div
              className="text-gradient-gold font-display text-5xl font-black sm:text-7xl"
              style={{ filter: 'drop-shadow(0 4px 24px rgba(232,195,122,0.55))' }}
            >
              Royal Flush!
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.5em] text-gold-soft">
              you found the nuts
            </div>
          </motion.div>
          {suits.map((c, i) => (
            <motion.span
              key={i}
              className={c.s === '♥' || c.s === '♦' ? 'text-card-red' : 'text-gold'}
              style={{ position: 'absolute', left: `${c.x}%`, top: '-8%', fontSize: `${c.size}rem` }}
              initial={{ y: '-10vh', rotate: 0, opacity: 0 }}
              animate={{ y: '110vh', rotate: 360, opacity: [0, 1, 1, 0] }}
              transition={{ duration: c.dur, delay: c.delay, ease: 'easeIn' }}
            >
              {c.s}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
