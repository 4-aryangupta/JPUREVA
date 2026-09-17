"use client";

import { useEffect, useState } from "react";
import type { Batch } from "@/lib/api/types";

export interface GuestCartItem {
  batch: Batch;
  quantity: number;
}

const CART_KEY = "jp_guest_cart";

function readCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? (JSON.parse(saved) as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

export function useGuestCart() {
  const [items, setItems] = useState<GuestCartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const save = (next: GuestCartItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const addItem = (batch: Batch, quantity: number) => {
    const existing = items.findIndex((i) => i.batch.id === batch.id);
    if (existing > -1) {
      const next = [...items];
      next[existing] = { ...next[existing], quantity: next[existing].quantity + quantity };
      save(next);
    } else {
      save([...items, { batch, quantity }]);
    }
  };

  const updateQuantity = (batchId: string, quantity: number) => {
    save(items.map((i) => (i.batch.id === batchId ? { ...i, quantity: Math.max(1, quantity) } : i)));
  };

  const removeItem = (batchId: string) => {
    save(items.filter((i) => i.batch.id !== batchId));
  };

  const clear = () => save([]);

  const subtotal = items.reduce((sum, i) => sum + Number(i.batch.price_per_unit ?? 0) * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, addItem, updateQuantity, removeItem, clear, subtotal, itemCount };
}
