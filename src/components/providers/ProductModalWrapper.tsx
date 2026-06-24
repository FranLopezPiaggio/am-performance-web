'use client';

import dynamic from 'next/dynamic';

const ProductModal = dynamic(() => import('@/components/ui/ProductModal'), { ssr: false });

export default function ProductModalWrapper() {
  return <ProductModal />;
}
