// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Redirect to home page after successful login
      const redirectTo = searchParams.get('redirectTo');
      router.push(redirectTo || '/');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-brutal-black flex flex-col">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#00FF00_1px,transparent_1px),linear-gradient(180deg,#00FF00_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center text-white/40 hover:text-neon-green transition-colors mb-8 text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver al inicio
          </Link>

          {/* Login Card */}
          <div className="bg-white/5 border border-white/10 p-8 md:p-12">
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <Image src="/logo/AMPerformance_Version_original.png" alt="AMP-Logo" width={300} height={300} loading="eager" />
              <p className="text-white/50 text-sm uppercase tracking-widest">
                Acceso Restringido
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-neon-green focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 mb-2"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-neon-green focus:outline-none transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow text-brutal-black font-bold uppercase tracking-widest py-4 hover:bg-yellow/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
            </form>

            {/* Help Text */}
            <p className="mt-6 text-center text-white/30 text-xs">
              Solo usuarios invitados pueden acceder
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
