import { MapPin, Ruler, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ShowroomBannerItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const SHOWROOM = {
  hours: 'Lunes a Viernes 9:00 - 19:00',
  banner: {
    ctaLabel: 'Visitar Showroom',
    ctaHref: '/showroom',
    items: [
      { icon: MapPin, title: 'Showroom Físico', desc: 'Probá las máquinas en persona.' },
      { icon: Ruler, title: 'Calidad Real', desc: 'Conocé materiales y terminaciones.' },
      { icon: Users, title: 'Asesoramiento', desc: 'Equipo técnico en el local.' }
    ] satisfies ShowroomBannerItem[],
  },
};
