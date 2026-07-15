import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  profile,
  projects,
  experience,
  education,
  skills,
  currentWork,
  story,
  type Project,
} from '../data/content'
import { useSeo } from '../lib/useSeo'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { useRepoStats, type RepoStat } from '../lib/useRepoStats'
import ResumeButton from '../components/ResumeButton'
import SocialLinks from '../components/SocialLinks'
import Portrait from '../components/Portrait'
import CustomCursor from '../components/fx/CustomCursor'
import HeroField from '../components/fx/HeroField'
import ScrollGauge from '../components/fx/ScrollGauge'
import Magnetic from '../components/fx/Magnetic'
import CountUp from '../components/fx/CountUp'
import { willPreload } from '../components/Preloader'
import { ArrowRight, ExternalIcon, GitHubIcon } from '../components/Icons'

// three.js lives in its own chunk — fetched only when the Journey section nears.
const GlobeScene = lazy(() => import('../components/GlobeScene'))

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease },
}

export default function Home() {
  useSeo('Aakash Shahani — Software & ML Engineer', profile.intro)
  const gh = useRepoStats()

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grain min-h-screen bg-ink"
    >
      <CustomCursor />
      <ScrollGauge />
      <Nav />
      <Hero />
      <Work gh={gh} />
      <Numbers />
      <About />
      <ExperienceSection />
      <Journey />
      <Skills />
      <Contact />
    </motion.main>
  )
}

/* ---- Nav ----------------------------------------------------------------- */

function Nav() {
  // The brand slides in only once the giant hero name has scaled away —
  // a handoff, so the name never appears twice on screen.
  const { scrollY } = useScroll()
  const brandOpacity = useTransform(scrollY, [380, 560], [0, 1])
  const brandY = useTransform(scrollY, [380, 560], [10, 0])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <motion.a
          href="#top"
          style={{ opacity: brandOpacity, y: brandY }}
          className="font-display text-lg font-semibold tracking-tight"
        >
          {profile.name}
        </motion.a>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#work" className="transition-colors hover:text-fg">Work</a>
            <a href="#about" className="transition-colors hover:text-fg">About</a>
            <a href="#experience" className="transition-colors hover:text-fg">Experience</a>
            <a href="#journey" className="transition-colors hover:text-fg">Journey</a>
            <a href="#contact" className="transition-colors hover:text-fg">Contact</a>
          </nav>
          <ResumeButton />
        </div>
      </div>
    </header>
  )
}

/* ---- Hero ----------------------------------------------------------------- */

/** Each line rises out of an overflow-hidden mask — the classic editorial reveal. */
function MaskedLine({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function Hero() {
  // If the preloader is covering the page this session, push entrances back
  // so they play as the curtain lifts instead of behind it.
  const [boot] = useState(willPreload)
  const base = boot ? 1.0 : 0

  // The name scales down and lifts away as you scroll — handed off to the nav.
  const { scrollY } = useScroll()
  const nameScale = useTransform(scrollY, [0, 600], [1, 0.7])
  const nameY = useTransform(scrollY, [0, 600], [0, -80])
  const nameOpacity = useTransform(scrollY, [100, 520], [1, 0])

  return (
    <section id="top" className="hero-bg relative flex min-h-screen flex-col justify-center px-6 pt-24">
      <HeroField />
      <div className="pointer-events-none relative mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_19rem] lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: base + 0.1 }}
              className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.35em] text-muted"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              {profile.availability}
            </motion.p>

            <motion.h1
              style={{ scale: nameScale, y: nameY, opacity: nameOpacity, transformOrigin: 'left center' }}
              className="font-display text-[clamp(2.8rem,8vw,7rem)] font-semibold uppercase leading-[0.95] tracking-tight"
            >
              <MaskedLine delay={base + 0.15}>Aakash</MaskedLine>
              <MaskedLine delay={base + 0.25}>
                <span className="text-gradient-gold">Shahani</span>
              </MaskedLine>
            </motion.h1>

            <div className="mt-10 flex flex-col gap-8">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: base + 0.5, ease }}
                className="max-w-xl text-lg leading-relaxed text-muted"
              >
                {profile.role} — real-time pipelines, agentic RAG, recommenders,
                and AI agents that reason under uncertainty.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: base + 0.6, ease }}
                className="pointer-events-auto flex items-center gap-3"
              >
                <Magnetic>
                  <a
                    href="#work"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
                  >
                    Selected work <ArrowRight width={16} height={16} />
                  </a>
                </Magnetic>
                <SocialLinks />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: base + 0.45, ease }}
            className="pointer-events-auto mx-auto w-full max-w-[15rem] sm:max-w-[17rem] lg:max-w-none"
          >
            <Portrait compact />
          </motion.div>
        </div>

        {/* Instrument read-out — in flow, so it can never collide with content */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: base + 1.0, duration: 0.8 }}
          className="mt-16 flex items-center justify-end border-t border-line pt-5 font-mono text-[10px] uppercase text-muted"
        >
          <span className="tracking-[0.4em]">Scroll ↓</span>
        </motion.div>
      </div>
    </section>
  )
}

/* ---- Work ----------------------------------------------------------------- */

function Work({ gh }: { gh: Record<string, RepoStat> | null }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [hovered, setHovered] = useState<Project | null>(null)
  const [fine, setFine] = useState(false)
  const reduced = usePrefersReducedMotion()

  // Floating screenshot preview that trails the cursor (desktop only).
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 200, damping: 25, mass: 0.6 })
  const py = useSpring(my, { stiffness: 200, damping: 25, mass: 0.6 })

  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches)
  }, [])

  const onMove = (e: React.MouseEvent) => {
    mx.set(e.clientX)
    my.set(e.clientY)
  }

  const showPreview = fine && !reduced && hovered && expanded !== hovered.id

  return (
    <section id="work" className="scroll-mt-24 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="01 — Selected Work"
          title="Built, measured, shipped"
          meta="2025 — 2026"
        />
        <div className="mt-14" onMouseMove={onMove} onMouseLeave={() => setHovered(null)}>
          {projects.map((p, i) => (
            <WorkRow
              key={p.id}
              project={p}
              index={i}
              stat={gh?.[p.repo?.split('/').pop()?.toLowerCase() ?? '']}
              expanded={expanded === p.id}
              onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
              onHover={(h) => setHovered(h ? p : null)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            key={hovered.id}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
            style={{ x: px, y: py, translateX: '-50%', translateY: '-115%' }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease }}
          >
            <img
              src={hovered.image}
              alt=""
              className="h-48 w-80 rounded-xl border border-line-strong object-cover object-top shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function WorkRow({
  project: p,
  index,
  stat,
  expanded,
  onToggle,
  onHover,
}: {
  project: Project
  index: number
  stat?: RepoStat
  expanded: boolean
  onToggle: () => void
  onHover: (hovering: boolean) => void
}) {
  return (
    <motion.article {...fadeUp} className="border-t border-line last:border-b">
      <button
        onClick={onToggle}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        aria-expanded={expanded}
        className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 py-7 text-left transition-colors md:grid-cols-[3rem_1fr_auto_2rem] md:items-center md:py-9"
      >
        <span className="font-mono text-sm text-muted">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-gold md:text-4xl">
              {p.name}
            </span>
            {p.demo && (
              <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold">
                Live
              </span>
            )}
          </span>
          <span className="mt-1.5 block text-sm text-muted md:text-base">
            {p.tagline}
          </span>
        </span>
        <span className="col-start-2 flex flex-wrap gap-x-6 gap-y-1 md:col-start-3 md:justify-end">
          {p.metrics.map((m) => (
            <span key={m.label} className="whitespace-nowrap">
              <span className="font-mono text-sm text-fg">{m.value}</span>
              <span className="ml-1.5 text-xs text-muted">{m.label}</span>
            </span>
          ))}
        </span>
        <span
          className={`hidden justify-self-end text-muted transition-transform duration-300 group-hover:text-gold md:block ${expanded ? 'rotate-90' : ''}`}
        >
          <ArrowRight width={18} height={18} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
              <div>
                <p className="text-base leading-relaxed text-fg/85">{p.blurb}</p>
                <ul className="mt-5 space-y-2.5">
                  {p.highlights.map((h, j) => (
                    <li key={j} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span key={s} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <Link
                    to={`/work/${p.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-soft"
                  >
                    Full case study <ArrowRight width={16} height={16} />
                  </Link>
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg"
                    >
                      <GitHubIcon width={16} height={16} /> Source
                      {stat && stat.stars > 0 && (
                        <span className="font-mono text-[11px]">★ {stat.stars}</span>
                      )}
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg"
                    >
                      Live demo <ExternalIcon />
                    </a>
                  )}
                </div>
              </div>
              {p.image && (
                <figure>
                  <div className="overflow-hidden rounded-xl border border-line">
                    <img
                      src={p.image}
                      alt={`${p.name} screenshot`}
                      loading="lazy"
                      className="h-full max-h-72 w-full object-cover object-top"
                    />
                  </div>
                  <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    fig. {String(index + 1).padStart(2, '0')} — {p.name} interface
                  </figcaption>
                </figure>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

/* ---- Numbers --------------------------------------------------------------- */

const numbers = [
  { value: 5, decimals: 0, suffix: '', label: 'Projects shipped' },
  { value: 2.8, decimals: 1, suffix: 'ms', label: 'p99 serving latency' },
  { value: 88, decimals: 0, suffix: '%', label: 'Peak test coverage' },
]

function Numbers() {
  return (
    <section className="border-y border-line px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-x-6 gap-y-10">
        {numbers.map((n) => (
          <motion.div key={n.label} {...fadeUp} className="text-center">
            <div className="font-display text-3xl font-semibold text-gradient-gold md:text-4xl">
              <CountUp value={n.value} decimals={n.decimals} suffix={n.suffix} />
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              {n.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---- Journey — the story, visualized ------------------------------------------ */

function Journey() {
  const holder = useRef<HTMLDivElement>(null)
  // Fetch the three.js chunk just before the section scrolls into view.
  const near = useInView(holder, { once: true, margin: '400px' })
  const [flight, setFlight] = useState<{
    index: number
    flying: boolean
    from?: string
    to?: string
    at?: string
  } | null>(null)

  return (
    <section id="journey" className="scroll-mt-24 border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="04 — Journey"
          title="Three cities, six languages"
          meta="HKG → HYD → TPA"
        />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <motion.div
            {...fadeUp}
            ref={holder}
            className="relative h-[340px] overflow-hidden rounded-2xl border border-line sm:h-[440px]"
          >
            {near && (
              <Suspense
                fallback={
                  <div className="grid h-full place-items-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                    spinning up the globe…
                  </div>
                }
              >
                <GlobeScene onStatus={setFlight} />
              </Suspense>
            )}
            {/* Live flight readout */}
            <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              <span className="text-gold">
                {flight
                  ? flight.flying
                    ? `✈ ${flight.from} → ${flight.to}`
                    : `● ${flight.at}`
                  : ''}
              </span>
              <span>drag to spin</span>
            </div>
          </motion.div>

          <div>
            <div className="space-y-7">
              {story.stops.map((s, i) => {
                const active = flight?.index === i
                return (
                  <motion.div
                    key={s.place}
                    {...fadeUp}
                    className={`border-l pl-5 transition-colors duration-500 ${active ? 'border-gold' : 'border-line-strong'}`}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                      {String(i + 1).padStart(2, '0')} · {s.label}
                      {active && flight?.flying && ' · inbound ✈'}
                    </p>
                    <h3
                      className={`mt-1 font-display text-xl font-semibold tracking-tight transition-colors duration-500 ${active ? 'text-gold' : ''}`}
                    >
                      {s.place}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.note}</p>
                  </motion.div>
                )
              })}
            </div>

            <motion.div {...fadeUp} className="mt-9 border-t border-line pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                Speaks
              </p>
              <p className="mt-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
                {story.languages.map((l) => (
                  <span key={l.name} className="whitespace-nowrap">
                    <span className="text-lg text-fg">{l.native}</span>
                    {l.native !== l.name && (
                      <span className="ml-1.5 text-xs text-muted">{l.name}</span>
                    )}
                  </span>
                ))}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---- About + Now ------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="scroll-mt-24 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="02 — About" title="Who I am" />
        <div className="mt-12 grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-14">
          <div>
            <motion.div {...fadeUp}>
              <p className="text-xl leading-relaxed text-fg/90 md:text-2xl">
                {profile.intro}
              </p>
            </motion.div>
          </div>
          <motion.aside {...fadeUp} className="glass h-fit rounded-2xl p-6">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Now — {currentWork.org}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold">
                {currentWork.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {currentWork.blurb}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {currentWork.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}

/* ---- Experience -------------------------------------------------------------- */

function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-24 border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="03 — Experience" title="Where I've worked" meta="2024 — present" />
        <div className="mt-12 space-y-10">
          {experience.map((e) => (
            <motion.div
              key={e.role + e.period}
              {...fadeUp}
              className="grid gap-3 border-l border-line-strong pl-6 md:grid-cols-[1fr_2fr] md:gap-8"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold">{e.role}</h3>
                  {e.current && (
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                      Now
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{e.org}</p>
                <p className="mt-0.5 font-mono text-xs text-muted">{e.period}</p>
              </div>
              <ul className="space-y-2.5">
                {e.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          <motion.div
            {...fadeUp}
            className="grid gap-3 border-l border-line-strong pl-6 md:grid-cols-[1fr_2fr] md:gap-8"
          >
            <div>
              <h3 className="font-display text-lg font-semibold">{education.degree}</h3>
              <p className="mt-1 text-sm text-muted">{education.school}</p>
              <p className="mt-0.5 font-mono text-xs text-muted">{education.period}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 self-center">
              {education.coursework.map((c) => (
                <span key={c} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ---- Skills -------------------------------------------------------------------- */

function Skills() {
  return (
    <section className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="05 — Toolkit" title="Skills & stack" meta={`${skills.length} domains`} />
        <div className="mt-12">
          {skills.map((group) => (
            <motion.div
              key={group.group}
              {...fadeUp}
              className="grid gap-2 border-t border-line py-5 last:border-b md:grid-cols-[14rem_1fr] md:gap-8"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
                {group.group}
              </h3>
              <p className="text-sm leading-relaxed text-fg/80">
                {group.items.join('  ·  ')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- Contact / footer ------------------------------------------------------------ */

function Contact() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-line px-6 pb-10 pt-24 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <motion.p {...fadeUp} className="font-mono text-xs uppercase tracking-[0.35em] text-gold">
          06 — Contact
        </motion.p>
        <motion.h2
          {...fadeUp}
          className="mt-6 font-display text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-[1.05] tracking-tight"
        >
          Let's build something
          <br />
          <span className="text-gradient-gold">that holds up.</span>
        </motion.h2>
        <motion.div {...fadeUp} className="mt-10">
          <a
            href={`mailto:${profile.email}`}
            className="underline-sweep font-display text-2xl font-medium text-fg md:text-3xl"
          >
            {profile.email}
          </a>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            Open to any and all opportunities — software, ML, or data — and
            happy to relocate.
          </p>
        </motion.div>
        <motion.div
          {...fadeUp}
          className="mt-12 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-fg transition-colors hover:text-gold"
            >
              GitHub ↗
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-fg transition-colors hover:text-gold"
            >
              LinkedIn ↗
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span>{profile.availability}</span>
          </div>
        </motion.div>
        <div className="mt-8 flex flex-col gap-2 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="hidden font-mono md:inline">⌘K to jump anywhere</span>
        </div>
      </div>
    </footer>
  )
}

/* ---- Shared -------------------------------------------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string
  title: string
  meta?: string
}) {
  return (
    <motion.div {...fadeUp} className="tick-b pb-6">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-gold">
        {eyebrow}
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h2>
        {meta && (
          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            [ {meta} ]
          </p>
        )}
      </div>
    </motion.div>
  )
}
