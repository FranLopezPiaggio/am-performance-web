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