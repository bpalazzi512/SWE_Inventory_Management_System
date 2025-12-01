"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 space-y-6">
      <div className="text-center space-y-4 max-w-xl">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to ReStocked</h1>
        <p className="text-lg text-gray-600">
          ReStocked is an intuitive inventory management solution. Sign in to access your
          dashboard, or create a new account to get started.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link href="/login">
          <Button size="lg" className="w-40 justify-center">
            Sign in
          </Button>
        </Link>
        <Link href="/register">
          <Button size="lg" variant="outline" className="w-40 justify-center">
            Create account
          </Button>
        </Link>
      </div>
    </div>
  );
}

