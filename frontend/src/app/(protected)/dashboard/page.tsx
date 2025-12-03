"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, TriangleAlert } from "lucide-react";
import SiteSurveyModal from "@/components/dashboard/site-survey-modal";
import { Inventory, Transaction } from "@/types";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { LowStockAlertsCard } from "@/components/dashboard/low-stock-alerts";

type RecentTxItem = { date: string; sku: string; type: "IN" | "OUT"; quantity: number };

export default function DashboardPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [inventoryData, transactionsData] = await Promise.all([
          api.get<Inventory[]>("/inventory").catch(() => [] as Inventory[]),
          api.get<Transaction[]>("/transactions").catch(() => [] as Transaction[]),
        ]);
        setInventory(inventoryData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col p-8">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  // Product info summary
  const totalSkus = inventory.length;
  const totalInventory = inventory.reduce(
    (sum: number, i: Inventory) => sum + Number(i.quantity ?? 0),
    0
  );
  const lowStockItems = inventory
    .filter((i: Inventory) => {
      const threshold = typeof i.lowStockThreshold === "number" ? i.lowStockThreshold : -1;
      const qty = Number(i.quantity ?? 0);
      return threshold > 0 && qty <= threshold;
    })
    .sort(
      (a: Inventory, b: Inventory) =>
        Number(a.quantity ?? 0) - Number(b.quantity ?? 0)
    )
    .slice(0, 6);
  const lowStockSkus = lowStockItems.length;

  // Flatten recent transaction items (newest first)
  const recentTxItems: RecentTxItem[] = transactions
    .flatMap((t: Transaction) =>
      (t.items || []).map((it) => ({
        date: t.date,
        sku: it.sku,
        type: it.type,
        quantity: it.quantity,
      }))
    )
    .slice(0, 10);

  const quickActions = [
    { name: "Add User", href: "/settings" },
    { name: "Record Stock In/Out", href: "/transactions" },
  ];

  return (
    <div className="w-full h-full flex flex-col p-8">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      {/* Grid: Product Info + Low Stock Alerts */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 auto-rows-[1fr] mb-6">
        {/* Product Info */}
        <Card className="flex flex-col justify-start">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              Product Info <Info />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Total SKUs: <span className="font-medium">{totalSkus}</span>
            </p>
            <p>
              Total Inventory:{" "}
              <span className="font-medium">{totalInventory}</span>
            </p>
            <p>
              Low Stock SKUs:{" "}
              <span className="font-medium">{lowStockSkus}</span>
            </p>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="flex flex-col justify-start">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              Low Stock Alerts <TriangleAlert />{" "}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {lowStockItems.map((item: Inventory) => (
                <li
                  key={item.sku}
                  className="flex justify-between border-b pb-1 last:border-none"
                >
                  <span>{item.name}</span>
                  <span>{item.sku}</span>
                  <span className="text-muted-foreground">
                    Qty: {item.quantity} / Threshold: {item.lowStockThreshold}
                  </span>
                </li>
              ))}
              {lowStockItems.length === 0 && (
                <li className="text-muted-foreground">
                  All good. No low stock items.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions: Full Width, Row Layout */}
      <Card className="flex flex-col justify-start w-full mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-4 items-center">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="text-primary hover:underline text-sm cursor-pointer"
              >
                {action.name}
              </Link>
            ))}
            <SiteSurveyModal />
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions: Full Width */}
      <Card className="flex flex-col justify-start w-full">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {recentTxItems.map((t, idx) => (
              <li
                key={`${t.date}-${t.sku}-${idx}`}
                className="flex justify-between border-b pb-1 last:border-none"
              >
                <span>{t.date}</span>
                <span>{t.sku}</span>
                <span>{t.quantity}</span>
                <span
                  className={`${
                    t.type === "IN" ? "text-green-600" : "text-red-600"
                  } font-medium`}
                >
                  {t.type}
                </span>
              </li>
            ))}
            {recentTxItems.length === 0 && (
              <li className="text-muted-foreground">
                No recent transactions.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


