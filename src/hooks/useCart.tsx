import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, DeliveryArea, DeliverySpeed, DELIVERY_FEES, PRIORITY_FEE } from '@/types/database';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryArea: DeliveryArea | null;
  setDeliveryArea: (area: DeliveryArea | null) => void;
  deliverySpeed: DeliverySpeed;
  setDeliverySpeed: (speed: DeliverySpeed) => void;
  deliveryFee: number;
  priorityFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'snaxo-cart';
const DELIVERY_AREA_KEY = 'snaxo-delivery-area';
const DELIVERY_SPEED_KEY = 'snaxo-delivery-speed';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DELIVERY_AREA_KEY);
      return saved as DeliveryArea | null;
    }
    return null;
  });

  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DELIVERY_SPEED_KEY);
      return (saved as DeliverySpeed) || 'standard';
    }
    return 'standard';
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (deliveryArea) {
      localStorage.setItem(DELIVERY_AREA_KEY, deliveryArea);
    } else {
      localStorage.removeItem(DELIVERY_AREA_KEY);
    }
  }, [deliveryArea]);

  useEffect(() => {
    localStorage.setItem(DELIVERY_SPEED_KEY, deliverySpeed);
  }, [deliverySpeed]);

  const addItem = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryArea ? DELIVERY_FEES[deliveryArea] : 0;
  const priorityFee = deliverySpeed === 'priority' ? PRIORITY_FEE : 0;
  const total = subtotal + deliveryFee + priorityFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryArea,
        setDeliveryArea,
        deliverySpeed,
        setDeliverySpeed,
        deliveryFee,
        priorityFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
