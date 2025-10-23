"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/app/types"
import { Button } from "@/app/components/ui/atoms/Button"
import { useCart } from "@/app/contexts/CartContext"
import styles from "@/styles/product-card.module.css"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.id}`} className={styles.imageContainer}>
        <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className={styles.image} />
      </Link>
      <div className={styles.content}>
        <Link href={`/products/${product.id}`}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <Button size="sm" onClick={() => addToCart(product)}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
