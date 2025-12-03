export type Inventory = {
    name: string;
    sku: string;
  lowStockThreshold: number;
    category?: string;
    quantity: number;
    unitPrice?: number;
    description: string;
};

export type Product = {
  id?: string; // backend _id for actions like delete
  name: string;
  sku: string;
  description: string;
  category: string;
  unitPrice: number;
  lowStockThreshold?: number;
}

export type Transaction = {
  date: string;
  tid: string;
  items: TransactionItem[];
};

export type TransactionItem = {
  sku: string;
  type: "IN" | "OUT";
  quantity: number;
  description: string;
}

export type ProductInfo = {
  totalSkus: number;
  totalInventory: number;
  lowStockSkus: number;
};

export type QuickAction = {
  name: string;
  href: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}