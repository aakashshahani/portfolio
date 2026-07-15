import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/useSeo'

export default function NotFound() {
  useSeo('404 — Not found', 'That page doesn’t exist. Head back home.')
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hero-bg flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="font-display text-8xl font-semibold tracking-tight sm:text-9xl">
        4<span className="text-gradient-gold">0</span>4
      </p>
      <h1 className="mt-6 font-display text-2xl font-semibold">Nothing here.</h1>
      <p className="mt-2 max-w-sm text-muted">
        This page doesn’t exist — or it did, and it’s been redesigned away.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
      >
        Back home
      </Link>
    </motion.main>
  )
}
