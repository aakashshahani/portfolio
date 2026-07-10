import { useMemo, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chess, type Square } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import ResumeButton from './ResumeButton'
import { play } from '../lib/sound'

// A real, verified mate in 3 — the classic smothered mate ("Philidor's Legacy").
// The start is a legal position (neither side already in check), and every
// Black reply is forced (exactly one legal move), so the opponent's responses
// are played deterministically. Verified with chess.js:
//   1. Nh6+ (discovered double check!) Kh8  2. Qg8+ Rxg8  3. Nf7#
const START_FEN = '5rk1/5Npp/8/8/8/1Q6/8/6K1 w - - 0 1'
const SOLUTION: { from: Square; to: Square }[] = [
  { from: 'f7', to: 'h6' }, // Nh6+  (uncovers Qb3 -> double check)
  { from: 'b3', to: 'g8' }, // Qg8+  (queen sacrifice)
  { from: 'h6', to: 'f7' }, // Nf7#  (smothered mate)
]

type Status = 'playing' | 'wrong' | 'solved'

export default function ChessPuzzle() {
  // One persistent game instance.
  const gameRef = useRef<Chess | null>(null)
  if (!gameRef.current) gameRef.current = new Chess(START_FEN)
  const game = gameRef.current

  const [fen, setFen] = useState(START_FEN)
  const [status, setStatus] = useState<Status>('playing')
  const [tries, setTries] = useState(0)
  const [selected, setSelected] = useState<Square | null>(null)
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null)
  const [hint, setHint] = useState<Square | null>(null)
  const moveIndex = useRef(0)

  const message = useMemo(() => {
    if (status === 'solved') return 'Checkmate — a smothered mate. Beautifully done. The resume is yours.'
    if (status === 'wrong')
      return "Not the solution. It's a forcing sequence — every check leaves Black one reply. Find the knight’s path."
    return 'White to move · mate in 3. Drag a piece (or tap-tap). Sacrifice boldly.'
  }, [status])

  const reset = useCallback(() => {
    game.load(START_FEN)
    moveIndex.current = 0
    setFen(START_FEN)
    setStatus('playing')
    setSelected(null)
    setLastMove(null)
    setHint(null)
  }, [game])

  const solve = useCallback(() => {
    setStatus('solved')
    setSelected(null)
    setHint(null)
    play('move')
    setTimeout(() => play('win'), 200)
  }, [])

  // Attempt a user (White) move; only the puzzle's correct move is accepted.
  const tryMove = useCallback(
    (from: Square, to: Square): boolean => {
      if (status === 'solved') return false
      const expected = SOLUTION[moveIndex.current]
      if (!expected || from !== expected.from || to !== expected.to) {
        setStatus('wrong')
        setTries((t) => t + 1)
        setSelected(null)
        return false
      }

      game.move({ from, to, promotion: 'q' })
      setFen(game.fen())
      setLastMove({ from, to })
      setStatus('playing')
      setSelected(null)
      setHint(null)
      moveIndex.current += 1
      play('move')

      if (game.isCheckmate()) {
        solve()
        return true
      }

      // Black's reply is forced (unique) — play it after a short beat.
      setTimeout(() => {
        const replies = game.moves({ verbose: true })
        if (replies.length) {
          const r = replies[0]
          game.move(r)
          setFen(game.fen())
          setLastMove({ from: r.from as Square, to: r.to as Square })
          play('move')
        }
      }, 380)
      return true
    },
    [game, status, solve],
  )

  // Drag-to-move
  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
      if (!targetSquare) return false
      return tryMove(sourceSquare as Square, targetSquare as Square)
    },
    [tryMove],
  )

  // Click / tap-to-move (chess.com style)
  const onSquareClick = useCallback(
    ({ square, piece }: { square: string; piece: { pieceType: string } | null }) => {
      if (status === 'solved') return
      const sq = square as Square
      if (selected) {
        if (sq === selected) {
          setSelected(null)
          return
        }
        // clicking another white piece re-selects
        if (piece && piece.pieceType.startsWith('w')) {
          setSelected(sq)
          return
        }
        tryMove(selected, sq)
        return
      }
      if (piece && piece.pieceType.startsWith('w')) setSelected(sq)
    },
    [selected, status, tryMove],
  )

  const showHint = () => {
    const exp = SOLUTION[moveIndex.current]
    if (exp) setHint(exp.from)
  }

  // Square highlights
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {}
    const ring = 'inset 0 0 0 3px rgba(232,195,122,0.9)'
    if (lastMove) {
      styles[lastMove.from] = { background: 'rgba(232,195,122,0.18)' }
      styles[lastMove.to] = { background: 'rgba(232,195,122,0.28)' }
    }
    if (hint) styles[hint] = { boxShadow: ring, background: 'rgba(232,195,122,0.25)' }
    if (selected) {
      styles[selected] = { background: 'rgba(232,195,122,0.35)' }
      // legal destinations for the selected piece
      for (const m of game.moves({ square: selected, verbose: true })) {
        styles[m.to] = {
          ...(styles[m.to] || {}),
          background: game.get(m.to as Square)
            ? 'radial-gradient(circle, transparent 58%, rgba(229,72,77,0.55) 60%)'
            : 'radial-gradient(circle, rgba(232,195,122,0.55) 24%, transparent 26%)',
        }
      }
    }
    return styles
  }, [lastMove, hint, selected, game, fen]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="glass mx-auto flex max-w-md flex-col items-center rounded-3xl p-6 text-center sm:p-8">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
        Endgame · daily puzzle
      </p>
      <h3 className="mt-2 font-display text-2xl font-extrabold">Mate in three.</h3>
      <p className="mt-2 min-h-[3rem] max-w-sm text-sm text-muted">{message}</p>

      <div className="mt-4 w-[min(82vw,360px)]">
        <Chessboard
          options={{
            position: fen,
            boardOrientation: 'white',
            onPieceDrop,
            onSquareClick,
            squareStyles,
            allowDragging: status !== 'solved',
            animationDurationInMs: 250,
            darkSquareStyle: { backgroundColor: '#123a2c' },
            lightSquareStyle: { backgroundColor: '#cdb892' },
            darkSquareNotationStyle: { color: '#cdb892' },
            lightSquareNotationStyle: { color: '#123a2c' },
            id: 'mate-in-3',
          }}
        />
      </div>

      {/* controls */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
        <button
          onClick={showHint}
          disabled={status === 'solved'}
          className="rounded-full border border-line px-4 py-1.5 text-muted transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-40"
        >
          💡 Hint
        </button>
        <button
          onClick={reset}
          className="rounded-full border border-line px-4 py-1.5 text-muted transition-colors hover:border-gold/50 hover:text-gold"
        >
          ↺ Reset
        </button>
        {tries > 1 && status !== 'solved' && (
          <span className="text-muted/70">tip: it starts with a knight check.</span>
        )}
      </div>

      <div className="mt-5 min-h-[3rem]">
        <AnimatePresence mode="wait">
          {status === 'solved' ? (
            <motion.div
              key="won"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ResumeButton />
            </motion.div>
          ) : (
            <motion.button
              key="skip"
              exit={{ opacity: 0 }}
              onClick={solve}
              className="text-xs text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
            >
              Not a chess player? Skip straight to the resume →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
