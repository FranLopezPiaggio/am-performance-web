export type HeroLayout = 'full' | 'split';

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  /** Imagen/poster: fallback si el video falla y única media en mobile */
  image: string;
  cta: string;
  link: string;
  video?: string;
  poster?: string;
  /** full = media a todo el ancho + texto encima · split = media 50% + texto sobre fondo oscuro */
  layout: HeroLayout;
  /** split: media a la derecha */
  reverse?: boolean;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Elite Performance',
    subtitle: 'Equipamiento profesional para atletas de alto rendimiento.',
    image: '/vid/clips/hero/hero-poster.jpg',
    cta: 'Ver Catálogo',
    link: '/catalogo',
    video: '/vid/clips/hero-segments/v4-seg-1.mp4',
    poster: '/vid/clips/hero/hero-poster.jpg',
    layout: 'full'
  },
  {
    id: 2,
    title: 'Conocé el Showroom',
    subtitle: 'Probá las máquinas en persona antes de decidir.',
    image: '/vid/clips/video-1/poster-2.jpg',
    cta: 'Ver Showroom',
    link: '/showroom',
    video: '/vid/clips/video-1/clip-2.mp4',
    poster: '/vid/clips/video-1/poster-2.jpg',
    layout: 'split',
    reverse: true
  },
  {
    id: 3,
    title: 'Equipamiento Premium',
    subtitle: 'Materiales certificados y resistencia verificada.',
    image: '/img/crossfit-equip.jpg',
    cta: 'Ver Catálogo',
    link: '/catalogo',
    layout: 'full'
  },
  {
    id: 4,
    title: 'Calidad Industrial',
    subtitle: 'Cada rack, diseñado y probado en nuestro taller.',
    image: '/img/dumbells-rack.jpg',
    cta: 'Ver Catálogo',
    link: '/catalogo',
    layout: 'split'
  },
  {
    id: 5,
    title: 'Asesoramiento Técnico',
    subtitle: 'Te acompañamos en el montaje de tu gimnasio.',
    image: '/img/ropes.jpg',
    cta: 'Empezar Tu Proyecto',
    link: '/proyectos',
    layout: 'full'
  }
];
