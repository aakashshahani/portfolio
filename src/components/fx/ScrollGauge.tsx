import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * A fixed ruler along the left edge with a gold needle marking scroll
 * progress and a live percentage readout. Desktop only.
 */
export default function ScrollGauge() {
  const { scrollYProgress } = useScroll()
  const top = useTransform(scrollYProgress, (v) => `${v * 100}%`)
  const pct = useTransform(
    scrollYProgress,
    (v) => String(Math.min(99, Math.round(v * 100))).padStart(2, '0'),
  )

  return (
    <div aria-hidden className="fixed left-0 top-0 z-40 hidden h-screen w-8 lg:block">
      <div className="ruler-y absolute inset-y-0 left-0 w-2" />
      <div className="ruler-y-major absolute inset-y-0 left-0 w-3.5" />
      <motion.div
        style={{ top }}
        className="absolute left-0 flex -translate-y-1/2 items-center gap-1.5"
      >
        <span className="h-px w-5 bg-gold" />
        <motion.span className="font-mono text-[9px] tabular-nums text-gold">
          {pct}
        </motion.span>
      </motion.div>
    </div>
  )
}
