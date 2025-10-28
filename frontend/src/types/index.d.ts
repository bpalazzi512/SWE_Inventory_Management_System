export type Inventory = {
    name: string;
    sku: string;
    lowStockThreshold: number;
    category?: string;
    quantity: number;
    unitPrice?: number;
    description?: string;
};

export type ProductInfo = {
  totalSkus: number;
  totalInventory: number;
  lowStockSkus: number;
};

export type Transaction = {
  date: string;
  sku: string;
  type: "IN" | "OUT";
  quantity: number;
};

export type QuickAction = {
  name: string;
  href: string;
};