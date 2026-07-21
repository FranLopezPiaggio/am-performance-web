'use client';

import { useSearchParams } from 'next/navigation';

const ERROR_MESSAGES: Record<string, string> = {
    'auth_callback_error': 'Error al iniciar sesión. Por favor, intentá de nuevo.',
};

export default function SearchParamHandler() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    if (error) {
        const message = ERROR_MESSAGES[error] || 'Error de autenticación.';
        return <p style={{ color: 'red' }}>Error: {message}</p>;
    }

    return null;
}