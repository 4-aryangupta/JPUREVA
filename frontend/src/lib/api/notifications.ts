import { apiFetch } from "./client";
import type { Notification, Paginated } from "./types";

export function listNotifications() {
  return apiFetch<Paginated<Notification>>("/notifications/");
}

export function markNotificationRead(id: number) {
  return apiFetch<Notification>(`/notifications/${id}/read/`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return apiFetch<{ detail: string }>("/notifications/mark-all-read/", { method: "POST" });
}
