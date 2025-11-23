import { items, shops } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/product-card';
import { Item } from '@/lib/types';
import ProductSearch from '@/components/product-search';

function ProductGrid({ products }: { products: Item[] }) {
  if (products.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No items found in this shop.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default async function CustomerDashboard() {
  const allItems = items;
  const allShops = shops;

  return (
    <div className="w-full">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Explore Our Products</h1>
        <p className="text-muted-foreground mt-2">Find fresh groceries from all our partner shops.</p>
      </header>

      <ProductSearch products={allItems} />

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="all">All Shops</TabsTrigger>
            {allShops.map((shop) => (
              <TabsTrigger key={shop.id} value={shop.id}>
                {shop.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="all">
          <ProductGrid products={allItems} />
        </TabsContent>
        {allShops.map((shop) => (
          <TabsContent key={shop.id} value={shop.id}>
            <ProductGrid products={allItems.filter((item) => item.shopId === shop.id)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
