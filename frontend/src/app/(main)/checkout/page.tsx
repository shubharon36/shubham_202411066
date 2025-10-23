"use client"

import { useMemo } from "react"
import { CheckoutForm } from "./_components/CheckoutForm"
import { useCart } from "@/app/contexts/CartContext"
import MainLayout from "@/app/components/ui/organisms/MainLayout"
import Link from "next/link"
import { Button } from "@/app/components/ui/atoms/Button"
import styles from "@/styles/checkout.module.css"

type NormalizedItem = {
  id: string
  name: string
  category: string
  price: number
  imageUrl: string
  quantity: number
}

export default function CheckoutPage() {
  const { cartItems } = useCart()

  // Normalize whatever shape cartItems may be in
  const items: NormalizedItem[] = useMemo(() => {
    return (cartItems ?? []).map((item: any) => {
      const p = item?.product ?? item ?? {}
      const id = item?.productId || item?.id || p?.id || p?._id || ""
      const name = p?.name ?? "Product"
      const category = p?.category ?? ""
      const price =
        typeof p?.price === "number"
          ? p.price
          : typeof p?.price === "string"
          ? parseFloat(p.price) || 0
          : 0
      const imageUrl = p?.imageUrl || "/placeholder.svg"
      const quantity = typeof item?.quantity === "number" && item.quantity > 0 ? item.quantity : 1
      return { id, name, category, price, imageUrl, quantity }
    })
  }, [cartItems])

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0), [items])
  const shipping = 0
  const taxRate = 0.1
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "var(--spacing-lg)", textAlign: "center" }}>
          <p style={{ color: "var(--muted-foreground)", marginBottom: "var(--spacing-lg)" }}>Your cart is empty.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.grid}>
          <div>
            <CheckoutForm />
          </div>

          <div>
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryItems}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
