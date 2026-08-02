"use client";

import { useEffect, useState, useCallback } from "react";
import { AppState, Product, InventoryItem, Transaction } from "./types";
import { SEED_DATA } from "./seed";

const STORAGE_KEY = "openboxes-lite-v1";

function loadState(): AppState {
  if (typeof window === "undefined") return SEED_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {}
  return SEED_DATA;
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useInventoryStore() {
  const [state, setState] = useState<AppState>(SEED_DATA);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const resetToSeed = useCallback(() => {
    setState(SEED_DATA);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, products: [...s.products, newProduct] }));
    return newProduct;
  }, []);

  const addInventoryItem = useCallback((item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    setState((s) => ({ ...s, inventory: [...s.inventory, newItem] }));
    return newItem;
  }, []);

  const adjustStock = useCallback(
    (inventoryItemId: string, delta: number, notes?: string) => {
      setState((s) => {
        const inventory = s.inventory.map((item) =>
          item.id === inventoryItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        );
        const tx: Transaction = {
          id: `tx-${Date.now()}`,
          type: delta >= 0 ? "RECEIPT" : "ISSUE",
          date: new Date().toISOString(),
          notes,
          entries: [{ inventoryItemId, quantity: delta }],
        };
        return { ...s, inventory, transactions: [tx, ...s.transactions] };
      });
    },
    []
  );

  const getProduct = useCallback(
    (id: string) => state.products.find((p) => p.id === id),
    [state.products]
  );

  const nearExpiry = useCallback(
    (days = 90) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + days);
      return state.inventory.filter((item) => {
        const exp = new Date(item.expirationDate);
        return exp <= cutoff && item.quantity > 0;
      });
    },
    [state.inventory]
  );

  const totalValue = useCallback(() => {
    return state.inventory.reduce((sum, item) => {
      const product = state.products.find((p) => p.id === item.productId);
      const price = product?.unitPrice ?? 0;
      return sum + item.quantity * price;
    }, 0);
  }, [state]);

  return {
    ...state,
    hydrated,
    addProduct,
    addInventoryItem,
    adjustStock,
    getProduct,
    nearExpiry,
    totalValue,
    resetToSeed,
  };
}
