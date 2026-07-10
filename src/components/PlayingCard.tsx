import { motion, type Variants } from 'framer-motion'
import type { Project } from '../data/content'
import { play } from '../lib/sound'

interface Props {
  project: Project
  onSelect: (p: Project) => void
}

const isRed = (s: string) => s === '♥' || s === '♦'

// The deal is orchestrated by the parent container (staggerChildren), so every
// card animates in together when the table scrolls into view — no card is ever
// left invisible waiting for its own intersection (which broke on mobile).
const cardVariants: Variants = {
  hidden: { opacity: 0, x: 120, y: -70, rotate: 14, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 95, damping: 14 },
  },
}

/**
 * A face-up playing card for a project — readable at a glance (no hover
 * required, so it works on touch). Lifts/tilts on hover as a flourish;
 * click opens the modal.
 */
export default function PlayingCard({ project, onSelect }: Props) {
  const red = isRed(project.card.suit)

  return (
    <motion.button
      variants={cardVariants}
      onClick={() => {
        play('click')
        onSelect(project)
      }}
      onHoverStart={() => play('flip')}
      aria-label={`${project.name} — ${project.tagline}. Open details.`}
      className="group relative h-52 w-36 shrink-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:h-64 sm:w-44"
      whileHover={{ y: -14, rotate: red ? 1.5 : -1.5, transition: { duration: 0.2 } }}
    >
      <div className="flex h-full w-full flex-col justify-between rounded-2xl border border-gold/25 bg-white p-3 text-ink shadow-xl transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-gold/20">
        <div className="flex items-start justify-between">
          <CardCorner rank={project.card.rank} suit={project.card.suit} red={red} />
        </div>

        <div className="px-1 text-center">
          <span className={`text-3xl sm:text-4xl ${red ? 'text-card-red' : 'text-ink'}`}>
            {project.card.suit}
          </span>
          <h3 className="mt-1 font-display text-sm font-extrabold leading-tight sm:text-base">
            {project.name}
          </h3>
          <p className="mt-1 text-[10px] leading-snug text-ink/60 sm:text-[11px]">
            {project.tagline}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <span className="text-[10px] font-semibold text-ink/40 transition-colors group-hover:text-gold-soft">
            View →
          </span>
          <CardCorner
            rank={project.card.rank}
            suit={project.card.suit}
            red={red}
            flip
          />
        </div>
      </div>
    </motion.button>
  )
}

function CardCorner({
  rank,
  suit,
  red,
  flip,
}: {
  rank: string
  suit: string
  red: boolean
  flip?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center leading-none ${
        red ? 'text-card-red' : 'text-ink'
      } ${flip ? 'rotate-180' : ''}`}
    >
      <span className="font-display text-xs font-bold sm:text-sm">{rank}</span>
      <span className="text-xs sm:text-sm">{suit}</span>
    </div>
  )
}
