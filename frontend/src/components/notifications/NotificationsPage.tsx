"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/api/notifications";
import type { Notification } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

export function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    listNotifications().then((res) => setItems(res.results)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-foreground">Notifications</h1>
        <Button variant="outline" size="sm" onClick={() => markAllNotificationsRead().then(load)}>
          Mark all read
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-foreground/50">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-foreground/50">No notifications yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <Card key={n.id} className={cn(!n.is_read && "border-primary/30 bg-primary/5")}>
              <CardBody
                className="cursor-pointer"
                onClick={() => {
                  if (!n.is_read) markNotificationRead(n.id).then(load);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-foreground/40">{new Date(n.created_at).toLocaleString()}</div>
                </div>
                {n.body && <div className="mt-1 text-sm text-foreground/60">{n.body}</div>}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
