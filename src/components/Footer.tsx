import Link from 'next/link';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { CONTACT } from '@/lib/constants/contact';

export default function Footer() {
  return (
    <footer className="pt-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-6 text-center md:text-left -mt-4">
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/logo/AMPerformance_Version_vertical(Positiva).png" alt="AMP-Logo" width={50} height={204} />
          </Link>
          <p className="text-white/50 max-w-md uppercase text-xs font-bold leading-loose tracking-widest">
            Somos líderes en equipamiento de gimnasios y centros de alto rendimiento en Argentina.
            Diseñamos y fabricamos soluciones técnicas para atletas exigentes.
          </p>
        </div>
        <div>
          <h5 className="font-bold uppercase tracking-widest text-xs mb-6 text-neon-green">Navegación</h5>
          <ul className="space-y-4 text-sm uppercase tracking-widest font-medium">
            <li><Link href="/catalogo" className="hover:text-neon-green transition-colors">Catálogo</Link></li>
            <li><Link href="/catalogo?ofertas=true" className="hover:text-neon-green transition-colors">Ofertas</Link></li>
            <li><Link href="/showroom" className="hover:text-neon-green transition-colors">Showroom</Link></li>
            <li><a href={getWhatsAppUrl('info')} target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold uppercase tracking-widest text-xs mb-6 text-neon-green">Contacto</h5>
          <ul className="space-y-4 text-sm uppercase tracking-widest font-medium text-white/70">
            <li>{CONTACT.address}</li>
            <li>{CONTACT.email}</li>
            <li>{CONTACT.phone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/20">
          © 2024 AM PERFORMANCE. BRUTALIST TECHNICAL EQUIPMENT.
        </p>
      </div>
    </footer>
  );
}
