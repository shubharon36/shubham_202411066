// src/app/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import MainLayout from "@/app/components/ui/organisms/MainLayout";
import { Button } from "@/app/components/ui/atoms/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("customer123");
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      router.push("/products");
    } catch (e: any) {
      setErr(e.message || "Login failed");
    }
  };

  return (
    <MainLayout>
      <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: "40px auto" }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Login</h1>
        {err && <p style={{ color: "red", marginBottom: 12 }}>{err}</p>}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" style={{ width: "100%", marginBottom: 16, padding: 8 }} />
        <Button type="submit">Sign in</Button>
      </form>
    </MainLayout>
  );
}
