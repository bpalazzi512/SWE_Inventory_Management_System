import type { Transaction } from "@/types";
import { TransactionsTable } from "@/components/transactions/transactions-table";

async function fetchTransactions(): Promise<Transaction[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
  const res = await fetch(`${apiBase}/transactions`, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: ${res.status}`);
  }
  return res.json();
}

export default async function Transactions() {
  const transactions = await fetchTransactions();

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-3xl font-semibold mb-6">Transactions</h1>
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}