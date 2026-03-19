// src/components/providers/ModalProvider.tsx
// Modal State Management
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setProductId(null);
    // Restore body scroll
    document.body.style.overflow = '';
  }, []);

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
