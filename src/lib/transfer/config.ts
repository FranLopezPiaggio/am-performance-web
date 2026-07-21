export interface BankAccount {
  bank: string;
  accountType: string;
  accountNumber: string;
  cbu: string;
  alias: string;
  owner: string;
  dni: string;
}

export interface TransferConfig {
  discountPercentage: number;
  discountLabel: string;
  expirationHours: number;
  instructions: string[];
  bankAccounts: BankAccount[];
}

export const transferConfig: TransferConfig = {
  discountPercentage: 10,
  discountLabel: '10% de descuento',
  expirationHours: 24,
  instructions: [
    'Realiza la transferencia por el monto total indicado',
    'Guarda el comprobante de transferencia',
    'Envíanos el comprobante por este chat',
    'Una vez verificado, enviaremos tu pedido',
  ],
  bankAccounts: [
    {
      bank: process.env.NEXT_PUBLIC_TRANSFER_BANK || 'Banco Patagonia',
      accountType: process.env.NEXT_PUBLIC_TRANSFER_ACCOUNT_TYPE || 'Cuenta Corriente',
      accountNumber: process.env.NEXT_PUBLIC_TRANSFER_ACCOUNT_NUMBER || '1234567890',
      cbu: process.env.NEXT_PUBLIC_TRANSFER_CBU || '0340215608123456789012',
      alias: process.env.NEXT_PUBLIC_TRANSFER_ALIAS || 'AM.PERFORMANCE',
      owner: process.env.NEXT_PUBLIC_TRANSFER_OWNER || 'AM PERFORMANCE SRL',
      dni: process.env.NEXT_PUBLIC_TRANSFER_DNI || '30-12345678-9',
    },
  ],
};

/**
 * Calculate the discounted total for bank transfer
 */
export function calculateTransferDiscount(total: number): number {
  const discount = (total * transferConfig.discountPercentage) / 100;
  return total - discount;
}

/**
 * Format account number for display (masked)
 */
export function getMaskedAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  return '****' + accountNumber.slice(-4);
}