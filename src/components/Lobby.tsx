import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { profile } from '../data/content'
import { useViewMemory } from '../lib/useViewMemory'
import ResumeButton from './ResumeButton'
import SocialLinks from './SocialLinks'
import SoundToggle from './SoundToggle'
import { play } from '../lib/sound'
import { ArrowRight } from './Icons'
import Tilt from './fx/Tilt'
import CursorGlow from './fx/CursorGlow'
import CustomCursor from './fx/CustomCursor'

const tables = [
  {
    to: '/poker',
    glyph: '♠',
    name: 'Poker',
    tagline: '“Deal me in.”',
    desc: 'Projects dealt as cards. Read the table, flip the hand.',
    accent: 'text-gold',
    ring: 'hover:border-gold/60',
    recommended: false,
  },
  {
    to: '/chess',
    glyph: '♟',
    name: 'Chess',
    tagline: '“The whole game.”',
    desc: 'My path as opening, midgame, and endgame.',
    accent: 'text-chip-blue',
    ring: 'hover:border-chip-blue/60',
    recommended: false,
  },
  {
    to: '/straight',
    glyph: '▦',
    name: 'Classic',
    tagline: '“Just the work.”',
    desc: 'Clean, conventional layout. Recruiter-friendly.',
    accent: 'text-fg',
    ring: 'hover:border-white/40',
    recommended: true,
  },
]

// Warm a view's lazy chunk on hover so navigation is instant.
const prefetch = (to: string) => {
  if (to === '/poker') import('../views/PokerView')
  else if (to === '/chess') import('../views/ChessView')
  else if (to === '/straight') import('../views/StraightView')
}

export default function Lobby() {
  const { get } = useViewMemory()
  const navigate = useNavigate()
  const [lastView, setLastView] = useState<string | null>(null)

  useEffect(() => {
    setLastView(get())
  }, [get])

  return (
    <motion.main
      className="felt-bg vignette relative flex min-h-screen flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <CustomCursor />
      <CursorGlow />

      {/* floating suit glyphs in the backdrop */}
      <FloatingSuits />

      {/* top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-display text-lg font-bold tracking-tight">
          <span className="text-gradient-gold">{profile.initials}</span>
        </span>
        <div className="flex items-center gap-3">
          <SocialLinks className="hidden sm:flex" />
          <SoundToggle />
          <ResumeButton />
        </div>
      </header>

      {/* center */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <motion.p
          className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-muted"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {profile.name}
        </motion.p>
        <motion.h1
          className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          Pick your <span className="text-gradient-gold">table.</span>
        </motion.h1>
        <motion.p
          className="mt-4 max-w-md text-balance text-sm text-muted sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          Same story, three ways to play it. {profile.tagline}
        </motion.p>

        {/* the three tables */}
        <div className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {tables.map((t, i) => (
            <motion.div
              key={t.to}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 + i * 0.08, type: 'spring', stiffness: 120, damping: 16 }}
              onHoverStart={() => {
                play('chip')
                prefetch(t.to)
              }}
            >
              <Tilt max={9} className="h-full">
              <Link
                to={t.to}
                onClick={() => play('deal')}
                className={`glass group relative flex h-full flex-col items-center rounded-3xl border border-line p-6 transition-colors duration-300 ${t.ring}`}
              >
                {t.recommended && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                    Recruiter?
                  </span>
                )}
                <span
                  className={`mb-4 text-5xl transition-transform duration-300 group-hover:scale-110 ${t.accent}`}
                >
                  {t.glyph}
                </span>
                <span className="font-display text-xl font-bold text-fg">
                  {t.name}
                </span>
                <span className={`mt-0.5 text-sm ${t.accent}`}>{t.tagline}</span>
                <span className="mt-3 text-xs leading-relaxed text-muted">
                  {t.desc}
                </span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors group-hover:text-fg">
                  Enter <ArrowRight width={14} height={14} />
                </span>
              </Link>
              </Tilt>
            </motion.div>
          ))}
        </div>

        {/* resume-last-view + ⌘K hint */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-3 text-xs text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {lastView && (
            <button
              onClick={() => navigate(`/${lastView}`)}
              className="rounded-full border border-line px-4 py-1.5 transition-colors hover:border-gold/50 hover:text-gold"
            >
              ↩ Resume your {lastView} table
            </button>
          )}
          <span className="flex items-center gap-1.5">
            Press
            <kbd className="rounded border border-line bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-fg">
              ⌘K
            </kbd>
            anywhere to jump around.
          </span>
          <Link
            to="/straight"
            onClick={() => play('deal')}
            className="underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            In a hurry? Skip to the classic résumé view →
          </Link>
        </motion.div>
      </div>
    </motion.main>
  )
}

function FloatingSuits() {
  const suits = ['♠', '♥', '♦', '♣', '♟', '♞']
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {suits.map((s, i) => (
        <motion.span
          key={i}
          className="absolute select-none text-white/[0.03]"
          style={{
            left: `${8 + i * 15}%`,
            top: `${12 + ((i * 37) % 70)}%`,
            fontSize: `${5 + (i % 3) * 2}rem`,
          }}
          animate={{ y: [0, -18, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          {s}
        </motion.span>
      ))}
    </div>
  )
}
