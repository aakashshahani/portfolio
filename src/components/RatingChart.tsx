import { motion } from 'framer-motion'
import { ratingCurve } from '../data/content'

/** A chess.com-style rating growth curve for the Endgame section. */
export default function RatingChart() {
  const W = 520
  const H = 200
  const pad = { l: 40, r: 20, t: 20, b: 30 }
  const ratings = ratingCurve.map((p) => p.rating)
  const min = Math.min(...ratings) - 100
  const max = Math.max(...ratings) + 100
  const innerW = W - pad.l - pad.r
  const innerH = H - pad.t - pad.b

  const x = (i: number) => pad.l + (i / (ratingCurve.length - 1)) * innerW
  const y = (r: number) => pad.t + (1 - (r - min) / (max - min)) * innerH

  const linePath = ratingCurve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.rating)}`)
    .join(' ')
  const areaPath = `${linePath} L ${x(ratingCurve.length - 1)} ${pad.t + innerH} L ${x(0)} ${pad.t + innerH} Z`

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className="font-display font-bold text-fg">Rating</h3>
        <span className="font-mono text-lg font-bold text-gold">
          {ratings[ratings.length - 1]}
        </span>
      </div>
      <p className="mb-3 text-xs text-muted">Trajectory over time — always climbing.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Rating growth chart">
        <defs>
          <linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8c37a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e8c37a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0, 0.5, 1].map((g) => (
          <line
            key={g}
            x1={pad.l}
            x2={W - pad.r}
            y1={pad.t + g * innerH}
            y2={pad.t + g * innerH}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}

        <motion.path
          d={areaPath}
          fill="url(#ratingFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#e8c37a"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />
        {ratingCurve.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={x(i)}
              cy={y(p.rating)}
              r={4}
              fill="#0a0f0d"
              stroke="#e8c37a"
              strokeWidth={2}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.12 }}
            />
            <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted" fontSize="11">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
