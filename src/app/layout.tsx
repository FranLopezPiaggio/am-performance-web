import type { Metadata } from 'next';
import { Inter, Anton } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModalProvider } from '@/components/providers/ModalProvider';
import ProductModalWrapper from '@/components/providers/ProductModalWrapper';
import dynamic from 'next/dynamic';

const PostHogProvider = dynamic(
  () => import('@/lib/analytics/posthog-provider').then(m => m.PostHogProvider)
);
import { CategoriesProvider } from '@/context/CategoriesContext';

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
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://us.i.posthog.com" />
        <link rel="preconnect" href="https://us-assets.i.posthog.com" crossOrigin="" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ErrorBoundary>
          <PostHogProvider>
            <AuthProvider>
              <SupabaseProvider>
                <CategoriesProvider>
                <CartProvider>
                  <ModalProvider>
                    {children}
                    <ProductModalWrapper />
                  </ModalProvider>
                </CartProvider>
              </CategoriesProvider>
              </SupabaseProvider>
            </AuthProvider>
          </PostHogProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
