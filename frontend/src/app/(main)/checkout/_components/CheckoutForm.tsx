"use client";

import { useState } from "react";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/ui/atoms/Button";
import { Input } from "@/app/components/ui/atoms/Input";
import CheckoutAuthModal from "@/app/components/ui/organisms/CheckoutAuthModal";
import styles from "@/styles/checkout.module.css";
import { apiFetch } from "@/app/lib/api";
import { useRouter } from "next/navigation";

type SuccessState = { success: true; orderId?: string; message?: string };
type ErrorState = { success: false; message: string };
type State = SuccessState | ErrorState | null;

export function CheckoutForm() {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<State>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setPendingFormData(new FormData(e.currentTarget));
      setShowAuthModal(true);
      return;
    }

    await processOrder(new FormData(e.currentTarget));
  };

  const processOrder = async (fd?: FormData) => {
    setState(null);
    setLoading(true);

    try {
      if (!isAuthenticated) {
        setState({ success: false, message: "Please log in to place an order." });
        return;
      }

      const formData = fd || pendingFormData;
      if (!formData) {
        setState({ success: false, message: "Form data missing." });
        return;
      }

      // Build payload for backend
      const items = cartItems.map((it: any) => ({
        productId: it.id ?? it.productId ?? it.product?._id ?? it.product?.id,
        quantity: it.quantity ?? 1,
      }));

      const subtotal = cartItems.reduce((s: number, it: any) => s + (Number(it.price) || 0) * (it.quantity || 0), 0);
      const tax = +(subtotal * 0.1).toFixed(2);
      const total = +(subtotal + tax).toFixed(2);

      const payload = {
        items,
        customer: {
          email: (formData.get("email") as string) || "",
          name: (formData.get("name") as string) || "",
          address: {
            line1: (formData.get("address") as string) || "",
            city: (formData.get("city") as string) || "",
            zip: (formData.get("zip") as string) || "",
          },
        },
      };

      const res = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const orderId: string | undefined =
        res?.order?.id || res?.order?._id || res?.id || res?.orderId;

      // Save a small summary for the success page
      const lastOrder = {
        orderId,
        placedAt: new Date().toISOString(),
        subtotal,
        tax,
        total,
        shipping: {
          name: payload.customer.name,
          email: payload.customer.email,
          address: payload.customer.address,
        },
        items: cartItems.map((it: any) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          imageUrl: it.imageUrl,
        })),
      };
      try {
        localStorage.setItem("lastOrder", JSON.stringify(lastOrder));
      } catch {}

      await clearCart();

      // Redirect to success page
      router.push(`/orders/success${orderId ? `?orderId=${orderId}` : ""}`);
    } catch (err: any) {
      const msg =
        err?.status === 401
          ? "Please log in to place an order."
          : err?.message || "Order failed. Please try again.";
      setState({ success: false, message: msg });
    } finally {
      setLoading(false);
      setPendingFormData(null);
    }
  };

  const handleAuthSuccess = () => {
    setTimeout(() => {
      processOrder(); // uses pendingFormData
    }, 300);
  };

  return (
    <>
      <div className={styles.form}>
        <h2 className={styles.formTitle}>Contact Information</h2>

        {isAuthenticated && user && (
          <div className={styles.userInfo}>
            <p className={styles.welcomeText}>
              Welcome back, <strong>{user.name}</strong>!
            </p>
            <p className={styles.emailText}>{user.email}</p>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.formField}>
              <label htmlFor="email" className={styles.formLabel}>
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                defaultValue={user?.email || ""}
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                defaultValue={user?.name || ""}
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="address" className={styles.formLabel}>
                Address
              </label>
              <Input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                placeholder="123 Main St"
                required
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label htmlFor="city" className={styles.formLabel}>
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="New York"
                  required
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="zip" className={styles.formLabel}>
                  ZIP Code
                </label>
                <Input
                  id="zip"
                  name="zip"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="10001"
                  required
                />
              </div>
            </div>

            {state && !state.success && state.message && (
              <div className={styles.errorMessage}>{state.message}</div>
            )}

            <div className={styles.formDivider}>
              <Button type="submit" disabled={loading} size="lg">
                {loading ? "Processing..." : isAuthenticated ? "Complete Order" : "Login to Complete Order"}
              </Button>
              {!isAuthenticated && (
                <p className={styles.authHint}>You'll be asked to login or create an account</p>
              )}
            </div>
          </div>
        </form>
      </div>

      <CheckoutAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
