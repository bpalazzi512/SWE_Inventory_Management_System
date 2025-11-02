"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info, TriangleAlert } from "lucide-react";
import type {ProductInfo, Inventory, Transaction, QuickAction } from "@/types"
import SiteSurveyModal from "@/components/dashboard/site-survey-modal";

const productInfo: ProductInfo = {
  totalSkus: 244,
  totalInventory: 9224,
  lowStockSkus: 24,
};

const lowStock: Inventory[] = [
  { sku: "SKU123", name: "Blue T-Shirt", quantity: 3 },
  { sku: "SKU456", name: "Red Hoodie", quantity: 5 },
  { sku: "SKU789", name: "Black Jeans", quantity: 2 },
];

const recentTransactions: Transaction[] = [
  { date: "2025-10-12", sku: "SKU123", type: "IN", quantity: 300 },
  { date: "2025-10-13", sku: "SKU456", type: "OUT", quantity: 600 },
  { date: "2025-10-14", sku: "SKU789", type: "IN", quantity: 2000 },
];

const quickActions: QuickAction[] = [
  { name: "Add User", href: "/users/add" },
  { name: "Record Stock In/Out", href: "/transactions/new" },
];


export default function Dashboard() {
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
            <p>Total SKUs: <span className="font-medium">{productInfo.totalSkus}</span></p>
            <p>Total Inventory: <span className="font-medium">{productInfo.totalInventory}</span></p>
            <p>Low Stock SKUs: <span className="font-medium">{productInfo.lowStockSkus}</span></p>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="flex flex-col justify-start">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">Low Stock Alerts <TriangleAlert/> </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {lowStock.map((item) => (
                <li
                  key={item.sku}
                  className="flex justify-between border-b pb-1 last:border-none"
                >
                  <span>{item.name}</span>
                  <span>{item.sku}</span>
                  <span className="text-muted-foreground">Qty: {item.quantity}</span>
                </li>
              ))}
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
              {recentTransactions.map((t, index) => (
                <li
                  key={index}
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
                  <Link
                    href={action.href}
                    className="text-primary hover:underline"
                  >
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

