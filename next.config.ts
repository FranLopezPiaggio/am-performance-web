import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DEL PROYECTO NUEVO: Optimización automática de rendimiento (React Compiler)
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**'
      },
    ],
  },

  // DEL PROYECTO VIEJO: Optimización para Docker/Producción
  output: 'standalone',

  turbopack: {
    root: __dirname,
    rules: {
      '*.webm': {
        loaders: ['file-loader'],
        as: '*.webm',
      },
    },
  },
  experimental: {
  },
  // Para Webpack (fallback)
  webpack: (config) => {
    config.module.rules.push({
      test: /\.webm$/,
      use: 'file-loader',
    });
    return config;
  },

};

export default nextConfig;
