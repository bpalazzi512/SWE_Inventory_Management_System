import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, TriangleAlert } from "lucide-react";
import SiteSurveyModal from "@/components/dashboard/site-survey-modal";
import { Inventory, Transaction } from "@/types";

type RecentTxItem = { date: string; sku: string; type: "IN" | "OUT"; quantity: number };

async function fetchInventory() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
  const res = await fetch(`${apiBase}/inventory`);
  if (!res.ok) return [] as Inventory[];
  return (res.json() as unknown) as Inventory[];
}

async function fetchTransactions() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
  const res = await fetch(`${apiBase}/transactions`);
  if (!res.ok) return [] as Transaction[];
  return (res.json() as unknown) as Transaction[];
}

export default async function Dashboard() {
  const [inventory, transactions] = await Promise.all([fetchInventory(), fetchTransactions()]);

  // Product info summary
  const totalSkus = inventory.length;
  const totalInventory = inventory.reduce((sum: number, i: any) => sum + Number(i.quantity ?? 0), 0);
  const LOW_STOCK_THRESHOLD = 5; // simple rule since backend doesn't store threshold per product
  const lowStockItems = inventory
    .filter((i: any) => Number(i.quantity ?? 0) <= LOW_STOCK_THRESHOLD)
    .sort((a: any, b: any) => Number(a.quantity ?? 0) - Number(b.quantity ?? 0))
    .slice(0, 6);
  const lowStockSkus = lowStockItems.length;

  // Flatten recent transaction items (newest first)
  const recentTxItems: RecentTxItem[] = (transactions as any[])
    .flatMap((t) =>
      (t.items || []).map((it: any) => ({
        date: t.date,
        sku: it.sku,
        type: it.type,
        quantity: it.quantity,
      }))
    )
    .slice(0, 10);

  const quickActions = [
    { name: "Add User", href: "/login" },
    { name: "Record Stock In/Out", href: "/transactions" },
  ];

  return (
    <div className="w-full h-full flex flex-col p-8">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 auto-rows-[1fr]">
        {/* Product Info */}
        <Card className="flex flex-col justify-start">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">Product Info <Info/></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Total SKUs: <span className="font-medium">{totalSkus}</span></p>
            <p>Total Inventory: <span className="font-medium">{totalInventory}</span></p>
            <p>Low Stock SKUs: <span className="font-medium">{lowStockSkus}</span></p>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="flex flex-col justify-start">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">Low Stock Alerts <TriangleAlert/> </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {lowStockItems.map((item: any) => (
                <li key={item.sku} className="flex justify-between border-b pb-1 last:border-none">
                  <span>{item.name}</span>
                  <span>{item.sku}</span>
                  <span className="text-muted-foreground">Qty: {item.quantity}</span>
                </li>
              ))}
              {lowStockItems.length === 0 && (
                <li className="text-muted-foreground">All good. No low stock items.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="flex flex-col justify-start">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {recentTxItems.map((t, idx) => (
                <li key={`${t.date}-${t.sku}-${idx}`} className="flex justify-between border-b pb-1 last:border-none">
                  <span>{t.date}</span>
                  <span>{t.sku}</span>
                  <span>{t.quantity}</span>
                  <span className={`${t.type === "IN" ? "text-green-600" : "text-red-600"} font-medium`}>
                    {t.type}
                  </span>
                </li>
              ))}
              {recentTxItems.length === 0 && (
                <li className="text-muted-foreground">No recent transactions.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="flex flex-col justify-start">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-left">
              {quickActions.map((action) => (
                <li key={action.name}>
                  <Link href={action.href} className="text-primary hover:underline">
                    {action.name}
                  </Link>
                </li>
              ))}
              <SiteSurveyModal/>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

