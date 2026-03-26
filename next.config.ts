import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true, // Enable for local images to avoid optimization errors
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**'
      },
    ],
  },

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

  webpack: (config) => {
    config.module.rules.push({
      test: /\.webm$/,
      use: 'file-loader',
    });
    return config;
  },
};

export default nextConfig;