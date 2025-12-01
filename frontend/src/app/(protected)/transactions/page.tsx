"use client";
import type { Transaction } from "@/types";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

async function fetchTransactions(): Promise<Transaction[]> {
  return api.get<Transaction[]>("/transactions");
}

async function createTransaction(data: {
  sku: string;
  type: "IN" | "OUT";
  quantity: number;
  description?: string;
}): Promise<void> {
  await api.post("/transactions", data);
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleTransactionCreated = useCallback(async () => {
    // Refresh transactions after transaction is created
    await loadTransactions();
  }, [loadTransactions]);

  const handleCreateTransaction = useCallback(
    async (data: {
      sku: string;
      type: "IN" | "OUT";
      quantity: number;
      description?: string;
    }) => {
      try {
        await createTransaction(data);
        // Refresh transactions after successful transaction
        await loadTransactions();
      } catch (e: unknown) {
        throw e; // Re-throw to let the modal handle the error
      }
    },
    [loadTransactions]
  );

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="text-gray-500">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-3xl font-semibold mb-6">Transactions</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <TransactionsTable
          transactions={transactions}
          onCreateTransaction={handleCreateTransaction}
          onTransactionCreated={handleTransactionCreated}
        />
      </div>
    </div>
  );
}