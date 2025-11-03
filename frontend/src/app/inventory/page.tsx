import type { Inventory } from "@/types";
import { InventoryTable } from "@/components/inventory/inventory-table";

async function fetchInventory(): Promise<Inventory[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
  const res = await fetch(`${apiBase}/inventory`, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch inventory: ${res.status}`);
  }
  const data = await res.json();
  // Ensure shape matches Inventory type with sensible defaults
  return (data as any[]).map((i) => ({
    name: i.name,
    sku: i.sku,
    category: i.category ?? "",
    quantity: Number(i.quantity ?? 0),
    unitPrice: Number(i.unitPrice ?? 0),
    lowStockThreshold: 0,
    description: i.description ?? "",
  }));
}

export default async function Inventory() {
  const inventories = await fetchInventory();

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-3xl font-semibold mb-6">Inventory</h1>

        <InventoryTable inventories={inventories} />
      </div>
    </div>
  );
}