import type { Product } from "@/types";
import { ProductsTable } from "@/components/products/products-table";
import CreateProductModal from "./create-product-modal";

const mockProducts: Product[] = [
    {
        name: "NetLink Router R3000",
        sku: "SEA000001",
        description: "Dual-band WiFi 6 router with 4 LAN ports",
        category: "Routers",
        unitPrice: 129.99,
    },
    {
        name: "NetLink Router R5000 Pro",
        sku: "BOS000001",
        description: "Enterprise-grade router with VPN and firewall",
        category: "Routers",
        unitPrice: 349.0,
    },
    {
        name: "SwiftSwitch 24G",
        sku: "SEA000003",
        description: "24-port gigabit managed switch",
        category: "Switches",
        unitPrice: 219.5,
    },
    {
        name: "SwiftSwitch 48G+",
        sku: "SEA000004",
        description: "48-port PoE+ gigabit switch with 4 SFP slots",
        category: "Switches",
        unitPrice: 499.0,
    },
    {
        name: "AirWave AP200",
        sku: "SEA000005",
        description: "WiFi 6 access point with mesh support",
        category: "Access Points",
        unitPrice: 149.0,
    },
    {
        name: "AirWave AP500 Pro",
        sku: "SEA000006",
        description: "WiFi 6E tri-band access point",
        category: "Access Points",
        unitPrice: 259.99,
    },
    {
        name: "FiberPro SFP-10G",
        sku: "SEA000007",
        description: "10G SFP+ transceiver module",
        category: "Transceivers",
        unitPrice: 89.99,
    },
    {
        name: "FiberPro SFP-1G",
        sku: "SEA000008",
        description: "1G SFP module (multimode)",
        category: "Transceivers",
        unitPrice: 39.99,
    },
    {
        name: "PowerLink Cat6 10ft",
        sku: "SEA000009",
        description: "Cat6 Ethernet cable (10 ft)",
        category: "Cables",
        unitPrice: 7.99,
    },
    {
        name: "PowerLink Cat6 50ft",
        sku: "SEA000010",
        description: "Cat6 Ethernet cable (50 ft)",
        category: "Cables",
        unitPrice: 14.99,
    },
    {
        name: "PowerLink Fiber LC-LC 5m",
        sku: "SEA000011",
        description: "Duplex fiber patch cable (OM4, 5m)",
        category: "Cables",
        unitPrice: 24.99,
    },
    {
        name: "NetCase 1U Rackmount Kit",
        sku: "SEA000012",
        description: "Mounting kit for small network devices",
        category: "Accessories",
        unitPrice: 29.99,
    },
    {
        name: "PowerStation PSU-120W",
        sku: "SEA000013",
        description: "120W power supply for switches/routers",
        category: "Power Supplies",
        unitPrice: 49.99,
    },
    {
        name: "NetGuard UPS Mini",
        sku: "SEA000014",
        description: "600VA UPS with 4 surge outlets",
        category: "Power Supplies",
        unitPrice: 99.0,
    },
    {
        name: "TestLink Cable Tester CT100",
        sku: "SEA000015",
        description: "Network cable tester with RJ45/RJ11 support",
        category: "Tools",
        unitPrice: 39.0,
    },
];

const mockCategories: string[] = [
    "Routers",
    "Switches",
    "Access Points",
    "Transcievers",
    "Cables",
    "Accessories",
    "Power Supplies",
    "Tools",
]

const mockLocations: string[] = [
    "BOS",
    "SEA",
]

export default async function Inventory() {

    return (
        <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl space-y-6">
                <h1 className="text-3xl font-semibold mb-6">Products</h1>
                <ProductsTable 
                    products={mockProducts} 
                    categories={mockCategories}
                    locations={mockLocations}/>
            </div>
        </div>
    )


}