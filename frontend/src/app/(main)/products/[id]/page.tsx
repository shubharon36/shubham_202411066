"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/app/types";
import { useCart } from "@/app/contexts/CartContext";
import { Button } from "@/app/components/ui/atoms/Button";
import MainLayout from "@/app/components/ui/organisms/MainLayout";
import Link from "next/link";
import styles from "@/styles/product-detail.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ call your backend: /api/products/:id
        const res = await fetch(`${API_BASE}/products/${params.id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load product (${res.status})`);

        const data = await res.json();
        const p = data?.product ?? data;
        if (!p?._id && !p?.id) throw new Error("Product not found");

        if (!cancelled) {
          // normalize id
          setProduct({ ...(p as any), id: p._id || p.id });
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error loading product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8 text-center">Loading…</div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <p className="text-destructive mb-4">Product not found.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <Link href="/products" className={styles.backLink}>
          ← Back to Products
        </Link>

        <div className={styles.grid}>
          <div className={styles.imageContainer}>
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className={styles.image}
            />
          </div>

          <div className={styles.content}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.price}>${Number(product.price ?? 0).toFixed(2)}</p>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.actions}>
              <div className={styles.quantityControl}>
                <label htmlFor="quantity" className={styles.quantityLabel}>
                  Quantity:
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  className={styles.quantityInput}
                />
              </div>

              <Button
                size="lg"
                onClick={() => {
                  addToCart(product, quantity);
                  setQuantity(1);
                }}
              >
                Add to Cart
              </Button>
            </div>

            <div className={styles.details}>
              <h3 className={styles.detailsTitle}>Product Details</h3>
              <dl className={styles.detailsList}>
                <div className={styles.detailsRow}>
                  <dt className={styles.detailsLabel}>SKU:</dt>
                  <dd className={styles.detailsValue}>{(product as any).sku}</dd>
                </div>
                <div className={styles.detailsRow}>
                  <dt className={styles.detailsLabel}>Category:</dt>
                  <dd className={styles.detailsValue}>{product.category}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
