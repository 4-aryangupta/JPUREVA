"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/api/notifications";
import type { Notification } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const load = () => {
    listNotifications()
      .then((res) => setItems(res.results))
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 text-foreground-secondary transition-colors duration-150 hover:bg-surface-2 hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-on-accent">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="glass-panel absolute right-0 z-20 mt-2 w-80 rounded-2xl shadow-lifted">
          <div className="flex items-center justify-between border-b border-border-strong px-4 py-3">
            <span className="text-sm font-semibold">Notifications</span>
            <button
              onClick={() => {
                markAllNotificationsRead().then(load);
              }}
              className="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 && <div className="p-4 text-sm text-foreground-tertiary">No notifications yet.</div>}
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  if (!n.is_read) markNotificationRead(n.id).then(load);
                }}
                className={cn(
                  "block w-full border-b border-border px-4 py-3 text-left text-sm last:border-0 transition-colors duration-150 hover:bg-surface-2",
                  !n.is_read && "bg-primary/10"
                )}
              >
                <div className="font-medium">{n.title}</div>
                {n.body && <div className="mt-0.5 text-xs text-foreground-secondary">{n.body}</div>}
                <div className="mt-1 text-[11px] text-foreground-tertiary">{new Date(n.created_at).toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
