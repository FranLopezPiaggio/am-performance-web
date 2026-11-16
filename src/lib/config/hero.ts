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
    title: 'Box de Hyrox',
    subtitle: 'Equipamiento de Alto Rendimiento para Hyrox',
    image: '/vid/clips/hero/hero-poster.jpg',
    cta: 'Ver Catálogo',
    link: '/catalogo',
    video: '/vid/clips/hero-segments/v4-seg-1.mp4',
    poster: '/vid/clips/hero/hero-poster.jpg',
    layout: 'full'
  },
  {
    id: 2,
    title: 'Armá tu Gimnasio',
    subtitle: 'Diseñá y Equipá tu Gimnasio a Medida',
    image: '/vid/clips/video-1/poster-2.jpg',
    cta: 'Proyectos',
    link: '/proyectos',
    video: '/vid/clips/video-1/clip-2.mp4',
    poster: '/vid/clips/video-1/poster-2.jpg',
    layout: 'split',
    reverse: true
  },
  {
    id: 3,
    title: 'Conoce nuestro Showroom',
    subtitle: 'Visita nuestro showroom y conoce nuestros productos en persona.',
    image: '/img/crossfit-equip.jpg',
    cta: 'Ver Catálogo',
    link: '/catalogo',
    layout: 'full'
  },
  {
    id: 4,
    title: 'Maquinas Lingoteras y a Disco',
    subtitle: 'Conoce nuestras maquinas para tu espacio.',
    image: '/img/dumbells-rack.jpg',
    cta: 'Ver',
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
