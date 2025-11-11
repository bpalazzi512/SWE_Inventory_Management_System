"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      // Redirect to dashboard if authenticated
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-12 space-y-12">

      <div className="w-2/3 flex flex-col sm:flex-row items-center justify-center space-y-12 sm:space-y-0 sm:space-x-12">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Hi, I&apos;m Chase.
        </h1>
      </div>
        
    </div>
  );
}
