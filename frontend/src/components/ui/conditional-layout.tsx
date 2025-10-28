'use client'

import { usePathname } from "next/navigation";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  
  return (
    <main className={`flex flex-col gap-[32px] row-start-2 items-center sm:items-start ${isLoginPage ? '' : 'ml-[224px]'}`}>
      {children}
    </main>
  );
}
