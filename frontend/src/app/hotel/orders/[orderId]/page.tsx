"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { getHotelOrder } from "@/lib/api/hotels";
import type { Order } from "@/lib/api/types";

export default function HotelOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    getHotelOrder(Number(orderId)).then(setOrder);
  }, [orderId]);

  if (!order) return <p className="text-sm text-foreground-secondary">Loading order…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-foreground">Order #{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>

      <Card>
        <CardHeader><CardTitle>Delivery tracking</CardTitle></CardHeader>
        <CardBody>
          <div className="space-y-4">
            {order.status_events.map((ev, i) => (
              <div key={ev.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary">
                    <CheckCircle2 size={14} />
                  </div>
                  {i < order.status_events.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
                </div>
                <div className="pb-4">
                  <div className="text-sm font-medium">{ev.status.replace(/_/g, " ")}</div>
                  <div className="text-xs text-foreground-secondary">{new Date(ev.created_at).toLocaleString()}</div>
                  {ev.note && <div className="text-xs text-foreground-secondary">{ev.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardBody className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-medium">{item.ingredient_name}</div>
                <div className="text-xs text-foreground-secondary">{item.supplier_name} · {item.quantity} units</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">₹{item.subtotal}</div>
                <StatusBadge status={item.fulfillment_status} />
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="text-sm text-foreground-secondary">
          <div>Delivery address: {order.delivery_address}</div>
          <div>Delivery date: {order.delivery_date} ({order.delivery_slot})</div>
          <div className="mt-2 font-semibold text-foreground">Total: ₹{order.total_amount}</div>
        </CardBody>
      </Card>
    </div>
  );
}
