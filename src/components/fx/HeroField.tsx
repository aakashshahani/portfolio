import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/**
 * A measured grid of gold points behind the hero that repels from the cursor
 * and springs back — the one "field" effect on the site. Canvas 2D (no WebGL
 * dependency), paused off-screen, skipped entirely on reduced motion.
 */
export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    type Pt = { x: number; y: number; ox: number; oy: number; vx: number; vy: number }
    let pts: Pt[] = []
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const mouse = { x: -9999, y: -9999 }
    const SPACING = 60
    const RADIUS = 150

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pts = []
      for (let x = SPACING / 2; x < w; x += SPACING)
        for (let y = SPACING / 2; y < h; y += SPACING)
          pts.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 })
    }
    resize()

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d = Math.hypot(dx, dy)
        if (d < RADIUS && d > 0.01) {
          const f = (1 - d / RADIUS) * 1.5
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.vx += (p.ox - p.x) * 0.02
        p.vy += (p.oy - p.y) * 0.02
        p.vx *= 0.86
        p.vy *= 0.86
        p.x += p.vx
        p.y += p.vy
        const disp = Math.hypot(p.x - p.ox, p.y - p.oy)
        const alpha = Math.min(0.6, 0.12 + disp * 0.025)
        ctx.fillStyle = `rgba(232, 195, 122, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      if (visible) draw()
      raf = requestAnimationFrame(loop)
    }
    loop()

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [reduced])

  if (reduced) return null
  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />
}
