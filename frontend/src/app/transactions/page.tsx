import type { Transaction } from "@/types";
import { TransactionsTable } from "@/components/transactions/transactions-table";

const mockTransactions: Transaction[] = [
  {
    tid: "T1001",
    date: "2025-10-20",
    items: [
      {
        sku: "SEA000001",
        type: "IN",
        quantity: 10,
        description: "Restocked NetLink Router R3000 units for retail inventory",
      },
      {
        sku: "SEA000003",
        type: "IN",
        quantity: 5,
        description: "New batch of SwiftSwitch 24G switches added to warehouse",
      },
      {
        sku: "SEA000007",
        type: "IN",
        quantity: 20,
        description: "Received FiberPro SFP-10G modules from supplier",
      },
      {
        sku: "SEA000009",
        type: "IN",
        quantity: 50,
        description: "Received shipment of PowerLink Cat6 10ft cables",
      },
    ],
  },
  {
    tid: "T1002",
    date: "2025-10-21",
    items: [
      {
        sku: "SEA000004",
        type: "OUT",
        quantity: 2,
        description: "Sold 2 SwiftSwitch 48G+ units to enterprise client",
      },
      {
        sku: "SEA000006",
        type: "OUT",
        quantity: 3,
        description: "Delivered AirWave AP500 Pro units to office installation",
      },
      {
        sku: "SEA000013",
        type: "OUT",
        quantity: 4,
        description: "Provided PowerStation PSU-120W supplies for deployment",
      },
    ],
  },
  {
    tid: "T1003",
    date: "2025-10-23",
    items: [
      {
        sku: "SEA000011",
        type: "IN",
        quantity: 25,
        description: "Bulk order of fiber patch cables for future network projects",
      },
      {
        sku: "SEA000012",
        type: "IN",
        quantity: 10,
        description: "Restocked NetCase 1U Rackmount Kits for online sales",
      },
      {
        sku: "SEA000014",
        type: "IN",
        quantity: 6,
        description: "New shipment of NetGuard UPS Mini units",
      },
      {
        sku: "SEA000015",
        type: "IN",
        quantity: 8,
        description: "Received TestLink Cable Tester CT100 units for QA team",
      },
    ],
  },
  {
    tid: "T1004",
    date: "2025-10-24",
    items: [
      {
        sku: "SEA000005",
        type: "OUT",
        quantity: 5,
        description: "Sold AirWave AP200 units to new hotel installation",
      },
      {
        sku: "SEA000010",
        type: "OUT",
        quantity: 12,
        description: "Dispatched PowerLink Cat6 50ft cables for deployment",
      },
      {
        sku: "SEA000007",
        type: "OUT",
        quantity: 10,
        description: "Used FiberPro SFP-10G modules for data center upgrade",
      },
    ],
  },
  {
    tid: "T1005",
    date: "2025-10-25",
    items: [
      {
        sku: "BOS000001",
        type: "IN",
        quantity: 5,
        description: "Received NetLink Router R5000 Pro units from Boston vendor",
      },
      {
        sku: "SEA000013",
        type: "IN",
        quantity: 10,
        description: "Restocked PowerStation PSU-120W for router and switch kits",
      },
      {
        sku: "SEA000015",
        type: "IN",
        quantity: 5,
        description: "Replenished TestLink Cable Tester CT100 inventory",
      },
      {
        sku: "SEA000004",
        type: "IN",
        quantity: 2,
        description: "Returned two SwiftSwitch 48G+ units after customer cancellation",
      },
      {
        sku: "SEA000012",
        type: "IN",
        quantity: 5,
        description: "Added more NetCase 1U Rackmount Kits to stock",
      },
    ],
  },
  {
    tid: "T1006",
    date: "2025-10-25",
    items: [
      {
        sku: "SEA000001",
        type: "OUT",
        quantity: 1,
        description: "Sold single NetLink Router R3000 to walk-in customer",
      },
    ],
  },
  {
    tid: "T1007",
    date: "2025-10-26",
    items: [
      {
        sku: "SEA000005",
        type: "IN",
        quantity: 8,
        description: "Received AirWave AP200 stock for Q4 retail campaign",
      },
    ],
  },
  {
    tid: "T1008",
    date: "2025-10-26",
    items: [
      {
        sku: "SEA000009",
        type: "OUT",
        quantity: 15,
        description: "Used Cat6 10ft cables for customer network installation",
      },
    ],
  },
  {
    tid: "T1009",
    date: "2025-10-27",
    items: [
      {
        sku: "SEA000011",
        type: "OUT",
        quantity: 5,
        description: "Sold PowerLink Fiber LC-LC 5m cables to reseller",
      },
    ],
  },
  {
    tid: "T1010",
    date: "2025-10-27",
    items: [
      {
        sku: "SEA000003",
        type: "OUT",
        quantity: 1,
        description: "Deployed one SwiftSwitch 24G to remote office site",
      },
    ],
  },
  {
    tid: "T1011",
    date: "2025-10-27",
    items: [
      {
        sku: "SEA000014",
        type: "OUT",
        quantity: 2,
        description: "Dispatched two NetGuard UPS Mini units to client data rack",
      },
    ],
  },
  {
    tid: "T1012",
    date: "2025-10-28",
    items: [
      {
        sku: "SEA000008",
        type: "IN",
        quantity: 30,
        description: "New stock of FiberPro SFP-1G modules received",
      },
    ],
  },
  {
    tid: "T1013",
    date: "2025-10-28",
    items: [
      {
        sku: "SEA000010",
        type: "IN",
        quantity: 20,
        description: "Restocked PowerLink Cat6 50ft cables for online store",
      },
    ],
  },
  {
    tid: "T1014",
    date: "2025-10-29",
    items: [
      {
        sku: "SEA000012",
        type: "OUT",
        quantity: 3,
        description: "Sold NetCase 1U Rackmount Kits to university lab project",
      },
    ],
  },
  {
    tid: "T1015",
    date: "2025-10-30",
    items: [
      {
        sku: "BOS000001",
        type: "OUT",
        quantity: 1,
        description: "Installed NetLink Router R5000 Pro for small business client",
      },
    ],
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

export default async function Transactions() {

    return (
        <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl space-y-6">
                <h1 className="text-3xl font-semibold mb-6">Transactions</h1>
                <TransactionsTable transactions={mockTransactions}/>
            </div>
        </div>
    )


}