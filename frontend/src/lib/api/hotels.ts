import { apiFetch, fetchAllPages } from "./client";
import type {
  Batch,
  Cart,
  ComplianceDocument,
  HotelSubscription,
  Order,
  Paginated,
  SubscriptionPlan,
  TrustBadge,
} from "./types";

export function listProducts(params: { category?: string; supplier?: number; price_min?: string; price_max?: string } = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && qs.set(k, String(v)));
  const str = qs.toString();
  return fetchAllPages<Batch>(`/hotels/products/${str ? `?${str}` : ""}`);
}

export function getProduct(id: string) {
  return apiFetch<Batch>(`/hotels/products/${id}/`);
}

export function getCart() {
  return apiFetch<Cart>("/hotels/cart/");
}

export function addToCart(batchId: string, quantity: number) {
  return apiFetch<Cart>("/hotels/cart/", { method: "POST", body: { batch_id: batchId, quantity } });
}

export function updateCartItem(itemId: number, quantity: number) {
  return apiFetch<Cart>(`/hotels/cart/items/${itemId}/`, { method: "PATCH", body: { quantity } });
}

export function removeCartItem(itemId: number) {
  return apiFetch<Cart>(`/hotels/cart/items/${itemId}/`, { method: "DELETE" });
}

export interface CheckoutPayload {
  delivery_date: string;
  delivery_address: string;
  delivery_slot?: string;
}

export function checkout(payload: CheckoutPayload) {
  return apiFetch<Order>("/hotels/checkout/", { method: "POST", body: payload });
}

export function listHotelOrders() {
  return apiFetch<Paginated<Order>>("/hotels/orders/");
}

export function getHotelOrder(id: number) {
  return apiFetch<Order>(`/hotels/orders/${id}/`);
}

export function listComplianceDocuments() {
  return apiFetch<Paginated<ComplianceDocument>>("/hotels/compliance-documents/");
}

export function uploadComplianceDocument(docType: string, file: File, issuedDate?: string, expiryDate?: string) {
  const form = new FormData();
  form.append("doc_type", docType);
  form.append("file", file);
  if (issuedDate) form.append("issued_date", issuedDate);
  if (expiryDate) form.append("expiry_date", expiryDate);
  return apiFetch<ComplianceDocument>("/hotels/compliance-documents/", { method: "POST", body: form, isForm: true });
}

export function getTrustBadge() {
  return apiFetch<TrustBadge>("/hotels/trust-badge/");
}

export function regenerateTrustBadge() {
  return apiFetch<TrustBadge>("/hotels/trust-badge/regenerate/", { method: "POST" });
}

export function listSubscriptionPlans() {
  return apiFetch<Paginated<SubscriptionPlan>>("/hotels/subscription-plans/", { auth: false });
}

export function getHotelSubscription() {
  return apiFetch<HotelSubscription | null>("/hotels/subscription/");
}

export function subscribeToPlan(planId: number) {
  return apiFetch<HotelSubscription>("/hotels/subscription/", { method: "POST", body: { plan_id: planId } });
}
