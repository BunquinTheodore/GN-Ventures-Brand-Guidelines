'use client'

import { useEffect, useRef } from 'react'
import { ACTIVE_CLASS, HOTSPOT_X, HOTSPOT_Y, SIZE, createCursorTracker } from './cursorTracker'

/**
 * Mazal mascot cursor (public/cursor/cursor.svg: one pose, 128x128 art shown at
 * 40px; the pointing fingertip sits at about 16% across and 25% down).
 */
const HIDE_NATIVE_CSS = `html.${ACTIVE_CLASS},html.${ACTIVE_CLASS} *{cursor:none!important}`

export default function CustomCursor() {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elRef.current
    return el ? createCursorTracker(el) : undefined
  }, [])

  return (
    <>
      <style>{HIDE_NATIVE_CSS}</style>
      <div
        ref={elRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: SIZE,
          height: SIZE,
          zIndex: 2147483000,
          pointerEvents: 'none',
          opacity: 0,
          transform: 'translate3d(-100px,-100px,0)',
          transformOrigin: `${HOTSPOT_X}px ${HOTSPOT_Y}px`,
          willChange: 'transform',
          transition: 'opacity 120ms ease',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cursor/cursor.svg"
          alt=""
          width={SIZE}
          height={SIZE}
          draggable={false}
          style={{
            display: 'block',
            width: SIZE,
            height: SIZE,
            userSelect: 'none',
            filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.85)) drop-shadow(0 0 1px rgba(255,255,255,0.7))',
          }}
        />
      </div>
    </>
  )
}
