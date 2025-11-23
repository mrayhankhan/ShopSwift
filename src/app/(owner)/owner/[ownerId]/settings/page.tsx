'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { shops } from '@/lib/data';

export async function generateStaticParams() {
    return shops.map((shop) => ({
        ownerId: shop.ownerId,
    }));
}

type Props = {
    params: Promise<{ ownerId: string }>;
};

export default function ShopSettingsPage({ params }: Props) {
    const [ownerId, setOwnerId] = useState<string>('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        params.then((resolvedParams) => {
            setOwnerId(resolvedParams.ownerId);
            // In a real app, fetch shop data here
            const shop = shops.find(s => s.ownerId === resolvedParams.ownerId);
            if (shop) {
                setAddress(shop.address);
                setLocation({ lat: shop.lat, lng: shop.lng });
            }
        });
    }, [params]);

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
                setLocation({ lat: latitude, lng: longitude });
                setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
                toast({
                    title: 'Location Updated',
                    description: 'Shop location has been set successfully.',
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

    const handleSaveSettings = () => {
        console.log('Saving shop settings:', { ownerId, address, location });
        toast({
            title: 'Settings Saved',
            description: 'Shop information has been updated.',
        });
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Shop Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Location & Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Shop Address</Label>
                        <div className="flex gap-2">
                            <Input
                                id="address"
                                placeholder="Enter shop address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <Button variant="outline" onClick={handleUseCurrentLocation}>
                                <MapPin className="mr-2 h-4 w-4" />
                                Locate Shop
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
                    <Button className="w-full" onClick={handleSaveSettings}>
                        Save Changes
                    </Button>
                </CardContent>
            </Card>

            <Card className="mt-6">
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
    );
}
