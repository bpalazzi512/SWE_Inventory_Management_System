import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image"
import { LogOutIcon, SeparatorHorizontal, Settings } from "lucide-react";
import { Separator } from "./separator";

export default function Sidebar() {

    const linkStyle = "text-xl font-medium text-brand-primary transition-colors py-4"

    return (
        <div className="fixed left-6 top-6 bottom-6 w-56 bg-white rounded-xl shadow-lg p-6">

            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col items-left">

                    <Image
                        src={"/images/restockedlogobottom.png"}
                        alt="Profile"
                        width={800}
                        height={600}
                        className="w-full h-auto"
                    />

                    <Separator className="mt-6 mb-2" />

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


                <div className="flex flex-col space-y-2 text-xl font-medium text-brand-primary">
                    <Settings />
                    <div className="flex flex-row gap-2 items-center">
                        Log Out
                        <LogOutIcon />
                    </div>
                </div>

            </div>
        </div>
    );
}
