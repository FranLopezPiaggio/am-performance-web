'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }

    setLoading(true);
    try {
      // TODO: Migrate to Supabase - Firebase code commented out
      // 1. Save order to Supabase (pending migration)
      // const orderData = {
      //   user_id: user.id,
      //   items: cart,
      //   total: totalPrice,
      //   status: 'pending',
      // };

      // 2. Call checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          userId: user.id
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 text-center">
          <div className="inline-block p-8 bg-white/5 border border-white/10 mb-8">
            <ShoppingBag size={64} className="text-white/20 mx-auto" />
          </div>
          <h1 className="text-6xl font-display uppercase tracking-tighter mb-4">Tu carrito está vacío</h1>
          <p className="text-white/50 uppercase tracking-widest text-sm mb-12">Parece que aún no has agregado nada.</p>
          <Link href="/catalogo" className="brutal-btn inline-block">
            Ir al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        <h1 className="text-6xl font-display uppercase tracking-tighter mb-12">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/10 p-4 flex items-center gap-6">
                <div className="relative w-24 h-24 bg-brutal-black flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-grow">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{item.category}</p>
                  <h3 className="font-display uppercase text-xl leading-tight">{item.name}</h3>
                  <p className="text-neon-green font-bold mt-1">${item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-white/20">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-white/10 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-white/10 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-white/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
            >
              Vaciar Carrito
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 brutal-shadow text-brutal-black">
              <h2 className="text-3xl font-display uppercase tracking-tighter mb-8">Resumen</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                  <span>Envío</span>
                  <span className="text-neon-green">Gratis</span>
                </div>
                <div className="pt-4 border-t border-brutal-black/10 flex justify-between text-2xl font-display uppercase tracking-tighter">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full brutal-btn flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <span>Finalizar Compra</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center mt-6 uppercase font-bold opacity-50 tracking-widest">
                Pagos procesados por Mercado Pago
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
