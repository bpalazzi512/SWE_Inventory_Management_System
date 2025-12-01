"use client";
import type { Inventory } from "@/types";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

async function fetchInventory(): Promise<Inventory[]> {
  const data = await api.get<Inventory[]>("/inventory");
  // Ensure shape matches Inventory type with sensible defaults
  return (data as Inventory[]).map((i) => ({
    name: i.name,
    sku: i.sku,
    category: i.category ?? "",
    quantity: Number(i.quantity ?? 0),
    unitPrice: Number(i.unitPrice ?? 0),
    lowStockThreshold: 0,
    description: i.description ?? "",
  })) as Inventory[];
}

async function createTransaction(data: {
  sku: string;
  type: "IN" | "OUT";
  quantity: number;
  description?: string;
}): Promise<void> {
  await api.post("/transactions", data);
}

export default function Inventory() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInventory();
      setInventories(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleTransactionCreated = useCallback(async () => {
    // Refresh inventory after transaction is created
    await loadInventory();
  }, [loadInventory]);

  const handleCreateTransaction = useCallback(
    async (data: {
      sku: string;
      type: "IN" | "OUT";
      quantity: number;
      description?: string;
    }) => {
      try {
        await createTransaction(data);
        // Refresh inventory after successful transaction
        await loadInventory();
      } catch (e: unknown) {
        throw e; // Re-throw to let the modal handle the error
      }
    },
    [loadInventory]
  );

  if (loading && inventories.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="text-gray-500">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-3xl font-semibold mb-6">Inventory</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <InventoryTable
          inventories={inventories}
          onCreateTransaction={handleCreateTransaction}
          onTransactionCreated={handleTransactionCreated}
        />
      </div>
    </div>
  );
}