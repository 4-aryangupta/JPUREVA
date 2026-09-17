"use client";

import { useState, useEffect } from "react";
import type { RawProduct } from "@/lib/data/products";

export interface CartItem {
  product: RawProduct;
  quantity: number;
}

const CART_KEY = "jpureva_b2b_cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    } catch {
      // ignore
    }
  };

  const addToCart = (product: RawProduct, quantityToAdd?: number) => {
    const qty = quantityToAdd && quantityToAdd >= product.moq ? quantityToAdd : product.moq;
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += qty;
    } else {
      updated = [...cart, { product, quantity: qty }];
    }
    saveCart(updated);
    setIsOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updated = cart.map((item) => {
      if (item.product.id === productId) {
        // Enforce MOQ minimum
        const validQty = Math.max(quantity, item.product.moq);
        return { ...item, quantity: validQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.pricePerUnit * item.quantity, 0);
  // Volume discount: 5% off if subtotal > 15000, 10% off if > 50000
  const discountRate = subtotal > 50000 ? 0.1 : subtotal > 15000 ? 0.05 : 0;
  const discountAmount = subtotal * discountRate;
  const taxAmount = (subtotal - discountAmount) * 0.05; // 5% GST on agro raw materials
  const total = subtotal - discountAmount + taxAmount;
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cart,
    isOpen,
    setIsOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    discountRate,
    taxAmount,
    total,
    itemCount
  };
}
