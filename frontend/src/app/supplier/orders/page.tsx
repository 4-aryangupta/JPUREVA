"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { fulfillOrderItem, listSupplierOrders } from "@/lib/api/suppliers";
import type { SupplierOrderItem } from "@/lib/api/types";

export default function SupplierOrdersPage() {
  const [items, setItems] = useState<SupplierOrderItem[]>([]);

  function load() {
    listSupplierOrders().then((res) => setItems(res.results));
  }

  useEffect(load, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Incoming orders</h1>

      {items.length === 0 ? (
        <p className="text-sm text-foreground-secondary">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{item.ingredient_name} × {item.quantity}</div>
                  <div className="text-xs text-foreground-secondary">
                    Order #{item.order_id} · {item.hotel_name} · Deliver {item.delivery_date}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">₹{item.subtotal}</span>
                  <StatusBadge status={item.fulfillment_status} />
                  {item.fulfillment_status === "PENDING" && (
                    <Button size="sm" onClick={() => fulfillOrderItem(item.id).then(load)}>Mark fulfilled</Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
