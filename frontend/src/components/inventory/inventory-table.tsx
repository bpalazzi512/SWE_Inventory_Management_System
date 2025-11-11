"use client"

import type { Inventory } from "@/types";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowUpDown, Copy, Check } from "lucide-react";
import RecordTransactionModal from "@/components/transactions/record-transaction-modal";
import { copyToClipboard } from "@/lib/utils";

interface InventoryTableProps {
  inventories: Inventory[];
  onCreateTransaction?: (data: {
    sku: string;
    type: "IN" | "OUT";
    quantity: number;
    description?: string;
  }) => Promise<void>;
  onTransactionCreated?: () => void;
}

export function InventoryTable({ inventories, onCreateTransaction, onTransactionCreated }: InventoryTableProps) {

    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<keyof Inventory>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [copiedCell, setCopiedCell] = useState<string | null>(null);
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    //Filter Inventories based on search
    const filteredInventories = useMemo(() => {
        return inventories.filter((t) =>
            [t.name.toLowerCase(), t.sku.toLowerCase()].some((value) =>
                value.includes(searchTerm.toLowerCase())
            )
        );
    }, [inventories, searchTerm]);

    //Sort Inventories
    const sortedInventories = useMemo(() => {
        return [...filteredInventories].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (typeof valA === "number" && typeof valB === "number") {
                return sortOrder === "asc" ? valA - valB : valB - valA;
            } else {
                return sortOrder === "asc"
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            }
        });
    }, [filteredInventories, sortKey, sortOrder]);

    const toggleSort = (key: keyof Inventory) => {
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
                    placeholder="Search by name or SKU..."
                    className="w-full max-w-md border-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Record Stock Button */}
                <div className="ml-2">
                    <RecordTransactionModal
                      onCreateTransaction={onCreateTransaction}
                      onCreated={onTransactionCreated}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-2xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-brand-primary">
                            <TableHead
                                className="cursor-pointer pl-4"
                                onClick={() => toggleSort("name")}
                            >
                                <div className="flex items-center gap-1">
                                    Name
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => toggleSort("sku")}
                            >
                                <div className="flex items-center gap-1">
                                    SKU
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => toggleSort("category")}
                            >
                                <div className="flex items-center gap-1">
                                    Category
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer text-center"
                                onClick={() => toggleSort("quantity")}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    Quantity
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer text-right pr-6"
                                onClick={() => toggleSort("unitPrice")}
                            >
                                <div className="flex items-center justify-end gap-1">
                                    Price
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedInventories.map((t, idx) => {
                            const rowId = `inventory-${idx}`;
                            return (
                                <TableRow key={idx}>
                                    <TableCell 
                                        className="pl-4 relative group"
                                        onMouseEnter={() => setHoveredCell(`name-${rowId}`)}
                                        onMouseLeave={() => {
                                            setHoveredCell(null);
                                            setCopiedCell(null);
                                        }}
                                    >
                                        <div 
                                            className="cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-2"
                                            onClick={() => handleCopy(t.name, `name-${rowId}`)}
                                        >
                                            <span>{t.name}</span>
                                            <span className="flex-shrink-0 w-[14px] flex items-center justify-center">
                                                {hoveredCell === `name-${rowId}` && (
                                                    copiedCell === `name-${rowId}` ? (
                                                        <Check size={14} className="text-green-600" />
                                                    ) : (
                                                        <Copy size={14} className="text-gray-600" />
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell 
                                        className="relative group"
                                        onMouseEnter={() => setHoveredCell(`sku-${rowId}`)}
                                        onMouseLeave={() => {
                                            setHoveredCell(null);
                                            setCopiedCell(null);
                                        }}
                                    >
                                        <div 
                                            className="cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-2"
                                            onClick={() => handleCopy(t.sku, `sku-${rowId}`)}
                                        >
                                            <span>{t.sku}</span>
                                            <span className="flex-shrink-0 w-[14px] flex items-center justify-center">
                                                {hoveredCell === `sku-${rowId}` && (
                                                    copiedCell === `sku-${rowId}` ? (
                                                        <Check size={14} className="text-green-600" />
                                                    ) : (
                                                        <Copy size={14} className="text-gray-600" />
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell 
                                        className="relative group"
                                        onMouseEnter={() => setHoveredCell(`category-${rowId}`)}
                                        onMouseLeave={() => {
                                            setHoveredCell(null);
                                            setCopiedCell(null);
                                        }}
                                    >
                                        <div 
                                            className="cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-2"
                                            onClick={() => handleCopy(t.category || "", `category-${rowId}`)}
                                        >
                                            <span>{t.category}</span>
                                            <span className="flex-shrink-0 w-[14px] flex items-center justify-center">
                                                {hoveredCell === `category-${rowId}` && (
                                                    copiedCell === `category-${rowId}` ? (
                                                        <Check size={14} className="text-green-600" />
                                                    ) : (
                                                        <Copy size={14} className="text-gray-600" />
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell 
                                        className="text-center relative group"
                                        onMouseEnter={() => setHoveredCell(`quantity-${rowId}`)}
                                        onMouseLeave={() => {
                                            setHoveredCell(null);
                                            setCopiedCell(null);
                                        }}
                                    >
                                        <div 
                                            className="cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                            onClick={() => handleCopy(String(t.quantity), `quantity-${rowId}`)}
                                        >
                                            <span>{t.quantity}</span>
                                            <span className="flex-shrink-0 w-[14px] flex items-center justify-center">
                                                {hoveredCell === `quantity-${rowId}` && (
                                                    copiedCell === `quantity-${rowId}` ? (
                                                        <Check size={14} className="text-green-600" />
                                                    ) : (
                                                        <Copy size={14} className="text-gray-600" />
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell 
                                        className="text-right pr-6 relative group"
                                        onMouseEnter={() => setHoveredCell(`price-${rowId}`)}
                                        onMouseLeave={() => {
                                            setHoveredCell(null);
                                            setCopiedCell(null);
                                        }}
                                    >
                                        <div 
                                            className="cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-end gap-2"
                                            onClick={() => handleCopy(`$${t.unitPrice?.toFixed(2)}`, `price-${rowId}`)}
                                        >
                                            <span>${t.unitPrice?.toFixed(2)}</span>
                                            <span className="flex-shrink-0 w-[14px] flex items-center justify-center">
                                                {hoveredCell === `price-${rowId}` && (
                                                    copiedCell === `price-${rowId}` ? (
                                                        <Check size={14} className="text-green-600" />
                                                    ) : (
                                                        <Copy size={14} className="text-gray-600" />
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {sortedInventories.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No results found.
                    </div>
                )}
            </div>
        </div>

    )



}