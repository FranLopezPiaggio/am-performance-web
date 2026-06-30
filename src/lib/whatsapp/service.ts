import { whatsappConfig } from "./config";
import { WhatsAppMsgContext } from "./types";

export const getWhatsAppUrl = (
  intent: WhatsAppMsgContext,
  params?: Record<string, string>
): string => {
  let message = whatsappConfig.messages[intent] || "";

  if (params) {
    Object.keys(params).forEach((key) => {
      message = message.replace(`{${key}}`, params[key] || "");
    });
  }

  const encodedMessage = encodeURIComponent(message);
  // Limpiamos el número de cualquier caracter no numérico
  const cleanPhone = whatsappConfig.phone.replace(/\D/g, '');

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const openWhatsApp = (intent: WhatsAppMsgContext, params?: Record<string, string>) => {
  if (typeof window !== "undefined") {
    const url = getWhatsAppUrl(intent, params);
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

/** Máximo seguro para el parámetro `text` de wa.me (límite real ~4096 total URL). */
const MAX_ENCODED_TEXT = 4000;

/**
 * Construye URL de WhatsApp con límite de tamaño.
 * Si el mensaje codificado excede MAX_ENCODED_TEXT, usa un fallback corto
 * con el número de orden para evitar URLs rotas.
 */
export const getWhatsAppUrlSafe = (
  message: string,
  shortFallback: string,
  phone?: string
): string => {
  const p = (phone || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '5492325511751').replace(/\D/g, '');
  const encoded = encodeURIComponent(message);

  if (encoded.length <= MAX_ENCODED_TEXT) {
    return `https://wa.me/${p}?text=${encoded}`;
  }

  // Fallback: mensaje corto con número de orden
  const fallbackEncoded = encodeURIComponent(shortFallback);
  return `https://wa.me/${p}?text=${fallbackEncoded}`;
};