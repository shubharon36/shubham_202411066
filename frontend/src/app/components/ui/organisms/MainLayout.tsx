import type React from "react"
import { Footer } from "@/app/components/ui/organisms/Footer"
import { Header } from "@/app/components/ui/organisms/Header"
import styles from '@/styles/main-layout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  );
}

