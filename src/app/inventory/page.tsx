"use client"

import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";


type Inventory = {
    name: string;
    sku: string;
    category: string;
    quantity: number;
    unitPrice: number;
};

const mockInventories: Inventory[] = [
    {
        name: "HP Pavilion Laptop",
        sku: "SEA000001",
        category: "Electronics",
        quantity: 200,
        unitPrice: 599.0,
    },
    {
        name: "Apple MacBook Pro",
        sku: "SEA000002",
        category: "Electronics",
        quantity: 50,
        unitPrice: 1999.99,
    },
    {
        name: "Logitech Wireless Mouse",
        sku: "SEA000003",
        category: "Accessories",
        quantity: 400,
        unitPrice: 29.99,
    },
    {
        name: "Dell Ultrasharp Monitor",
        sku: "SEA000004",
        category: "Electronics",
        quantity: 120,
        unitPrice: 279.49,
    },
];

//Eventually will need to turn this page async so we can fetch inventory data
//Plan: create a table + search bar component that we pass the inventory objects to
//Use pagination, when searching maybe pass up search term so we can search server-side
//instead of getting all inventory objects and filtering

export default function Inventory() {

    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<keyof Inventory>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Filter Inventories based on search
    const filteredInventories = useMemo(() => {
        return mockInventories.filter((t) =>
            [t.name.toLowerCase(), t.sku.toLowerCase()].some((value) =>
                value.includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm]);

    // Sort Inventories
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
        <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl space-y-6">
                <h1 className="text-3xl font-semibold mb-6">Inventory</h1>

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
                                        ${t.unitPrice.toFixed(2)}
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
        </div>
    )


}