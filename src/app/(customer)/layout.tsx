'use client';

import { CartProvider } from '@/hooks/use-cart';
import AppHeader from '@/components/app-header';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { UserRole } from '@/lib/types';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const customerId = params.customerId as string;

  return (
    <CartProvider>
      <ClientOnly>
        <div className="min-h-screen flex flex-col">
          <AppHeader userId={customerId} userRole={UserRole.Customer} />
          <main className="flex-grow container mx-auto p-4 md:p-6">
            {children}
          </main>
          <footer className="text-center p-4 text-muted-foreground text-sm">
            ShopSwift &copy; 2024
          </footer>
        </div>
      </ClientOnly>
    </CartProvider>
  );
}
