import { type ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

export interface CartItem {
  id: string;
  code: string;
  product: string;
  description: string | null;
  website: string;
  image_url: string | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

// Provide default value
const defaultContext: CartContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
};

// Create context with default value
const CartContext = createContext<CartContextType>(defaultContext);
CartContext.displayName = 'CartContext'; // Add display name to ensure context is correctly identified

export { CartContext };

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      // Check if item already exists
      if (prev.some(i => i.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 