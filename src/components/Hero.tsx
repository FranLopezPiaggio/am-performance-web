'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { HERO_SLIDES, type HeroSlide } from '@/lib/constants/hero';

const HERO_VIDEO_RATE = 0.5;
const DESKTOP_QUERY = '(min-width: 768px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

interface HeroProps {
  slides?: HeroSlide[];
}

export default function Hero({ slides = HERO_SLIDES }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const slide = slides[current];
  // mounted: el SSR siempre renderiza la imagen (el video jamás se descarga en mobile)
  const useVideo = Boolean(slide.video) && mounted && isDesktop && !reducedMotion && !videoFailed;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true; // React no hidrata el atributo muted (issue #10389)
      videoRef.current.playbackRate = HERO_VIDEO_RATE;
    }
  }, [current, useVideo]);

  useEffect(() => {
    const desktopMq = window.matchMedia(DESKTOP_QUERY);
    const motionMq = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => {
      setIsDesktop(desktopMq.matches);
      setReducedMotion(motionMq.matches);
    };
    sync();
    desktopMq.addEventListener('change', sync);
    motionMq.addEventListener('change', sync);
    return () => {
      desktopMq.removeEventListener('change', sync);
      motionMq.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !useVideo) return;
    const syncPlayback = () => {
      if (document.hidden || !inView) {
        video.pause();
      } else if (video.paused) {
        video.play().catch(() => undefined);
      }
    };
    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => document.removeEventListener('visibilitychange', syncPlayback);
  }, [inView, useVideo, current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), [slides.length]);

  const media = useVideo ? (
    <video
      ref={videoRef}
      src={slide.video}
      autoPlay
      loop
      playsInline
      preload="metadata"
      poster={slide.poster}
      onError={() => setVideoFailed(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  ) : (
    <Image
      src={slide.image}
      alt={slide.title}
      fill
      priority={current === 0}
      className="object-cover"
      sizes="100vw"
    />
  );

  const textBlock = (
    <div className="flex flex-col items-start">
      <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
        AM <span className="text-white">Performance</span>
      </p>
      <h1 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-[0.9] mb-6 max-w-3xl">
        {slide.title}
      </h1>
      <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10">{slide.subtitle}</p>
      <Link href={slide.link} className="brutal-btn-strong flex items-center space-x-2">
        <span>{slide.cta}</span>
        <ArrowRight size={20} />
      </Link>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative h-[80vh] w-full overflow-hidden bg-brutal-black">
      <div
        key={current}
        className={`absolute inset-0 animate-[fadeIn_0.7s_ease] ${useVideo ? 'bg-blue-600' : ''}`}
      >
        {slide.layout === 'split' ? (
          <div className="h-full grid grid-cols-1 md:grid-cols-2">
            <div className={`relative h-[45%] md:h-auto overflow-hidden ${slide.reverse ? 'md:order-2' : ''}`}>
              {media}
              <div
                className={`absolute inset-0 ${
                  slide.reverse
                    ? 'bg-gradient-to-l from-transparent via-transparent to-brutal-black'
                    : 'bg-gradient-to-r from-transparent via-transparent to-brutal-black'
                }`}
              />
            </div>
            <div className={`flex items-center bg-brutal-black px-8 md:px-16 ${slide.reverse ? 'md:order-1' : ''}`}>
              {textBlock}
            </div>
          </div>
        ) : (
          <>
            {media}
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start">
              {textBlock}
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 right-10 flex space-x-4">
        <button onClick={prev} className="p-4 border border-white/20 hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="p-4 border border-white/20 hover:bg-white/10 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-10 flex space-x-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 transition-all duration-300 ${i === current ? 'w-12 bg-neon-green' : 'w-4 bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  );
}
