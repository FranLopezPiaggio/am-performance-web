export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Elite Performance',
    subtitle: 'Equipamiento profesional para atletas de alto rendimiento.',
    image: '/img/gym-black.jpg',
    cta: 'Ver Catálogo',
    link: '/catalogo'
  },
  {
    id: 2,
    title: 'Nuevos Ingresos',
    subtitle: 'Descubrí la línea AM Combat. Resistencia extrema.',
    image: '/img/crossfit-equip.jpg',
    cta: 'Ver Novedades',
    link: '/catalogo?categoria=cardio'
  },
  {
    id: 3,
    title: 'Ofertas de Temporada',
    subtitle: 'Hasta 30% OFF en racks y multiestaciones.',
    image: '/img/racks.jpg',
    cta: 'Aprovechar',
    link: '/catalogo?ofertas=true'
  }
];
