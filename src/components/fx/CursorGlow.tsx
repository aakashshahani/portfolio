import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/**
 * A soft light that follows the cursor within its positioned parent — a
 * "table light" / spotlight. Drop inside a `relative`/`overflow-hidden`
 * container. Pointer-events none, so it never blocks interaction.
 */
export default function CursorGlow({
  color = 'rgba(232,195,122,0.14)',
  size = 520,
}: {
  color?: string
  size?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect()
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--gx', `${e.clientX - r.left}px`)
        el.style.setProperty('--gy', `${e.clientY - r.top}px`)
        el.style.opacity = '1'
      })
    }
    const onLeave = () => {
      el.style.opacity = '0'
    }
    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)
    return () => {
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
      style={{
        background: `radial-gradient(${size}px circle at var(--gx, 50%) var(--gy, 20%), ${color}, transparent 70%)`,
      }}
    />
  )
}
