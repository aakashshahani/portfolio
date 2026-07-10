import { useSyncExternalStore } from 'react'
import { isSoundOn, subscribeSound, toggleSound } from '../lib/sound'

/** Small speaker toggle — sound is opt-in and off by default. */
export default function SoundToggle({ className = '' }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => false)

  return (
    <button
      onClick={toggleSound}
      aria-pressed={on}
      aria-label={on ? 'Mute sound' : 'Enable sound'}
      title={on ? 'Sound on' : 'Sound off'}
      className={`grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-gold/50 hover:text-gold aria-pressed:text-gold ${className}`}
    >
      {on ? <SpeakerOn /> : <SpeakerOff />}
    </button>
  )
}

function SpeakerOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" />
    </svg>
  )
}

function SpeakerOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m23 9-6 6M17 9l6 6" />
    </svg>
  )
}
