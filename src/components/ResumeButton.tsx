import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resumes } from '../data/content'
import { DownloadIcon, ChevronDown } from './Icons'

/**
 * Aakash targets three roles (SWE / DS / DE), so the resume button opens a
 * small menu to pick the right PDF instead of guessing.
 */
export default function ResumeButton({ tone = 'gold' }: { tone?: 'gold' | 'ghost' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const trigger =
    tone === 'gold'
      ? 'bg-gold text-ink hover:bg-gold-soft'
      : 'border border-line text-fg hover:border-gold/50 hover:text-gold'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${trigger}`}
      >
        <DownloadIcon width={16} height={16} />
        Resume
        <ChevronDown
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="glass absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl p-1.5 shadow-2xl"
          >
            <p className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted">
              Pick your table
            </p>
            {resumes.map((r) => (
              <a
                key={r.id}
                href={r.file}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
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
