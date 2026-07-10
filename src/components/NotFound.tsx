import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/useSeo'

/** A themed 404 — you've wandered off the table. */
export default function NotFound() {
  useSeo('404 — Off the table', 'That page folded. Head back to the lobby.')
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="felt-bg flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        className="flex gap-2"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        {['4', '♠', '4'].map((c, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: -30, rotate: -12 },
              show: { opacity: 1, y: 0, rotate: 0 },
            }}
            className={`font-display text-7xl font-black sm:text-8xl ${
              c === '♠' ? 'text-gradient-gold' : 'text-fg'
            }`}
          >
            {c}
          </motion.span>
        ))}
      </motion.div>
      <h1 className="mt-6 font-display text-2xl font-bold">You folded a bad hand.</h1>
      <p className="mt-2 max-w-sm text-muted">
        This page isn’t at any of the tables. Let’s deal you back in.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition-transform hover:scale-105"
      >
        ♠ Back to the lobby
      </Link>
    </motion.main>
  )
}
