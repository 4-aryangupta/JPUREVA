"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import { checkout, getCart } from "@/lib/api/hotels";
import type { Cart } from "@/lib/api/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("morning");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const total = cart?.items.reduce((sum, i) => sum + Number(i.unit_price) * Number(i.quantity), 0) ?? 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const order = await checkout({ delivery_date: deliveryDate, delivery_address: address, delivery_slot: deliverySlot });
      router.push(`/hotel/orders/${order.id}`);
    } catch {
      setError("Checkout failed. Make sure your cart isn't empty and all fields are filled.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Checkout</h1>

      <Card>
        <CardBody>
          <h2 className="mb-3 font-semibold text-foreground">Order summary</h2>
          <div className="space-y-2 text-sm">
            {cart?.items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>{i.ingredient_name} × {i.quantity}</span>
                <span>₹{(Number(i.unit_price) * Number(i.quantity)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Delivery date">
              <Input type="date" required value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
            </Field>
            <Field label="Delivery slot">
              <Select value={deliverySlot} onChange={(e) => setDeliverySlot(e.target.value)}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </Select>
            </Field>
            <Field label="Delivery address">
              <Input required value={address} onChange={(e) => setAddress(e.target.value)} />
            </Field>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full" loading={loading} disabled={!cart || cart.items.length === 0}>
              Place order
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
