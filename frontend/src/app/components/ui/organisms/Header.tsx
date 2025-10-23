'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useCart } from '@/app/contexts/CartContext';
import CheckoutAuthModal from '@/app/components/ui/organisms/CheckoutAuthModal';
import styles from '@/styles/header.module.css';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');               // 👈 redirect to homepage
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>ShopHub</Link>

        <nav className={styles.nav}>
          <Link href="/products" className={styles.navLink}>Products</Link>
          <Link href="/cart" className={styles.navLink}>
            Cart {itemCount > 0 ? `(${itemCount})` : ''}
          </Link>

          {/* Show Admin link if admin */}
          {isAuthenticated && user?.role === 'admin' && (
            <Link href="/admin/products" className={styles.navLink}>Admin</Link>
          )}

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.welcome}>
                Hi, {user?.name?.split(' ')[0] || 'User'}
              </span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className={styles.loginBtn} onClick={() => setOpen(true)}>
              Login / Register
            </button>
          )}
        </nav>
      </div>

      <CheckoutAuthModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() => setOpen(false)}
      />
    </header>
  );
}
