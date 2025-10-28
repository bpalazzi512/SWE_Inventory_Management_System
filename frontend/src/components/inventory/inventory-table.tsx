"use client"

import type { Inventory } from "@/types";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";


export function InventoryTable({ inventories }: { inventories: Inventory[] }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<keyof Inventory>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    //Filter Inventories based on search
    const filteredInventories = useMemo(() => {
        return inventories.filter((t) =>
            [t.name.toLowerCase(), t.sku.toLowerCase()].some((value) =>
                value.includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm]);

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

    return (

        <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="flex items-center">
                <Input
                    type="text"
                    placeholder="Search by name or SKU..."
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
                        {sortedInventories.map((t, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="pl-4">{t.name}</TableCell>
                                <TableCell>{t.sku}</TableCell>
                                <TableCell>{t.category}</TableCell>
                                <TableCell className="text-center">{t.quantity}</TableCell>
                                <TableCell className="text-right pr-6">
                                    ${t.unitPrice?.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
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