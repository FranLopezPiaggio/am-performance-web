'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ANTES = '/img/antes.jpeg';
const DESPUES = '/img/despues.jpeg';

const TRIGGER_TIMEOUT_MS = 10000;
const CROSSFADE_S = 3;

export default function AntesDespuesBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [showAfter, setShowAfter] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preAfter = new Image();
    preAfter.src = DESPUES;

    let settled = false;
    const trigger = () => {
      if (settled) return;
      settled = true;
      observer?.disconnect();
      clearTimeout(timer);
      setShowAfter(true);
    };

    // Sentinel a 100px del tope: sale del viewport cuando el usuario scrollea >100px.
    let seenIntersecting = false;
    let observer: IntersectionObserver | null = null;
    if (sentinelRef.current) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          seenIntersecting = true;
          return;
        }
        if (seenIntersecting) trigger();
      });
      observer.observe(sentinelRef.current);
    }

    const onFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement).closest('form')) trigger();
    };

    const timer = setTimeout(trigger, TRIGGER_TIMEOUT_MS);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      observer?.disconnect();
      document.removeEventListener('focusin', onFocusIn);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div ref={sentinelRef} className="absolute top-[100px] left-0 h-px w-px pointer-events-none" />
      {/* ANTES */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url(${ANTES})` }}
          animate={
            prefersReducedMotion
              ? undefined
              : { scale: 1.08, x: '-1.5%' }
          }
          initial={{ scale: 1, x: '0%' }}
          transition={{ duration: 18, ease: 'linear' }}
        />
      </motion.div>

      {/* DESPUES — entra al trigger y queda fijo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showAfter ? 1 : 0 }}
        transition={{ duration: CROSSFADE_S, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url(${DESPUES})` }}
          initial={prefersReducedMotion ? false : { scale: 1.1, x: '1%' }}
          animate={
            prefersReducedMotion
              ? undefined
              : showAfter
                ? { scale: 1.02, x: '0%' }
                : undefined
          }
          transition={{ duration: 9, ease: 'easeOut' }}
        />
      </motion.div>
    </div>
  );
}
