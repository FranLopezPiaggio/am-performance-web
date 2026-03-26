import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// PUBLIC_ROUTES removed - all routes except /admin are now public

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Crear una respuesta base
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Crear el cliente de Supabase (Nueva API)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sincronizamos con el Request para que los Server Components lean lo nuevo
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // Sincronizamos con la Response para que el navegador guarde la cookie
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // 3. Validar usuario (getUser es más seguro que getSession)
  const { data: { user } } = await supabase.auth.getUser();

  // 4. Protección de Admin - Solo /admin rutas requieren auth
  if (pathname.startsWith('/admin')) {
    // 4a. Verificar que el usuario esté autenticado
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      console.log(`[Auth] Redirecting unauthenticated user to login from ${pathname}`);
      return NextResponse.redirect(url);
    }

    // 4b. Verificar que el usuario tenga rol de admin
    const isAdmin = user?.app_metadata?.role === 'admin';
    if (!isAdmin) {
      console.warn(`[Security] Access denied to ${pathname} for user ${user?.id} - not admin`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // 5. Todas las demás rutas son públicas (sin verificación de auth)

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
