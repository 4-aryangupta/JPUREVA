"use client";

import { useEffect, useState } from "react";
import { ClipboardList, ShoppingBag, ShoppingCart, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { getCart, listHotelOrders } from "@/lib/api/hotels";
import type { Cart, Order } from "@/lib/api/types";

export default function HotelDashboardPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCart(), listHotelOrders()])
      .then(([cartRes, ordersRes]) => {
        setCart(cartRes);
        setOrders(ordersRes.results);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingOrders = orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-foreground-secondary">Browse verified ingredients and track your orders.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Items in cart" value={cart?.items.length ?? 0} icon={ShoppingCart} />
        <StatCard label="Orders in progress" value={loading ? "…" : pendingOrders} icon={ClipboardList} />
        <StatCard label="Total orders" value={loading ? "…" : orders.length} icon={TrendingUp} tone="accent" />
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent orders</CardTitle>
          <Button href="/hotel/orders" variant="ghost" size="sm">View all</Button>
        </CardHeader>
        <CardBody className="space-y-3">
          {orders.length === 0 && <p className="text-sm text-foreground-secondary">No orders yet — start browsing verified ingredients.</p>}
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-medium">Order #{o.id}</div>
                <div className="text-xs text-foreground-secondary">{o.items.length} items · ₹{o.total_amount}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
          ))}
        </CardBody>
      </Card>

      <Button href="/hotel/browse" variant="accent" size="lg">
        <ShoppingBag size={18} /> Browse verified ingredients
      </Button>
    </div>
  );
}
