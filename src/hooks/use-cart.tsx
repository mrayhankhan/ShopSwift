'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Item, CartItem } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartReady: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartReady, setIsCartReady] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedCart = window.localStorage.getItem('shopswift-cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
      setCart([]);
    } finally {
      setIsCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (isCartReady) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('shopswift-cart', JSON.stringify(cart));
        }
      } catch (error) {
        console.error('Failed to save cart to localStorage', error);
      }
    }
  }, [cart, isCartReady]);

  const addToCart = useCallback((item: Item) => {
    setCart((prevCart) => {
      // Logic for adding to cart
      const existingItem = prevCart.find((cartItem) => cartItem.item.id === item.id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + 1, item.stock);
        return prevCart.map((cartItem) =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((cartItem) => {
        if (cartItem.item.id === itemId) {
          const newQuantity = Math.min(quantity, cartItem.item.stock);
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  const totalPrice = cart.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);

  const value = { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartReady };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
