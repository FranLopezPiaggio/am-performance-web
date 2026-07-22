export type WhatsAppMsgContext = 'projects' | 'shop' | 'support' | 'other' | 'order' | 'showroom' | 'help' | 'info';

export interface WhatsAppConfig {
  phone: string;
  messages: Partial<Record<WhatsAppMsgContext, string>>;
}