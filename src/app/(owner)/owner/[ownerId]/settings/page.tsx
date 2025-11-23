import { users } from '@/lib/data';
import ShopSettingsForm from './settings-form';

export async function generateStaticParams() {
    return users.filter(u => u.shopId).map((user) => ({
        ownerId: user.id,
    }));
}

type Props = {
    params: Promise<{ ownerId: string }>;
};

export default async function ShopSettingsPage({ params }: Props) {
    const { ownerId } = await params;
    return <ShopSettingsForm ownerId={ownerId} />;
}
