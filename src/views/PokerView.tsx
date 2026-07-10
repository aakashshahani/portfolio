import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  profile,
  projects,
  skills,
  experience,
  currentWork,
  type Project,
} from '../data/content'
import { useViewMemory } from '../lib/useViewMemory'
import { useSeo } from '../lib/useSeo'
import { play } from '../lib/sound'
import PlayingCard from '../components/PlayingCard'
import ProjectModal from '../components/ProjectModal'
import ResumeButton from '../components/ResumeButton'
import ViewSwitcher from '../components/ViewSwitcher'
import SocialLinks from '../components/SocialLinks'
import SoundToggle from '../components/SoundToggle'
import { ChipStack, CHIP_STYLES } from '../components/PokerChip'
import { ExternalIcon } from '../components/Icons'
import Magnetic from '../components/fx/Magnetic'
import CursorGlow from '../components/fx/CursorGlow'
import CustomCursor from '../components/fx/CustomCursor'
import FeltShader from '../components/fx/FeltShader'
import { Footer } from './StraightView'

const CHIP_VALUES = ['5', '10', '25', '100', '500', '1K']

export default function PokerView() {
  const { set } = useViewMemory()
  const [selected, setSelected] = useState<Project | null>(null)

  useSeo(
    'Aakash Shahani — Poker Table',
    'Aakash Shahani’s projects, dealt as a poker hand. ML systems, real-time pipelines, and AI agents — click any card for the full story.',
  )
  useEffect(() => {
    set('poker')
  }, [set])

  const pokersim = projects.find((p) => p.id === 'pokersim')
  const scrollToBoard = () =>
    document.getElementById('board')?.scrollIntoView({ behavior: 'smooth' })

  // Community cards: Flop (3) / Turn (1) / River (1)
  const flop = projects.slice(0, 3)
  const turn = projects[3]
  const river = projects[4]

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="felt-bg min-h-screen"
    >
      <CustomCursor glyph="♠" />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg font-bold">
            <span className="text-gradient-gold">♠ {profile.initials}</span>
          </Link>
          <div className="flex items-center gap-3">
            <ViewSwitcher />
            <SoundToggle />
            <div className="hidden sm:block">
              <ResumeButton tone="ghost" />
            </div>
          </div>
        </div>
      </header>

      {/* Pre-flop — hero */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-14 pt-16 text-center sm:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-muted"
        >
          Pre-flop · who’s dealt in
        </motion.p>

        <HoleCards />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 font-display text-6xl font-black leading-[0.95] tracking-tight sm:text-8xl"
        >
          <span className="text-gradient-gold">Aakash</span>
          <br />
          <span className="text-fg">Shahani</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62 }}
          className="mt-6 max-w-lg text-balance text-base text-muted sm:text-lg"
        >
          {profile.tagline}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-2 max-w-md text-sm italic text-gold/70"
        >
          “{profile.pokerLine}”
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Magnetic>
            <button
              onClick={scrollToBoard}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-105"
            >
              ♠ Deal me in
            </button>
          </Magnetic>
          {pokersim?.repo && (
            <a
              href={pokersim.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-gold/50 hover:text-gold"
            >
              🃏 Play vs my poker AI <ExternalIcon />
            </a>
          )}
        </motion.div>
      </section>

      {/* The board — Flop / Turn / River as community cards */}
      <section id="board" className="scroll-mt-20 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionLabel
            eyebrow="The board"
            title="The community cards"
            hint="Flop, turn, and river — click any card for the full hand"
          />

          {/* Oval felt table */}
          <div className="table-light rail relative mt-12 overflow-hidden rounded-[42%/60%] bg-felt sm:rounded-[46%/72%]">
            <FeltShader />
            <CursorGlow color="rgba(232,195,122,0.18)" size={600} />
            <div className="relative z-10 px-4 py-12 sm:px-10 sm:py-16">
              {/* dealer button */}
              <div
                aria-hidden
                className="absolute left-6 top-6 grid h-9 w-9 place-items-center rounded-full border-2 border-gold/40 bg-white text-xs font-black text-ink shadow-lg"
              >
                D
              </div>

              <motion.div
                className="flex flex-wrap items-end justify-center gap-x-3 gap-y-8 sm:gap-x-5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={{ show: { transition: { staggerChildren: 0.16 } } }}
                onViewportEnter={() => play('deal')}
              >
                <Street label="Flop">
                  {flop.map((p) => (
                    <PlayingCard key={p.id} project={p} onSelect={setSelected} />
                  ))}
                </Street>
                <Street label="Turn">
                  <PlayingCard project={turn} onSelect={setSelected} />
                </Street>
                <Street label="River">
                  <PlayingCard project={river} onSelect={setSelected} />
                </Street>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The chip stack — skills */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionLabel eyebrow="The chip stack" title="What I bring to the table" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((group, gi) => (
              <ChipStack
                key={group.group}
                index={gi}
                style={CHIP_STYLES[gi % CHIP_STYLES.length]}
                value={CHIP_VALUES[gi % CHIP_VALUES.length]}
                label={group.group}
                items={group.items}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The players — experience */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionLabel eyebrow="The players" title="Who’s at the table" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {experience.map((e, i) => (
              <PlayerSeat key={e.role + e.period} exp={e} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* The river reveal — current research */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionLabel eyebrow="Still in the hand" title="The card yet to turn" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass mt-10 rounded-3xl p-8"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              {currentWork.status}
            </span>
            <h3 className="mt-2 font-display text-xl font-bold text-fg">
              {currentWork.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {currentWork.blurb}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {currentWork.tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Showdown — contact */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Showdown
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to <span className="text-gradient-gold">go all in?</span>
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

/** A labelled group of community cards (Flop / Turn / River). */
function Street({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3 sm:gap-5">{children}</div>
      <span className="rounded-full bg-black/30 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-soft/80">
        {label}
      </span>
    </div>
  )
}

/** Two hole cards that get dealt to "you" and flip to pocket aces. */
function HoleCards() {
  const cards = [
    { rank: 'A', suit: '♠', red: false, rot: -8, x: -18 },
    { rank: 'A', suit: '♥', red: true, rot: 8, x: 18 },
  ]
  return (
    <div className="relative flex h-28 items-center justify-center">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          className="absolute [perspective:1000px]"
          initial={{ opacity: 0, x: 180, y: -60, rotate: 30 }}
          animate={{ opacity: 1, x: c.x, y: 0, rotate: c.rot }}
          transition={{ delay: 0.15 + i * 0.18, type: 'spring', stiffness: 90, damping: 13 }}
        >
          <motion.div
            className="relative h-24 w-16 [transform-style:preserve-3d]"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{ delay: 0.5 + i * 0.18, duration: 0.5 }}
          >
            {/* front */}
            <div className="absolute inset-0 flex flex-col justify-between rounded-lg border border-gold/30 bg-white p-1.5 [backface-visibility:hidden]">
              <span className={`text-sm font-bold leading-none ${c.red ? 'text-card-red' : 'text-ink'}`}>
                {c.rank}
                <br />
                {c.suit}
              </span>
              <span className={`self-center text-2xl ${c.red ? 'text-card-red' : 'text-ink'}`}>
                {c.suit}
              </span>
              <span className={`rotate-180 self-end text-sm font-bold leading-none ${c.red ? 'text-card-red' : 'text-ink'}`}>
                {c.rank}
                <br />
                {c.suit}
              </span>
            </div>
            {/* back */}
            <div className="absolute inset-0 rounded-lg border border-gold/30 bg-gradient-to-br from-felt-2 to-felt [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="grid h-full place-items-center">
                <span className="text-gradient-gold font-display text-xs font-black">AS</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

/** An experience entry styled as a seated player with a chip stack. */
function PlayerSeat({
  exp,
  index,
}: {
  exp: (typeof experience)[number]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/30 bg-felt/50 font-display text-lg font-bold text-gold">
          {exp.org
            .split(/[\s,]+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join('')}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-fg">{exp.role}</h3>
            {exp.current && (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                In the hand
              </span>
            )}
          </div>
          <p className="text-sm text-muted">{exp.org}</p>
          <p className="mt-0.5 text-xs text-muted">{exp.period}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {exp.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-fg/80">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function SectionLabel({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string
  title: string
  hint?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </motion.div>
  )
}
