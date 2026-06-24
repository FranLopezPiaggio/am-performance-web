// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

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
  const supabaseRef = useRef(createClient());

  // Check if user is admin based on app_metadata role
  const isAdmin = user?.app_metadata?.role === 'admin';

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabaseRef.current.auth.getSession();
      setUser(session?.user as UserWithMetadata ?? null);
      setLoading(false);
    };

    getInitialSession();

    // 2. Listen for auth changes (login/logout)
    const { data: { subscription } } = supabaseRef.current.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as UserWithMetadata ?? null);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await supabaseRef.current.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
        scopes: 'email profile openid',
      }
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabaseRef.current.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabaseRef.current.auth.signOut();
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
