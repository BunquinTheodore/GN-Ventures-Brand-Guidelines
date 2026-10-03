'use client'

import { useEffect } from 'react'
import CustomCursor from './CustomCursor'
import Splash from './Splash'
import SoundToggle from './SoundToggle'
import { sfx, type SfxKind } from '@/lib/sfx'

const KINDS: readonly string[] = [
  'click',
  'nav',
  'copy',
  'download',
  'hover',
  'open',
  'toggle',
  'error',
]

function isKind(v: string | null): v is SfxKind {
  return v !== null && KINDS.includes(v)
}

/** Sound kind for a pointerdown target. null means stay silent (data-sfx="none"). */
function kindFor(target: EventTarget | null): SfxKind | null {
  if (!(target instanceof Element)) return 'click'
  const tagged = target.closest('[data-sfx]')
  if (tagged) {
    const v = tagged.getAttribute('data-sfx')
    if (v === 'none') return null
    if (isKind(v)) return v
  }
  if (target.closest('a[download]')) return 'download'
  if (target.closest('a[href^="#"]')) return 'nav'
  return 'click'
}

export default function FxProvider() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const kind = kindFor(e.target)
      if (!kind) return
      sfx.unlock()
      sfx.play(kind)
    }
    document.addEventListener('pointerdown', onDown, { capture: true, passive: true })
    return () => document.removeEventListener('pointerdown', onDown, { capture: true })
  }, [])

  return (
    <>
      <CustomCursor />
      <Splash />
      <SoundToggle />
    </>
  )
}
