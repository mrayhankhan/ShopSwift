'use client';

import { useState, useTransition, useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, Clock, Loader2, Minus, Plus, IndianRupee, MapPin, Edit2, CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { placeOrder } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { users, shops } from '@/lib/data';
import { calculateDistance } from '@/lib/distance';
import Link from 'next/link';
import { CartItem } from '@/lib/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<{ orderIds: string, total: number, items: CartItem[] } | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Load user location on mount
  useEffect(() => {
    // Try loading from localStorage first (persistence fix)
    const savedAddress = localStorage.getItem('user_address');
    const savedLocation = localStorage.getItem('user_location');

    if (savedAddress) {
      setAddress(savedAddress);
    }
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }

    // Fallback to mock user if no local storage (initial load)
    if (!savedAddress) {
      const user = users.find(u => u.id === 'user-6');
      if (user) {
        setAddress(user.address || '');
        if (user.lat && user.lng) {
          setLocation({ lat: user.lat, lng: user.lng });
        }
      }
    }
  }, []);

  // Group items by shop
  const itemsByShop = cart.reduce((acc, cartItem) => {
    const shopId = cartItem.item.shopId;
    if (!acc[shopId]) {
      acc[shopId] = [];
    }
    acc[shopId].push(cartItem);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const getShopName = (shopId: string) => {
    return shops.find(s => s.id === shopId)?.name || 'Unknown Shop';
  };

  const getDeliveryEstimate = (shopId: string) => {
    if (!location) return 'TBD (Set Location)';
    const shop = shops.find(s => s.id === shopId);
    if (!shop) return 'Unknown';

    const dist = calculateDistance(location.lat, location.lng, shop.lat, shop.lng);
    const time = Math.round(dist * 2.5 + 15);
    return `${time}-${time + 10} mins`;
  };

  const handlePlaceOrder = () => {
    if (!address) {
      toast({ title: 'Address required', description: 'Please enter a delivery address.', variant: 'destructive' });
      return;
    }

    startTransition(async () => {
      const currentTotal = totalPrice + Object.keys(itemsByShop).length * 5;
      const currentItems = [...cart]; // Capture current items before clearing
      const result = await placeOrder({ cart, customerAddress: address, deliveryEstimate: 'Calculating...' });
      if (result.success) {
        setOrderPlaced(true);
        setPlacedOrderDetails({ orderIds: result.orderId || '', total: currentTotal, items: currentItems });
        clearCart();
        toast({ title: 'Order Placed!', description: `Your orders have been successfully placed.` });
      } else {
        toast({ title: 'Order Failed', description: result.error, variant: 'destructive' });
      }
    });
  };

  const generateInvoice = () => {
    if (!placedOrderDetails) return;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('ShopSwift Invoice', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Order IDs: ${placedOrderDetails.orderIds}`, 20, 35);

    // Items Table
    const tableColumn = ["Item", "Shop", "Qty", "Price", "Total"];
    const tableRows: any[] = [];

    placedOrderDetails.items.forEach(cartItem => {
      const itemData = [
        cartItem.item.name,
        getShopName(cartItem.item.shopId),
        cartItem.quantity,
        cartItem.item.price.toFixed(2),
        (cartItem.item.price * cartItem.quantity).toFixed(2)
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [66, 66, 66] },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Amount: ${placedOrderDetails.total.toFixed(2)}`, 140, finalY + 15);

    doc.save('invoice.pdf');
  };

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6 max-w-3xl mx-auto">
        <div className="rounded-full bg-green-100 p-6">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-center">Order Placed Successfully!</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold block">Order IDs:</span>
                <span className="font-mono text-muted-foreground">{placedOrderDetails?.orderIds}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold block">Total Amount:</span>
                <span className="text-lg font-bold text-primary"><IndianRupee className="h-4 w-4 inline" />{placedOrderDetails?.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-3 font-medium">Item</th>
                    <th className="p-3 font-medium">Qty</th>
                    <th className="p-3 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {placedOrderDetails?.items.map((cartItem) => (
                    <tr key={cartItem.item.id}>
                      <td className="p-3">
                        <div className="font-medium">{cartItem.item.name}</div>
                        <div className="text-xs text-muted-foreground">{getShopName(cartItem.item.shopId)}</div>
                      </td>
                      <td className="p-3">{cartItem.quantity}</td>
                      <td className="p-3 text-right"><IndianRupee className="h-3 w-3 inline" />{(cartItem.item.price * cartItem.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button onClick={generateInvoice} className="w-full sm:w-auto flex-1" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Link href="/customer/user-6" className="w-full sm:w-auto flex-1">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          Your Shopping Cart ({totalItems} items)
        </h1>

        {cart.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="p-8 text-center text-muted-foreground">
              Your cart is empty.
            </CardContent>
          </Card>
        ) : (
          Object.entries(itemsByShop).map(([shopId, shopItems]) => (
            <Card key={shopId} className="shadow-md border-t-4 border-t-primary">
              <CardHeader className="bg-muted/20 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">
                    Shipment from {getShopName(shopId)}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground bg-background px-3 py-1 rounded-full border">
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    Est. Delivery: <span className="font-bold text-foreground ml-1">{getDeliveryEstimate(shopId)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {shopItems.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md object-cover border" data-ai-hint={item.imageHint} />
                      <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <IndianRupee className="h-3 w-3" />{item.price.toFixed(2)} / {item.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, quantity - 1)} disabled={quantity <= 1}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-8 text-center">{quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, quantity + 1)} disabled={quantity >= item.stock}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-semibold w-20 text-right flex items-center justify-end"><IndianRupee className="h-4 w-4" />{(item.price * quantity).toFixed(2)}</p>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="md:col-span-1">
        <Card className="shadow-lg sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="flex items-center"><IndianRupee className="h-4 w-4" />{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping (Total)</span>
              <span className="flex items-center"><IndianRupee className="h-4 w-4" />{(Object.keys(itemsByShop).length * 5).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="flex items-center"><IndianRupee className="h-5 w-5" />{(totalPrice + Object.keys(itemsByShop).length * 5).toFixed(2)}</span>
            </div>
            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Delivery Address</Label>
                <Link href="/customer/profile">
                  <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
              <div className="p-3 bg-muted rounded-md text-sm">
                {address ? (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p>{address}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No address set. Please update your profile.</p>
                )}
              </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button onClick={handlePlaceOrder} disabled={cart.length === 0 || !address || isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/80 text-lg py-6">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Place Order ({Object.keys(itemsByShop).length} shipments)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
