"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/atoms/Button";
import { Input } from "@/app/components/ui/atoms/Input";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/products";

  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("customer123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirect);
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Login</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ marginBottom: 6 }}>Email</div>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          <div style={{ marginBottom: 6 }}>Password</div>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {err && <div style={{ color: "red" }}>{err}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
      </form>

      <p style={{ marginTop: 12, color: "var(--muted-foreground)" }}>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
