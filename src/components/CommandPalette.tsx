import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { profile, projects, resumes } from '../data/content'

type Command = {
  id: string
  label: string
  hint?: string
  glyph: string
  run: () => void
}

/** ⌘K / Ctrl-K command palette — a power-user shortcut available everywhere. */
export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      { id: 'lobby', label: 'Go to Lobby', glyph: '⌂', run: () => navigate('/') },
      { id: 'poker', label: 'Poker table', glyph: '♠', run: () => navigate('/poker') },
      { id: 'chess', label: 'Chess view', glyph: '♟', run: () => navigate('/chess') },
      { id: 'straight', label: 'Classic view', glyph: '▦', run: () => navigate('/straight') },
    ]
    const links: Command[] = [
      { id: 'github', label: 'Open GitHub', glyph: '↗', run: () => window.open(profile.github, '_blank') },
      { id: 'linkedin', label: 'Open LinkedIn', glyph: '↗', run: () => window.open(profile.linkedin, '_blank') },
      { id: 'email', label: 'Copy email', hint: profile.email, glyph: '✉', run: () => navigator.clipboard?.writeText(profile.email) },
    ]
    const secrets: Command[] = [
      { id: 'hire', label: 'sudo hire-me', hint: 'best decision you’ll make today', glyph: '✦', run: () => window.open(`mailto:${profile.email}?subject=Let’s talk`) },
      { id: 'whoami', label: 'whoami', hint: profile.tagline, glyph: '✦', run: () => navigate('/straight') },
      { id: 'allin', label: 'all in', hint: 'go to the poker table', glyph: '♠', run: () => navigate('/poker') },
    ]
    const res: Command[] = resumes.map((r) => ({
      id: `resume-${r.id}`,
      label: `Resume — ${r.label}`,
      glyph: '⤓',
      run: () => window.open(r.file, '_blank'),
    }))
    const proj: Command[] = projects.map((p) => ({
      id: `proj-${p.id}`,
      label: p.name,
      hint: p.tagline,
      glyph: p.card.suit,
      run: () => p.repo && window.open(p.repo, '_blank'),
    }))
    return [...nav, ...links, ...res, ...proj, ...secrets]
  }, [navigate])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q),
    )
  }, [query, commands])

  const [active, setActive] = useState(0)
  useEffect(() => setActive(0), [query, open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40)
    else setQuery('')
  }, [open])

  const runAt = (i: number) => {
    const cmd = filtered[i]
    if (!cmd) return
    cmd.run()
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="glass w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="text-muted">⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setActive((a) => Math.min(a + 1, filtered.length - 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setActive((a) => Math.max(a - 1, 0))
                  } else if (e.key === 'Enter') {
                    e.preventDefault()
                    runAt(active)
                  }
                }}
                placeholder="Jump to a view, project, or link…"
                className="w-full bg-transparent py-4 text-fg outline-none placeholder:text-muted"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted">
                  No matches. Fold and try again.
                </li>
              )}
              {filtered.map((c, i) => (
                <li key={c.id}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => runAt(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      i === active ? 'bg-white/8' : ''
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold">
                      {c.glyph}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-fg">
                        {c.label}
                      </span>
                      {c.hint && (
                        <span className="block truncate text-xs text-muted">
                          {c.hint}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
