// Tiny synthesized sound engine (Web Audio) — no audio files to ship.
// Off by default; the visitor opts in via the speaker toggle. All sounds are
// short, soft, and only ever fire on user interaction.

type SoundName = 'deal' | 'flip' | 'chip' | 'move' | 'win' | 'click'

const KEY = 'as-portfolio-sound'

let ctx: AudioContext | null = null
let enabled = load()
const listeners = new Set<(v: boolean) => void>()

function load(): boolean {
  try {
    return localStorage.getItem(KEY) === 'on'
  } catch {
    return false
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function isSoundOn() {
  return enabled
}

export function setSoundOn(v: boolean) {
  enabled = v
  try {
    localStorage.setItem(KEY, v ? 'on' : 'off')
  } catch {
    /* ignore */
  }
  if (v) {
    getCtx() // warm up on the enabling gesture
    play('chip')
  }
  listeners.forEach((l) => l(v))
}

export function toggleSound() {
  setSoundOn(!enabled)
}

export function subscribeSound(cb: (v: boolean) => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

// --- tiny synth helpers ------------------------------------------------------
function tone(
  ac: AudioContext,
  {
    freq,
    type = 'sine',
    start = 0,
    dur = 0.12,
    gain = 0.12,
    slideTo,
  }: {
    freq: number
    type?: OscillatorType
    start?: number
    dur?: number
    gain?: number
    slideTo?: number
  },
) {
  const t = ac.currentTime + start
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(ac.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

function noise(ac: AudioContext, { dur = 0.14, gain = 0.06, hp = 800 } = {}) {
  const t = ac.currentTime
  const frames = Math.floor(ac.sampleRate * dur)
  const buf = ac.createBuffer(1, frames, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames) // decaying
  }
  const src = ac.createBufferSource()
  src.buffer = buf
  const filter = ac.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = hp
  const g = ac.createGain()
  g.gain.value = gain
  src.connect(filter).connect(g).connect(ac.destination)
  src.start(t)
}

export function play(name: SoundName) {
  if (!enabled) return
  const ac = getCtx()
  if (!ac) return
  switch (name) {
    case 'deal':
      noise(ac, { dur: 0.16, gain: 0.05, hp: 1200 }) // card sliding
      break
    case 'flip':
      noise(ac, { dur: 0.08, gain: 0.05, hp: 2000 })
      break
    case 'chip':
      tone(ac, { freq: 880, type: 'triangle', dur: 0.05, gain: 0.06 })
      tone(ac, { freq: 1320, type: 'triangle', start: 0.04, dur: 0.05, gain: 0.05 })
      break
    case 'move': // wooden chess thunk
      tone(ac, { freq: 190, type: 'triangle', dur: 0.13, gain: 0.14, slideTo: 90 })
      break
    case 'click':
      tone(ac, { freq: 520, type: 'sine', dur: 0.05, gain: 0.05 })
      break
    case 'win': // small ascending arpeggio
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(ac, { freq: f, type: 'triangle', start: i * 0.09, dur: 0.16, gain: 0.09 }),
      )
      break
  }
}
