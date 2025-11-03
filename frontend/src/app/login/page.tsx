"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      if (mode === "login") {
        const res = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Login failed (${res.status})`);
        }
        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        // Register user
        const regRes = await fetch(`${apiBase}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });
        if (!regRes.ok) {
          const data = await regRes.json().catch(() => ({}));
          throw new Error(data?.error || `Registration failed (${regRes.status})`);
        }
        // Auto-login after registration
        const loginRes = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!loginRes.ok) {
          const data = await loginRes.json().catch(() => ({}));
          throw new Error(data?.error || `Login failed (${loginRes.status})`);
        }
        const loginData = await loginRes.json();
        localStorage.setItem("token", loginData.token);
        router.push("/dashboard");
      }
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 space-y-6">
      <Image src="/images/restockedlogin.png" alt="ReStocked Logo" width={610} height={310} priority />
      <p className="text-2xl text-text-primary">Inventory simplified.</p>
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm flex flex-col gap-3">
        {mode === "register" && (
          <>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First name"
                className="border rounded px-3 py-2 w-1/2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last name"
                className="border rounded px-3 py-2 w-1/2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "register" && (
          <input
            type="password"
            placeholder="Confirm password"
            className="border rounded px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={
            loading ||
            !email ||
            !password ||
            (mode === "register" && (!firstName || !lastName || !confirmPassword))
          }
        >
          {loading ? (mode === "login" ? "Logging in..." : "Registering...") : mode === "login" ? "Login" : "Register"}
        </Button>
        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError(null);
          }}
          className="text-sm text-brand-primary mt-1 underline"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}
