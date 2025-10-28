import type { Inventory } from "@/types";
import { InventoryTable } from "@/components/inventory/inventory-table";

const mockInventories: Inventory[] = [
{
name: "NetLink Router R3000",
sku: "SEA000001",
category: "Routers",
quantity: 25,
unitPrice: 129.99,
lowStockThreshold: 10,
description: "Dual-band WiFi 6 router with 4 LAN ports",
},
{
name: "NetLink Router R5000 Pro",
sku: "BOS000001",
category: "Routers",
quantity: 8,
unitPrice: 349.0,
lowStockThreshold: 5,
description: "Enterprise-grade router with VPN and firewall",
},
{
name: "SwiftSwitch 24G",
sku: "SEA000003",
category: "Switches",
quantity: 15,
unitPrice: 219.5,
lowStockThreshold: 5,
description: "24-port gigabit managed switch",
},
{
name: "SwiftSwitch 48G+",
sku: "SEA000004",
category: "Switches",
quantity: 5,
unitPrice: 499.0,
lowStockThreshold: 3,
description: "48-port PoE+ gigabit switch with 4 SFP slots",
},
{
name: "AirWave AP200",
sku: "SEA000005",
category: "Access Points",
quantity: 18,
unitPrice: 149.0,
lowStockThreshold: 6,
description: "WiFi 6 access point with mesh support",
},
{
name: "AirWave AP500 Pro",
sku: "SEA000006",
category: "Access Points",
quantity: 7,
unitPrice: 259.99,
lowStockThreshold: 3,
description: "WiFi 6E tri-band access point",
},
{
name: "FiberPro SFP-10G",
sku: "SEA000007",
category: "Transceivers",
quantity: 30,
unitPrice: 89.99,
lowStockThreshold: 10,
description: "10G SFP+ transceiver module",
},
{
name: "FiberPro SFP-1G",
sku: "SEA000008",
category: "Transceivers",
quantity: 45,
unitPrice: 39.99,
lowStockThreshold: 10,
description: "1G SFP module (multimode)",
},
{
name: "PowerLink Cat6 10ft",
sku: "SEA000009",
category: "Cables",
quantity: 100,
unitPrice: 7.99,
lowStockThreshold: 20,
description: "Cat6 Ethernet cable (10 ft)",
},
{
name: "PowerLink Cat6 50ft",
sku: "SEA000010",
category: "Cables",
quantity: 60,
unitPrice: 14.99,
lowStockThreshold: 15,
description: "Cat6 Ethernet cable (50 ft)",
},
{
name: "PowerLink Fiber LC-LC 5m",
sku: "SEA000011",
category: "Cables",
quantity: 40,
unitPrice: 24.99,
lowStockThreshold: 10,
description: "Duplex fiber patch cable (OM4, 5m)",
},
{
name: "NetCase 1U Rackmount Kit",
sku: "SEA000012",
category: "Accessories",
quantity: 22,
unitPrice: 29.99,
lowStockThreshold: 5,
description: "Mounting kit for small network devices",
},
{
name: "PowerStation PSU-120W",
sku: "SEA000013",
category: "Power Supplies",
quantity: 12,
unitPrice: 49.99,
lowStockThreshold: 5,
description: "120W power supply for switches/routers",
},
{
name: "NetGuard UPS Mini",
sku: "SEA000014",
category: "Power Supplies",
quantity: 4,
unitPrice: 99.0,
lowStockThreshold: 2,
description: "600VA UPS with 4 surge outlets",
},
{
name: "TestLink Cable Tester CT100",
sku: "SEA000015",
category: "Tools",
quantity: 10,
unitPrice: 39.0,
lowStockThreshold: 3,
description: "Network cable tester with RJ45/RJ11 support",
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