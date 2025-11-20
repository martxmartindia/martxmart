'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
}

interface WishlistContextType extends WishlistState {
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearWishlist: () => void;
  sortByPrice: (ascending: boolean) => void;
  filterByPriceRange: (min: number, max: number) => void;
  getItemCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [state, setState] = useState<WishlistState>({ items: [] });

  // Hydrate state from localStorage on client-side mount
  useEffect(() => {
    const hydrateState = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedData = localStorage.getItem('wishlist-storage');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            // Migration logic for version 0
            const items = parsed.version === 0 ? parsed.items || [] : parsed.items;
            setState({ items });
          }
        }
      } catch (error) {
        console.error('Failed to hydrate wishlist state:', error);
      }
    };

    hydrateState();
  }, []);

  // Persist state to localStorage
  const persistState = (newState: Partial<WishlistState>) => {
    const updatedState = { ...state, ...newState, version: 1 };
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist-storage', JSON.stringify(updatedState));
    }
    setState(updatedState);
  };

  const addItem = (item: WishlistItem) => {
    setState((prev) => {
      if (prev.items.find((i) => i.id === item.id)) return prev;
      return { items: [...prev.items, item] };
    });
  };

  const removeItem = (id: string) => {
    setState((prev) => ({
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const hasItem = (id: string) => {
    return state.items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    persistState({ items: [] });
  };

  const sortByPrice = (ascending: boolean) => {
    setState((prev) => ({
      items: [...prev.items].sort((a, b) => (ascending ? a.price - b.price : b.price - a.price)),
    }));
  };

  const filterByPriceRange = (min: number, max: number) => {
    setState((prev) => ({
      items: prev.items.filter((item) => item.price >= min && item.price <= max),
    }));
  };

  const getItemCount = () => {
    return state.items.length;
  };

  // Persist state after updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist-storage', JSON.stringify(state));
    }
  }, [state]);

  const value: WishlistContextType = {
    ...state,
    addItem,
    removeItem,
    hasItem,
    clearWishlist,
    sortByPrice,
    filterByPriceRange,
    getItemCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const getWishlistItems = (): WishlistItem[] => {
  if (typeof window === 'undefined') return []; // Server-side
  try {
    const storedData = localStorage.getItem('wishlist-storage');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      return parsed.version === 0 ? parsed.items || [] : parsed.items || [];
    }
    return [];
  } catch {
    return [];
  }
};