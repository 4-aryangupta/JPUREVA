import { apiFetch } from "./client";
import type { Certificate, Invoice, LabAnalytics, Paginated, TestType, VerificationRequest } from "./types";

export function listTestTypes() {
  return apiFetch<Paginated<TestType>>("/labs/test-types/");
}

export function listVerificationRequests(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return apiFetch<Paginated<VerificationRequest>>(`/labs/verification-requests/${qs}`);
}

export function claimVerificationRequest(id: number) {
  return apiFetch<VerificationRequest>(`/labs/verification-requests/${id}/`, {
    method: "PATCH",
    body: { status: "SAMPLE_COLLECTED" },
  });
}

export interface IssueCertificatePayload {
  overall_result: "PASS" | "FAIL" | "CONDITIONAL";
  shelf_life_days?: number;
  testing_fee?: string;
  test_results: Record<string, { result: string; value?: string }>;
}

export function issueCertificate(requestId: number, payload: IssueCertificatePayload) {
  return apiFetch<Certificate>(`/labs/verification-requests/${requestId}/certificate/`, {
    method: "POST",
    body: payload,
  });
}

export function listCertificates() {
  return apiFetch<Paginated<Certificate>>("/labs/certificates/");
}

export function getCertificate(id: number) {
  return apiFetch<Certificate>(`/labs/certificates/${id}/`);
}

export function listInvoices() {
  return apiFetch<Paginated<Invoice>>("/labs/invoices/");
}

export function markInvoicePaid(id: number) {
  return apiFetch<Invoice>(`/labs/invoices/${id}/mark-paid/`, { method: "POST" });
}

export function fetchLabAnalytics() {
  return apiFetch<LabAnalytics>("/labs/analytics/");
}
