"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getCart, removeCartItem, updateCartItem } from "@/lib/api/hotels";
import type { Cart } from "@/lib/api/types";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    getCart().then(setCart).finally(() => setLoading(false));
  }

  useEffect(load, []);

  const total = cart?.items.reduce((sum, i) => sum + Number(i.unit_price) * Number(i.quantity), 0) ?? 0;

  if (loading) return <p className="text-sm text-foreground-secondary">Loading cart…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Your cart</h1>

      {!cart || cart.items.length === 0 ? (
        <Card><CardBody><p className="text-sm text-foreground-secondary">Your cart is empty. Browse verified ingredients to get started.</p><Button href="/hotel/browse" className="mt-4">Browse ingredients</Button></CardBody></Card>
      ) : (
        <>
          <Card>
            <CardBody className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{item.ingredient_name}</div>
                    <div className="text-xs text-foreground-secondary">{item.supplier_name} · ₹{item.unit_price}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={1}
                      className="w-20"
                      value={item.quantity}
                      onChange={(e) => {
                        const qty = Number(e.target.value);
                        updateCartItem(item.id, qty).then(setCart);
                      }}
                    />
                    <button onClick={() => removeCartItem(item.id).then(setCart)} className="text-danger hover:opacity-70">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center justify-between">
              <div>
                <div className="text-sm text-foreground-secondary">Estimated total</div>
                <div className="font-heading text-2xl">₹{total.toFixed(2)}</div>
              </div>
              <Button href="/hotel/checkout" size="lg">Proceed to checkout</Button>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
