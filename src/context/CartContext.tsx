import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  _id: string;
  gameId: {
    _id: string;
    title: string;
    price: number;
    images: { url: string; type: string }[];
  };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (gameId: string) => Promise<boolean>;
  removeFromCart: (gameId: string) => Promise<boolean>;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { token, user } = useAuth();

  useEffect(() => {
    if (user && token) {
      fetchCart();
    }
  }, [user, token]);

  const fetchCart = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/api/user/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (gameId: string): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(`http://localhost:3001/api/games/${gameId}/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (gameId: string): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(`http://localhost:3001/api/user/cart/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((total, item) => total + (item.gameId.price * item.quantity), 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalAmount,
    itemCount,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};