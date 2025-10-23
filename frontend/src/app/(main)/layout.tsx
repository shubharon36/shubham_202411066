import React from 'react';
import MainLayout from '@/app/components/ui/organisms/MainLayout';

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  // MainLayout should render <Header /> and <Footer />
  return <>{children}</>;
}
