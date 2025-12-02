"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const onSubmit = async () => {
    if (loading) return;
    if (!email || !password || !firstName || !lastName || !confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Use the new /auth/register endpoint
      const data = await api.post<{ token: string; user: { id: string; firstName: string; lastName: string; email: string } }>(
        "/auth/register",
        { firstName, lastName, email, password },
        {
          requireAuth: false,
          useApiKey: true,
        }
      );

      // Store token and redirect to dashboard
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 space-y-6">
      <Image
        src="/images/restockedlogin.png"
        alt="ReStocked Logo"
        width={610}
        height={310}
        priority
      />
      <p className="text-2xl text-text-primary">Create your ReStocked account.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="bg-white rounded-xl shadow p-6 w-full max-w-sm flex flex-col gap-3"
      >
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
        <input
          type="password"
          placeholder="Confirm password"
          className="border rounded px-3 py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button
          type="submit"
          size="lg"
          onClick={onSubmit}
          disabled={
            loading ||
            !email ||
            !password ||
            !firstName ||
            !lastName ||
            !confirmPassword
          }
        >
          {loading ? "Registering..." : "Register"}
        </Button>
        <div className="text-sm text-brand-primary mt-1 underline text-center">
          <Link href="/login">Already have an account? Log in</Link>
        </div>
      </form>
    </div>
  );
}


