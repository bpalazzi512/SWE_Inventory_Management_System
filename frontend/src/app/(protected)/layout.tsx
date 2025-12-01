"use client";

import Sidebar from "@/components/ui/sidebar";
import ConditionalLayout from "@/components/ui/conditional-layout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <Sidebar />
      <ConditionalLayout>{children}</ConditionalLayout>
    </>
  );
}


