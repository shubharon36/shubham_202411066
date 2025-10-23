import Link from "next/link"
import { Button } from '../app/components/ui/atoms/Button'
import MainLayout from "../app/components/ui/organisms/MainLayout"
import styles from "@/styles/page.module.css"

export default function HomePage() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Welcome to ShopHub</h1>
            <p className={styles.heroDescription}>
              Discover our curated collection of premium products across Electronics, Home, Sports, Furniture, and
              Books.
            </p>
            <Link href="/products">
              <Button size="lg" variant="primary">Start Shopping</Button>
            </Link>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🚚</div>
              <h3 className={styles.featureTitle}>Fast Shipping</h3>
              <p className={styles.featureDescription}>Quick and reliable delivery to your doorstep.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3 className={styles.featureTitle}>Secure Checkout</h3>
              <p className={styles.featureDescription}>Your payment information is always protected.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💯</div>
              <h3 className={styles.featureTitle}>Quality Guaranteed</h3>
              <p className={styles.featureDescription}>All products are carefully selected and verified.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
