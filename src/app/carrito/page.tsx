'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { z } from 'zod';
import { customerFormSchema, CustomerFormValues } from '@/lib/validations/order';

import CartDisclaimer from '@/components/CartDisclaimer';

// --- SOLUCIÓN 1: MOVER EL COMPONENTE FUERA ---
// Se mueve el componente InputField fuera de CartPage para evitar el bug de tipeo.
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  multiline = false
}) => (
  <div className="space-y-1">
    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50">
      {label}
    </label>
    {multiline ? (
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-transparent border border-white/20 p-3 text-white placeholder:text-white/30 focus:border-neon-green focus:outline-none transition-colors resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-white/20 p-3 text-white placeholder:text-white/30 focus:border-neon-green focus:outline-none transition-colors"
      />
    )}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


// --- COMPONENTE PRINCIPAL ---

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CustomerFormValues>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    notas: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormValues, string>>>({});

  const validateForm = (): boolean => {
    try {
      customerFormSchema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CustomerFormValues, string>> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof CustomerFormValues] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof CustomerFormValues, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('Sending order data:', {
        cartItems: cart,
        customerInfo: form,
        total: totalPrice,
      });
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          customerInfo: form,
          total: totalPrice,
        }),
      });

      const data = await response.json();

      if (data.orderId) {
        localStorage.setItem('orderConfirmation', JSON.stringify({
          orderId: data.orderId,
          customerInfo: form,
          cartItems: cart,
          total: totalPrice,
        }));
        clearCart();

        // Redirigimos a WhatsApp usando la lógica consolidada de @/lib/whatsapp
        window.location.href = getWhatsAppUrl('order', {
          nombre: form.nombre,
          orderId: data.orderId,
        });
      } else if (data.error) {
        console.error('Order error:', data.error);
        alert('Error al procesar el pedido. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al procesar el pedido. Intenta de nuevo.');
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Columna Izquierda: Lista de Items */}
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



          {/* Columna Derecha: Formulario y Resumen */}
          <div className="lg:col-span-2 space-y-8">
            {/* Formulario de Datos */}
            <div className="bg-white/5 border border-white/10 p-8">
              <h2 className="text-2xl font-display uppercase tracking-tighter mb-6 text-neon-green">Tus Datos</h2>

              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Nombre Completo *"
                  name="nombre"
                  value={form.nombre}
                  onChange={(v) => handleInputChange('nombre', v)}
                  error={errors.nombre}
                  placeholder="Juan Pérez"
                />
                <InputField
                  label="Email *"
                  name="email"
                  value={form.email}
                  onChange={(v) => handleInputChange('email', v)}
                  error={errors.email}
                  type="email"
                  placeholder="juan@email.com"
                />
                <InputField
                  label="Teléfono / WhatsApp *"
                  name="telefono"
                  value={form.telefono}
                  onChange={(v) => handleInputChange('telefono', v)}
                  error={errors.telefono}
                  placeholder="+54 11 1234-5678"
                />
                <InputField
                  label="Dirección de Envío *"
                  name="direccion"
                  value={form.direccion}
                  onChange={(v) => handleInputChange('direccion', v)}
                  error={errors.direccion}
                  placeholder="Calle 123, Ciudad, CP 1234"
                />
                <InputField
                  label="Notas Adicionales (opcional)"
                  name="notas"
                  value={form.notas || ''}
                  onChange={(v) => handleInputChange('notas', v)}
                  placeholder="Indicaciones para el delivery, horario preferido, etc."
                  multiline
                />
              </div>

              <p className="text-[10px] text-white/40 mt-6 uppercase tracking-widest">
                * Campos obligatorios
              </p>
            </div>

            {/* Resumen y Botón de Envío */}
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

              {/* El botón siempre está visible y llama a handleCheckout */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full brutal-btn flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <span>Enviar Orden por WhatsApp</span>
                    <MessageCircle size={20} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center mt-6 uppercase font-bold opacity-50 tracking-widest">
                Pedidos procesados por WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}