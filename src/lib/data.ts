
import { User, Shop, Item, Order, UserRole } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// --- USERS ---
export let users: User[] = [
  { id: 'user-1', name: 'Alice', email: 'alice@example.com', role: UserRole.ShopOwner, shopId: 'shop-1' },
  { id: 'user-2', name: 'Bob', email: 'bob@example.com', role: UserRole.ShopOwner, shopId: 'shop-2' },
  { id: 'user-3', name: 'Charlie', email: 'charlie@example.com', role: UserRole.ShopOwner, shopId: 'shop-3' },
  { id: 'user-4', name: 'Diana', email: 'diana@example.com', role: UserRole.ShopOwner, shopId: 'shop-4' },
  { id: 'user-5', name: 'Eve', email: 'eve@example.com', role: UserRole.ShopOwner, shopId: 'shop-5' },
  { id: 'user-6', name: 'Frank', email: 'frank@customer.com', role: UserRole.Customer },
  { id: 'user-7', name: 'Grace', email: 'grace@customer.com', role: UserRole.Customer },
  { id: 'user-8', name: 'Heidi', email: 'heidi@customer.com', role: UserRole.Customer },
  { id: 'user-9', name: 'Ivan', email: 'ivan@customer.com', role: UserRole.Customer },
  { id: 'user-10', name: 'Judy', email: 'judy@customer.com', role: UserRole.Customer },
];

// --- SHOPS ---
export let shops: Shop[] = [
  { id: 'shop-1', name: 'Fresh Finds', ownerId: 'user-1', address: '123 Green St, Farmville, USA', lat: 34.0522, lng: -118.2437 },
  { id: 'shop-2', name: 'The Corner Mart', ownerId: 'user-2', address: '456 Oak Ave, Metropolis, USA', lat: 40.7128, lng: -74.0060 },
  { id: 'shop-3', name: 'Pantry Plus', ownerId: 'user-3', address: '789 Pine Ln, Smalltown, USA', lat: 39.9526, lng: -75.1652 },
  { id: 'shop-4', name: 'Daily Essentials', ownerId: 'user-4', address: '101 Maple Rd, Cityburg, USA', lat: 41.8781, lng: -87.6298 },
  { id: 'shop-5', name: 'Quick Grocer', ownerId: 'user-5', address: '212 Birch Blvd, Villageton, USA', lat: 34.0522, lng: -118.2437 },
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
                generatedItems.push({
                    id: `item-${shop.id}-${i + 1}`,
                    name: `${placeholder.description} #${i+1}`, // Make name unique
                    description: `High-quality ${placeholder.description} from ${shop.name}.`,
                    imageUrl: placeholder.imageUrl,
                    imageHint: placeholder.imageHint,
                    price: parseFloat((Math.random() * (20 - 1) + 1).toFixed(2)),
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
