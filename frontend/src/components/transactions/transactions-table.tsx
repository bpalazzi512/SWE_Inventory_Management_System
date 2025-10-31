"use client"

import type { Transaction } from "@/types";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import CreateProductModal from "@/components/products/create-product-modal";

interface TransactionTableProps {
    transactions: Transaction[];
    // categories: string[];
    // locations: string[];
}

export function TransactionsTable({ transactions }: TransactionTableProps) {

    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<keyof Transaction>("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    //Filter Transactions based on search
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) =>
            [t.date.toLowerCase(), t.tid.toLowerCase()].some((value) =>
                value.includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm]);

    //Sort Transactions
    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (typeof valA === "number" && typeof valB === "number") {
                return sortOrder === "desc" ? valA - valB : valB - valA;
            } else {
                return sortOrder === "desc"
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            }
        });
    }, [filteredTransactions, sortKey, sortOrder]);

    const toggleSort = (key: keyof Transaction) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    return (

        <div className="flex flex-col gap-4">

            {/* Search Input */}
                        <div className="flex items-center justify-between">
                            <Input
                                type="text"
                                placeholder="Search by TID or date..."
                                className="w-full max-w-md border-gray-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

            {/* Table */}
            <div className="bg-white shadow rounded-2xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-brand-primary">
                            <TableHead
                                className="cursor-pointer pl-4"
                                onClick={() => toggleSort("tid")}
                            >
                                <div className="flex items-center gap-1">
                                    TID
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer pl-4"
                                onClick={() => toggleSort("date")}
                            >
                                <div className="flex items-center gap-1">
                                    Date
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    Type
                                </div>
                            </TableHead>
                            <TableHead
                                className="pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    Quantity
                                </div>
                            </TableHead>
                            <TableHead
                                className="pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    SKU
                                </div>
                            </TableHead>

                            <TableHead
                                className="pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    Description
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTransactions.map((t) => (
                            <TableRow key={t.tid}>
                                <TableCell className="align-top">{t.tid}</TableCell>
                                <TableCell className="align-top">{t.date}</TableCell>
                                <TableCell className="pl-4 align-top">
                                    <div className="flex flex-col gap-1">
                                        {t.items.map((item, idx) => (
                                            <div key={idx}>{item.type}</div>
                                        ))}
                                    </div>
                                </TableCell>

                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        {t.items.map((item, idx) => (
                                            <div key={idx}>{item.quantity}</div>
                                        ))}
                                    </div>
                                </TableCell>

                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        {t.items.map((item, idx) => (
                                            <div key={idx}>{item.sku}</div>
                                        ))}
                                    </div>
                                </TableCell>

                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        {t.items.map((item, idx) => (
                                            <div key={idx}>{item.description}</div>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>


                </Table>
                {sortedTransactions.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No results found.
                    </div>
                )}
            </div>
        </div>

    )



}