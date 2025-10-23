'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

type Product = {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  category?: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartTotal: number;
  itemCount: number;
  addToCart: (product: Product, quantity?: number) => Promise<void> | void;
  removeFromCart: (productId: string) => Promise<void> | void;
  clearCart: () => Promise<void> | void;
  setQuantity: (productId: string, quantity: number) => Promise<void> | void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'cart:v2';
const LEGACY_KEY = 'ecom_cart';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeFromBackend(items: any[] = []): CartItem[] {
  return items.map((it) => {
    const p = it.product || {};
    return {
      id: String(it.productId || p._id || p.id),
      name: p.name ?? 'Product',
      price: Number(p.price ?? 0),
      imageUrl: p.imageUrl ?? '/placeholder.svg',
      category: p.category ?? '',
      quantity: Number(it.quantity ?? 1),
    } as CartItem;
  });
}

function normalizeFromLegacyLocal(items: any[] = []): CartItem[] {
  return items
    .map((raw) => {
      const prod = raw.product ?? raw;
      const id = String(raw.id ?? raw.productId ?? prod?._id ?? prod?.id ?? '');
      if (!id) return null;
      return {
        id,
        name: prod?.name ?? raw.name ?? 'Product',
        price: Number(prod?.price ?? raw.price ?? 0),
        imageUrl: prod?.imageUrl ?? raw.imageUrl ?? '/placeholder.svg',
        category: prod?.category ?? raw.category ?? '',
        quantity: Number(raw.quantity ?? 1),
      } as CartItem;
    })
    .filter(Boolean) as CartItem[];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const mergedOnce = useRef(false);

  // load guest cart
  useEffect(() => {
    const loadGuest = () => {
      try {
        const v2 = localStorage.getItem(STORAGE_KEY);
        if (v2) {
          setCartItems(JSON.parse(v2));
          return;
        }
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const normalized = normalizeFromLegacyLocal(JSON.parse(legacy));
          setCartItems(normalized);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          localStorage.removeItem(LEGACY_KEY);
        }
      } catch {
        setCartItems([]);
      }
    };

    if (!token) {
      mergedOnce.current = false;
      loadGuest();
    }
  }, [token]);

  // persist guest cart
  useEffect(() => {
    if (!token) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      } catch {}
    }
  }, [cartItems, token]);

  // merge guest -> server on login
  useEffect(() => {
    const mergeAndFetch = async () => {
      if (!token || mergedOnce.current) return;

      let guest: CartItem[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) guest = JSON.parse(raw);
      } catch {}

      try {
        if (guest.length) {
          for (const it of guest) {
            await fetch(`${API_URL}/cart/add`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ productId: String(it.id), quantity: it.quantity }),
            });
          }
          localStorage.removeItem(STORAGE_KEY);
        }

        const res = await fetch(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(normalizeFromBackend(data?.items));
        }
      } catch {
        // keep optimistic if merge/fetch fails
      } finally {
        mergedOnce.current = true;
      }
    };

    mergeAndFetch();
  }, [token]);

  const cartTotal = useMemo(
    () => cartItems.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0),
    [cartItems]
  );

  const itemCount = useMemo(
    () => cartItems.reduce((s, it) => s + Number(it.quantity || 0), 0),
    [cartItems]
  );

  const addToCart = async (product: Product, quantity = 1) => {
    const id = String(product._id ?? product.id ?? '');
    if (!id) return;

    // optimistic local update
    setCartItems((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          id,
          name: product.name ?? 'Product',
          price: Number(product.price ?? 0),
          imageUrl: product.imageUrl ?? '/placeholder.svg',
          category: product.category ?? '',
          quantity,
        },
      ];
    });

    if (!token) return;

    try {
      const addRes = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity }),
      });

      // Only refresh from server if add actually succeeded
      if (addRes.ok) {
        const res = await fetch(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(normalizeFromBackend(data?.items));
        }
      } else {
        const txt = await addRes.text();
        console.warn('cart/add failed; keeping optimistic cart', addRes.status, txt);
      }
    } catch (err) {
      console.warn('cart/add error; keeping optimistic cart', err);
    }
  };

  const setQuantity = async (productId: string, quantity: number) => {
    const id = String(productId);
    setCartItems((prev) => {
      if (quantity <= 0) return prev.filter((x) => x.id !== id);
      return prev.map((x) => (x.id === id ? { ...x, quantity } : x));
    });

    if (token) {
      try {
        await fetch(`${API_URL}/cart/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id, quantity }),
        });
      } catch {}
    }
  };

  const removeFromCart = async (productId: string) => {
    const id = String(productId);
    setCartItems((prev) => prev.filter((x) => x.id !== id));

    if (token) {
      try {
        await fetch(`${API_URL}/cart/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (token) {
      try {
        await fetch(`${API_URL}/cart`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
  };

  const value: CartContextType = {
    cartItems,
    cartTotal,
    itemCount,
    addToCart,
    removeFromCart,
    clearCart,
    setQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
