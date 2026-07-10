import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

type Pt = [number, number, number] // x(-1..1), y(-1..1), brightness(0..1)
interface FaceData {
  w: number
  h: number
  p: Pt[]
}

/**
 * Renders a face as a cloud of gold particles (data baked from a photo). The
 * points assemble on load, drift gently, and scatter away from the cursor.
 * Pure canvas 2D — no 3D dependency. Reduced motion draws a static portrait.
 */
export default function ParticleFace({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let particles: {
      hx: number; hy: number; x: number; y: number
      vx: number; vy: number; b: number
    }[] = []
    let W = 0, H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999 }
    let data: FaceData | null = null

    const layout = () => {
      if (!data) return
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      W = cssW * dpr
      H = cssH * dpr
      canvas.width = W
      canvas.height = H
      const faceAspect = data.w / data.h
      const availH = H * 0.94
      const availW = W * 0.94
      let faceH = Math.min(availH, availW / faceAspect)
      const faceW = faceH * faceAspect
      const cx = W / 2
      const cy = H / 2
      particles = data.p.map(([x, y, b]) => {
        const hx = cx + x * (faceW / 2)
        const hy = cy + y * (faceH / 2)
        return {
          hx, hy,
          x: reduced ? hx : cx + (Math.random() - 0.5) * W,
          y: reduced ? hy : cy + (Math.random() - 0.5) * H,
          vx: 0, vy: 0, b,
        }
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const repelR = 70 * dpr
      for (const p of particles) {
        // spring home
        let ax = (p.hx - p.x) * 0.02
        let ay = (p.hy - p.y) * 0.02
        // cursor repel
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < repelR * repelR) {
          const d = Math.sqrt(d2) || 1
          const f = ((repelR - d) / repelR) * 4
          ax += (dx / d) * f
          ay += (dy / d) * f
        }
        p.vx = (p.vx + ax) * 0.84
        p.vy = (p.vy + ay) * 0.84
        p.x += p.vx
        p.y += p.vy
        ctx.fillStyle = `rgba(232,195,122,${0.28 + p.b * 0.6})`
        const s = (0.7 + p.b * 1.1) * dpr
        ctx.fillRect(p.x, p.y, s, s)
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) * dpr
      mouse.y = (e.clientY - r.top) * dpr
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    fetch('/face-particles.json')
      .then((r) => r.json())
      .then((d: FaceData) => {
        data = d
        layout()
        draw()
      })

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', layout)
    canvas.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', layout)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  return <canvas ref={canvasRef} aria-label="Portrait of Aakash, rendered as particles" className={className} />
}
