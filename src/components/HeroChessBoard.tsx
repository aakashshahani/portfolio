import { Chessboard } from 'react-chessboard'

interface Props {
  fen: string
  onScrollToGame: () => void
}

/**
 * The hero board — a real chess.com-style board that auto-plays the "career
 * opening" (driven by the parent). Clicking it jumps to the annotated game.
 */
export default function HeroChessBoard({ fen, onScrollToGame }: Props) {
  return (
    <div className="w-full max-w-sm cursor-pointer" onClick={onScrollToGame}>
      <Chessboard
        options={{
          position: fen,
          boardOrientation: 'white',
          allowDragging: false,
          animationDurationInMs: 500,
          showNotation: false,
          darkSquareStyle: { backgroundColor: '#123a2c' },
          lightSquareStyle: { backgroundColor: '#cdb892' },
          boardStyle: {
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px -20px rgba(0,0,0,0.7)',
            border: '1px solid rgba(232,195,122,0.25)',
          },
          id: 'hero-board',
        }}
      />
    </div>
  )
}
