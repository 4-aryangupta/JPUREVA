"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { approveOrder, listPendingOrders, rejectOrder } from "@/lib/api/admin";
import type { Order } from "@/lib/api/types";

export default function AdminApprovalsPage() {
  const [pending, setPending] = useState<Order[]>([]);
  const [acting, setActing] = useState<number | null>(null);

  function load() {
    listPendingOrders().then((res) => setPending(res.results));
  }

  useEffect(load, []);

  async function handle(action: "approve" | "reject", orderId: number) {
    setActing(orderId);
    try {
      if (action === "approve") await approveOrder(orderId);
      else await rejectOrder(orderId);
      load();
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Order approvals</h1>
        <p className="text-sm text-foreground-secondary">
          Hotel checkouts wait here until you approve them — approving notifies suppliers and credits their ledger.
        </p>
      </div>

      {pending.length === 0 ? (
        <p className="text-sm text-foreground-secondary">No orders awaiting approval.</p>
      ) : (
        <div className="space-y-3">
          {pending.map((o) => (
            <Card key={o.id}>
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Order #{o.id}</div>
                    <div className="text-xs text-foreground-secondary">
                      Placed {new Date(o.placed_at).toLocaleString()} · Delivery {o.delivery_date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading text-lg text-foreground">₹{o.total_amount}</div>
                    <div className="text-xs text-foreground-secondary">{o.items.length} item(s)</div>
                  </div>
                </div>

                <div className="space-y-1 border-t border-border pt-3 text-xs text-foreground-secondary">
                  {o.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span>{item.ingredient_name} · {item.supplier_name}</span>
                      <span className="tabular-nums">{item.quantity} × ₹{item.unit_price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="outline" loading={acting === o.id} onClick={() => handle("reject", o.id)}>Reject</Button>
                  <Button size="sm" loading={acting === o.id} onClick={() => handle("approve", o.id)}>Approve</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
