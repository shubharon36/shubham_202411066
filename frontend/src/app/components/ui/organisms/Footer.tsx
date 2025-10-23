// src/app/components/ui/organisms/Footer.tsx
import Link from "next/link"
import styles from "@/styles/footer.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3>About</h3>
            <p>Your trusted online shopping destination.</p>
          </div>

          <div className={styles.section}>
            <h3>Support</h3>
            <ul className={styles.sectionList}>
              <li><Link href="/support#contact">Contact Us</Link></li>
              <li><Link href="/support#faq">FAQ</Link></li>
              <li><Link href="/support#shipping">Shipping</Link></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Legal</h3>
            <ul className={styles.sectionList}>
              <li><Link href="/legal#privacy">Privacy</Link></li>
              <li><Link href="/legal#terms">Terms</Link></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Follow</h3>
            <ul className={styles.sectionList}>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.divider}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
