import { motion } from 'framer-motion'
import { play } from '../lib/sound'

export interface ChipStyle {
  base: string // face color
  edge: string // edge stripe color
  text: string
}

// Standard casino denominations, used to theme skill groups.
export const CHIP_STYLES: ChipStyle[] = [
  { base: '#e5484d', edge: '#ffffff', text: '#fff' }, // red $5
  { base: '#4c6ef5', edge: '#ffffff', text: '#fff' }, // blue $10
  { base: '#1f8a5b', edge: '#ffffff', text: '#fff' }, // green $25
  { base: '#161616', edge: '#e8c37a', text: '#e8c37a' }, // black $100
  { base: '#7c3aed', edge: '#ffffff', text: '#fff' }, // purple $500
  { base: '#e8c37a', edge: '#0a0f0d', text: '#0a0f0d' }, // gold $1k
]

/** A single casino chip with edge spots and a centre value. */
export function Chip({
  style,
  value,
  size = 84,
}: {
  style: ChipStyle
  value: string
  size?: number
}) {
  const spots = Array.from({ length: 8 })
  return (
    <div
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: style.base,
        boxShadow: `inset 0 0 0 3px ${style.base}, 0 6px 14px -4px rgba(0,0,0,0.6)`,
      }}
    >
      {/* edge spots */}
      {spots.map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-[2px]"
          style={{
            width: size * 0.12,
            height: size * 0.2,
            background: style.edge,
            transform: `translate(-50%,-50%) rotate(${i * 45}deg) translateY(-${size * 0.4}px)`,
            opacity: 0.9,
          }}
        />
      ))}
      {/* inner ring + value */}
      <div
        className="absolute inset-[18%] grid place-items-center rounded-full border-2 border-dashed"
        style={{ borderColor: `${style.edge}88` }}
      >
        <span
          className="font-display font-black leading-none"
          style={{ color: style.text, fontSize: size * 0.22 }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

/** A stack of chips with a skill group's label and its items. */
export function ChipStack({
  style,
  value,
  label,
  items,
  index,
}: {
  style: ChipStyle
  value: string
  label: string
  items: string[]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      onHoverStart={() => play('chip')}
      className="glass flex flex-col items-center rounded-2xl p-5 text-center"
    >
      {/* stacked chips */}
      <div className="relative mb-4 h-24 w-24">
        {[0, 1, 2, 3].map((k) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 + k * 0.05, type: 'spring', stiffness: 160 }}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: k * 9 }}
          >
            <Chip style={style} value={k === 3 ? value : ''} size={84} />
          </motion.div>
        ))}
      </div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gold">
        {label}
      </h3>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {items.map((s) => (
          <span key={s} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-fg/80">
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
