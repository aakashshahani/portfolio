import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Lobby from './components/Lobby'
import CommandPalette from './components/CommandPalette'
import BootSequence from './components/BootSequence'
import NotFound from './components/NotFound'
import KonamiEgg from './components/KonamiEgg'

// Themed views are lazy-loaded so the lobby paints instantly.
const StraightView = lazy(() => import('./views/StraightView'))
const PokerView = lazy(() => import('./views/PokerView'))
const ChessView = lazy(() => import('./views/ChessView'))

function ViewFallback() {
  return (
    <div className="felt-bg flex min-h-screen flex-col items-center justify-center gap-4 text-muted">
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
        <span className="absolute inset-0 grid place-items-center text-gold">♠</span>
      </div>
      <span className="animate-pulse font-mono text-xs uppercase tracking-[0.4em]">
        dealing…
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
      <BootSequence />
      <KonamiEgg />
      <CommandPalette />
      <Suspense fallback={<ViewFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Lobby />} />
            <Route path="/poker" element={<PokerView />} />
            <Route path="/chess" element={<ChessView />} />
            <Route path="/straight" element={<StraightView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </MotionConfig>
  )
}
