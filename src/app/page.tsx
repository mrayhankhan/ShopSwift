
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/data';
import { UserRole } from '@/lib/types';
import { Loader2, LogIn } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = () => {
    startTransition(() => {
      if (password !== '123') {
        toast({
          title: 'Invalid Credentials',
          description: 'The password you entered is incorrect.',
          variant: 'destructive',
        });
        return;
      }

      const user = users.find((u) => u.email === email);

      if (!user) {
        toast({
          title: 'Invalid Credentials',
          description: 'No user found with that email address.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Signed In!',
        description: `Welcome back, ${user.name}!`,
      });

      if (user.role === UserRole.ShopOwner) {
        router.push(`/owner/${user.id}`);
      } else {
        router.push(`/customer/${user.id}`);
      }
    });
  };

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline tracking-tight">
            Welcome to ShopSwift
          </CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Hint: The password is '123' for all users.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignIn} disabled={isPending} className="w-full text-lg py-6">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
