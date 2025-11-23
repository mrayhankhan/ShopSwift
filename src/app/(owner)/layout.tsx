'use client';

import { CartProvider } from '@/hooks/use-cart';

export default function OwnerPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
