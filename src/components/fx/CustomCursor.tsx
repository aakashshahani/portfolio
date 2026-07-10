import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/**
 * A subtle accent ring that trails the cursor (native cursor kept for
 * usability). Grows over interactive elements. Disabled on touch / reduced
 * motion. `glyph` themes it per view (♠, ♟, etc.).
 */
export default function CustomCursor({
  color = '#e8c37a',
  glyph,
}: {
  color?: string
  glyph?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 })

  useEffect(() => {
    if (reduced) return
    // pointer:fine only (skip touch)
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = e.target as HTMLElement
      setActive(!!el.closest('a, button, [role="button"], input'))
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [reduced, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] grid place-items-center"
      style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="grid place-items-center rounded-full border"
        animate={{
          width: active ? 44 : 26,
          height: active ? 44 : 26,
          borderColor: color,
          backgroundColor: active ? `${color}22` : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ borderColor: color }}
      >
        {glyph && (
          <span
            className="text-[10px] leading-none opacity-70"
            style={{ color }}
          >
            {glyph}
          </span>
        )}
      </motion.div>
    </motion.div>
  )
}
