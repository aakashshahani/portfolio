import { motion } from 'framer-motion'
import { profile } from '../data/content'

/**
 * The dealer at the head of the table — a stylized croupier (monogram + bowtie,
 * no photo) that the community cards are dealt from. Idle-bobs and the deck
 * riffles slightly.
 */
export default function Dealer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 flex flex-col items-center"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center"
      >
        {/* avatar */}
        <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-gold/50 bg-gradient-to-b from-felt-2 to-ink shadow-lg shadow-black/40">
          <span className="text-gradient-gold font-display text-xl font-black">
            {profile.initials}
          </span>
          {/* collar + bowtie */}
          <svg
            viewBox="0 0 40 20"
            className="absolute -bottom-2 h-5 w-10"
            aria-hidden
          >
            <path d="M6 2 L20 8 L34 2 L34 6 L22 12 L18 12 L6 6 Z" fill="#e9efec" opacity="0.85" />
            <path d="M12 10 L20 8 L20 16 Z" fill="#e5484d" />
            <path d="M28 10 L20 8 L20 16 Z" fill="#e5484d" />
            <rect x="18.5" y="9.5" width="3" height="5" rx="1" fill="#b83a3e" />
          </svg>
        </div>

        {/* deck in hand */}
        <div aria-hidden className="relative mt-4 h-6 w-10">
          {[0, 1, 2].map((k) => (
            <motion.div
              key={k}
              className="absolute inset-0 rounded-md border border-gold/30 bg-gradient-to-br from-felt-2 to-felt shadow"
              animate={{ x: [0, k === 2 ? 2 : 0, 0], rotate: [0, k === 2 ? 3 : 0, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: k * 0.1 }}
              style={{ transform: `translate(${k * 1.5}px, ${-k * 1.5}px)` }}
            />
          ))}
        </div>
      </motion.div>

      <span className="mt-3 rounded-full border border-gold/30 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-soft">
        Dealer · {profile.name.split(' ')[0]}
      </span>
    </motion.div>
  )
}
