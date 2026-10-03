/**
 * Synthesized UI sound effects (Web Audio API, no audio files).
 * SSR-safe: nothing touches window or AudioContext at module load.
 */

export type SfxKind =
  | 'click'
  | 'nav'
  | 'copy'
  | 'download'
  | 'hover'
  | 'open'
  | 'toggle'
  | 'error'

interface Note {
  readonly freq: number
  readonly endFreq?: number
  readonly start: number // seconds from trigger
  readonly dur: number // seconds, kept under ~0.12 in total
  readonly type: OscillatorType
  readonly gain: number
}

const STORAGE_KEY = 'gn-brand-sfx-muted'
const MASTER_GAIN = 0.5
const ATTACK = 0.005
const MIN_GAP_MS: Readonly<Record<SfxKind, number>> = {
  click: 45,
  nav: 60,
  copy: 80,
  download: 80,
  hover: 90,
  open: 80,
  toggle: 60,
  error: 120,
}

const RECIPES: Readonly<Record<SfxKind, readonly Note[]>> = {
  click: [{ freq: 520, endFreq: 380, start: 0, dur: 0.06, type: 'sine', gain: 0.16 }],
  nav: [
    { freq: 660, start: 0, dur: 0.05, type: 'triangle', gain: 0.12 },
    { freq: 880, start: 0.045, dur: 0.06, type: 'triangle', gain: 0.1 },
  ],
  copy: [
    { freq: 740, start: 0, dur: 0.045, type: 'sine', gain: 0.14 },
    { freq: 1110, start: 0.04, dur: 0.07, type: 'sine', gain: 0.12 },
  ],
  download: [{ freq: 420, endFreq: 840, start: 0, dur: 0.11, type: 'triangle', gain: 0.13 }],
  hover: [{ freq: 1400, start: 0, dur: 0.025, type: 'sine', gain: 0.04 }],
  open: [
    { freq: 392, start: 0, dur: 0.05, type: 'sine', gain: 0.12 },
    { freq: 588, start: 0.045, dur: 0.07, type: 'sine', gain: 0.12 },
  ],
  toggle: [{ freq: 300, endFreq: 600, start: 0, dur: 0.07, type: 'square', gain: 0.05 }],
  error: [
    { freq: 220, start: 0, dur: 0.055, type: 'sawtooth', gain: 0.07 },
    { freq: 165, start: 0.06, dur: 0.06, type: 'sawtooth', gain: 0.07 },
  ],
}

type AudioCtor = typeof AudioContext

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
let mutedLoaded = false
const lastPlayed: Partial<Record<SfxKind, number>> = {}
const listeners = new Set<() => void>()

function loadMuted(): void {
  if (mutedLoaded) return
  mutedLoaded = true
  try {
    muted = window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    // Storage blocked: stay unmuted for this session.
  }
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (ctx) return ctx
  const w = window as unknown as { webkitAudioContext?: AudioCtor }
  const Ctor: AudioCtor | undefined = window.AudioContext ?? w.webkitAudioContext
  if (!Ctor) return null
  try {
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = MASTER_GAIN
    master.connect(ctx.destination)
  } catch {
    ctx = null
    master = null
  }
  return ctx
}

function scheduleNote(audio: AudioContext, out: AudioNode, note: Note, t0: number): void {
  const osc = audio.createOscillator()
  const env = audio.createGain()
  const begin = t0 + note.start
  const end = begin + note.dur
  osc.type = note.type
  osc.frequency.setValueAtTime(note.freq, begin)
  if (note.endFreq) osc.frequency.exponentialRampToValueAtTime(note.endFreq, end)
  env.gain.setValueAtTime(0.0001, begin)
  env.gain.linearRampToValueAtTime(note.gain, begin + ATTACK)
  env.gain.exponentialRampToValueAtTime(0.0001, end)
  osc.connect(env)
  env.connect(out)
  osc.start(begin)
  osc.stop(end + 0.02)
  osc.onended = () => {
    osc.disconnect()
    env.disconnect()
  }
}

/** True when a sound of this kind is allowed now. Exported for tests. */
export function shouldPlay(kind: SfxKind, now: number, last: number | undefined): boolean {
  return last === undefined || now - last >= MIN_GAP_MS[kind]
}

function play(kind: SfxKind): void {
  if (typeof window === 'undefined') return
  loadMuted()
  if (muted) return
  const now = performance.now()
  if (!shouldPlay(kind, now, lastPlayed[kind])) return
  const audio = getContext()
  if (!audio || !master) return
  lastPlayed[kind] = now
  const out = master
  const run = () => {
    const t0 = audio.currentTime + 0.005
    RECIPES[kind].forEach((note) => scheduleNote(audio, out, note, t0))
  }
  if (audio.state === 'suspended') {
    audio.resume().then(run, () => undefined)
  } else {
    run()
  }
}

function setMuted(next: boolean): void {
  if (typeof window === 'undefined') return
  loadMuted()
  muted = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
  listeners.forEach((fn) => fn())
}

/** Subscribe to mute changes (for useSyncExternalStore). Returns an unsubscribe function. */
function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function isMuted(): boolean {
  if (typeof window === 'undefined') return false
  loadMuted()
  return muted
}

/** Create or resume the shared context. Call from a user gesture. */
function unlock(): void {
  const audio = getContext()
  if (audio && audio.state === 'suspended') audio.resume().catch(() => undefined)
}

export const sfx = { play, setMuted, isMuted, unlock, subscribe } as const
