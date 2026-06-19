// src/components/CartDisclaimer.tsx
import { AlertCircle, Clock, Package } from 'lucide-react';

interface CartDisclaimerProps {
  hasOnlyDelayed: boolean;
  hasDelayed: boolean;
  hasMixed: boolean;
  maxLeadDays: number;
}

export default function CartDisclaimer({
  hasOnlyDelayed,
  hasDelayed,
  hasMixed,
  maxLeadDays,
}: CartDisclaimerProps) {
  if (!hasDelayed) return null;

  return (
    <div className="border-l-4 p-4 mb-6">
      {/* All delayed products */}
      {hasOnlyDelayed && (
        <div className="bg-yellow-500/10 border-yellow-500">
          <div className="flex items-start gap-3">
            <Clock className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-yellow-500 uppercase tracking-wider text-sm">
                Productos a Coordinar
              </p>
              <p className="text-white/70 text-sm mt-1">
                Los productos seleccionados requieren un tiempo de espera de{' '}
                <span className="text-yellow-500 font-bold">{maxLeadDays} días</span>.
                Te contactaremos para coordinar la entrega.
              </p>
              <p className="text-white/50 text-xs mt-2">
                El pedido se coordinará por WhatsApp una vez confirmado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mixed cart - has both immediate and delayed */}
      {hasMixed && (
        <div className="bg-yellow-500/10 border-yellow-500 mt-4">
          <div className="flex items-start gap-3">
            <Package className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-yellow-500 uppercase tracking-wider text-sm">
                Carrito Mixto
              </p>
              <p className="text-white/70 text-sm mt-1">
                Tu carrito tiene productos de entrega inmediata y productos con espera de{' '}
                <span className="text-yellow-500 font-bold">{maxLeadDays} días</span>.
              </p>
              <div className="mt-2 text-xs text-white/50">
                <p>• Entrega inmediata: Se procesará automáticamente</p>
                <p>• Productos a coordinar: Requieren coordinación por WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Base alert icon at bottom */}
      <div className="flex items-center gap-2 mt-3 text-white/40 text-xs">
        <AlertCircle size={14} />
        <span>Contáctanos para coordinación especial</span>
      </div>
    </div>
  );
}