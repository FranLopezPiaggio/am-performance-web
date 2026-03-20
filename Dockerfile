# Usa node:20-alpine como imagen base
FROM node:20-alpine AS base

# ----------------------------------------------------------------------------
# 1. Fase de Dependencias (deps)
# Instala las dependencias solo cuando los archivos package*.json cambian
# ----------------------------------------------------------------------------
FROM base AS deps
# libc6-compat podría ser necesario para librerías nativas usando alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia los archivos de manifiesto de dependencias
COPY package.json package-lock.json* ./
RUN npm ci

# ----------------------------------------------------------------------------
# 2. Fase de Desarrollo (dev)
# Hot-reload para desarrollo local. El código fuente se monta como volumen.
# ----------------------------------------------------------------------------
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
ENV PORT=3000
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ----------------------------------------------------------------------------
# 3. Fase de Construcción (builder)
# Compila el código fuente de Next.js
# ----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copia las dependencias instaladas en la fase anterior
COPY --from=deps /app/node_modules ./node_modules
# Copia todo el código fuente del proyecto
COPY . .

# Deshabilitar telemetría durante el build (opcional)
ENV NEXT_TELEMETRY_DISABLED=1

# Construye la aplicación. Requiere que en next.config.ts exista: `output: 'standalone'`
RUN npm run build

# ----------------------------------------------------------------------------
# 3. Fase de Ejecución (runner)
# Imagen de producción final: ultraligera, ejecuta el servidor standalone
# ----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Mejora de seguridad: usar un usuario/grupo sin privilegios
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia archivos estáticos
COPY --from=builder /app/public ./public

# Copia los archivos del build 'standalone' (son optimizados para ocupar muy poco tamaño)
# Y cambia el propietario a nuestro usuario sin privilegios
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Exponer el puerto al exterior (3000 por defecto de Next.js)
EXPOSE 3000
ENV PORT=3000
# Necesario para que Next.js standalone sea accesible desde fuera del contenedor
ENV HOSTNAME=0.0.0.0

# Cambia al usuario seguro
USER nextjs

# Comando para ejecutar la build standalone de Next.js
CMD ["node", "server.js"]
