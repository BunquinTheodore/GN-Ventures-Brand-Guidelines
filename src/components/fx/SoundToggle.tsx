'use client'

import { sfx } from '@/lib/sfx'
import { useSfxMuted } from '@/lib/useSfxMuted'

interface SoundToggleProps {
  /** Fixed top-right at lg+ by default (hidden below, TopBar hosts its own). Pass false to place it inside TopBar. */
  readonly floating?: boolean
  readonly className?: string
}

function SpeakerIcon({ muted }: { readonly muted: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="m16 9 5 6m0-6-5 6" />
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  )
}

const BASE =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 ' +
  'bg-[color-mix(in_srgb,var(--ink,#08090a)_60%,transparent)] text-[var(--fg,#f3f4f0)] ' +
  'backdrop-blur-md hover:text-[var(--lime,#c6f24e)] focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-[var(--lime,#c6f24e)]'

export default function SoundToggle({ floating = true, className = '' }: SoundToggleProps) {
  const muted = useSfxMuted()

  const onClick = () => {
    const next = !muted
    sfx.setMuted(next)
    if (!next) {
      sfx.unlock()
      sfx.play('toggle')
    }
  }

  const position = floating ? 'fixed right-4 top-4 z-[70] max-lg:hidden ' : ''
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!muted}
      aria-label="Interface sounds"
      title={muted ? 'Sounds off. Turn on' : 'Sounds on. Turn off'}
      data-sfx="none"
      className={`${position}${BASE} ${className}`.trim()}
    >
      <SpeakerIcon muted={muted} />
    </button>
  )
}
