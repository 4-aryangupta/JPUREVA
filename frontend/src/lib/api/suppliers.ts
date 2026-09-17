import { apiFetch } from "./client";
import type { Batch, ColdChainLog, LedgerEntry, Paginated, SupplierOrderItem } from "./types";

export function listBatches() {
  return apiFetch<Paginated<Batch>>("/suppliers/batches/");
}

export function getBatch(id: string) {
  return apiFetch<Batch>(`/suppliers/batches/${id}/`);
}

export interface CreateBatchPayload {
  ingredient: number;
  quantity: string;
  unit: string;
  sowing_date?: string;
  harvest_date: string;
}

export function createBatch(payload: CreateBatchPayload) {
  return apiFetch<Batch>("/suppliers/batches/", { method: "POST", body: payload });
}

export function uploadBatchPhoto(batchId: string, file: File) {
  const form = new FormData();
  form.append("image", file);
  form.append("batch", batchId);
  return apiFetch(`/suppliers/batches/${batchId}/photos/`, { method: "POST", body: form, isForm: true });
}

export function requestVerification(batchId: string, testTypeIds: number[] = []) {
  return apiFetch<{ verification_request_id: number; batch_status: string }>(
    `/suppliers/batches/${batchId}/request-verification/`,
    { method: "POST", body: { test_type_ids: testTypeIds } }
  );
}

export function listBatchForSale(batchId: string, pricePerUnit: string, availableQuantity: string) {
  return apiFetch<Batch>(`/suppliers/batches/${batchId}/list/`, {
    method: "POST",
    body: { price_per_unit: pricePerUnit, available_quantity: availableQuantity },
  });
}

export function listSupplierOrders() {
  return apiFetch<Paginated<SupplierOrderItem>>("/suppliers/orders/");
}

export function fulfillOrderItem(itemId: number) {
  return apiFetch<SupplierOrderItem>(`/suppliers/orders/${itemId}/fulfill/`, { method: "PATCH" });
}

export function listSupplierColdChainLogs(batchId?: string) {
  const qs = batchId ? `?batch=${batchId}` : "";
  return apiFetch<Paginated<ColdChainLog>>(`/suppliers/coldchain-logs/${qs}`);
}

export interface CreateColdChainLogPayload {
  batch: string;
  stage: "WAREHOUSE" | "TRANSIT" | "DELIVERY";
  location_name: string;
  temperature_c: number;
  humidity_pct?: number;
  recorded_at: string;
  notes?: string;
}

export function createColdChainLog(payload: CreateColdChainLogPayload) {
  return apiFetch<ColdChainLog>("/suppliers/coldchain-logs/", { method: "POST", body: payload });
}

export function listSupplierLedger() {
  return apiFetch<Paginated<LedgerEntry>>("/suppliers/ledger/");
}
