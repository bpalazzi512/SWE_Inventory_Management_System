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

    return (

        <div className="flex flex-col gap-4">

            {/* Table */}
            <div className="bg-white shadow rounded-2xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-brand-primary">
                            <TableHead
                                className="cursor-pointer pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    TID
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    Date
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    Type
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    Quantity
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    SKU
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                            
                            <TableHead
                                className="cursor-pointer pl-4"
                            >
                                <div className="flex items-center gap-1">
                                    Description
                                    <ArrowUpDown size={14} />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t) => (
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
                {transactions.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No results found.
                    </div>
                )}
            </div>
        </div>

    )



}