'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchParamHandler() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    return null;
}