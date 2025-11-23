'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Package, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IndianRupee } from 'lucide-react';

export default function ProfilePage() {
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { toast } = useToast();

    // Order History State
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        // Load from localStorage on mount
        const savedAddress = localStorage.getItem('user_address');
        const savedLocation = localStorage.getItem('user_location');
        if (savedAddress) setAddress(savedAddress);
        if (savedLocation) setLocation(JSON.parse(savedLocation));

        // Fetch real orders
        const fetchOrders = async () => {
            const { getCustomerOrders } = await import('@/app/actions');
            const userOrders = await getCustomerOrders('user-6'); // Mock current user
            setOrders(userOrders);
        };
        fetchOrders();
    }, []);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast({
                title: 'Error',
                description: 'Geolocation is not supported by your browser.',
                variant: 'destructive',
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newLocation = { lat: latitude, lng: longitude };
                setLocation(newLocation);
                setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`); // Placeholder

                // Save immediately to localStorage for convenience
                localStorage.setItem('user_location', JSON.stringify(newLocation));
                localStorage.setItem('user_address', `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);

                toast({
                    title: 'Location Updated',
                    description: 'Your location has been set successfully.',
                });
            },
            (error) => {
                toast({
                    title: 'Error',
                    description: 'Unable to retrieve your location.',
                    variant: 'destructive',
                });
            }
        );
    };

    const handleSaveProfile = () => {
        // Save to localStorage
        localStorage.setItem('user_address', address);
        if (location) {
            localStorage.setItem('user_location', JSON.stringify(location));
        }

        toast({
            title: 'Profile Saved',
            description: 'Your profile information has been updated.',
        });
    };

    const generateHistoryInvoice = (order: any) => {
        const doc = new jsPDF();
        doc.text(`Invoice for Order ${order.id}`, 20, 20);
        doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 20, 30);
        doc.text(`Total: ${order.totalPrice.toFixed(2)}`, 20, 40);

        const tableColumn = ["Item ID", "Qty", "Price"];
        const tableRows: any[] = [];
        order.items.forEach((item: any) => {
            tableRows.push([item.itemId, item.quantity, item.price]);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
        });

        doc.save(`invoice_${order.id}.pdf`);
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Delivery Address</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="address"
                                        placeholder="Enter your address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <Button variant="outline" onClick={handleUseCurrentLocation}>
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Locate Me
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lat">Latitude</Label>
                                        <Input
                                            id="lat"
                                            type="number"
                                            placeholder="e.g. 34.0522"
                                            value={location?.lat || ''}
                                            onChange={(e) => setLocation(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0, lng: prev?.lng || 0 }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lng">Longitude</Label>
                                        <Input
                                            id="lng"
                                            type="number"
                                            placeholder="e.g. -118.2437"
                                            value={location?.lng || ''}
                                            onChange={(e) => setLocation(prev => ({ ...prev, lat: prev?.lat || 0, lng: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    * On local networks (http://192...), browser geolocation may be blocked. You can manually enter coordinates above.
                                </p>
                                {location && (
                                    <p className="text-sm text-muted-foreground">
                                        Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                    </p>
                                )}
                            </div>
                            <Button className="w-full" onClick={handleSaveProfile}>
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                            <Button className="w-full" variant="secondary" onClick={() => toast({ title: 'Password Updated', description: 'Your password has been changed successfully.' })}>
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">No orders placed yet.</p>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-primary" />
                                                    <span className="font-semibold text-xs">{order.id}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()}</p>
                                                <p className="text-sm font-medium flex items-center">
                                                    <IndianRupee className="h-3 w-3" />
                                                    {order.totalPrice.toFixed(2)} • {order.items.length} items
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => generateHistoryInvoice(order)}>
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
