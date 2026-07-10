import { Link, useLocation } from 'react-router-dom'

const tables = [
  { path: '/poker', label: 'Poker', glyph: '♠' },
  { path: '/chess', label: 'Chess', glyph: '♟' },
  { path: '/straight', label: 'Classic', glyph: '▦' },
]

/** Segmented control to hop between the three tables; sits in each view's nav. */
export default function ViewSwitcher() {
  const { pathname } = useLocation()
  return (
    <div className="glass flex items-center gap-0.5 rounded-full p-1">
      {tables.map((t) => {
        const active = pathname === t.path
        return (
          <Link
            key={t.path}
            to={t.path}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'bg-gold text-ink'
                : 'text-muted hover:text-fg'
            }`}
          >
            <span aria-hidden>{t.glyph}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
