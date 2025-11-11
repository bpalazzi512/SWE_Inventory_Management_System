"use client"

import type { Transaction } from "@/types";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowUpDown, Copy, Check } from "lucide-react";
import RecordTransactionModal from "@/components/transactions/record-transaction-modal";
import { copyToClipboard } from "@/lib/utils";

interface TransactionTableProps {
    transactions: Transaction[];
    onCreateTransaction?: (data: {
      sku: string;
      type: "IN" | "OUT";
      quantity: number;
      description?: string;
    }) => Promise<void>;
    onTransactionCreated?: () => void;
}

export function TransactionsTable({ transactions, onCreateTransaction, onTransactionCreated }: TransactionTableProps) {

    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<keyof Transaction>("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [copiedCell, setCopiedCell] = useState<string | null>(null);
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    //Filter Transactions based on search
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) =>
            [t.date.toLowerCase(), t.tid.toLowerCase()].some((value) =>
                value.includes(searchTerm.toLowerCase())
            )
        );
    }, [transactions, searchTerm]);

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

    const handleCopy = async (text: string, cellId: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedCell(cellId);
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
                            <RecordTransactionModal
                              onCreateTransaction={onCreateTransaction}
                              onCreated={onTransactionCreated}
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
                                <TableCell 
                                    className="align-top relative group"
                                    onMouseEnter={() => setHoveredCell(`tid-${t.tid}`)}
                                    onMouseLeave={() => {
                                        setHoveredCell(null);
                                        setCopiedCell(null);
                                    }}
                                >
                                    <div 
                                        className="cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-2"
                                        onClick={() => handleCopy(t.tid, `tid-${t.tid}`)}
                                    >
                                        <span>{t.tid}</span>
                                        <span className="flex-shrink-0 w-[14px] flex items-center justify-center">
                                            {hoveredCell === `tid-${t.tid}` && (
                                                copiedCell === `tid-${t.tid}` ? (
                                                    <Check size={14} className="text-green-600" />
                                                ) : (
                                                    <Copy size={14} className="text-gray-600" />
                                                )
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell 
                                    className="align-top relative group"
                                    onMouseEnter={() => setHoveredCell(`date-${t.tid}`)}
                                    onMouseLeave={() => {
                                        setHoveredCell(null);
                                        setCopiedCell(null);
                                    }}
                                >
                                    <div 
                                        className="cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-2"
                                        onClick={() => handleCopy(t.date, `date-${t.tid}`)}
                                    >
                                        <span>{t.date}</span>
                                        <span className="flex-shrink-0 w-[14px] flex items-center justify-center">
                                            {hoveredCell === `date-${t.tid}` && (
                                                copiedCell === `date-${t.tid}` ? (
                                                    <Check size={14} className="text-green-600" />
                                                ) : (
                                                    <Copy size={14} className="text-gray-600" />
                                                )
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="pl-4 align-top">
                                    <div className="flex flex-col gap-1">
                                        {t.items.map((item, idx) => (
                                            <div key={idx}>{item.type}</div>
                                        ))}
                                    </div>
                                </TableCell>

                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        {t.items.map((item, idx) => {
                                            const cellId = `quantity-${t.tid}-${idx}`;
                                            return (
                                                <div 
                                                    key={idx}
                                                    className="relative group flex items-center gap-2"
                                                    onMouseEnter={() => setHoveredCell(cellId)}
                                                    onMouseLeave={() => {
                                                        setHoveredCell(null);
                                                        setCopiedCell(null);
                                                    }}
                                                >
                                                    <div 
                                                        className="cursor-pointer hover:bg-gray-100 transition-colors px-1 rounded flex items-center gap-2"
                                                        onClick={() => handleCopy(String(item.quantity), cellId)}
                                                    >
                                                        <span>{item.quantity}</span>
                                                        <span className="flex-shrink-0 w-[14px] flex items-center justify-center">
                                                            {hoveredCell === cellId && (
                                                                copiedCell === cellId ? (
                                                                    <Check size={14} className="text-green-600" />
                                                                ) : (
                                                                    <Copy size={14} className="text-gray-600" />
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TableCell>

                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        {t.items.map((item, idx) => {
                                            const cellId = `sku-${t.tid}-${idx}`;
                                            return (
                                                <div 
                                                    key={idx}
                                                    className="relative group flex items-center gap-2"
                                                    onMouseEnter={() => setHoveredCell(cellId)}
                                                    onMouseLeave={() => {
                                                        setHoveredCell(null);
                                                        setCopiedCell(null);
                                                    }}
                                                >
                                                    <div 
                                                        className="cursor-pointer hover:bg-gray-100 transition-colors px-1 rounded flex items-center gap-2"
                                                        onClick={() => handleCopy(item.sku, cellId)}
                                                    >
                                                        <span>{item.sku}</span>
                                                        <span className="flex-shrink-0 w-[14px] flex items-center justify-center">
                                                            {hoveredCell === cellId && (
                                                                copiedCell === cellId ? (
                                                                    <Check size={14} className="text-green-600" />
                                                                ) : (
                                                                    <Copy size={14} className="text-gray-600" />
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
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