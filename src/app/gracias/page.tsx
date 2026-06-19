'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CheckCircle, MessageCircle, ArrowLeft, Package, Building, Clock, Copy, Check } from 'lucide-react';
import { transferConfig, calculateTransferDiscount } from '@/lib/transfer/config';

interface OrderData {
  orderId: string;
  customerInfo?: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  customer?: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  cartItems?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paymentMethod?: 'whatsapp' | 'mercadopago' | 'transfer';
  paymentExpiresAt?: string;
}

export default function GraciasPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  // Support both old (customer/items) and new (customerInfo/cartItems) structure
  const customer = orderData?.customerInfo || orderData?.customer;
  const items = orderData?.cartItems || orderData?.items;
  const isTransfer = orderData?.paymentMethod === 'transfer';
  const transferTotal = isTransfer ? calculateTransferDiscount(orderData?.total || 0) : 0;

  // Calculate time remaining for transfer payment (runs on client only)
  useEffect(() => {
    if (!orderData?.paymentExpiresAt) {
      setTimeRemaining(null);
      return;
    }

    const calculateTime = () => {
      const expires = new Date(orderData.paymentExpiresAt!).getTime();
      const now = Date.now();
      const diff = expires - now;
      
      if (diff <= 0) return 'Expirado';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    };

    setTimeRemaining(calculateTime());
    
    const interval = setInterval(() => {
      setTimeRemaining(calculateTime());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [orderData?.paymentExpiresAt]);

  useEffect(() => {
    const stored = localStorage.getItem('orderConfirmation');
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderData(JSON.parse(stored));
    }
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsAppFollowUp = () => {
    const phone = customer?.telefono;
    if (!phone) return;

    const message = `¡Hola! ${customer.nombre}, tu pedido #${orderData?.orderId} está siendo procesado. ¿Hay algo en lo que pueda ayudarte?`;
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-24">
        {isTransfer ? (
          // === TRANSFER PAYMENT VIEW ===
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/10 border border-orange-500 mb-8">
                <Building size={40} className="text-orange-500" />
              </div>
              <h1 className="text-5xl font-display uppercase tracking-tighter mb-4">
                Transferencia Bancaria
              </h1>
              <p className="text-white/50 uppercase tracking-widest text-sm">
                Completá tu pago para confirmar el pedido
              </p>
            </div>

            {/* Time Remaining Warning */}
            {timeRemaining && timeRemaining !== 'Expirado' && (
              <div className="bg-orange-500/10 border border-orange-500/30 p-4 mb-8 flex items-center gap-3">
                <Clock size={20} className="text-orange-500" />
                <div>
                  <p className="text-orange-500 font-bold text-sm uppercase tracking-wider">
                    Tiempo restante para pagar
                  </p>
                  <p className="text-white/70 text-lg font-mono">{timeRemaining}</p>
                </div>
              </div>
            )}

            {/* Bank Account Details */}
            <div className="bg-white/5 border border-white/10 p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Building size={20} className="text-neon-green" />
                <h2 className="text-xl font-display uppercase tracking-tight">
                  Datos para Transferir
                </h2>
              </div>

              {transferConfig.bankAccounts.map((account, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Banco</p>
                      <p className="font-bold text-lg">{account.bank}</p>
                    </div>
                    <div className="bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Tipo de Cuenta</p>
                      <p className="font-bold text-lg">{account.accountType}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Número de Cuenta</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-xl">{account.accountNumber}</p>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber, 'account')}
                        className="p-2 hover:bg-white/10 transition-colors"
                      >
                        {copiedField === 'account' ? <Check size={18} className="text-neon-green" /> : <Copy size={18} className="text-white/50" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">CBU</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-lg">{account.cbu}</p>
                      <button
                        onClick={() => copyToClipboard(account.cbu, 'cbu')}
                        className="p-2 hover:bg-white/10 transition-colors"
                      >
                        {copiedField === 'cbu' ? <Check size={18} className="text-neon-green" /> : <Copy size={18} className="text-white/50" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Alias</p>
                      <p className="font-mono text-lg">{account.alias}</p>
                    </div>
                    <div className="bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">CUIT/DNI</p>
                      <p className="font-mono text-lg">{account.dni}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Titular</p>
                    <p className="font-bold text-lg">{account.owner}</p>
                  </div>
                </div>
              ))}

              {/* Instructions */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
                  Instrucciones
                </h3>
                <ol className="space-y-2">
                  {transferConfig.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Order Summary with Discount */}
            {orderData && (
              <div className="bg-white p-8 brutal-shadow text-brutal-black mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Package size={20} />
                  <h2 className="text-xl font-display uppercase tracking-tight">
                    Resumen del Pedido
                  </h2>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="uppercase tracking-widest">Pedido</span>
                    <span className="font-mono">#{orderData.orderId}</span>
                  </div>
                  
                  {/* Original price */}
                  <div className="flex justify-between text-sm text-white/50">
                    <span className="uppercase tracking-widest">Subtotal</span>
                    <span className="line-through">${orderData.total.toLocaleString()}</span>
                  </div>
                  
                  {/* Discount */}
                  <div className="flex justify-between text-sm text-neon-green">
                    <span className="uppercase tracking-widest">Descuento ({transferConfig.discountPercentage}%)</span>
                    <span>-${(orderData.total - transferTotal).toLocaleString()}</span>
                  </div>

                  <div className="pt-4 border-t border-brutal-black/10 flex justify-between text-2xl font-display uppercase tracking-tighter">
                    <span>Total a Transferir</span>
                    <span className="text-neon-green">${transferTotal.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-[10px] text-center text-brutal-black/60 uppercase tracking-widest mb-6">
                  ¡Pagando por transferencia ottenés {transferConfig.discountLabel}!
                </p>
              </div>
            )}
          </>
        ) : (
          // === STANDARD WHATSAPP/MP VIEW ===
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-neon-green/10 border border-neon-green mb-8">
                <CheckCircle size={40} className="text-neon-green" />
              </div>
              <h1 className="text-6xl font-display uppercase tracking-tighter mb-4">
                ¡Pedido Enviado!
              </h1>
              <p className="text-white/50 uppercase tracking-widest text-sm">
                Tu mensaje fue enviado por WhatsApp
              </p>
            </div>

            {orderData ? (
              <div className="bg-white/5 border border-white/10 p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Package size={20} className="text-neon-green" />
                  <h2 className="text-xl font-display uppercase tracking-tight">
                    Resumen del Pedido
                  </h2>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50 uppercase tracking-widest">Pedido</span>
                    <span className="font-mono">#{orderData.orderId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50 uppercase tracking-widest">Cliente</span>
                    <span>{customer?.nombre}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50 uppercase tracking-widest">Email</span>
                    <span>{customer?.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50 uppercase tracking-widest">Teléfono</span>
                    <span>{customer?.telefono}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 mb-6">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
                    Productos
                  </h3>
                  <div className="space-y-3">
                    {items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="text-neon-green">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-display uppercase tracking-tight">
                  <span>Total</span>
                  <span className="text-neon-green">${orderData.total?.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 p-8 mb-8 text-center">
                <p className="text-white/50 text-sm uppercase tracking-widest">
                  Resumen del pedido no disponible
                </p>
              </div>
            )}
          </>
        )}

        <div className="space-y-4">
          <button
            onClick={handleWhatsAppFollowUp}
            className="w-full brutal-btn flex items-center justify-center space-x-2"
          >
            <MessageCircle size={20} />
            <span>Enviar Comprobante por WhatsApp</span>
          </button>

          <Link
            href="/catalogo"
            className="w-full brutal-btn-outline flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Seguir Comprando</span>
          </Link>
        </div>

        <p className="text-center text-[10px] text-white/30 uppercase tracking-widest mt-12">
          {isTransfer 
            ? 'Te contactaremos una vez verificada la transferencia' 
            : 'Te contactaremos pronto para confirmar tu pedido'}
        </p>
      </div>
    </main>
  );
}