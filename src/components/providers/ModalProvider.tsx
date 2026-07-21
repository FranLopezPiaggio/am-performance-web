// src/components/providers/ModalProvider.tsx
// Modal State Management
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface ModalContextType {
  isOpen: boolean;
  productId: string | null;
  openModal: (productId: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const openModal = useCallback((id: string) => {
    setProductId(id);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setProductId(null);
  }, []);

  useEffect(() => {
    const original = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ isOpen, productId, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
