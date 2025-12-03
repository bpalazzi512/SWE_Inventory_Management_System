"use client";

import type { Inventory } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

async function fetchInventory(): Promise<Inventory[]> {
  const data = await api.get<Inventory[]>("/inventory");
  return (data as Inventory[]).map((i) => ({
    name: i.name,
    sku: i.sku,
    category: i.category ?? "",
    quantity: Number(i.quantity ?? 0),
    unitPrice: Number(i.unitPrice ?? 0),
    lowStockThreshold:
      typeof i.lowStockThreshold === "number" ? i.lowStockThreshold : -1,
    description: i.description ?? "",
  }));
}

export function LowStockAlertsCard() {
  const [items, setItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInventory();
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const lowStockItems = items.filter(
    (i) => i.lowStockThreshold > 0 && i.quantity <= i.lowStockThreshold
  );

  return (
    <Card className="flex flex-col justify-start h-full">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="text-muted-foreground" size={18} />
        <h2 className="font-semibold">Low Stock Alerts</h2>
      </div>

      {loading && lowStockItems.length === 0 && (
        <div className="text-sm text-gray-500">Loading alerts...</div>
      )}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!loading && lowStockItems.length === 0 && !error && (
        <div className="text-sm text-gray-500">
          No products are currently below their low stock thresholds.
        </div>
      )}

      <ul className="space-y-1.5 text-sm">
        {lowStockItems.map((item) => (
          <li
            key={item.sku}
            className="flex items-center justify-between rounded-md border px-3 py-1.5"
          >
            <span className="font-medium text-sm">{item.name}</span>
            <span className="text-xs text-gray-600">{item.sku}</span>
            <span className="text-xs text-gray-700">
              Qty: <span className="font-semibold">{item.quantity}</span>
            </span>
            <span className="text-xs text-gray-700">
              Threshold: <span className="font-semibold">{item.lowStockThreshold}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
