import type { Metadata } from 'next';
import { Inter, Anton } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModalProvider } from '@/components/providers/ModalProvider';
import ProductModal from '@/components/ui/ProductModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'AM Performance | High Performance Equipment',
  description: 'Equipamiento deportivo de alto rendimiento. Moderno, técnico y brutalista.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${anton.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <ModalProvider>
                {children}
                <ProductModal />
              </ModalProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
