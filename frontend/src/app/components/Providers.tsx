'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { CartProvider } from '@/app/contexts/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Auth MUST wrap Cart so Cart can safely call useAuth */}
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
