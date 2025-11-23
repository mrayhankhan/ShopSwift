export enum UserRole {
  Customer = 'CUSTOMER',
  ShopOwner = 'SHOP_OWNER',
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shopId?: string;
};

export type Shop = {
  id: string;
  name: string;
  ownerId: string;
  address: string;
  lat: number;
  lng: number;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  price: number;
  stock: number;
  shopId: string;
};

export type Order = {
  id: string;
  customerId: string;
  shopId: string;
  items: {
    itemId: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  orderDate: Date;
  estimatedDeliveryTime: string;
  customerAddress: string;
};

export type CartItem = {
  item: Item;
  quantity: number;
};
