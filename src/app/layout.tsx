import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

// Polyfill for Node.js 25+ where localStorage is an empty object on the server
if (typeof global !== 'undefined') {
  try {
    // Check if localStorage is broken (exists but getItem is not a function)
    if (global.localStorage && typeof global.localStorage.getItem !== 'function') {
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: () => null,
          setItem: () => { },
          removeItem: () => { },
          clear: () => { },
          length: 0,
          key: () => null,
        },
        writable: true,
        configurable: true,
      });
    }
  } catch (e) {
    console.error('Failed to polyfill localStorage:', e);
  }
}

export const metadata: Metadata = {
  title: 'ShopSwift',
  description: 'Your neighborhood grocery app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
