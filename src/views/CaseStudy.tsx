import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects, profile } from '../data/content'
import { useSeo } from '../lib/useSeo'
import ResumeButton from '../components/ResumeButton'
import SocialLinks from '../components/SocialLinks'
import CustomCursor from '../components/fx/CustomCursor'
import NotFound from '../components/NotFound'
import { ArrowLeft, ArrowRight, ExternalIcon, GitHubIcon } from '../components/Icons'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease },
}

export default function CaseStudy() {
  const { id } = useParams()
  const idx = projects.findIndex((p) => p.id === id)
  const p = projects[idx]

  useSeo(
    p ? `${p.name} — ${profile.name}` : `Not found — ${profile.name}`,
    p?.blurb,
  )
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!p) return <NotFound />
  const next = projects[(idx + 1) % projects.length]

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grain min-h-screen bg-ink"
    >
      <CustomCursor />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft width={16} height={16} /> {profile.name}
          </Link>
          <ResumeButton />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pt-32">
        {/* Title block */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-mono text-xs uppercase tracking-[0.35em] text-gold"
        >
          Case {String(idx + 1).padStart(2, '0')} — {p.period}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl"
        >
          {p.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="mt-4 max-w-2xl text-lg text-muted"
        >
          {p.tagline}
        </motion.p>

        {/* Metrics band */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="tick-b mt-12 grid grid-cols-3 gap-6 pb-8"
        >
          {p.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-2xl font-semibold text-gradient-gold md:text-4xl">
                {m.value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:text-[11px]">
                {m.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Figure */}
        {p.image && (
          <motion.figure {...fadeUp} className="relative mt-12">
            <div className="overflow-hidden rounded-2xl border border-line">
              <img
                src={p.image}
                alt={`${p.name} interface`}
                className="w-full object-cover object-top"
              />
            </div>
            <span aria-hidden className="absolute -left-1.5 -top-1.5 h-4 w-4 border-l border-t border-gold/40" />
            <span aria-hidden className="absolute -right-1.5 -top-1.5 h-4 w-4 border-r border-t border-gold/40" />
            <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              fig. {String(idx + 1).padStart(2, '0')} — {p.name} interface
            </figcaption>
          </motion.figure>
        )}

        {/* Overview */}
        <motion.section {...fadeUp} className="mt-16 grid gap-10 md:grid-cols-[1fr_2fr]">
          <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-gold">
            Overview
          </h2>
          <p className="text-xl leading-relaxed text-fg/90">{p.blurb}</p>
        </motion.section>

        {/* Highlights */}
        <motion.section {...fadeUp} className="mt-14 grid gap-10 md:grid-cols-[1fr_2fr]">
          <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-gold">
            Highlights
          </h2>
          <ul className="space-y-4">
            {p.highlights.map((h, j) => (
              <li key={j} className="flex gap-3 text-base leading-relaxed text-muted">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                {h}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Stack + links */}
        <motion.section {...fadeUp} className="mt-14 grid gap-10 md:grid-cols-[1fr_2fr]">
          <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-gold">
            Stack
          </h2>
          <div>
            <div className="flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span key={s} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              {p.repo && (
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-gold"
                >
                  <GitHubIcon width={16} height={16} /> Source
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
        </motion.section>

        {/* Next project */}
        <motion.div {...fadeUp} className="mt-24 border-t border-line pb-16 pt-10">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted">
            Next case
          </p>
          <Link
            to={`/work/${next.id}`}
            className="group mt-3 inline-flex items-center gap-4"
          >
            <span className="font-display text-3xl font-semibold tracking-tight transition-colors group-hover:text-gold md:text-5xl">
              {next.name}
            </span>
            <ArrowRight
              width={28}
              height={28}
              className="text-muted transition-all group-hover:translate-x-2 group-hover:text-gold"
            />
          </Link>
          <div className="mt-12 flex items-center justify-between">
            <SocialLinks />
            <Link to="/#work" className="text-sm text-muted transition-colors hover:text-fg">
              All work ↩
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
