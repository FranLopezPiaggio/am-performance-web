// src/hooks/authFetch.ts
'use client';

import { createClient } from '@/lib/supabase/client';

// 2. Create the client INSIDE the function to avoid module-level initialization issues
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    // Create client per-request (not at module level)
    const supabase = createClient();

    // Obtiene la sesión desde el cliente
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        // Es mejor lanzar un error para que el componente que lo llama pueda manejarlo
        throw new Error('No active session. Cannot make authenticated request.');
    }

    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            // El token de acceso
            'Authorization': `Bearer ${session.access_token}`,
            ...options.headers,
        },
    };

    return fetch(url, { ...defaultOptions, ...options });
};
