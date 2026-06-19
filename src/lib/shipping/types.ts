// S3: Shipping Types
// DTOs e interfaces para el módulo de shipping con Andreani

// ==========================================
// 1. Tipos de Contrato
// ==========================================

/**
 * Tipos de contrato Andreani disponibles
 */
export type AndreaniContrato = 'estandar' | 'urgente' | 'sucursal';

/**
 * Mapeo de contratos a nombres técnicos
 */
export const CONTRATO_MAP: Record<AndreaniContrato, string> = {
  estandar: 'AND00EST',
  urgente: 'AND00URG',
  sucursal: 'AND00SUC',
};

// ==========================================
// 2. DTOs Request
// ==========================================

/**
 * Un producto/bulto para cotización
 */
export interface Package {
  /** Peso en kilogramos */
  pesoKg: number;
  /** Volumen en cm3 (opcional si hay dimensiones) */
  volumenCm3?: number;
  /** Alto en cm */
  altoCm?: number;
  /** Ancho en cm */
  anchoCm?: number;
  /** Largo en cm */
  largoCm?: number;
  /** Valor declarado sin impuestos (para seguro) */
  valorDeclarado?: number;
}

/**
 * Solicitud de cotización de envío
 */
export interface ShippingQuoteRequest {
  /** Código postal de destino */
  cpDestino: string;
  /** Código postal de origen (opcional, usa default si no se pasa) */
  cpOrigen?: string;
  /** Lista de productos/bultos */
  productos: Package[];
  /** Tipo de contrato */
  contrato?: AndreaniContrato;
}

// ==========================================
// 3. DTOs Response
// ==========================================

/**
 * Respuesta de cotización de Andreani
 */
export interface ShippingQuoteResponse {
  /** Costo del envío en pesos */
  tarifa: number;
  /** Categoría de peso (1-5) */
  categoriaPeso: number;
  /** Descripción de categoría de peso */
  categoriaPesoDesc?: string;
  /** Categoría de distancia (LOCAL/REGIONAL/NACIONAL) */
  categoriaDistancia: string;
  /** Peso aforado calculado por Andreani */
  pesoAforado: number;
  /** Días estimados de entrega */
  tiempoEntregaDias: number;
  /** Rango de días (para mostrar al usuario) */
  tiempoEntregaTexto?: string;
  /** Contrato usado */
  contrato: AndreaniContrato;
  /** CP de origen usado */
  cpOrigen: string;
  /** CP de destino */
  cpDestino: string;
  /** Timestamp de la cotización */
  cotizadoAt: number;
  /** Si vino de cache */
  fromCache?: boolean;
}

/**
 * Error de cotización
 */
export interface ShippingQuoteError {
  code: string;
  message: string;
  details?: string;
}

// ==========================================
// 4. Tipos de DB
// ==========================================

/**
 * Zona de envío (origen)
 */
export interface ShippingZone {
  id: string;
  name: string;
  cpOrigen: string;
  provincia: string;
  localidad: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Cotización cacheada en DB
 */
export interface ShippingQuote {
  id: string;
  cpOrigen: string;
  cpDestino: string;
  totalPesoKg: number;
  totalVolumenCm3: number;
  contrato: string;
  resultado: ShippingQuoteResponse;
  createdAt: string;
  expiresAt: string | null;
}

// ==========================================
// 5. UI Types
// ==========================================

/**
 * Opción de envío para mostrar en UI
 */
export interface ShippingOption {
  id: string;
  label: string;
  description: string;
  price: number;
  deliveryDays: number;
  deliveryText: string;
  contrato: AndreaniContrato;
}

/**
 * Estado del calculador de envío en el frontend
 */
export interface ShippingCalculatorState {
  cpDestino: string;
  isLoading: boolean;
  quote: ShippingQuoteResponse | null;
  error: ShippingQuoteError | null;
  selectedOption: ShippingOption | null;
}

// ==========================================
// 6. API Response wrapper
// ==========================================

/**
 * Respuesta exitosa de API
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * Respuesta de error de API
 */
export interface ApiErrorResponse {
  success: false;
  error: ShippingQuoteError;
}

/**
 * Tipo de respuesta de API
 */
export type ApiShippingResponse<T> = ApiResponse<T> | ApiErrorResponse;

// ==========================================
// Helper functions
// ==========================================

/**
 * Calcula el volumen total de una lista de paquetes
 * Si no hay volumen directo, lo calcula desde dimensiones
 */
export function calculateTotalVolumen(productos: Package[]): number {
  return productos.reduce((total, pkg) => {
    if (pkg.volumenCm3) {
      return total + pkg.volumenCm3;
    }
    // Calcular desde dimensiones
    if (pkg.altoCm && pkg.anchoCm && pkg.largoCm) {
      return total + (pkg.altoCm * pkg.anchoCm * pkg.largoCm);
    }
    return total;
  }, 0);
}

/**
 * Calcula el peso total de una lista de paquetes
 */
export function calculateTotalPeso(productos: Package[]): number {
  return productos.reduce((total, pkg) => total + pkg.pesoKg, 0);
}

/**
 * Genera texto de tiempo de entrega
 */
export function getDeliveryText(dias: number): string {
  if (dias <= 1) return '1 día hábil';
  if (dias <= 3) return '2-3 días hábiles';
  if (dias <= 5) return '3-5 días hábiles';
  if (dias <= 7) return '5-7 días hábiles';
  return `${dias}+ días hábiles`;
}

/**
 * Convierte respuesta de API a ShippingOption
 */
export function toShippingOption(
  quote: ShippingQuoteResponse,
  label?: string
): ShippingOption {
  return {
    id: `${quote.contrato}-${quote.cpDestino}`,
    label: label || getContratoLabel(quote.contrato),
    description: `Entrega a CP ${quote.cpDestino}`,
    price: quote.tarifa,
    deliveryDays: quote.tiempoEntregaDias,
    deliveryText: quote.tiempoEntregaTexto || getDeliveryText(quote.tiempoEntregaDias),
    contrato: quote.contrato,
  };
}

/**
 * Obtiene label legible para contrato
 */
export function getContratoLabel(contrato: AndreaniContrato): string {
  const labels: Record<AndreaniContrato, string> = {
    estandar: 'Envío Estándar',
    urgente: 'Envío Urgente',
    sucursal: 'Retiro en Sucursal',
  };
  return labels[contrato];
}