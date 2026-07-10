import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import type { Project } from '../data/content'
import { GitHubIcon, ExternalIcon } from './Icons'

interface Props {
  project: Project | null
  onClose: () => void
}

/** Shared project detail overlay used by the Poker and Chess views. */
export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    if (project) document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-6 backdrop-blur-md sm:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass relative my-auto w-full max-w-2xl rounded-3xl p-5 sm:p-8"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-line bg-ink/60 text-muted backdrop-blur transition-colors hover:border-gold/50 hover:text-gold"
            >
              ✕
            </button>

            {project.image && (
              <div className="mb-5 overflow-hidden rounded-2xl border border-line">
                <img
                  src={project.image}
                  alt={`${project.name} — screenshot`}
                  loading="lazy"
                  className="block max-h-64 w-full object-cover object-top"
                />
              </div>
            )}

            <div>
              <h2 className="font-display text-2xl font-extrabold text-fg">
                {project.name}
              </h2>
              <p className="mt-1 text-sm text-gold">{project.tagline}</p>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-fg/85">
              {project.blurb}
            </p>

            <h3 className="mt-6 text-xs font-semibold uppercase tracking-widest text-gold">
              Highlights
            </h3>
            <ul className="mt-3 space-y-2.5">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-fg/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
                >
                  {s}
                </span>
              ))}
            </div>

            {(project.repo || project.demo) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
                  >
                    <GitHubIcon width={16} height={16} /> Source
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    Live demo <ExternalIcon />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
