'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image"
import { LogOutIcon, Settings } from "lucide-react";
import { Separator } from "./separator";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";


export default function Sidebar() {

    const pathname = usePathname();
    const router = useRouter();

    if (pathname == "/login") {
        return null;
    }

    const linkStyle = `text-xl font-medium text-brand-primary transition-colors py-4`

    return (
        <div className="fixed left-6 top-6 bottom-6 w-[200px] bg-white rounded-xl shadow-lg p-6">

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
                        className={`${linkStyle} ${pathname == "/dashboard" ? 'text-slate-700': ''}`}
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/inventory"
                        className={`${linkStyle} ${pathname == "/inventory" ? 'text-slate-700': ''}`}
                    >
                        Inventory
                    </Link>
                    <Link
                        href="/products"
                        className={`${linkStyle} ${pathname == "/products" ? 'text-slate-700': ''}`}
                    >
                        Products
                    </Link>
                    <Link
                        href="/transactions"
                        className={`${linkStyle} ${pathname == "/transactions" ? 'text-slate-700': ''}`}
                    >
                        Transactions
                    </Link>
                </div>


                <div className="flex flex-col space-y-2 text-xl font-medium text-brand-primary">
                    <Link
                        href="/settings"
                        className={`text-xl font-medium text-brand-primary transition-colors py-0`}
                    >
                        <Settings />
                    </Link>
                    <button
                      onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
                      className="flex flex-row gap-2 items-center text-left"
                    >
                      Log Out
                      <LogOutIcon />
                    </button>
                </div>

            </div>
        </div>
    );
}
