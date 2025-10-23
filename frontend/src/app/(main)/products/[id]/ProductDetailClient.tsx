"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/contexts/CartContext";
import { Button } from "@/app/components/ui/atoms/Button";
import styles from "@/styles/product-detail.module.css";

type Product = {
  id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  imageUrl?: string;
  sku?: string;
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  return (
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

          {/* ₹ price with 80x factor */}
          <p className={styles.price}>${(Number(product.price ?? 0)).toFixed(2)}</p>

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
                onChange={(e) =>
                  setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
                }
                className={styles.quantityInput}
              />
            </div>

            <Button
              size="lg"
              onClick={() => {
                // ensure backend gets a Mongo-style _id too
                addToCart({ ...product, _id: product.id } as any, quantity);
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
                <dd className={styles.detailsValue}>{product.sku}</dd>
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
  );
}
