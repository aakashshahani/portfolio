import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resumes } from '../data/content'
import { DownloadIcon, ChevronDown } from './Icons'

/**
 * Split button: the main click downloads the default (SWE) resume in one
 * step — recruiters shouldn't need two clicks — while the chevron opens the
 * role-targeted picker (DS / DE).
 */
export default function ResumeButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const primary = resumes[0]

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative inline-flex">
      <a
        href={primary.file}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-l-full bg-gold py-2.5 pl-5 pr-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
      >
        <DownloadIcon width={16} height={16} />
        Resume
      </a>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Choose a role-targeted resume"
        className="inline-flex items-center rounded-r-full border-l border-ink/25 bg-gold px-2.5 text-ink transition-colors hover:bg-gold-soft"
      >
        <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="glass absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl p-1.5 shadow-2xl"
          >
            <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted">
              Role-targeted builds
            </p>
            {resumes.map((r) => (
              <a
                key={r.id}
                href={r.file}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-fg/5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold">
                  <DownloadIcon width={16} height={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-fg">
                    {r.label}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {r.blurb}
                  </span>
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
