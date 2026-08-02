export interface Product {
  id: string;
  productCode: string;
  name: string;
  description?: string;
  category: string;
  unitOfMeasure: string;
  lotAndExpiryControl: boolean;
  active: boolean;
  unitPrice?: number;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  lotNumber: string;
  expirationDate: string;
  quantity: number;
  binLocation: string;
  orgCode?: string;
}

export interface Location {
  id: string;
  name: string;
  type: "DEPOT" | "BIN" | "ZONE";
  parentId?: string;
}

export interface Transaction {
  id: string;
  type: "RECEIPT" | "ISSUE" | "ADJUSTMENT" | "INVENTORY";
  date: string;
  notes?: string;
  entries: {
    inventoryItemId: string;
    quantity: number;
  }[];
}

export interface AppState {
  products: Product[];
  inventory: InventoryItem[];
  locations: Location[];
  transactions: Transaction[];
}
