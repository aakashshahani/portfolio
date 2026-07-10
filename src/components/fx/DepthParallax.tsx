import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }
`

// Depth-based parallax: displace the color UV by the depth map, driven by the
// pointer, so near features (nose) move more than far ones — a 2.5D "pop".
const FRAG = `
precision highp float;
uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform vec2 uMouse;
uniform float uStrength;
varying vec2 vUv;
void main(){
  vec2 uv = vUv;
  float d = texture2D(uDepth, uv).r;
  vec2 off = (d - 0.5) * uStrength * uMouse;
  d = texture2D(uDepth, uv + off).r;          // one refine pass
  vec2 uv2 = uv + (d - 0.5) * uStrength * uMouse;
  gl_FragColor = texture2D(uColor, uv2);
}
`

function sh(gl: WebGLRenderingContext, t: number, src: string) {
  const s = gl.createShader(t)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}
function tex(gl: WebGLRenderingContext, img: HTMLImageElement) {
  const t = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  return t
}

/**
 * A 2.5D parallax portrait built from a photo + its depth map. Tilts toward the
 * cursor for a real 3D feel. Falls back to a flat image if WebGL is missing or
 * the visitor prefers reduced motion.
 */
export default function DepthParallax({
  color,
  depth,
  className = '',
}: {
  color: string
  depth: string
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!gl) return

    let raf = 0
    let disposed = false
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }

    const load = (src: string) =>
      new Promise<HTMLImageElement>((res) => {
        const i = new Image()
        i.crossOrigin = 'anonymous'
        i.onload = () => res(i)
        i.src = src
      })

    Promise.all([load(color), load(depth)]).then(([cImg, dImg]) => {
      if (disposed) return
      const prog = gl.createProgram()!
      gl.attachShader(prog, sh(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, sh(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      gl.useProgram(prog)

      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'p')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

      gl.activeTexture(gl.TEXTURE0)
      tex(gl, cImg)
      gl.uniform1i(gl.getUniformLocation(prog, 'uColor'), 0)
      gl.activeTexture(gl.TEXTURE1)
      tex(gl, dImg)
      gl.uniform1i(gl.getUniformLocation(prog, 'uDepth'), 1)

      const uMouse = gl.getUniformLocation(prog, 'uMouse')
      const uStrength = gl.getUniformLocation(prog, 'uStrength')
      gl.uniform1f(uStrength, 0.06)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = Math.round(canvas.clientWidth * dpr)
        const h = Math.round(canvas.clientHeight * dpr)
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w
          canvas.height = h
        }
        gl.viewport(0, 0, canvas.width, canvas.height)
      }

      const draw = () => {
        cur.x += (target.x - cur.x) * 0.08
        cur.y += (target.y - cur.y) * 0.08
        resize()
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform2f(uMouse, cur.x, cur.y)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        if (!reduced) raf = requestAnimationFrame(draw)
      }
      draw()
    })

    const onMove = (e: MouseEvent) => {
      if (reduced) return
      const r = canvas.getBoundingClientRect()
      target.x = ((e.clientX - (r.left + r.width / 2)) / r.width) * 2
      target.y = -((e.clientY - (r.top + r.height / 2)) / r.height) * 2
    }
    const onLeave = () => {
      target.x = 0
      target.y = 0
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [color, depth, reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-label="3D portrait of Aakash Shahani"
      className={className}
    />
  )
}
