import { WhatsAppConfig } from "./types";

export const whatsappConfig: WhatsAppConfig = {
    // Siempre usa variables de entorno para datos sensibles o configurables
    // ponytail: fallback hardcodeado reemplazado por NEXT_PUBLIC_ env var
    phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || process.env.WHATSAPP_BUSINESS_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK || "",
    messages: {
        info: "Hola quiero mas info de AMPerformance",
        showroom: "Hola, me gustaría agendar una visita al showroom.",
        help: "Hola AM Performance!, necesito ayuda",
        projects: "Hola, mi nombre es {name}. He enviado una propuesta para un proyecto de gimnasio. ID de Consulta: {recordId}. Por favor ingresar al administrador para ver detalles.",
        // Futuros (sin implementar):
        // order: "{nombre} hizo la orden {orderId}",
        // shop: "Hola, me gustaría obtener más info sobre un producto.",
        // support: "Hola, necesito asistencia técnica.",
        // other: "Hola, tengo una consulta.",
    },
};