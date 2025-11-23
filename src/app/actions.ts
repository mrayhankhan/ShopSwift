'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { items, orders, shops, users } from '@/lib/data';
import { CartItem, Item } from '@/lib/types';
import { z } from 'zod';
import { estimateDeliveryTime } from '@/ai/ai-estimated-delivery-time';

// --- ITEM MANAGEMENT ACTIONS ---

const itemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  unit: z.string().default('unit'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  stock: z.coerce.number().int().min(0, 'Stock must be a non-negative integer'),
  imageUrl: z.string().url('Must be a valid URL'),
  imageHint: z.string().optional(),
  shopId: z.string(),
  ownerId: z.string(),
});

export async function saveItem(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = itemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    // A real app would return these errors to the form
    throw new Error('Invalid item data.');
  }

  const { id, shopId, ownerId, imageHint, unit, ...itemData } = validatedFields.data;

  if (id) {
    // Update existing item
    const itemIndex = items.findIndex(i => i.id === id);
    if (itemIndex > -1) {
      items[itemIndex] = { ...items[itemIndex], ...itemData, unit, imageHint: imageHint || '' };
    }
  } else {
    // Create new item
    // Find the next serial number for this shop
    const shopItems = items.filter(i => i.shopId === shopId);
    let maxSerial = 0;
    shopItems.forEach(i => {
      const parts = i.id.split('_');
      if (parts.length === 2) {
        const serial = parseInt(parts[1], 10);
        if (!isNaN(serial) && serial > maxSerial) {
          maxSerial = serial;
        }
      }
    });
    const nextSerial = (maxSerial + 1).toString().padStart(3, '0');

    const newItem: Item = {
      id: `${shopId}_${nextSerial}`,
      shopId,
      ...itemData,
      unit,
      imageHint: imageHint || '',
    };
    items.unshift(newItem);
  }

  revalidatePath(`/owner/${ownerId}/items`);
  redirect(`/owner/${ownerId}/items`);
}

export async function deleteItem(formData: FormData) {
  const itemId = formData.get('itemId') as string;
  const ownerId = formData.get('ownerId') as string;

  const itemIndex = items.findIndex(i => i.id === itemId);
  if (itemIndex > -1) {
    items.splice(itemIndex, 1);
  }
  revalidatePath(`/owner/${ownerId}/items`);
}


// --- CUSTOMER ACTIONS ---

// This function is kept for potential future use but is not called by the cart page anymore.
export async function getDeliveryEstimate(shopId: string, customerAddress: string, orderTotal: number) {
  if (!shopId || !customerAddress) {
    return { success: false, error: 'Shop and address are required.' };
  }

  const shop = shops.find(s => s.id === shopId);
  if (!shop) {
    return { success: false, error: 'Shop not found.' };
  }

  try {
    const result = await estimateDeliveryTime({
      shopLocation: shop.address,
      customerLocation: customerAddress,
      orderTotal: orderTotal,
      timeOfDay: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });

    return { success: true, estimate: result.estimatedTime };
  } catch (error) {
    console.error('AI estimation failed:', error);
    // Fallback to mock estimate if AI fails
    const distance = Math.random() * 20 + 2; // 2-22 km
    const time = Math.round(distance * 2.5 + 15); // 15 mins base + 2.5 min/km
    const estimate = `${time}-${time + 10} minutes`;
    return { success: true, estimate: `${estimate} (fallback)` };
  }
}

type PlaceOrderArgs = {
  cart: CartItem[];
  customerAddress: string;
  deliveryEstimate: string;
};

export async function placeOrder({ cart, customerAddress, deliveryEstimate }: PlaceOrderArgs) {
  // Group items by shopId
  const itemsByShop = cart.reduce((acc, cartItem) => {
    const shopId = cartItem.item.shopId;
    if (!acc[shopId]) {
      acc[shopId] = [];
    }
    acc[shopId].push(cartItem);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const customerId = 'user-6'; // Mock customer ID
  const customer = users.find(u => u.id === customerId); // Get full customer object

  const createdOrderIds: string[] = [];

  for (const [shopId, shopCartItems] of Object.entries(itemsByShop)) {
    // Atomic stock check for this shop's items
    for (const cartItem of shopCartItems) {
      const stockItem = items.find(i => i.id === cartItem.item.id);
      if (!stockItem || stockItem.stock < cartItem.quantity) {
        return { success: false, error: `Sorry, "${cartItem.item.name}" is out of stock or has limited quantity.` };
      }
    }

    // Reduce stock
    for (const cartItem of shopCartItems) {
      const stockItem = items.find(i => i.id === cartItem.item.id);
      if (stockItem) {
        stockItem.stock -= cartItem.quantity;
      }
    }

    // Calculate delivery estimate
    let estimate = "30-45 mins";
    if (customer?.lat && customer?.lng) {
      const shop = shops.find(s => s.id === shopId);
      if (shop) {
        const { calculateDistance } = await import('@/lib/distance');
        const dist = calculateDistance(customer.lat, customer.lng, shop.lat, shop.lng);
        const time = Math.round(dist * 2.5 + 15); // 15 mins base + 2.5 min/km
        estimate = `${time}-${time + 10} minutes`;
      }
    } else if (deliveryEstimate) {
      estimate = deliveryEstimate;
    }


    // Create order for this shop
    const totalPrice = shopCartItems.reduce((total, { item, quantity }) => total + item.price * quantity, 0) + 5.00; // with shipping
    const newOrderId = `order-${Date.now()}-${shopId}`;
    orders.push({
      id: newOrderId,
      customerId: customerId,
      shopId: shopId,
      items: shopCartItems.map(({ item, quantity }) => ({ itemId: item.id, quantity, price: item.price })),
      totalPrice,
      orderDate: new Date(),
      customerAddress: customerAddress || customer?.address || '',
      estimatedDeliveryTime: estimate,
    });
    createdOrderIds.push(newOrderId);

    const owner = shops.find(s => s.id === shopId)?.ownerId;
    if (owner) {
      revalidatePath(`/owner/${owner}`);
    }
  }

  revalidatePath(`/customer`);

  return { success: true, orderId: createdOrderIds.join(','), redirectUrl: `/customer/${customerId}` };
}

export async function getCustomerOrders(customerId: string) {
  return orders.filter(o => o.customerId === customerId).sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
}
