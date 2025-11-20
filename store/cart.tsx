// app/lib/cart/context.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface AppliedCoupon {
  code: string;
  discount: number;
  discountAmount: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  appliedCoupon: AppliedCoupon | null;
  isLoading: boolean;
}


interface CartContextType extends CartState {
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, setState] = useState<CartState>({
    items: [],
    totalPrice: 0,
    appliedCoupon: null,
    isLoading: false,
  });

  useEffect(() => {
    fetchCart();
    loadCouponFromStorage();
  }, []);

  const loadCouponFromStorage = () => {
    try {
      const storedCoupon = localStorage.getItem('appliedCoupon');
      if (storedCoupon) {
        const couponData = JSON.parse(storedCoupon);
        setState(prev => ({ ...prev, appliedCoupon: couponData }));
      }
    } catch (error) {
      console.error('Error loading coupon from storage:', error);
    }
  };

  const fetchCart = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        const totalPrice = data.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
        setState(prev => ({ 
          ...prev, 
          items: data.items || [], 
          totalPrice,
          isLoading: false 
        }));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const addItem = async (productId: string, quantity = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      
      if (response.ok) {
        await fetchCart();
        toast.success('Item added to cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity })
      });
      
      if (response.ok) {
        await fetchCart();
        if (state.appliedCoupon) {
          const newSubtotal = state.items.reduce((total, item) => 
            total + item.price * (item.id === itemId ? quantity : item.quantity), 0
          );
          const newDiscountAmount = (newSubtotal * state.appliedCoupon.discount) / 100;
          setState(prev => ({
            ...prev,
            appliedCoupon: prev.appliedCoupon ? { ...prev.appliedCoupon, discountAmount: newDiscountAmount } : null
          }));
        }
      } else {
        toast.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });
      
      if (response.ok) {
        await fetchCart();
        if (state.appliedCoupon) {
          const newSubtotal = state.totalPrice;
          const newDiscountAmount = (newSubtotal * state.appliedCoupon.discount) / 100;
          setState(prev => ({
            ...prev,
            appliedCoupon: prev.appliedCoupon ? { ...prev.appliedCoupon, discountAmount: newDiscountAmount } : null
          }));
        }
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', { method: 'DELETE' });
      if (response.ok) {
        setState(prev => ({ 
          ...prev, 
          items: [], 
          totalPrice: 0, 
          appliedCoupon: null 
        }));
        localStorage.removeItem('appliedCoupon');
        toast.success('Cart cleared successfully');
      } else {
        toast.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: state.totalPrice })
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        const couponData = {
          code: data.coupon.code,
          discount: data.coupon.discount,
          discountAmount: data.discountAmount
        };
        setState(prev => ({ ...prev, appliedCoupon: couponData }));
        localStorage.setItem('appliedCoupon', JSON.stringify(couponData));
        toast.success('Coupon applied successfully!');
      } else {
        toast.error(data.error || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    }
  };

  const removeCoupon = () => {
    setState(prev => ({ ...prev, appliedCoupon: null }));
    localStorage.removeItem('appliedCoupon');
    toast.success('Coupon removed');
  };

  const value: CartContextType = {
    ...state,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const response = await fetch('/api/cart');
    if (response.ok) {
      const data = await response.json();
      return data.items || [];
    }
    return [];
  } catch {
    return [];
  }
};