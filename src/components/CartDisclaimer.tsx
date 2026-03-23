// src/components/CartDisclaimer.tsx
import { AlertCircle } from 'lucide-react';

const CartDisclaimer = ({ hasItemsToOrder }: { hasItemsToOrder: boolean }) => {
    if (!hasItemsToOrder) return null;

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-brutal flex items-start space-x-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-bold">Atención:</p>
                <p className="text-sm">
                    Uno o más productos en tu carrito son realizados a pedido y requieren un tiempo de espera estimado.
                    Te contactaremos para confirmar los plazos.
                </p>
            </div>
        </div>
    );
};

export default CartDisclaimer;