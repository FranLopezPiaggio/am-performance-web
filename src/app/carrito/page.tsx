'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

interface CustomerForm {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  notas: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- SOLUCIÓN 2: ELIMINAR ESTADO Y LÓGICA ADICIONAL ---
  // El formulario ahora siempre es visible, no necesitamos 'showForm'.
  const [form, setForm] = useState<CustomerForm>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    notas: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!form.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Ingresa un email válido';
    }
    if (!form.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }
    if (!form.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo si el usuario empieza a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      // Si el formulario no es válido, no hacemos nada
      // Los errores se mostrarán junto a los campos
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer: form,
          total: totalPrice,
        }),
      });

      const data = await response.json();

      if (data.whatsappUrl) {
        // Guardamos la confirmación en localStorage para la página de gracias
        localStorage.setItem('orderConfirmation', JSON.stringify({
          orderId: data.orderId,
          customer: form,
          items: cart,
          total: totalPrice,
        }));
        clearCart();
        // Redirigimos a WhatsApp
        window.location.href = data.whatsappUrl;
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
                  value={form.notas}
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