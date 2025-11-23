import { users } from '@/lib/data';
import CartPageClient from './cart-client';

export async function generateStaticParams() {
    return users.map((user) => ({
        customerId: user.id,
    }));
}

type Props = {
    params: Promise<{ customerId: string }>;
};

export default async function CartPage({ params }: Props) {
    const { customerId } = await params;
    return <CartPageClient />;
}
