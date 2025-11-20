'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image"
import { LogOutIcon, Settings } from "lucide-react";
import { Separator } from "./separator";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { useState, useEffect } from "react";


export default function Sidebar() {

    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
    const linkStyle = `text-xl font-medium text-brand-primary transition-colors py-4`

    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    function decodeJwt(token: string | null) {
        if (!token) return null;
        console.log(token);
        try {
            const payload = token.split('.')[1];
            const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        const payload: any = decodeJwt(token);
        const id = payload?.sub;

        if (id) {
            fetch(`${apiBase}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch user");
                    return res.json();
                })
                .then((data: User) => setCurrentUser(data.firstName))
                .catch(() => setCurrentUser(null));
            return;
        }
    }, [pathname]);

    if (pathname == "/login") {
        return null;
    }

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
                        className={`${linkStyle} ${pathname == "/dashboard" ? 'text-slate-700' : ''}`}
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/inventory"
                        className={`${linkStyle} ${pathname == "/inventory" ? 'text-slate-700' : ''}`}
                    >
                        Inventory
                    </Link>
                    <Link
                        href="/products"
                        className={`${linkStyle} ${pathname == "/products" ? 'text-slate-700' : ''}`}
                    >
                        Products
                    </Link>
                    <Link
                        href="/transactions"
                        className={`${linkStyle} ${pathname == "/transactions" ? 'text-slate-700' : ''}`}
                    >
                        Transactions
                    </Link>
                </div>


                <div className="flex flex-col space-y-2 text-xl font-medium text-brand-primary">
                    {currentUser && (
                        <div className="mt-3 mb-2 text-xl text-left font-medium text-brand-primary transition-colors">
                            {`Hi, ${currentUser}!`}
                        </div>
                    )}
                    <div className="flex flex-row justify-start items-center gap-4">
                        <Link
                            href="/settings"
                            className={`text-xl font-medium text-brand-primary transition-colors py-0`}
                        >
                            <Settings />
                        </Link>
                        <button
                            onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
                            className="flex flex-row gap-2 items-center text-left cursor-pointer"
                        >
                            <LogOutIcon />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
