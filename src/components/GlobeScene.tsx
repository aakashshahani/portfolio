import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

/**
 * The journey, visualized: a night-earth globe with gold arcs tracing
 * Hong Kong → Hyderabad → Tampa, radar rings at each city, and a gold dart
 * flying the route on a loop. Reports flight status upward so the page can
 * highlight the active stop. Lazy-loaded (three.js in its own chunk).
 */

export interface FlightStatus {
  /** index into the stops the plane is at / heading to */
  index: number
  flying: boolean
  from?: string
  to?: string
  at?: string
}

const STOPS = [
  { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
  { lat: 17.385, lng: 78.4867, name: 'Hyderabad' },
  { lat: 27.9506, lng: -82.4572, name: 'Tampa' },
]

const ARCS = [
  { startLat: STOPS[0].lat, startLng: STOPS[0].lng, endLat: STOPS[1].lat, endLng: STOPS[1].lng },
  { startLat: STOPS[1].lat, startLng: STOPS[1].lng, endLat: STOPS[2].lat, endLng: STOPS[2].lng },
]

const D2R = Math.PI / 180
const R2D = 180 / Math.PI

/** Angular distance between two stops (radians). */
function angDist(a: (typeof STOPS)[number], b: (typeof STOPS)[number]) {
  const φ1 = a.lat * D2R
  const φ2 = b.lat * D2R
  const dφ = (b.lat - a.lat) * D2R
  const dλ = (b.lng - a.lng) * D2R
  const s =
    Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2
  return 2 * Math.asin(Math.min(1, Math.sqrt(s)))
}

/** Intermediate point along the great circle at fraction t. */
function gcPoint(
  a: (typeof STOPS)[number],
  b: (typeof STOPS)[number],
  t: number,
) {
  const Δ = angDist(a, b)
  if (Δ === 0) return { lat: a.lat, lng: a.lng }
  const φ1 = a.lat * D2R
  const λ1 = a.lng * D2R
  const φ2 = b.lat * D2R
  const λ2 = b.lng * D2R
  const A = Math.sin((1 - t) * Δ) / Math.sin(Δ)
  const B = Math.sin(t * Δ) / Math.sin(Δ)
  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2)
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2)
  const z = A * Math.sin(φ1) + B * Math.sin(φ2)
  return { lat: Math.atan2(z, Math.hypot(x, y)) * R2D, lng: Math.atan2(y, x) * R2D }
}

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

// Flight tuning
const ARC_ALT = 0.28
const GROUND_ALT = 0.025
const PAUSE_MS = 1500
const HOME_PAUSE_MS = 2400 // longer layover in Tampa before the loop restarts
const legDuration = (i: number) =>
  Math.min(7000, 1600 + 2600 * angDist(STOPS[i], STOPS[i + 1]))

export default function GlobeScene({
  onStatus,
}: {
  onStatus?: (s: FlightStatus) => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const reduced = usePrefersReducedMotion()
  const [size, setSize] = useState({ w: 0, h: 0 })
  const statusRef = useRef(onStatus)
  statusRef.current = onStatus
  const stopFlight = useRef<(() => void) | null>(null)

  // Track the container so the WebGL canvas always fits it.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => () => stopFlight.current?.(), [])

  const onReady = () => {
    const g = globeRef.current
    if (!g) return
    const controls = g.controls()
    controls.enableZoom = false
    controls.autoRotate = !reduced
    controls.autoRotateSpeed = 0.5
    // Start framed on the middle of the route.
    g.pointOfView({ lat: 22, lng: 96, altitude: 2.1 }, 0)

    if (reduced) return
    stopFlight.current?.() // StrictMode double-mount guard

    // The plane: a flattened gold dart, nose pointing +Z so lookAt() steers it.
    const geom = new THREE.ConeGeometry(1.3, 4.2, 4)
    geom.rotateX(Math.PI / 2)
    const mat = new THREE.MeshBasicMaterial({
      color: 0xf4dca6,
      transparent: true,
      opacity: 0.95,
    })
    const plane = new THREE.Mesh(geom, mat)
    plane.scale.set(1, 0.4, 1)
    g.scene().add(plane)

    const park = (i: number) => {
      const c = g.getCoords(STOPS[i].lat, STOPS[i].lng, GROUND_ALT)
      plane.position.set(c.x, c.y, c.z)
    }

    let at = 0 // stop the plane is at (or departing from)
    let phase: 'pause' | 'fly' = 'pause'
    let phaseStart = performance.now()
    let raf = 0
    park(0)
    statusRef.current?.({ index: 0, flying: false, at: STOPS[0].name })

    const tick = (now: number) => {
      const elapsed = now - phaseStart
      const lastStop = at === STOPS.length - 1

      if (phase === 'pause') {
        const pauseLen = lastStop ? HOME_PAUSE_MS : PAUSE_MS
        // At the end of the route: fade out, teleport home, fade back in.
        if (lastStop) {
          const fadeOut = Math.max(0, elapsed - (pauseLen - 600)) / 600
          mat.opacity = 0.95 * (1 - fadeOut)
        } else {
          mat.opacity = Math.min(0.95, mat.opacity + 0.05)
        }
        if (elapsed >= pauseLen) {
          if (lastStop) {
            at = 0
            park(0)
            phase = 'pause'
            phaseStart = now
            statusRef.current?.({ index: 0, flying: false, at: STOPS[0].name })
          } else {
            phase = 'fly'
            phaseStart = now
            statusRef.current?.({
              index: at + 1,
              flying: true,
              from: STOPS[at].name,
              to: STOPS[at + 1].name,
            })
          }
        }
      } else {
        const dur = legDuration(at)
        const t = Math.min(elapsed / dur, 1)
        const te = easeInOut(t)
        const pos = gcPoint(STOPS[at], STOPS[at + 1], te)
        const alt = GROUND_ALT + ARC_ALT * Math.sin(Math.PI * te)
        const c = g.getCoords(pos.lat, pos.lng, alt)
        const tAhead = Math.min(te + 0.012, 1)
        const ahead = gcPoint(STOPS[at], STOPS[at + 1], tAhead)
        const altAhead = GROUND_ALT + ARC_ALT * Math.sin(Math.PI * tAhead)
        const c2 = g.getCoords(ahead.lat, ahead.lng, altAhead)
        plane.position.set(c.x, c.y, c.z)
        plane.lookAt(c2.x, c2.y, c2.z)
        if (t >= 1) {
          at += 1
          phase = 'pause'
          phaseStart = now
          statusRef.current?.({ index: at, flying: false, at: STOPS[at].name })
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    stopFlight.current = () => {
      cancelAnimationFrame(raf)
      g.scene().remove(plane)
      geom.dispose()
      mat.dispose()
      stopFlight.current = null
    }
  }

  return (
    <div ref={wrapRef} className="h-full w-full cursor-grab active:cursor-grabbing">
      {size.w > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          onGlobeReady={onReady}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="/globe/earth-night.jpg"
          atmosphereColor="#e8c37a"
          atmosphereAltitude={0.16}
          arcsData={ARCS}
          arcColor={() => ['#f4dca6', '#e8c37a']}
          arcAltitude={ARC_ALT}
          arcStroke={0.55}
          arcDashLength={0.45}
          arcDashGap={0.25}
          arcDashAnimateTime={reduced ? 0 : 3200}
          pointsData={STOPS}
          pointColor={() => '#e8c37a'}
          pointAltitude={0.012}
          pointRadius={0.32}
          ringsData={STOPS}
          ringColor={() => (t: number) => `rgba(232, 195, 122, ${Math.max(0, 1 - t)})`}
          ringMaxRadius={3.2}
          ringPropagationSpeed={reduced ? 0 : 1.1}
          ringRepeatPeriod={2400}
          labelsData={STOPS}
          labelLat={(d) => (d as (typeof STOPS)[number]).lat}
          labelLng={(d) => (d as (typeof STOPS)[number]).lng}
          labelText={(d) => (d as (typeof STOPS)[number]).name}
          labelSize={1.3}
          labelDotRadius={0.35}
          labelColor={() => '#ececec'}
          labelAltitude={0.015}
        />
      )}
    </div>
  )
}
