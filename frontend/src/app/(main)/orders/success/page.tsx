// src/app/(main)/orders/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "@/styles/order-success.module.css";

type LastOrder = {
  orderId?: string;
  placedAt: string;
  subtotal: number;
  tax: number;
  total: number;
  shipping: {
    name: string;
    email: string;
    address: { line1: string; city: string; zip: string };
  };
  items: Array<{ id: string; name: string; price: number; quantity: number; imageUrl?: string }>;
};

export default function OrderSuccessPage() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId") ?? undefined;

  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastOrder");
      if (!raw) return;
      const data: LastOrder = JSON.parse(raw);

      // If orderId exists in URL, prefer matching one; otherwise just show what we have
      if (!orderId || data.orderId === orderId) {
        setOrder(data);
      } else {
        setOrder(data);
      }
    } catch {
      // ignore parse errors
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icon}>✓</div>
          <h1 className={styles.title}>Order placed!</h1>
          <p className={styles.text}>Thanks for your purchase.</p>
          <Link href="/products" className={styles.primary}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>Order confirmed</h1>
        <p className={styles.text}>
          {order.orderId ? <>Order <strong>#{order.orderId}</strong></> : "Your order"} has been placed successfully.
        </p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Delivery</h2>
          <p className={styles.kv}><span>Name</span><span>{order.shipping.name}</span></p>
          <p className={styles.kv}><span>Email</span><span>{order.shipping.email}</span></p>
          <p className={styles.kv}>
            <span>Address</span>
            <span>
              {order.shipping.address.line1}, {order.shipping.address.city} {order.shipping.address.zip}
            </span>
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Payment</h2>
          <p className={styles.kv}><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></p>
          <p className={styles.kv}><span>Tax (10%)</span><span>${order.tax.toFixed(2)}</span></p>
          <p className={styles.totalRow}><span>Total</span><span>${order.total.toFixed(2)}</span></p>
        </div>

        <div className={styles.actions}>
          <Link href="/products" className={styles.primary}>Continue Shopping</Link>
          <Link href="/cart" className={styles.secondary}>View Cart</Link>
        </div>
      </div>
    </div>
  );
}
