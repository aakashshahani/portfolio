import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import {
  profile,
  projects,
  experience,
  education,
  currentWork,
  careerMoves,
  type Project,
  type Annotation,
} from '../data/content'
import { useViewMemory } from '../lib/useViewMemory'
import { useSeo } from '../lib/useSeo'
import { play } from '../lib/sound'
import ChessPiece, { type PieceName } from '../components/ChessPiece'
import MoveList from '../components/MoveList'
import ParticleFace from '../components/fx/ParticleFace'
import RatingChart from '../components/RatingChart'
import ChessClock from '../components/ChessClock'
import ChessPuzzle from '../components/ChessPuzzle'
import ProjectModal from '../components/ProjectModal'
import ViewSwitcher from '../components/ViewSwitcher'
import SocialLinks from '../components/SocialLinks'
import SoundToggle from '../components/SoundToggle'
import Magnetic from '../components/fx/Magnetic'
import CursorGlow from '../components/fx/CursorGlow'
import CustomCursor from '../components/fx/CustomCursor'
import { Footer } from './StraightView'

const glyphName: Record<string, PieceName> = {
  '♚': 'king',
  '♛': 'queen',
  '♜': 'rook',
  '♝': 'bishop',
  '♞': 'knight',
  '♟': 'pawn',
}

const phases = [
  {
    id: 'opening',
    piece: 'pawn' as PieceName,
    name: 'The Opening',
    sub: 'Foundations',
    opening: 'A principled start',
    desc: 'Where the position was set — degree, coursework, and first research.',
  },
  {
    id: 'midgame',
    piece: 'knight' as PieceName,
    name: 'The Midgame',
    sub: 'Building tension',
    opening: 'Developing pieces',
    desc: 'Systems shipped, experiments run, complications navigated.',
  },
  {
    id: 'endgame',
    piece: 'queen' as PieceName,
    name: 'The Endgame',
    sub: 'Playing for the win',
    opening: 'Converting the advantage',
    desc: 'The strongest work, and the game still in progress.',
  },
] as const

export default function ChessView() {
  const { set } = useViewMemory()
  const [selected, setSelected] = useState<Project | null>(null)

  useSeo(
    'Aakash Shahani — Chess',
    'Aakash Shahani’s journey as a chess game — opening, midgame, endgame. Education, experience, and projects, move by move.',
  )
  useEffect(() => {
    set('chess')
  }, [set])

  // Precompute FENs for the "career opening" (a real Ruy Lopez line).
  const fens = useMemo(() => {
    const c = new Chess()
    const arr = [c.fen()]
    for (const m of careerMoves) {
      c.move(m.move)
      arr.push(c.fen())
    }
    return arr
  }, [])

  // The interactive "game score" board (defaults to the final position).
  const [gamePly, setGamePly] = useState(careerMoves.length)

  // annotation per project (from the career move list)
  const projAnnotation = useMemo(() => {
    const m: Record<string, Annotation | undefined> = {}
    for (const mv of careerMoves) if (mv.projectId) m[mv.projectId] = mv.annotation
    return m
  }, [])

  const openProject = (id: string) => {
    const p = projects.find((x) => x.id === id)
    if (p) {
      setSelected(p)
      play('move')
    }
  }

  const projectsByPhase = (phase: string) => projects.filter((p) => p.phase === phase)
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-ink"
    >
      <CustomCursor glyph="♟" />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <ChessPiece name="knight" size={22} />
            <span className="text-gradient-gold">{profile.initials}</span>
          </Link>
          <div className="flex items-center gap-3">
            <ViewSwitcher />
            <SoundToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-10 overflow-hidden px-6 py-16 md:grid-cols-2 md:py-20">
        <CursorGlow color="rgba(76,110,245,0.14)" size={560} />
        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-muted"
          >
            The whole game
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl"
          >
            <span className="text-fg">Aakash</span>
            <br />
            <span className="text-gradient-gold">Shahani</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-md text-base text-muted"
          >
            {profile.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="mt-2 max-w-md text-sm italic text-gold/70"
          >
            “{profile.chessLine}”
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <button
                onClick={() => scrollTo('game')}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition-transform hover:scale-105"
              >
                Replay the game
              </button>
            </Magnetic>
            <ChessClock />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gold/10 blur-3xl" />
          <ParticleFace className="relative h-[440px] w-full max-w-[320px]" />
        </motion.div>
      </section>

      {/* The game score — synced board + move list */}
      <section id="game" className="scroll-mt-20 border-t border-line px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionLabel piece="rook" eyebrow="The game" title="Played move by move" />
          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,360px)_1fr] md:items-start">
            <div className="mx-auto w-full max-w-sm md:sticky md:top-24">
              <Chessboard
                options={{
                  position: fens[gamePly],
                  boardOrientation: 'white',
                  allowDragging: false,
                  animationDurationInMs: 300,
                  showNotation: true,
                  darkSquareStyle: { backgroundColor: '#123a2c' },
                  lightSquareStyle: { backgroundColor: '#cdb892' },
                  darkSquareNotationStyle: { color: '#cdb892' },
                  lightSquareNotationStyle: { color: '#123a2c' },
                  boardStyle: { borderRadius: '12px', overflow: 'hidden' },
                  id: 'game-board',
                }}
              />
              <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                <button
                  onClick={() => setGamePly((p) => Math.max(0, p - 1))}
                  className="rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-gold/50 hover:text-gold"
                >
                  ‹ Prev
                </button>
                <button
                  onClick={() => setGamePly((p) => Math.min(fens.length - 1, p + 1))}
                  className="rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-gold/50 hover:text-gold"
                >
                  Next ›
                </button>
              </div>
            </div>
            <MoveList
              activePly={gamePly}
              onSelect={(p) => {
                setGamePly(p)
                play('move')
              }}
              onOpenProject={openProject}
            />
          </div>
        </div>
      </section>

      {/* Phases */}
      {phases.map((phase, pi) => (
        <section
          key={phase.id}
          id={phase.id}
          className="scroll-mt-20 border-t border-line px-6 py-16"
        >
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, rotateX: -25, y: 16 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true }}
              style={{ transformPerspective: 800 }}
              className="flex items-center gap-4"
            >
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-gold/20 bg-felt/40 p-2">
                <ChessPiece name={phase.piece} size="100%" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  Move {pi + 1} · {phase.sub}
                </p>
                <h2 className="font-display text-3xl font-extrabold tracking-tight">
                  {phase.name}
                </h2>
                <p className="mt-0.5 text-sm italic text-muted">{phase.opening}</p>
              </div>
            </motion.div>
            <p className="mt-3 max-w-2xl text-sm text-muted">{phase.desc}</p>

            <div className="mt-8 space-y-4">
              {phase.id === 'opening' && <OpeningContent />}
              {phase.id === 'midgame' && <MidgameExperience />}

              <div className="grid gap-4 sm:grid-cols-2">
                {projectsByPhase(phase.id).map((p) => (
                  <PieceCard
                    key={p.id}
                    project={p}
                    annotation={projAnnotation[p.id]}
                    onSelect={setSelected}
                  />
                ))}
              </div>

              {phase.id === 'endgame' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <RatingChart />
                  <EndgameCurrentWork />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Mate in three puzzle → resume */}
      <section className="border-t border-line px-6 py-20">
        <ChessPuzzle />
      </section>

      {/* Contact */}
      <section className="border-t border-line px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl"
        >
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Your <span className="text-gradient-gold">move.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Open to software, ML, and data roles. Email’s the fastest line.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
            >
              {profile.email}
            </a>
            <SocialLinks />
          </div>
        </motion.div>
      </section>

      <Footer />
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </motion.main>
  )
}

function SectionLabel({
  piece,
  eyebrow,
  title,
}: {
  piece: PieceName
  eyebrow: string
  title: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/20 bg-felt/40 p-1.5">
        <ChessPiece name={piece} size="100%" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight">{title}</h2>
      </div>
    </motion.div>
  )
}

function PieceCard({
  project,
  annotation,
  onSelect,
}: {
  project: Project
  annotation?: Annotation
  onSelect: (p: Project) => void
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => {
        play('move')
        onSelect(project)
      }}
      className="glass group flex items-start gap-4 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold/30"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-felt/50 p-1.5 transition-transform group-hover:scale-110">
        <ChessPiece name={glyphName[project.piece]} size="100%" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="font-display font-bold text-fg">{project.name}</span>
          {annotation && (
            <span
              className={`font-mono text-sm font-bold ${
                annotation === '!!' ? 'text-gold' : 'text-chip-blue'
              }`}
            >
              {annotation}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-sm text-gold">{project.tagline}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted">
          {project.blurb}
        </span>
      </span>
    </motion.button>
  )
}

function OpeningContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display font-bold text-fg">{education.degree}</h3>
        <span className="text-xs text-muted">{education.period}</span>
      </div>
      <p className="text-sm text-muted">
        {education.school} · {education.location}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {education.coursework.map((c) => (
          <span key={c} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
            {c}
          </span>
        ))}
      </div>
      {experience
        .filter((e) => !e.current)
        .map((e) => (
          <div key={e.role} className="mt-5 border-t border-line pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-medium text-fg">
                {e.role} · {e.org}
              </h4>
              <span className="text-xs text-muted">{e.period}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {e.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-fg/75">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </motion.div>
  )
}

function MidgameExperience() {
  const current = experience.find((e) => e.current)
  if (!current) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-fg">{current.role}</h3>
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            Now
          </span>
        </div>
        <span className="text-xs text-muted">{current.period}</span>
      </div>
      <p className="text-sm text-muted">{current.org}</p>
      <ul className="mt-3 space-y-1.5">
        {current.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-fg/75">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function EndgameCurrentWork() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl border-gold/20 p-5"
    >
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
        </span>
        {currentWork.status} · {currentWork.org}
      </span>
      <h3 className="mt-2 font-display font-bold text-fg">{currentWork.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{currentWork.blurb}</p>
    </motion.div>
  )
}
