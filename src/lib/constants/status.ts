// src/lib/constants/status.ts
// Status colors and labels for admin UI — single source of truth

export const orderStatusColors: Record<string, string> = {
  pending: 'text-yellow',
  paid: 'text-blue-400',
  processing: 'text-neon-green',
  shipped: 'text-neon-green',
  delivered: 'text-green-400',
  cancelled: 'text-red-500',
};

export const orderStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const orderStatusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export const projectStatusColors: Record<string, string> = {
  new: 'text-neon-green',
  contacted: 'text-blue-400',
  quoted: 'text-yellow',
  won: 'text-green-400',
  lost: 'text-red-500',
};

export const projectStatusLabels: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  quoted: 'Cotizado',
  won: 'Ganado',
  lost: 'Perdido',
};

export const projectStatusOptions = ['new', 'contacted', 'quoted', 'won', 'lost'] as const;
