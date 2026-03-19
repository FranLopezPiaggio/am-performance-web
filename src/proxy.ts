// src/proxy.ts
// AMPerformance - Admin Route Protection
// Security: JWT verification via Supabase SSR

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create Supabase client for proxy
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          const response = NextResponse.next();
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session to validate JWT
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Admin route protection logic
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // Not logged in → Redirect to home
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // Check admin role from app_metadata
    const isAdmin = user.app_metadata?.role === 'admin';

    if (!isAdmin) {
      // Logged in but not admin → Redirect to home with access denied
      console.warn(`[Security] Non-admin user ${user.id} attempted to access ${pathname}`);
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match admin routes
    '/admin/:path*',
    // Optional: Also protect API routes if needed
    // '/api/admin/:path*',
  ],
};
