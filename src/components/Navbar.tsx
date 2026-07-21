'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Menu, X, ChevronDown, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/context/AuthContext';
import { getWhatsAppUrl } from '@/lib/whatsapp/service';
import { useRouter } from 'next/navigation';
import { trackWhatsappClicked, trackCatalogFiltered } from '@/lib/analytics/events';

const WhatsAppSVG = '/img/svg/whatsapp.svg';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { categories: allCategories } = useCategories();
  const categories = allCategories.filter(c => !c.parent_id);
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isClient, setIsClient] = useState<boolean>(() => typeof window !== 'undefined');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      trackCatalogFiltered({ type: 'search', value: q });
      router.push(`/catalogo?search=${encodeURIComponent(q)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const btnClass = "flex items-center space-x-2 px-4 py-2 text-sm font-medium uppercase tracking-widest border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-brutal-black border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2 ml-[-30px]">
              <Image src="/logo/AMPerformance_Version_original.png" alt="AMP-Logo" width={300} height={300}
                loading="eager" unoptimized />
            </Link>


            <div className="hidden md:flex items-center space-x-8">
              <div
                className="relative group"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <div className="flex items-center space-x-1 text-sm font-medium uppercase tracking-widest hover:text-neon-green transition-colors">
                  <Link href="/catalogo">Catalogo</Link>
                  <ChevronDown size={16} />
                </div>

                {isCategoriesOpen && (
                    <div
                      className="absolute top-full left-0 w-48 bg-brutal-black border border-white/10 mt-2 p-2 brutal-shadow"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/catalogo?categoria=${cat.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-neon-green hover:text-brutal-black transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>

              <Link href="/catalogo?ofertas=true" className="text-sm font-medium uppercase tracking-widest hover:text-neon-green transition-colors">
                Ofertas
              </Link>
              <Link href="/proyectos" className="text-sm font-medium uppercase tracking-widest hover:text-neon-green transition-colors">
                Proyectos
              </Link>
            </div>

            <div className="flex items-center space-x-5">
              <div className="relative flex items-center">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 hover:text-neon-green transition-colors"
                  aria-label="Buscar productos"
                >
                  <Search size={20} />
                </button>
                {showSearch && (
                    <form
                      onSubmit={handleSearchSubmit}
                      className="absolute right-0 top-1/2 -translate-y-1/2"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-60 bg-white/5 border border-white/20 text-white text-sm px-4 py-2 focus:outline-none focus:border-neon-green uppercase tracking-widest placeholder:text-white/30"
                        autoFocus
                      />
                    </form>
                  )}
              </div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={signOut}
                    className={btnClass}
                  >
                    Salir
                  </button>
                  <Link href="/admin" className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center text-brutal-black font-bold text-xs hover:scale-110 transition-transform">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </Link>
                </div>
              ) : null}
              <Link href="/carrito" className="p-2 hover:text-neon-green transition-colors relative">
                <ShoppingCart size={20} />
                {isClient && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neon-green text-brutal-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    suppressHydrationWarning={true}>
                    {totalItems}
                  </span>
                )}
              </Link>
              <a
                href={getWhatsAppUrl('help')}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:text-neon-green transition-colors"
                aria-label="Contacto por WhatsApp"
                onClick={() => trackWhatsappClicked('navbar')}
              >
                <Image src={WhatsAppSVG} alt="WhatsApp" width={30} height={30} unoptimized />
              </a>
              <button
                className="md:hidden p-2 hover:text-neon-green transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
            <div
              className="md:hidden bg-brutal-black border-t border-white/10"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                <form onSubmit={(e) => { handleSearchSubmit(e); setIsMenuOpen(false); }} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 focus:outline-none focus:border-neon-green uppercase tracking-widest placeholder:text-white/30"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-neon-green">
                    <Search size={18} />
                  </button>
                </form>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Catalogo</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/catalogo?categoria=${cat.slug}`}
                      className="block text-lg font-display uppercase tracking-tighter hover:text-neon-green"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <Link href="/catalogo?ofertas=true" className="block text-lg font-display uppercase tracking-tighter hover:text-neon-green">Ofertas</Link>
                  <Link href="/proyectos" className="block text-lg font-display uppercase tracking-tighter hover:text-neon-green">Proyectos</Link>
                </div>
              </div>
            </div>
          )}
      </nav>

      
    </>
  );
}
