import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * GET /auth/callback
 *
 * Ruta de callback para OAuth (Google).
 * Supabase redirige aquí después de que el usuario autoriza la app.
 * Intercambia el code de autorización por una session y redirige al admin.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Login exitoso → redirigir al admin dashboard
      return NextResponse.redirect(`${origin}/admin`);
    }

    console.error('Auth callback error:', error.message);
  }

  // Error o sin code → redirigir al login con error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
