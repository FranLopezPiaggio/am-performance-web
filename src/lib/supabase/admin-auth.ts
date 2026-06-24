// src/lib/supabase/admin-auth.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface AdminAuthSuccess {
  authorized: true;
  userId: string;
}

interface AdminAuthFailure {
  authorized: false;
  response: NextResponse;
}

type AdminAuth = AdminAuthSuccess | AdminAuthFailure;

/**
 * Verifica que la request actual tenga una sesión admin válida.
 *
 * - Lee la cookie de sesión de Supabase Auth
 * - Verifica el JWT con `getUser()` (vía servidor, no confía en la cookie sola)
 * - Chequea que el rol sea 'admin'
 *
 * Uso en API Routes:
 *   const auth = await verifyAdminRequest();
 *   if (!auth.authorized) return auth.response;
 */
export async function verifyAdminRequest(): Promise<AdminAuth> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // Read-only en API routes.
          // El refresh de sesión lo maneja el middleware en las páginas.
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión como administrador.' },
        { status: 401 }
      ),
    }
  }

  if (user.app_metadata?.role !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Acceso denegado. Se requieren permisos de administrador.' },
        { status: 403 }
      ),
    }
  }

  return { authorized: true, userId: user.id }
}
