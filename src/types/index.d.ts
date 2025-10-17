export type Inventory = {
    name: string;
    sku: string;
    category?: string;
    quantity: number;
    unitPrice?: number;
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