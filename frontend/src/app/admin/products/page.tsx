"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiFetch } from "@/app/lib/api";
import MainLayout from "@/app/components/ui/organisms/MainLayout";
import { Button } from "@/app/components/ui/atoms/Button";

type P = { _id: string; sku: string; name: string; price: number; category?: string; stock?: number };

export default function AdminProductsPage() {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<P[]>([]);
  const [form, setForm] = useState<Partial<P>>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const data = await apiFetch("/products?limit=200");
      setItems((data.products || []) as P[]);
    } catch (e: any) {
      setErr(e.message || "Failed to load products");
    }
  };

  useEffect(() => { load(); }, []);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <>
        <div style={{ padding: 24 }}>
          <h1>Admin Products</h1>
          <p>You must be an admin to view this page.</p>
        </div>
      </>
    );
  }

  const save = async () => {
    setLoading(true); setErr("");
    try {
      const body = JSON.stringify({
        sku: form.sku,
        name: form.name,
        price: Number(form.price),
        category: form.category,
        // send stock (default to 100 if empty)
        stock: Number.isFinite(Number(form.stock)) ? Number(form.stock) : 100,
      });

      if (form._id) {
        await apiFetch(`/products/${form._id}`, { method: "PUT", body });
      } else {
        await apiFetch(`/products`, { method: "POST", body });
      }
      setForm({});
      await load();
    } catch (e: any) {
      setErr(e.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setLoading(true); setErr("");
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      setErr(e.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24, display: "grid", gap: 16 }}>
        <h1>Admin Products</h1>
        {err && <div style={{ color: "crimson" }}>{err}</div>}

        {/* form */}
        <div style={{ display: "grid", gap: 8, padding: 16, background: "var(--card)", borderRadius: 12 }}>
          <input placeholder="SKU" value={form.sku || ""} onChange={e=>setForm(f=>({...f, sku:e.target.value}))}/>
          <input placeholder="Name" value={form.name || ""} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
          <input placeholder="Price" type="number" value={form.price ?? ""} onChange={e=>setForm(f=>({...f, price:e.target.valueAsNumber}))}/>
          <input placeholder="Category" value={form.category || ""} onChange={e=>setForm(f=>({...f, category:e.target.value}))}/>
          {/* NEW: Stock */}
          <input placeholder="Stock" type="number" min={0} value={form.stock ?? ""} onChange={e=>setForm(f=>({...f, stock:e.target.valueAsNumber}))}/>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={save} disabled={loading}>{form._id ? "Update" : "Create"}</Button>
            {form._id && <Button variant="outline" onClick={()=>setForm({})}>Cancel</Button>}
          </div>
        </div>

        {/* list */}
        <div style={{ display: "grid", gap: 8 }}>
          {items.map(p => (
            <div key={p._id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center", padding: 12, background: "var(--muted)", borderRadius: 10 }}>
              <div>
                <div><strong>{p.name}</strong> — {p.category || "Uncategorized"}</div>
                <div>
                  SKU: {p.sku} · Price: ₹{(Number(p.price) * 80).toFixed(2)} · Stock: {p.stock ?? 0}
                </div>
              </div>
              <Button variant="outline" onClick={()=>setForm(p)}>Edit</Button>
              <Button variant="destructive" onClick={()=>del(p._id)}>Delete</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
