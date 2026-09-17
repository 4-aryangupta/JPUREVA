import { apiFetch } from "./client";
import type { MeResponse } from "./types";

export interface LoginResponse {
  access: string;
  refresh: string;
}

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login/", { method: "POST", body: { email, password }, auth: false });
}

export function logout(refresh: string) {
  return apiFetch<void>("/auth/logout/", { method: "POST", body: { refresh } });
}

export function fetchMe() {
  return apiFetch<MeResponse>("/auth/me/");
}

export interface RegisterHotelPayload {
  email: string;
  password: string;
  phone?: string;
  business_name: string;
  fssai_license_number?: string;
  gstin?: string;
  address?: string;
  city?: string;
  cuisine_type?: string;
}

export function registerHotel(payload: RegisterHotelPayload) {
  return apiFetch("/auth/register/hotel/", { method: "POST", body: payload, auth: false });
}
