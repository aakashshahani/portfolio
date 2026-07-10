import { motion } from 'framer-motion'
import { careerMoves, openingName, type CareerMove } from '../data/content'

interface Props {
  activePly: number // 0..moves.length (0 = start, i = after i-th half-move)
  onSelect: (ply: number) => void
  onOpenProject: (projectId: string) => void
}

const annotationColor: Record<string, string> = {
  '!': 'text-chip-blue',
  '!!': 'text-gold',
  '?!': 'text-card-red',
}

/**
 * A PGN-style score sheet of the career. Rows pair White/Black half-moves; the
 * active move (synced to the hero board) is highlighted. Annotated results
 * (!, !!) link to the project.
 */
export default function MoveList({ activePly, onSelect, onOpenProject }: Props) {
  // Group half-moves into numbered rows (White + Black).
  const rows: { no: string; white?: CareerMove; black?: CareerMove; wPly?: number; bPly?: number }[] = []
  careerMoves.forEach((m, i) => {
    const ply = i + 1
    if (m.side === 'w') rows.push({ no: m.no.replace('.', ''), white: m, wPly: ply })
    else {
      const last = rows[rows.length - 1]
      if (last && !last.black) {
        last.black = m
        last.bPly = ply
      } else rows.push({ no: m.no.replace('…', ''), black: m, bPly: ply })
    }
  })

  const Move = ({ m, ply }: { m: CareerMove; ply: number }) => {
    const active = activePly === ply
    return (
      <button
        onClick={() => {
          onSelect(ply)
          if (m.projectId) onOpenProject(m.projectId)
        }}
        className={`group flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
          active ? 'bg-gold/15' : 'hover:bg-white/5'
        }`}
      >
        <span className="mt-0.5 whitespace-nowrap font-mono text-sm font-semibold text-fg">
          {m.move}
          {m.annotation && (
            <span className={annotationColor[m.annotation]}>{m.annotation}</span>
          )}
        </span>
        <span className="text-xs leading-snug text-muted group-hover:text-fg/80">
          {m.note}
        </span>
      </button>
    )
  }

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
        <span className="font-display text-sm font-bold text-fg">Game score</span>
        <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold">
          {openingName}
        </span>
      </div>
      <div className="space-y-0.5">
        {rows.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[1.4rem_1fr] items-start gap-1"
          >
            <span className="pt-1.5 text-right font-mono text-xs text-muted">
              {r.no}.
            </span>
            <div className="min-w-0">
              {r.white && r.wPly !== undefined && <Move m={r.white} ply={r.wPly} />}
              {r.black && r.bPly !== undefined && <Move m={r.black} ply={r.bPly} />}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 border-t border-line pt-3 text-[11px] text-muted">
        <span className="text-chip-blue">!</span> strong ·{' '}
        <span className="text-gold">!!</span> brilliant — tap a move to view it.
      </p>
    </div>
  )
}
