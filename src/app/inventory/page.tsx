import type { Inventory } from "@/types";
import { InventoryTable } from "@/components/inventory/inventory-table";

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

export default async function Inventory() {

    return (
        <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl space-y-6">
                <h1 className="text-3xl font-semibold mb-6">Inventory</h1>

                <InventoryTable inventories={mockInventories}/>
                
            </div>
        </div>
    )


}