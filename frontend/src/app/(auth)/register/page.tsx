"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/atoms/Button";
import { Input } from "@/app/components/ui/atoms/Input";

function RegisterInner() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/products";

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push(redirect);
    } catch (e: any) {
      setErr(e?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Register</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ marginBottom: 6 }}>Name</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          <div style={{ marginBottom: 6 }}>Email</div>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          <div style={{ marginBottom: 6 }}>Password</div>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {err && <div style={{ color: "red" }}>{err}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <RegisterInner />
    </Suspense>
  );
}
"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/atoms/Button";
import { Input } from "@/app/components/ui/atoms/Input";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/products";

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push(redirect);
    } catch (e: any) {
      setErr(e?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Register</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ marginBottom: 6 }}>Name</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          <div style={{ marginBottom: 6 }}>Email</div>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          <div style={{ marginBottom: 6 }}>Password</div>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {err && <div style={{ color: "red" }}>{err}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
      </form>
    </div>
  );
}
