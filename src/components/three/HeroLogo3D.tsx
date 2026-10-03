'use client';

import { useEffect, useRef, useState } from 'react';
import { createPlateStage, type PlateStageHandle, type PlateStatus } from '@/lib/three/plateStage';
import { usePrefersReducedMotion, useWebGLSupport } from './hooks';

export interface HeroLogo3DProps {
  src: string;
  alt: string;
  className?: string;
  /** Render the plain image fallback inside (default true). The lazy wrapper renders its own. */
  showFallback?: boolean;
  /** Reports 'loading', 'ready' or 'fallback' so a wrapper can hide its static image. */
  onStatusChange?: (status: PlateStatus) => void;
}

/**
 * Interactive 3D logo plate: textured rounded slab with a bevel, glassy sheen
 * that follows the pointer, spring tilt, idle float, drag to spin, double
 * click to reset. The wrapper is an accessible image; a plain <img> is shown
 * when WebGL is unavailable or reduced motion is requested.
 */
export default function HeroLogo3D({ src, alt, className, showFallback = true, onStatusChange }: HeroLogo3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<PlateStageHandle | null>(null);
  const reduced = usePrefersReducedMotion();
  const supported = useWebGLSupport();
  const disabled = reduced || !supported;
  const [status, setStatus] = useState<PlateStatus>('loading');
  const effective: PlateStatus = disabled ? 'fallback' : status;
  const srcRef = useRef(src);
  const reportRef = useRef(onStatusChange);

  useEffect(() => {
    srcRef.current = src;
    reportRef.current = onStatusChange;
  });

  useEffect(() => {
    const host = hostRef.current;
    if (disabled || !host) return;
    const handle = createPlateStage({ container: host, src: srcRef.current, mode: 'hero', onStatus: setStatus });
    handleRef.current = handle;
    return () => {
      handle.dispose();
      handleRef.current = null;
    };
  }, [disabled]);

  useEffect(() => {
    handleRef.current?.setSrc(src);
  }, [src]);

  useEffect(() => {
    reportRef.current?.(effective);
  }, [effective]);

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative ${className ?? ''}`}
      style={{ aspectRatio: '1 / 1' }}
    >
      {showFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
          style={{ opacity: effective === 'ready' ? 0 : 1 }}
        />
      ) : null}
      <div ref={hostRef} className="absolute inset-0" />
    </div>
  );
}
