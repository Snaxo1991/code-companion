// Custom types for the SNAXO application

export type ProductCategory = 'drycker' | 'fryst' | 'snacks' | 'deals';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
export type DeliveryArea = 'jarfalla' | 'upplands_bro' | 'stockholm';
export type DeliverySpeed = 'standard' | 'priority';

export const PRIORITY_FEE = 19;

export const DELIVERY_SPEED_LABELS: Record<DeliverySpeed, string> = {
  standard: 'Standard',
  priority: 'Prioritering',
};

export const DELIVERY_SPEED_TIMES: Record<DeliverySpeed, string> = {
  standard: '20-30 min',
  priority: '10-20 min',
};

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: ProductCategory;
  image_url: string | null;
  in_stock: boolean;
  is_popular: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_id: string | null;
  guest_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_area: DeliveryArea;
  delivery_speed: DeliverySpeed;
  delivery_fee: number;
  priority_fee: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price_at_order: number;
  created_at: string;
}

// Delivery fee configuration
export const DELIVERY_FEES: Record<DeliveryArea, number> = {
  jarfalla: 29,
  upplands_bro: 49,
  stockholm: 52,
};

export const DELIVERY_AREA_LABELS: Record<DeliveryArea, string> = {
  jarfalla: 'Järfälla',
  upplands_bro: 'Upplands Bro',
  stockholm: 'Husby, Akalla & Kista',
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  drycker: 'Drickor',
  fryst: 'Fryst mat',
  snacks: 'Snacks',
  deals: 'Deals',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Mottagen',
  confirmed: 'Bekräftad',
  preparing: 'Förbereds',
  delivering: 'På väg',
  delivered: 'Levererad',
  cancelled: 'Avbruten',
};
