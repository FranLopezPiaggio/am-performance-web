'use client';

import { useSyncExternalStore } from 'react';
import { video4Pool, galleryPool, verticalClips } from './images';

function pickN<T>(pool: T[], n: number): T[] {
  const copy = [...pool];
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    out.push(...copy.splice(Math.floor(Math.random() * copy.length), 1));
  }
  return out;
}

// Snapshot de server / primer render: valores fijos, deterministas.
const DEFAULTS = {
  space: video4Pool[0],
  info: video4Pool[1],
  gallery: video4Pool.slice(2, 10),
  video: verticalClips[0],
};

function makeSelection() {
  const [space, info] = pickN(video4Pool, 2);
  return {
    space: space ?? DEFAULTS.space,
    info: info ?? DEFAULTS.info,
    gallery: pickN(galleryPool, 8),
    video: pickN(verticalClips, 1)[0] ?? DEFAULTS.video,
  };
}

// Se evalúa una vez por carga de página en el cliente: azar por visita.
const CLIENT_SELECTION = typeof window === 'undefined' ? DEFAULTS : makeSelection();

const noopSubscribe = () => () => {};

export function useShowroomImages() {
  return useSyncExternalStore(noopSubscribe, () => CLIENT_SELECTION, () => DEFAULTS);
}
