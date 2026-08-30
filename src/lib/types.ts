export interface ShoppingItem {
  id: string;
  userId: string;
  name: string;
  category: string;
  quantity: number;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  name: string;
  category: string;
  quantity: number;
  minStock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseReceipt {
  id: string;
  userId: string;
  storeName: string;
  totalItems: number;
  totalPrice: number;
  date: string;
  createdAt: string;
}
