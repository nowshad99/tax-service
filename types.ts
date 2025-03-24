// Sale Item
export interface SaleItem {
    itemId: string;
    cost: number; // in pennies
    taxRate: number;
}

// Sales Event
export interface SalesEvent {
    eventType: "SALES";
    date: string;
    invoiceId: string;
    items: SaleItem[];
}

// Tax Payment Event
export interface TaxPaymentEvent {
    eventType: "TAX_PAYMENT";
    date: string;
    amount: number; // in pennies
}

export const transactions: (SalesEvent | TaxPaymentEvent)[] = [];
export const amendments: Record<string, SaleItem[]> = {};