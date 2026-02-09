
export interface Staff {
  id: string;
  name: string;
  password: string;
  role: 'CASHIER' | 'MANAGER';
  createdAt: Date;
}

export interface ShopConfig {
  id: string; 
  name: string;
  ownerName: string;
  email: string;
  password?: string;
  logoUrl: string;
  address: string;
  phone: string;
  currency: string;
  taxRate: number;
  status: 'active' | 'suspended' | 'trial';
  subscriptionType: 'Basic' | 'Pro' | 'Enterprise';
  createdAt: Date;
  expiryDate: string; // ISO String for subscription deadline
  staff: Staff[];
}

export interface User {
  id: string;
  username: string;
  role: 'PLATFORM_ADMIN' | 'SHOP_OWNER' | 'STAFF';
  shopId?: string;
  staffName?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  shopId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: Date;
  paymentMethod: 'Cash' | 'Card' | 'Digital';
}

export enum View {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  POS = 'POS',
  INVENTORY = 'INVENTORY',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  ADMIN_PANEL = 'ADMIN_PANEL',
  STAFF_MGMT = 'STAFF_MGMT'
}
