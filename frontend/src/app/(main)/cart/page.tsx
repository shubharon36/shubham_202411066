"use client";

import { useMemo } from "react";
import { useCart } from "@/app/contexts/CartContext";
import { Button } from "@/app/components/ui/atoms/Button";
import MainLayout from "@/app/components/ui/organisms/MainLayout";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import styles from "@/styles/cart.module.css";

type NormalizedItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export default function CartPage() {
  // NOTE: use setQuantity (this is the correct name from CartContext)
  const { cartItems, removeFromCart, setQuantity } = useCart();

  // Normalize any cart item shape into a consistent one for rendering
  const items: NormalizedItem[] = useMemo(() => {
    return (cartItems ?? []).map((item: any) => {
      const p = item?.product ?? item ?? {};
      const id = item?.productId || item?.id || p?.id || p?._id || "";
      const name = p?.name ?? "Product";
      const category = p?.category ?? "";
      const priceNum =
        typeof p?.price === "number"
          ? p.price
          : typeof p?.price === "string"
          ? parseFloat(p.price) || 0
          : 0;
      const imageUrl = p?.imageUrl || "/placeholder.svg";
      const quantity =
        typeof item?.quantity === "number" && item.quantity > 0 ? item.quantity : 1;

      return { id, name, category, price: priceNum, imageUrl, quantity };
    });
  }, [cartItems]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const dec = (id: string, qty: number) => {
    const next = qty - 1;
    if (next < 1) removeFromCart(id);
    else setQuantity(id, next);
  };

  const inc = (id: string, qty: number) => {
    setQuantity(id, qty + 1);
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Your cart is empty.</p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            <div>
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img src={item.imageUrl} alt={item.name} />
                    </div>

                    <div className={styles.itemContent}>
                      <Link href={`/products/${item.id}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      <p className={styles.itemCategory}>{item.category}</p>
                      <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                    </div>

                    <div className={styles.itemActions}>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={styles.deleteButton}
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className={styles.quantityControl}>
                        <button
                          onClick={() => dec(item.id, item.quantity)}
                          className={styles.quantityButton}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className={styles.quantityDisplay}>{item.quantity}</span>
                        <button
                          onClick={() => inc(item.id, item.quantity)}
                          className={styles.quantityButton}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={styles.summary}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>

                <div className={styles.summaryItems}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Shipping</span>
                    <span>Free</span>
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

                <Link href="/checkout" className={styles.summaryButton}>
                  <Button className={styles.summaryButton}>Proceed to Checkout</Button>
                </Link>

                <Link href="/products" className={styles.summaryButtonSecondary}>
                  <Button variant="outline" className={styles.summaryButtonSecondary}>
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
