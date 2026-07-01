'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="bg-brutal-black text-white">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-9xl font-display uppercase tracking-tighter text-white/10">
              500
            </h1>
            <h2 className="text-2xl font-display uppercase tracking-tighter mt-4 mb-2">
              Error del servidor
            </h2>
            <p className="text-white/50 text-sm uppercase tracking-widest mb-8">
              Algo salió mal. El equipo ya fue notificado.
            </p>
            <button
              onClick={() => reset()}
              className="brutal-btn"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
