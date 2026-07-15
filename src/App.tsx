import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import Home from './views/Home'
import CaseStudy from './views/CaseStudy'
import CommandPalette from './components/CommandPalette'
import Preloader from './components/Preloader'
import NotFound from './components/NotFound'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'

export default function App() {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()

  // Lenis smooth scroll — app-wide so every route feels the same. Skipped for
  // reduced motion, where native (instant) scrolling is the right behavior.
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ autoRaf: true, anchors: true })
    return () => lenis.destroy()
  }, [reduced])

  // Route changes: honor #hash targets (e.g. /#work from a case page),
  // otherwise start at the top.
  useEffect(() => {
    if (location.hash) {
      const t = setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    // reducedMotion="user" makes every animation instant when the visitor's OS
    // requests reduced motion — an accessibility guard across the whole site.
    <MotionConfig reducedMotion="user">
      <Preloader />
      <CommandPalette />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:id" element={<CaseStudy />} />
        {/* Old multi-view routes — keep deep links alive */}
        <Route path="/poker" element={<Navigate to="/" replace />} />
        <Route path="/chess" element={<Navigate to="/" replace />} />
        <Route path="/straight" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MotionConfig>
  )
}
