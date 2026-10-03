'use client'

import { useSyncExternalStore } from 'react'
import { sfx } from '@/lib/sfx'

const serverSnapshot = (): boolean => false

/** Shared mute state: every consumer re-renders together when the preference changes. */
export function useSfxMuted(): boolean {
  return useSyncExternalStore(sfx.subscribe, sfx.isMuted, serverSnapshot)
}
