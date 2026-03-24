// src/components/SafeImage.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
}

export default function SafeImage({ src, alt, width, height, priority, ...props }: SafeImageProps) {
    const [useNextImage, setUseNextImage] = useState(true);

    // Si hay un error al cargar con next/image, cambiamos a una etiqueta img normal
    const handleError = () => {
        console.warn(`Next/Image failed to load ${src}, falling back to <img>.`);
        setUseNextImage(false);
    };

    if (!useNextImage) {
        // Fallback a la etiqueta img estándar
        return <img src={src} alt={alt} width={width} height={height} {...props} />;
    }

    // Intento con next/image
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            onError={handleError}
            {...props}
        />
    );
}