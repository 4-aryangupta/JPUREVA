"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { addToCart } from "@/lib/api/hotels";
import { useAuth } from "@/lib/auth/AuthContext";
import { useGuestCart } from "@/lib/store/guestCart";

export default function GuestCartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, clear, subtotal } = useGuestCart();
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function handleCheckout() {
    if (!user) {
      router.push("/login?next=/cart");
      return;
    }
    if (user.role !== "HOTEL") {
      setError("Only hotel/restaurant accounts can check out. Log in with a hotel account.");
      return;
    }
    setError(null);
    setSyncing(true);
    try {
      for (const item of items) {
        await addToCart(item.batch.id, item.quantity);
      }
      clear();
      router.push("/hotel/checkout");
    } catch {
      setError("Some items could not be added — they may be out of stock. Please review and try again.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex-1 space-y-8 pb-16">
      <header className="glass-panel sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold tracking-tight text-primary">
            <ShieldCheck size={28} className="text-primary" />
            <span>JPureva</span>
          </Link>
          <Link href="/browse" className="text-sm font-medium text-foreground-secondary hover:text-foreground">
            Continue browsing
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 px-6">
        <h1 className="font-heading text-2xl text-foreground">Your cart</h1>

        {items.length === 0 ? (
          <Card>
            <CardBody className="space-y-4 text-center">
              <ShoppingBag size={40} className="mx-auto text-foreground-tertiary/40" />
              <p className="text-sm text-foreground-secondary">Your cart is empty. Browse verified ingredients to get started.</p>
              <Button href="/browse">Browse ingredients</Button>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card>
              <CardBody className="space-y-4">
                {items.map((item) => (
                  <div key={item.batch.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{item.batch.ingredient_name}</div>
                      <div className="text-xs text-foreground-secondary">
                        {item.batch.supplier_name} · ₹{item.batch.price_per_unit} / {item.batch.unit}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.batch.id, Number(e.target.value))}
                        className="w-20 rounded-xl border border-border bg-surface-muted px-3 py-1.5 text-sm text-foreground focus:border-primary-light focus:outline-none"
                      />
                      <button onClick={() => removeItem(item.batch.id)} className="text-danger hover:opacity-70">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-foreground-secondary">Estimated total</div>
                    <div className="font-heading text-2xl">₹{subtotal.toFixed(2)}</div>
                  </div>
                  <Button onClick={handleCheckout} loading={syncing} size="lg">
                    {user ? "Proceed to checkout" : "Log in to checkout"}
                  </Button>
                </div>
                {error && <p className="text-sm text-danger">{error}</p>}
                {!user && (
                  <p className="text-xs text-foreground-tertiary">
                    You&apos;ll be asked to log in as a hotel/restaurant to place the order — your cart stays saved.
                  </p>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
