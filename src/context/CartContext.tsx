'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackProductAddedToCart } from '@/lib/analytics/events';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  // AMP-023: Delivery fields
  immediatelyAvailable: boolean;
  delivery_lead_days: number | null;
}

// StaticImageData has a 'src' property
interface NextStaticImage {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
}

type ProductImage = string | NextStaticImage;

// Base product fields (without quantity)
interface BaseProduct {
  id: string;
  name: string;
  price: number;
  image: ProductImage;
  category: string;
  // AMP-023: Delivery fields
  immediatelyAvailable?: boolean;
  delivery_lead_days?: number | null;
}

// Extended product with optional fields
type AddToCartProduct = BaseProduct & {
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  discount?: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: AddToCartProduct, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  // AMP-023: Derived helpers
  hasImmediateItems: () => boolean;
  hasDelayedItems: () => boolean;
  hasOnlyDelayedItems: () => boolean;
  hasMixedItems: () => boolean;
  maxLeadDays: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('am-performance-cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error('Failed to parse cart', e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('am-performance-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: AddToCartProduct, quantity: number) => {
    // Convert StaticImageData to string for localStorage
    let imageString: string;
    if (typeof product.image === 'object') {
      const img = product.image as NextStaticImage;
      imageString = img.src;
    } else {
      imageString = product.image;
    }

    trackProductAddedToCart({
      variant_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity,
      category: product.category,
      is_immediate: product.immediatelyAvailable ?? true,
    });

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // AMP-023: Include delivery fields
      return [...prevCart, { 
        ...product, 
        image: imageString, 
        quantity,
        immediatelyAvailable: product.immediatelyAvailable ?? true,
        delivery_lead_days: product.delivery_lead_days ?? null,
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // AMP-023: Derived helpers
  const hasImmediateItems = () => cart.some(item => item.immediatelyAvailable === true);
  const hasDelayedItems = () => cart.some(item => item.immediatelyAvailable === false);
  const hasOnlyDelayedItems = () => cart.length > 0 && cart.every(item => item.immediatelyAvailable === false);
  const hasMixedItems = () => {
    if (cart.length === 0) return false;
    const hasImmediate = cart.some(item => item.immediatelyAvailable === true);
    const hasDelayed = cart.some(item => item.immediatelyAvailable === false);
    return hasImmediate && hasDelayed;
  };
  const maxLeadDays = () => {
    const delayedItems = cart.filter(item => item.delivery_lead_days !== null);
    if (delayedItems.length === 0) return 0;
    return Math.max(...delayedItems.map(item => item.delivery_lead_days || 0));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        hasImmediateItems,
        hasDelayedItems,
        hasOnlyDelayedItems,
        hasMixedItems,
        maxLeadDays,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
