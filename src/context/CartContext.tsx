'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaticImageData } from 'next/image';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
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

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, image: imageString, quantity }];
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
