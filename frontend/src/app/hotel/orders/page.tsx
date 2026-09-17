"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { listHotelOrders } from "@/lib/api/hotels";
import type { Order } from "@/lib/api/types";

export default function HotelOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listHotelOrders().then((res) => setOrders(res.results)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-foreground-secondary">Loading orders…</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-foreground-secondary">No orders placed yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Order #{o.id} · {o.items.length} items</div>
                  <div className="text-xs text-foreground-secondary">
                    Delivery {o.delivery_date} · ₹{o.total_amount} · Placed {new Date(o.placed_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={o.status} />
                  <Button href={`/hotel/orders/${o.id}`} size="sm" variant="outline">Track</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
