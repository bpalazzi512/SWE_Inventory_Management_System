import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image"
import { SeparatorHorizontal } from "lucide-react";
import { Separator } from "./separator";

export default function Sidebar() {

    const linkStyle = "text-xl font-medium text-brand-primary transition-colors"

    return (
        <div className="fixed left-6 top-6 bottom-6 w-56 bg-white rounded-xl shadow-lg p-6">

            <Image
                src={"/images/restockedlogobottom.png"}
                alt="Profile"
                width={100}
                height={100}
                className="w-full h-auto"
            />

            <Separator className="my-6"/>

            <div className="flex flex-col items-left space-y-8">

                <Link
                    href="/dashboard"
                    className={linkStyle}
                >
                    Dashboard
                </Link>

                <Link
                    href="/inventory"
                    className={linkStyle}
                >
                    Inventory
                </Link>
                <Link
                    href="/products"
                    className={linkStyle}
                >
                    Products
                </Link>
                <Link
                    href="/transactions"
                    className={linkStyle}
                >
                    Transactions
                </Link>
            </div>
        </div>
    );
}
