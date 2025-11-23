'use client';

import { useState } from 'react';
import { items, shops, users } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Item } from '@/lib/types';
import ProductSearch from '@/components/product-search';

export async function generateStaticParams() {
  return users.map((user) => ({
    customerId: user.id,
  }));
}

function ProductGrid({ products }: { products: Item[] }) {
  if (products.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No items found in this shop.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const [selectedShop, setSelectedShop] = useState('all');
  const allItems = items;
  const allShops = shops;

  return (
    <div className="w-full">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Explore Our Products</h1>
        <p className="text-muted-foreground mt-2">Find fresh groceries from all our partner shops.</p>
      </header>

      <ProductSearch products={allItems} />

      {/* Shop Selection - Compact Bento Grid */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedShop('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedShop === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
              }`}
          >
            All Shops
          </button>
          {allShops.map((shop) => (
            <button
              key={shop.id}
              onClick={() => setSelectedShop(shop.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedShop === shop.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
                }`}
            >
              {shop.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <ProductGrid products={selectedShop === 'all' ? allItems : allItems.filter((item) => item.shopId === selectedShop)} />
    </div>
  );
}
