import type { Metadata } from 'next';
import { Inter, Anton } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModalProvider } from '@/components/providers/ModalProvider';
import ProductModalWrapper from '@/components/providers/ProductModalWrapper';
import { PostHogProvider } from '@/lib/analytics/posthog-provider';
import { CategoriesProvider } from '@/context/CategoriesContext';
import { createClient } from '@/lib/supabase/server';
import { getCategories } from '@/lib/supabase/queries';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    const supabase = await createClient();
    categories = await getCategories(supabase);
  } catch {
    // ponytail: categorías vacías → Navbar sin dropdown
  }

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
              <CategoriesProvider categories={categories}>
                <CartProvider>
                  <ModalProvider>
                    {children}
                    <ProductModalWrapper />
                  </ModalProvider>
                </CartProvider>
              </CategoriesProvider>
            </AuthProvider>
          </PostHogProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
