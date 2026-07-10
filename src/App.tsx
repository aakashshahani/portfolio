import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Lobby from './components/Lobby'
import CommandPalette from './components/CommandPalette'

// Themed views are lazy-loaded so the lobby paints instantly.
const StraightView = lazy(() => import('./views/StraightView'))
const PokerView = lazy(() => import('./views/PokerView'))
const ChessView = lazy(() => import('./views/ChessView'))

function ViewFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink text-muted">
      <span className="animate-pulse font-mono text-sm tracking-widest">
        shuffling…
      </span>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  // Always start each route at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    // reducedMotion="user" makes every animation instant when the visitor's OS
    // requests reduced motion — an accessibility guard across all views.
    <MotionConfig reducedMotion="user">
      <CommandPalette />
      <Suspense fallback={<ViewFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Lobby />} />
            <Route path="/poker" element={<PokerView />} />
            <Route path="/chess" element={<ChessView />} />
            <Route path="/straight" element={<StraightView />} />
            <Route path="*" element={<Lobby />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </MotionConfig>
  )
}
