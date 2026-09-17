import { apiFetch } from "./client";
import type { PublicBatchScan, PublicTrustBadge } from "./types";

export function fetchPublicBatchScan(publicId: string) {
  return apiFetch<PublicBatchScan>(`/public/scan/${publicId}/`, { auth: false });
}

export function fetchPublicTrustBadge(hotelSlug: string) {
  return apiFetch<PublicTrustBadge>(`/public/trust/${hotelSlug}/`, { auth: false });
}
