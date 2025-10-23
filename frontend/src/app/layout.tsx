// src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/app/components/Providers";
import { CartProvider } from "./contexts/CartContext";
import { Header } from "@/app/components/ui/organisms/Header";
import { Footer } from "@/app/components/ui/organisms/Footer";

export const metadata: Metadata = {
  title: "E-Commerce Frontend",
  description: "A modern e-commerce application frontend.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
