'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, ChevronDown, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  { name: 'Cardio', slug: 'cardio' },
  { name: 'Máquinas', slug: 'maquinas' },
  { name: 'Pesas Libres', slug: 'pesas-libres' },
  { name: 'Accesorios', slug: 'accesorios' },
  { name: 'Suplementos', slug: 'suplementos' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { totalItems } = useCart();
  // const { user, signInWithGoogle, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, signInWithEmail, signOut } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      setShowLoginModal(false); // Cerrar modal al éxito
    } catch (error: any) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  const btnClass = "flex items-center space-x-2 px-4 py-2 text-sm font-medium uppercase tracking-widest border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-brutal-black border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2 ml-[-30px]">
              {/* <span className="text-2xl font-display uppercase tracking-tighter text-white">
                AM <span className="text-neon-green">Performance</span>
              </span> */}
              <Image src="/logo/AMPerformance_Version_original.png" alt="AMP-Logo" width={300} height={300} />
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

                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/catalogo?ofertas=true" className="text-sm font-medium uppercase tracking-widest hover:text-neon-green transition-colors">
                Ofertas
              </Link>
              <Link href="/proyectos" className="text-sm font-medium uppercase tracking-widest hover:text-neon-green transition-colors text-neon-green">
                Proyectos
              </Link>
            </div>

            <div className="flex items-center space-x-5">
              {/* <button className="p-2 hover:text-neon-green transition-colors">
                <Search size={20} />
              </button> */}

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
              ) : (
                <button
                  // onClick={signInWithGoogle}
                  onClick={() => setShowLoginModal(true)}
                  className="p-2 hover:text-neon-green transition-colors"
                >
                  <User size={20} />
                </button>
              )}
              <Link href="/carrito" className="p-2 hover:text-neon-green transition-colors relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neon-green text-brutal-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    suppressHydrationWarning={true}>
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden p-2 hover:text-neon-green transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-brutal-black border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
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
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {
        showLoginModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-black border border-white/10 p-8 w-full max-w-md brutal-shadow">
              <h2 className="text-2xl font-display uppercase tracking-tighter text-white mb-6">
                Acceso Admin
              </h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-neon-green"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-neon-green"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-neon-green text-brutal-black font-bold uppercase tracking-widest py-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
                >
                  Ingresar
                </button>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="w-full text-center text-xs uppercase tracking-widest text-white/40 mt-4 hover:text-white"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )
      }
    </>
  );
}
