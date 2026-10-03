'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'
import { sfx } from '@/lib/sfx'

const SEEN_KEY = 'gn-brand-splash-seen'
const HOLD_MS = 1100
const HOLD_REDUCED_MS = 450
const FADE_MS = 400
const FADE_REDUCED_MS = 120
const SKIP_KEYS: readonly string[] = ['Enter', ' ', 'Escape']
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

type Phase = 'idle' | 'show' | 'fade' | 'gone'

function alreadySeen(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Storage blocked: the splash may show again, which is harmless.
  }
}

function prefersReduced(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches
}

const noopSubscribe = (): (() => void) => () => undefined
const onClient = (): boolean => true
const onServer = (): boolean => false

/** Marks every top-level body child except the splash's own as inert. Returns a restore function. */
function inertBackground(overlay: HTMLElement | null): () => void {
  const own = overlay?.closest('body > *') ?? overlay
  const marked: Element[] = []
  Array.from(document.body.children).forEach((el) => {
    if (el === own || el.hasAttribute('inert')) return
    el.setAttribute('inert', '')
    marked.push(el)
  })
  return () => marked.forEach((el) => el.removeAttribute('inert'))
}

const OVERLAY_STYLE = {
  position: 'fixed',
  inset: 0,
  zIndex: 2147482000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.25rem',
  padding: '1rem',
  textAlign: 'center',
  background: 'var(--ink, #08090a)',
  cursor: 'pointer',
} as const

const TITLE_STYLE = {
  margin: 0,
  fontFamily: 'var(--font-josefin, "Josefin Sans"), sans-serif',
  fontWeight: 300,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  fontSize: 'clamp(2rem, 8vw, 4.5rem)',
  lineHeight: 1.1,
  color: 'var(--lime, #c6f24e)',
  backgroundImage:
    'linear-gradient(90deg, var(--cyan, #33c7e0), var(--lime, #c6f24e) 55%, var(--amber, #f2b84e))',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
} as const

const ENTER_STYLE = {
  minHeight: 44,
  padding: '0.6rem 1.5rem',
  borderRadius: 999,
  border: '1px solid color-mix(in srgb, var(--lime, #c6f24e) 45%, transparent)',
  background: 'color-mix(in srgb, var(--lime, #c6f24e) 12%, transparent)',
  color: 'var(--fg, #f3f4f0)',
  fontFamily: 'var(--font-poppins, Poppins), sans-serif',
  fontSize: '0.9rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  cursor: 'pointer',
} as const

/** While shown: hold timer, skip keys, inert background and focus on the enter button. */
function useShowPhase(
  phase: Phase,
  dismiss: (fromGesture: boolean) => void,
  overlay: RefObject<HTMLDivElement | null>,
  enter: RefObject<HTMLButtonElement | null>,
): void {
  useEffect(() => {
    if (phase !== 'show') return
    const restore = inertBackground(overlay.current)
    enter.current?.focus()
    const hold = window.setTimeout(
      () => dismiss(false),
      prefersReduced() ? HOLD_REDUCED_MS : HOLD_MS,
    )
    const onKey = (e: KeyboardEvent) => {
      if (SKIP_KEYS.includes(e.key)) {
        if (e.key === ' ') e.preventDefault()
        dismiss(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(hold)
      window.removeEventListener('keydown', onKey)
      restore()
    }
  }, [phase, dismiss, overlay, enter])
}

export default function Splash() {
  const mounted = useSyncExternalStore(noopSubscribe, onClient, onServer)
  // Lazy init runs on the client during hydration; the overlay is gated by `mounted`, so the
  // server HTML never contains it.
  const [phase, setPhase] = useState<Phase>(() => (alreadySeen() ? 'gone' : 'show'))
  const overlay = useRef<HTMLDivElement>(null)
  const enter = useRef<HTMLButtonElement>(null)

  const dismiss = useCallback((fromGesture: boolean) => {
    setPhase((p) => (p === 'show' ? 'fade' : p))
    if (fromGesture) {
      sfx.unlock()
      sfx.play('click')
    }
    markSeen()
  }, [])

  useShowPhase(mounted ? phase : 'idle', dismiss, overlay, enter)

  useEffect(() => {
    if (phase !== 'fade') return
    document.getElementById('main')?.focus({ preventScroll: true })
    const t = window.setTimeout(
      () => setPhase('gone'),
      prefersReduced() ? FADE_REDUCED_MS : FADE_MS,
    )
    return () => window.clearTimeout(t)
  }, [phase])

  if (!mounted || phase === 'gone') return null

  const fading = phase === 'fade'
  return (
    <div
      ref={overlay}
      className="gn-splash"
      role="dialog"
      aria-modal="true"
      aria-label="GN Ventures Brand Guidelines"
      data-sfx="none"
      onPointerDown={() => dismiss(true)}
      style={{
        ...OVERLAY_STYLE,
        opacity: fading ? 0 : 1,
        transition: `opacity ${prefersReduced() ? FADE_REDUCED_MS : FADE_MS}ms ease`,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <p style={TITLE_STYLE}>GN Ventures</p>
      <button
        ref={enter}
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          dismiss(true)
        }}
        style={ENTER_STYLE}
      >
        Tap to enter
      </button>
    </div>
  )
}
