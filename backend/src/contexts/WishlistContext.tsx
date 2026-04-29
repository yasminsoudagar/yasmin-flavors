import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { FoodItem } from '@/data/mockData';

interface WishlistContextType {
  items: FoodItem[];
  addItem: (item: FoodItem) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  toggleItem: (item: FoodItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<FoodItem[]>([]);

  const addItem = useCallback((item: FoodItem) => {
    setItems(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item]);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const isInWishlist = useCallback((id: number) => items.some(i => i.id === id), [items]);

  const toggleItem = useCallback((item: FoodItem) => {
    setItems(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]);
  }, []);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleItem }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
