import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import {
  profile,
  projects,
  experience,
  education,
  skills,
  currentWork,
} from '../data/content'
import { useViewMemory } from '../lib/useViewMemory'
import { useSeo } from '../lib/useSeo'
import ResumeButton from '../components/ResumeButton'
import SocialLinks from '../components/SocialLinks'
import ViewSwitcher from '../components/ViewSwitcher'
import SoundToggle from '../components/SoundToggle'
import CountUp from '../components/fx/CountUp'
import Magnetic from '../components/fx/Magnetic'
import CustomCursor from '../components/fx/CustomCursor'
import { ArrowRight, ExternalIcon, GitHubIcon } from '../components/Icons'

const numbers = [
  { value: 6, decimals: 0, suffix: '', label: 'Projects shipped' },
  { value: 0.788, decimals: 3, suffix: '', label: 'Best macro-F1' },
  { value: 2.8, decimals: 1, suffix: 'ms', label: 'p99 serving latency' },
  { value: 88, decimals: 0, suffix: '%', label: 'Peak test coverage' },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

export default function StraightView() {
  const { set } = useViewMemory()
  useSeo(
    'Aakash Shahani — Software / ML Engineer',
    profile.intro,
  )
  useEffect(() => {
    set('straight')
  }, [set])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-ink"
    >
      <CustomCursor />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            <span className="text-gradient-gold">{profile.name}</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
              <a href="#work" className="transition-colors hover:text-fg">Work</a>
              <a href="#experience" className="transition-colors hover:text-fg">Experience</a>
              <a href="#skills" className="transition-colors hover:text-fg">Skills</a>
              <a href="#contact" className="transition-colors hover:text-fg">Contact</a>
            </nav>
            <ViewSwitcher />
            <SoundToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6">
        {/* Hero */}
        <section className="py-20 md:py-28">
          <motion.p {...fadeUp} className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-gold">
            {profile.location} · {profile.pronouns}
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl"
          >
            {profile.name}
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-muted"
          >
            {profile.intro}
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <ResumeButton />
            <Magnetic>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-gold/50 hover:text-gold"
              >
                View work <ArrowRight width={16} height={16} />
              </a>
            </Magnetic>
            <SocialLinks className="ml-1" />
          </motion.div>
        </section>

        {/* Current research banner */}
        <motion.section {...fadeUp}>
          <div className="glass flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Currently researching
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-fg">
                {currentWork.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                {currentWork.blurb}
              </p>
            </div>
            <div className="shrink-0 text-sm text-muted">{currentWork.org}</div>
          </div>
        </motion.section>

        {/* By the numbers */}
        <motion.section {...fadeUp} className="py-14">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.label} className="glass rounded-2xl p-6 text-center">
                <div className="font-display text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                  <CountUp value={n.value} decimals={n.decimals} suffix={n.suffix} />
                </div>
                <div className="mt-1 text-xs text-muted">{n.label}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Work */}
        <section id="work" className="scroll-mt-24 py-20">
          <SectionHeading eyebrow="Selected Work" title="Things I've built" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <motion.article
                key={p.id}
                {...fadeUp}
                transition={{ duration: 0.5, delay: (i % 2) * 0.06 }}
                className="glass group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-gold/30"
              >
                {p.image && (
                  <div className="aspect-[16/9] overflow-hidden border-b border-line bg-ink">
                    <img
                      src={p.image}
                      alt={`${p.name} screenshot`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-fg">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-gold">{p.tagline}</p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {p.blurb}
                </p>
                <ul className="mt-4 space-y-2">
                  {p.highlights.slice(0, 2).map((h, j) => (
                    <li key={j} className="flex gap-2 text-sm leading-relaxed text-fg/80">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-gold"
                    >
                      <GitHubIcon width={16} height={16} /> View source
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-soft"
                    >
                      Live demo <ExternalIcon />
                    </a>
                  )}
                </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Experience + Education */}
        <section id="experience" className="scroll-mt-24 py-16">
          <SectionHeading eyebrow="Experience" title="Where I've worked" />
          <div className="mt-10 space-y-6">
            {experience.map((e) => (
              <motion.div
                key={e.role + e.period}
                {...fadeUp}
                className="grid gap-2 border-l-2 border-line pl-6 md:grid-cols-[1fr_2fr]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-fg">{e.role}</h3>
                    {e.current && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                        Now
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted">{e.org}</p>
                  <p className="mt-0.5 text-xs text-muted">{e.period}</p>
                </div>
                <ul className="space-y-2">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-sm leading-relaxed text-fg/80">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
            <motion.div {...fadeUp} className="grid gap-2 border-l-2 border-line pl-6 md:grid-cols-[1fr_2fr]">
              <div>
                <h3 className="font-display font-bold text-fg">{education.degree}</h3>
                <p className="text-sm text-muted">{education.school}</p>
                <p className="mt-0.5 text-xs text-muted">{education.period}</p>
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
        </section>

        {/* Skills */}
        <section id="skills" className="scroll-mt-24 py-16">
          <SectionHeading eyebrow="Toolkit" title="Skills & stack" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((group) => (
              <motion.div key={group.group} {...fadeUp} className="glass rounded-2xl p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
                  {group.group}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((s) => (
                    <span key={s} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-fg/80">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24 py-20 text-center">
          <motion.div {...fadeUp}>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Contact
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Let's talk.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Open to software, ML, and data roles. The fastest way to reach me is email.
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
      </div>

      <Footer />
    </motion.main>
  )
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div {...fadeUp}>
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
    </motion.div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <div className="flex items-center gap-4">
          <Link to="/" className="transition-colors hover:text-gold">
            ↩ Back to lobby
          </Link>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Built with React & Tailwind</span>
        </div>
      </div>
    </footer>
  )
}
