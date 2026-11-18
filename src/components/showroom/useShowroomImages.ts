'use client';

import { useSyncExternalStore } from 'react';
import { heroPool, video4Pool, galleryPool } from './images';

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
  hero: heroPool[0],
  statement: video4Pool[0],
  info: video4Pool[1],
  features: video4Pool[2],
  gallery: video4Pool.slice(3, 11),
};

function makeSelection() {
  const hero = pickN(heroPool, 1)[0] ?? DEFAULTS.hero;
  const [statement, info, features] = pickN(video4Pool, 3);
  return {
    hero,
    statement: statement ?? DEFAULTS.statement,
    info: info ?? DEFAULTS.info,
    features: features ?? DEFAULTS.features,
    gallery: pickN(galleryPool, 8),
  };
}

// Se evalúa una vez por carga de página en el cliente: azar por visita.
const CLIENT_SELECTION = typeof window === 'undefined' ? DEFAULTS : makeSelection();

const noopSubscribe = () => () => {};

export function useShowroomImages() {
  return useSyncExternalStore(noopSubscribe, () => CLIENT_SELECTION, () => DEFAULTS);
}
