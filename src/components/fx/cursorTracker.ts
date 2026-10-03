/**
 * Pointer tracking for the Mazal mascot cursor. Pure DOM, no React: createCursorTracker wires
 * listeners while a fine pointer is present and returns a cleanup function.
 *
 * The native cursor is hidden (html.gn-cursor-on) ONLY while the mascot is visible, so users never
 * lose their system pointer before the first move, after a pointer leave or a tab switch.
 */

export const SIZE = 40
export const HOTSPOT_X = Math.round(SIZE * 0.16)
export const HOTSPOT_Y = Math.round(SIZE * 0.25)
export const ACTIVE_CLASS = 'gn-cursor-on'
const EASE = 0.28
const HOVER_SCALE = 1.25
const PRESS_SCALE = 0.82
const SCALE_EASE = 0.25
const SETTLE_DISTANCE = 0.1
const SETTLE_SCALE = 0.005
const INTERACTIVE = 'a[href],button,[role="button"],[data-cursor],summary,label[for],select'
const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const FORCED_COLORS = '(forced-colors: active)'

interface CursorState {
  x: number
  y: number
  tx: number
  ty: number
  scale: number
  hovering: boolean
  pressed: boolean
  visible: boolean
  raf: number
}

function initialState(): CursorState {
  return { x: -100, y: -100, tx: -100, ty: -100, scale: 1, hovering: false, pressed: false, visible: false, raf: 0 }
}

function targetScaleOf(s: CursorState): number {
  if (s.pressed) return PRESS_SCALE
  return s.hovering ? HOVER_SCALE : 1
}

function isSettled(s: CursorState, goal: number): boolean {
  return (
    Math.abs(s.tx - s.x) < SETTLE_DISTANCE &&
    Math.abs(s.ty - s.y) < SETTLE_DISTANCE &&
    Math.abs(goal - s.scale) < SETTLE_SCALE
  )
}

function step(s: CursorState, goal: number, snap: boolean): void {
  if (snap) {
    s.x = s.tx
    s.y = s.ty
    s.scale = goal
    return
  }
  s.x += (s.tx - s.x) * EASE
  s.y += (s.ty - s.y) * EASE
  s.scale += (goal - s.scale) * SCALE_EASE
}

/** Attaches the pointer listeners and returns their cleanup. */
function attach(el: HTMLElement, reduced: MediaQueryList): () => void {
  const state = initialState()
  const root = document.documentElement

  const render = () => {
    el.style.transform = `translate3d(${state.x - HOTSPOT_X}px,${state.y - HOTSPOT_Y}px,0) scale(${state.scale})`
  }
  const tick = () => {
    state.raf = 0
    const goal = targetScaleOf(state)
    step(state, goal, reduced.matches)
    render()
    if (!isSettled(state, goal) && !document.hidden) schedule()
  }
  const schedule = () => {
    if (!state.raf) state.raf = requestAnimationFrame(tick)
  }
  const setVisible = (v: boolean) => {
    state.visible = v
    el.style.opacity = v ? '1' : '0'
    root.classList.toggle(ACTIVE_CLASS, v)
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    if (!state.visible) {
      state.x = e.clientX
      state.y = e.clientY
      setVisible(true)
    }
    state.tx = e.clientX
    state.ty = e.clientY
    state.hovering = !!(e.target instanceof Element && e.target.closest(INTERACTIVE))
    schedule()
  }
  const onDown = () => {
    state.pressed = true
    schedule()
  }
  const onUp = () => {
    state.pressed = false
    schedule()
  }
  const onLeave = () => setVisible(false)
  const onVisibility = () => {
    if (!document.hidden) return
    if (state.raf) cancelAnimationFrame(state.raf)
    state.raf = 0
    setVisible(false)
  }

  document.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerdown', onDown, { passive: true })
  document.addEventListener('pointerup', onUp, { passive: true })
  document.addEventListener('pointercancel', onUp, { passive: true })
  root.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', onVisibility)
  return () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerdown', onDown)
    document.removeEventListener('pointerup', onUp)
    document.removeEventListener('pointercancel', onUp)
    root.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    if (state.raf) cancelAnimationFrame(state.raf)
    state.raf = 0
    setVisible(false)
  }
}

/** Starts tracking while a fine pointer is present (and not in forced-colors). Returns cleanup. */
export function createCursorTracker(el: HTMLElement): () => void {
  const fine = window.matchMedia(FINE_POINTER)
  const forced = window.matchMedia(FORCED_COLORS)
  const reduced = window.matchMedia(REDUCED_MOTION)
  let detach: (() => void) | null = null

  const sync = () => {
    const want = fine.matches && !forced.matches
    if (want && !detach) detach = attach(el, reduced)
    if (!want && detach) {
      detach()
      detach = null
    }
  }
  sync()
  fine.addEventListener('change', sync)
  forced.addEventListener('change', sync)
  return () => {
    fine.removeEventListener('change', sync)
    forced.removeEventListener('change', sync)
    detach?.()
    detach = null
  }
}
