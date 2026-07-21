// S2: Upstash Redis Setup
// Cliente y wrapper para cache de cotizaciones de envío

import { Redis } from '@upstash/redis';

// ==========================================
// 1. Redis Client (singleton)
// ==========================================

/**
 * Cliente de Upstash Redis.
 * Lee automáticamente de UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ==========================================
// 2. Tipos para Cache
// ==========================================

export interface CacheOptions {
  /** Time to live en segundos (default: 3600 = 1 hora) */
  ttl?: number;
  /** Prefijo para la key (default: 'amp') */
  prefix?: string;
}

export interface CachedItem<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

// ==========================================
// 3. Cache Service
// ==========================================

/**
 * Obtiene un valor del cache o lo genera si no existe.
 * @param key - Clave única para el cache
 * @param fetcher - Función que genera los datos si no hay cache
 * @param options - Opciones de TTL y prefijo
 */
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 3600, prefix = 'amp' } = options;

  const cacheKey = `${prefix}:${key}`;
  
  try {
    // 1. Intentar obtener del cache
    const cached = await redis.get<CachedItem<T>>(cacheKey);
    
    if (cached) {
      // Verificar si expiró
      if (cached.expiresAt && cached.expiresAt < Date.now()) {
        // Cache expiró, eliminar
        await redis.del(cacheKey);
      } else {
        return cached.data;
      }
    }
  } catch (error) {
    // Si falla Redis, continuar sin cache
    console.warn('[Cache] Redis get failed, fetching:', error);
  }

  // 2. Generar datos
  const data = await fetcher();

  try {
    // 3. Guardar en cache
    const cacheItem: CachedItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl * 1000,
    };
    
    // Upstash set with EX option
    await redis.set(cacheKey, cacheItem, { ex: ttl });
  } catch (error) {
    // Si falla guardar, no es crítico
    console.warn('[Cache] Redis set failed:', error);
  }

  return data;
}

/**
 * Obtiene un valor del cache sin generar
 */
export async function get<T>(key: string, prefix: string = 'amp'): Promise<T | null> {
  try {
    const cacheKey = `${prefix}:${key}`;
    const cached = await redis.get<CachedItem<T>>(cacheKey);
    
    if (cached) {
      if (!cached.expiresAt || cached.expiresAt > Date.now()) {
        return cached.data;
      }
    }
  } catch (error) {
    console.warn('[Cache] Redis get failed:', error);
  }
  
  return null;
}

/**
 * Guarda un valor en cache
 */
export async function set<T>(
  key: string,
  data: T,
  options: CacheOptions = {}
): Promise<void> {
  const { ttl = 3600, prefix = 'amp' } = options;
  const cacheKey = `${prefix}:${key}`;

  const cacheItem: CachedItem<T> = {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl * 1000,
  };

  await redis.set(cacheKey, cacheItem, { ex: ttl });
}

/**
 * Elimina una key del cache
 */
export async function invalidate(key: string, prefix: string = 'amp'): Promise<void> {
  const cacheKey = `${prefix}:${key}`;
  await redis.del(cacheKey);
}

/**
 * Elimina todas las keys con un patrón
 */
export async function invalidatePattern(pattern: string, prefix: string = 'amp'): Promise<void> {
  const patternKey = `${prefix}:${pattern}*`;
  
  try {
    const keys = await redis.keys(patternKey);
    if (keys && keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn('[Cache] Redis keys failed:', error);
  }
}

/**
 * Verifica si Redis está conectado
 */
export async function isRedisConnected(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// 4. Cache keys helpers para shipping
// ==========================================

export const ShippingCacheKeys = {
  /**
   * Genera clave para cotización de envío
   */
  quote: (
    cpOrigen: string,
    cpDestino: string,
    pesoKg: number,
    volumenCm3: number,
    contrato: string = 'estandar'
  ) => `shipping:quote:${cpOrigen}:${cpDestino}:${pesoKg}:${volumenCm3}:${contrato}`,

  /**
   * Genera clave para cotización de carrito completo
   */
  cartQuote: (cpDestino: string, totalPeso: number, totalVolumen: number, contract: string = 'estandar') =>
    `shipping:cart:${cpDestino}:${totalPeso}:${totalVolumen}:${contract}`,
};

const redisClient = {
  redis,
  getOrSet,
  get,
  set,
  invalidate,
  invalidatePattern,
  isRedisConnected,
  ShippingCacheKeys,
};

export default redisClient;