export type WhatsAppMsgContext = 'projects' | 'shop' | 'support' | 'other' | 'order' | 'showroom' | 'help';

export interface WhatsAppConfig {
  phone: string;
  messages: Record<WhatsAppMsgContext, string>;
}