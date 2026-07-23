// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

// Extended User type with app_metadata
interface UserWithMetadata extends User {
  app_metadata: {
    provider?: string;
    role?: string;
    [key: string]: unknown;
  };
  user_metadata: Record<string, unknown>;
}

// Context type definition
interface AuthContextType {
  user: UserWithMetadata | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef<any>(null);

  // Check if user is admin based on app_metadata role
  const isAdmin = user?.app_metadata?.role === 'admin';

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      if (cancelled) return;
      supabaseRef.current = createClient();

      // 1. Get initial session
      const { data: { session } } = await supabaseRef.current.auth.getSession();
      if (cancelled) return;
      setUser(session?.user as UserWithMetadata ?? null);
      setLoading(false);

      // 2. Listen for auth changes (login/logout)
      const { data: { subscription } } = supabaseRef.current.auth.onAuthStateChange((_event: any, s: any) => {
        if (!cancelled) {
          setUser(s?.user as UserWithMetadata ?? null);
          setLoading(false);
        }
      });

      return () => { subscription.unsubscribe(); };
    };

    init();
    return () => { cancelled = true; };
  }, []);

  const getClient = useCallback(() => {
    // ponytail: signIn/signOut only called from user interaction, ref is always set by then
    return supabaseRef.current!;
  }, []);

  const signInWithGoogle = async () => {
    await getClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
        scopes: 'email profile openid',
      }
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await getClient().auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await getClient().auth.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAdmin,
    signInWithGoogle,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
