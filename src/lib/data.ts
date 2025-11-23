
import { User, Shop, Item, Order, UserRole } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// --- USERS ---
export let users: User[] = [
    { id: 'user-1', name: 'Owner 1', email: 'shop1@example.com', role: UserRole.ShopOwner, shopId: 'shop-1' },
    { id: 'user-2', name: 'Owner 2', email: 'shop2@example.com', role: UserRole.ShopOwner, shopId: 'shop-2' },
    { id: 'user-3', name: 'Owner 3', email: 'shop3@example.com', role: UserRole.ShopOwner, shopId: 'shop-3' },
    { id: 'user-4', name: 'Owner 4', email: 'shop4@example.com', role: UserRole.ShopOwner, shopId: 'shop-4' },
    { id: 'user-5', name: 'Owner 5', email: 'shop5@example.com', role: UserRole.ShopOwner, shopId: 'shop-5' },
    { id: 'user-6', name: 'Customer 1', email: 'customer1@example.com', role: UserRole.Customer, address: 'IIITD Okhla Delhi', lat: 28.5459, lng: 77.2731 },
    { id: 'user-7', name: 'Customer 2', email: 'customer2@example.com', role: UserRole.Customer, address: 'IIITD Okhla Delhi', lat: 28.5459, lng: 77.2731 },
    { id: 'user-8', name: 'Customer 3', email: 'customer3@example.com', role: UserRole.Customer },
    { id: 'user-9', name: 'Customer 4', email: 'customer4@example.com', role: UserRole.Customer },
    { id: 'user-10', name: 'Customer 5', email: 'customer5@example.com', role: UserRole.Customer },
];

// --- SHOPS ---
export let shops: Shop[] = [
    { id: 'shop-1', name: 'Shop 1', ownerId: 'user-1', address: 'IIITD Okhla Delhi', lat: 28.5459, lng: 77.2731 },
    { id: 'shop-2', name: 'Shop 2', ownerId: 'user-2', address: 'IIITD Okhla Delhi', lat: 28.5459, lng: 77.2731 },
    { id: 'shop-3', name: 'Shop 3', ownerId: 'user-3', address: 'IIITD Okhla Delhi', lat: 28.5459, lng: 77.2731 },
    { id: 'shop-4', name: 'Shop 4', ownerId: 'user-4', address: 'IIITD Okhla Delhi', lat: 28.5459, lng: 77.2731 },
    { id: 'shop-5', name: 'Shop 5', ownerId: 'user-5', address: 'IIITD Okhla Delhi', lat: 28.5459, lng: 77.2731 },
];

// --- ITEMS ---
// This function generates a consistent set of items for each shop.
const generateItems = () => {
    const generatedItems: Item[] = [];
    const itemsPerShop = 30;

    shops.forEach((shop, shopIndex) => {
        for (let i = 0; i < itemsPerShop; i++) {
            const placeholderIndex = shopIndex * itemsPerShop + i;
            const placeholder = PlaceHolderImages[placeholderIndex % PlaceHolderImages.length];

            if (placeholder) {
                let unit = 'unit';
                const lowerDesc = placeholder.description.toLowerCase();
                if (lowerDesc.includes('apple') || lowerDesc.includes('banana') || lowerDesc.includes('orange') || lowerDesc.includes('potato') || lowerDesc.includes('tomato') || lowerDesc.includes('onion')) {
                    unit = 'kg';
                } else if (lowerDesc.includes('milk') || lowerDesc.includes('juice') || lowerDesc.includes('water') || lowerDesc.includes('oil')) {
                    unit = 'L';
                } else if (lowerDesc.includes('egg')) {
                    unit = 'dozen';
                } else if (lowerDesc.includes('bread')) {
                    unit = 'pack';
                }

                generatedItems.push({
                    id: `${shop.id}_${(i + 1).toString().padStart(3, '0')}`,
                    name: `${placeholder.description} #${i + 1}`, // Make name unique
                    description: `High-quality ${placeholder.description} from ${shop.name}.`,
                    unit: unit,
                    imageUrl: placeholder.imageUrl,
                    imageHint: placeholder.imageHint,
                    price: parseFloat((Math.random() * (2000 - 50) + 50).toFixed(2)), // INR 50 - 2000
                    stock: Math.floor(Math.random() * 91) + 10, // Stock between 10 and 100
                    shopId: shop.id,
                });
            }
        }
    });
    return generatedItems;
}

// Ensure items are only generated once.
export let items: Item[] = generateItems();


// --- ORDERS ---
export let orders: Order[] = [];
