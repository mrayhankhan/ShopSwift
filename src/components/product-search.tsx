'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Item } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Search, IndianRupee } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

type ProductSearchProps = {
    products: Item[];
};

export default function ProductSearch({ products }: ProductSearchProps) {
    const [query, setQuery] = useState('');
    const { addToCart } = useCart();
    const { toast } = useToast();

    const filteredProducts = useMemo(() => {
        if (!query) return [];
        return products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, products]);

    const handleAddToCart = (item: Item) => {
        addToCart(item);
        toast({
            title: 'Added to cart',
            description: `${item.name} has been added to your cart.`,
        });
    };

    return (
        <div className="w-full max-w-md mx-auto mb-8 relative z-50">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-8"
                />
            </div>
            {query && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground rounded-md border shadow-md overflow-hidden max-h-96 overflow-y-auto">
                    <div className="p-2 space-y-2">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="flex items-center p-2 gap-3 hover:bg-accent transition-colors">
                                <div className="h-12 w-12 relative flex-shrink-0 overflow-hidden rounded-md border">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium truncate">{product.name}</h4>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <IndianRupee className="h-3 w-3 mr-0.5" />
                                        {product.price.toFixed(2)}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock <= 0}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span className="sr-only">Add to cart</span>
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {query && filteredProducts.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground rounded-md border shadow-md p-4 text-center text-sm text-muted-foreground">
                    No products found.
                </div>
            )}
        </div>
    );
}
