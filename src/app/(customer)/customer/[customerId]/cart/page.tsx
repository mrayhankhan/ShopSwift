'use client';

import { useState, useTransition } from 'react';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, Clock, Loader2, Minus, Plus } from 'lucide-react';
import { placeOrder } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [address, setAddress] = useState('123 Main St, Anytown, USA');
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleDistanceChange = (value: string) => {
    const num = Number(value);
    setDistanceKm(Number.isNaN(num) ? null : num);
    setEtaMinutes(null); // Reset ETA when distance changes
  };

  const computeEta = () => {
    if (distanceKm === null || distanceKm <= 0) {
      toast({ title: 'Invalid Distance', description: 'Please enter a valid distance in kilometers.', variant: 'destructive' });
      return;
    }
    // Minimal deterministic formula: base 10 minutes + 5 min per km
    const eta = 10 + distanceKm * 5;
    setEtaMinutes(Math.round(eta));
    toast({ title: 'Estimate Calculated', description: `For a distance of ${distanceKm} km, the estimated delivery is ${Math.round(eta)} minutes.` });
  };
  
  const handlePlaceOrder = () => {
    if (!address) {
      toast({ title: 'Address required', description: 'Please enter a delivery address.', variant: 'destructive' });
      return;
    }
    if (distanceKm === null || etaMinutes === null) {
      toast({ title: 'Estimate required', description: 'Please calculate the delivery estimate first.', variant: 'destructive' });
      return;
    }
    
    startTransition(async () => {
      const result = await placeOrder({ cart, customerAddress: address, deliveryEstimate: `${etaMinutes} minutes` });
      if (result.success) {
        toast({ title: 'Order Placed!', description: `Your order #${result.orderId} has been successfully placed.` });
        clearCart();
        router.push(result.redirectUrl);
      } else {
        toast({ title: 'Order Failed', description: result.error, variant: 'destructive' });
      }
    });
  };

  const canPlaceOrder = cart.length > 0 && distanceKm != null && etaMinutes != null && !isPending;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              Your Shopping Cart ({totalItems} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map(({ item, quantity }) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded-md object-cover" data-ai-hint={item.imageHint}/>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
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
                    <p className="font-semibold w-20 text-right">${(item.price * quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="shadow-lg sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{etaMinutes ? '$5.00' : 'TBD'}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{etaMinutes ? `$${(totalPrice + 5.00).toFixed(2)}` : `$${totalPrice.toFixed(2)}`}</span>
            </div>
            <Separator />
             <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., 456 Oak Ave, Metropolis" />
              </div>
            
            <div className="space-y-3 border p-4 rounded-md">
                <h3 className="font-semibold text-md">Delivery Estimate</h3>
                <div className="space-y-2">
                    <Label htmlFor="distance">Approximate distance from shop (km)</Label>
                    <Input
                        id="distance"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 3.5"
                        value={distanceKm ?? ""}
                        onChange={(e) => handleDistanceChange(e.target.value)}
                    />
                </div>
                 <Button onClick={computeEta} disabled={distanceKm === null || distanceKm <= 0} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <Clock className="mr-2 h-4 w-4" />
                  Compute Delivery Time
                </Button>
                 {distanceKm != null && etaMinutes != null && (
                  <div className="text-sm mt-2 space-y-1 text-center">
                    <p>Distance to shop: <strong>{distanceKm.toFixed(1)} km</strong></p>
                    <p className="text-primary font-semibold">Estimated delivery time: <strong>{etaMinutes} minutes</strong></p>
                  </div>
                )}
            </div>

          </CardContent>
          <CardFooter>
            <Button onClick={handlePlaceOrder} disabled={!canPlaceOrder} className="w-full bg-accent text-accent-foreground hover:bg-accent/80 text-lg py-6">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
