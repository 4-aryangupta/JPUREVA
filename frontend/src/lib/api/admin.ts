import { apiFetch } from "./client";
import type { AdminAnalyticsOverview, AuditLogEntry, Batch, Category, Order, Paginated, PendingUser } from "./types";

export function listPendingOrders() {
  return apiFetch<Paginated<Order>>("/admin/approvals/");
}

export function approveOrder(orderId: number) {
  return apiFetch<Order>(`/admin/approvals/${orderId}/approve/`, { method: "POST" });
}

export function rejectOrder(orderId: number, reason?: string) {
  return apiFetch<Order>(`/admin/approvals/${orderId}/reject/`, { method: "POST", body: { reason } });
}

export function fetchAnalyticsOverview() {
  return apiFetch<AdminAnalyticsOverview>("/admin/analytics/overview/");
}

export function listUsers(params: { role?: string; status?: string } = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
  const str = qs.toString();
  return apiFetch<Paginated<PendingUser>>(`/admin/users/${str ? `?${str}` : ""}`);
}

export function listAuditLog() {
  return apiFetch<Paginated<AuditLogEntry>>("/admin/audit-log/");
}

export function listAdminCategories() {
  return apiFetch<Paginated<Category>>("/admin/catalog/categories/");
}

export function createCategory(data: { name: string; icon?: string }) {
  return apiFetch<Category>("/admin/catalog/categories/", { method: "POST", body: data });
}

export function listAdminItems() {
  return apiFetch<Batch[]>("/admin/catalog/items/");
}

export interface CreateItemPayload {
  category: number;
  name: string;
  unit_default: string;
  price_per_unit: string;
  available_quantity: string;
  expected_min_harvest_days?: number | null;
  expected_max_harvest_days?: number | null;
  image?: File | null;
}

export function createItem(data: CreateItemPayload) {
  const form = new FormData();
  form.append("category", String(data.category));
  form.append("name", data.name);
  form.append("unit_default", data.unit_default);
  form.append("price_per_unit", data.price_per_unit);
  form.append("available_quantity", data.available_quantity);
  if (data.expected_min_harvest_days != null) form.append("expected_min_harvest_days", String(data.expected_min_harvest_days));
  if (data.expected_max_harvest_days != null) form.append("expected_max_harvest_days", String(data.expected_max_harvest_days));
  if (data.image) form.append("image", data.image);
  return apiFetch<Batch>("/admin/catalog/items/", { method: "POST", body: form, isForm: true });
}

export function deleteItem(id: string) {
  return apiFetch<void>(`/admin/catalog/items/${id}/`, { method: "DELETE" });
}
