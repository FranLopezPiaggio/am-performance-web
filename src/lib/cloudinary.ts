// src/lib/cloudinary.ts
// Cloudinary SDK config — SERVER SIDE ONLY
// El cloud_name es público y se comparte con NEXT_PUBLIC_
// Nunca importar este archivo desde componentes cliente

import 'server-only';
import { v2 as cloudinary } from 'cloudinary';

const requiredVars = [
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const;

for (const v of requiredVars) {
  if (!process.env[v]) {
    throw new Error(`Missing required env var: ${v}`);
  }
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
