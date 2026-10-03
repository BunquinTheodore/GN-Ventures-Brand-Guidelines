'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPlateStage, type PlateStageHandle, type PlateStatus } from '@/lib/three/plateStage';
import BrandThumb from '@/components/ui/BrandThumb';
import type { BrandId } from '@/content/types';
import { usePrefersReducedMotion, useWebGLSupport } from './hooks';

export interface LogoViewerItem {
  id: string;
  label: string;
  src: string;
  /** Optional small thumbnail path; the picker falls back to BrandThumb by id. */
  thumb?: string;
}

export interface LogoViewer3DProps {
  items: LogoViewerItem[];
}

const KEY_NUDGE = 4;
const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent,#C6F24E)]';

/**
 * Brand swatch row driving a draggable, inertial 3D logo card. The card
 * auto-rotates slowly until the user interacts. Arrow keys rotate it, Home or
 * double click resets. Without WebGL (or with reduced motion) the same
 * swatches switch a static image.
 */
export default function LogoViewer3D({ items }: LogoViewer3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<PlateStageHandle | null>(null);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const [status, setStatus] = useState<PlateStatus>('loading');
  const reduced = usePrefersReducedMotion();
  const supported = useWebGLSupport();
  const disabled = reduced || !supported;
  const effective: PlateStatus = disabled ? 'fallback' : status;
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const selectedSrc = selected?.src ?? '';
  const srcRef = useRef(selectedSrc);

  useEffect(() => {
    srcRef.current = selectedSrc;
  });

  useEffect(() => {
    const host = hostRef.current;
    if (disabled || !host || !srcRef.current) return;
    const handle = createPlateStage({ container: host, src: srcRef.current, mode: 'viewer', onStatus: setStatus });
    handleRef.current = handle;
    return () => {
      handle.dispose();
      handleRef.current = null;
    };
  }, [disabled]);

  useEffect(() => {
    handleRef.current?.setSrc(selectedSrc);
  }, [selectedSrc]);

  if (!selected) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'ArrowLeft') handleRef.current?.nudge(-KEY_NUDGE);
    else if (event.key === 'ArrowRight') handleRef.current?.nudge(KEY_NUDGE);
    else if (event.key === 'Home') handleRef.current?.reset();
    else return;
    event.preventDefault();
  };

  return (
    <div className="mx-auto flex w-full max-w-md min-h-[28rem] flex-col gap-4">
      <div
        role="group"
        aria-label={`3D logo viewer showing ${selected.label}. Drag or use the left and right arrow keys to rotate, Home to reset.`}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={onKeyDown}
        className={`relative aspect-square w-full rounded-2xl ${FOCUS_RING}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selected.src}
          alt={disabled ? `${selected.label} logo` : ''}
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
          style={{ opacity: effective === 'ready' ? 0 : 1 }}
        />
        <div ref={hostRef} className="absolute inset-0" />
      </div>
      <p aria-live="polite" className="text-center font-[family-name:var(--font-ui,inherit)] text-sm uppercase tracking-[0.1em]">
        {selected.label}
      </p>
      <div role="group" aria-label="Choose a brand logo" className="flex flex-wrap justify-center gap-2">
        {items.map((item) => {
          const active = item.id === selected.id;
          return (
            <button
              key={item.id}
              type="button"
              data-sfx="toggle"
              aria-pressed={active}
              onClick={() => setSelectedId(item.id)}
              className={`inline-flex min-h-11 min-w-11 items-center gap-2 overflow-hidden rounded-full border px-3 text-sm transition-colors ${FOCUS_RING}`}
              style={{
                borderColor: active
                  ? 'var(--brand-accent, #C6F24E)'
                  : 'color-mix(in srgb, currentColor 22%, transparent)',
                background: active
                  ? 'color-mix(in srgb, var(--brand-accent, #C6F24E) 16%, transparent)'
                  : 'color-mix(in srgb, currentColor 5%, transparent)',
              }}
            >
              <BrandThumb brand={item.id as BrandId} src={item.thumb} size={24} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
