export type Role = "HOTEL" | "LAB" | "SUPPLIER" | "ADMIN";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface JwtClaims {
  user_id: number;
  role: Role;
  approval_status: ApprovalStatus;
  email: string;
  exp: number;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Ingredient {
  id: number;
  name: string;
  category: number;
  category_name: string;
  unit_default: string;
  expected_min_harvest_days: number | null;
  expected_max_harvest_days: number | null;
  image: string | null;
}

export interface GeoTaggedPhoto {
  id: number;
  batch: string;
  image: string;
  latitude: number | null;
  longitude: number | null;
  captured_at: string | null;
  exif_locked: boolean;
  created_at: string;
}

export type BatchStatus =
  | "DRAFT"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "REJECTED"
  | "LISTED"
  | "SOLD_OUT"
  | "EXPIRED";

export interface Batch {
  id: string;
  public_id: string;
  supplier: number;
  supplier_name: string;
  ingredient: number;
  ingredient_name: string;
  quantity: string;
  unit: string;
  sowing_date: string | null;
  harvest_date: string;
  actual_harvest_days: number | null;
  is_growth_anomaly: boolean;
  status: BatchStatus;
  price_per_unit: string | null;
  available_quantity: string | null;
  qr_image: string | null;
  photos: GeoTaggedPhoto[];
  created_at: string;
}

export interface TestType {
  id: number;
  name: string;
  description: string;
}

export interface VerificationRequest {
  id: number;
  batch: string;
  batch_public_id: string;
  ingredient_name: string;
  supplier_name: string;
  requested_by: number;
  lab: number | null;
  requested_tests: { id: number; name: string; description: string }[];
  status: string;
  notes: string;
  created_at: string;
}

export interface Certificate {
  id: number;
  verification_request: number;
  batch: string;
  batch_public_id: string;
  ingredient_name: string;
  lab: number;
  certificate_number: string;
  test_results: Record<string, { result: string; value?: string }>;
  overall_result: "PASS" | "FAIL" | "CONDITIONAL";
  shelf_life_days: number | null;
  integrity_hash: string;
  signed_stamp: string;
  pdf_file: string | null;
  issued_at: string;
  is_valid: boolean;
}

export interface Invoice {
  id: number;
  verification_request: number;
  lab: number;
  supplier: number;
  amount: string;
  status: "PENDING" | "PAID";
  issued_at: string;
  paid_at: string | null;
}

export interface CartItem {
  id: number;
  batch: string;
  ingredient_name: string;
  supplier_name: string;
  quantity: string;
  unit_price: string;
  created_at: string;
}

export interface Cart {
  id: number;
  hotel: number;
  items: CartItem[];
  created_at: string;
}

export interface OrderItem {
  id: number;
  batch: string;
  batch_public_id: string;
  ingredient_name: string;
  supplier_name: string;
  quantity: string;
  unit_price: string;
  subtotal: string;
  fulfillment_status: "PENDING" | "FULFILLED";
}

export interface SupplierOrderItem extends OrderItem {
  order_id: number;
  hotel_name: string;
  delivery_date: string;
}

export interface OrderStatusEvent {
  id: number;
  status: string;
  note: string;
  created_at: string;
}

export interface Order {
  id: number;
  hotel: number;
  status: string;
  delivery_date: string;
  delivery_slot: string;
  delivery_address: string;
  total_amount: string;
  payment_status: string;
  placed_at: string;
  items: OrderItem[];
  status_events: OrderStatusEvent[];
}

export interface Notification {
  id: number;
  notif_type: string;
  title: string;
  body: string;
  link_url: string;
  related_object_type: string;
  related_object_id: string;
  is_read: boolean;
  created_at: string;
}

export interface LedgerEntry {
  id: number;
  supplier: number;
  order_item: number | null;
  entry_type: "CREDIT" | "DEBIT";
  amount: string;
  status: "PENDING" | "PAID";
  note: string;
  created_at: string;
}

export interface ColdChainLog {
  id: number;
  batch: string;
  stage: "WAREHOUSE" | "TRANSIT" | "DELIVERY";
  location_name: string;
  temperature_c: number;
  humidity_pct: number | null;
  recorded_at: string;
  is_within_threshold: boolean;
  notes: string;
  created_at: string;
}

export interface ComplianceDocument {
  id: number;
  hotel: number;
  doc_type: "FSSAI_LICENSE" | "AUDIT_REPORT" | "OTHER";
  file: string;
  issued_date: string | null;
  expiry_date: string | null;
  status: "VALID" | "EXPIRING_SOON" | "EXPIRED";
  created_at: string;
}

export interface SubscriptionPlan {
  id: number;
  name: "BASIC" | "PROFESSIONAL" | "ENTERPRISE";
  price_monthly: string;
  price_annual: string;
  features: Record<string, unknown>;
}

export interface HotelSubscription {
  id: number;
  hotel: number;
  plan: number;
  plan_detail: SubscriptionPlan;
  status: string;
  started_at: string;
  expires_at: string | null;
  auto_renew: boolean;
}

export interface TrustBadge {
  id: number;
  hotel: number;
  public_slug: string;
  qr_image: string | null;
  is_active: boolean;
  regenerated_at: string | null;
  created_at: string;
}

export interface MeResponse {
  id: number;
  email: string;
  phone: string;
  role: Role;
  approval_status: ApprovalStatus;
  profile: Record<string, unknown> | null;
}

export interface PublicBatchScan {
  public_id: string;
  ingredient_name: string;
  category_name: string;
  quantity: string;
  unit: string;
  sowing_date: string | null;
  harvest_date: string;
  is_growth_anomaly: boolean;
  fpo_name: string;
  fpo_region: string;
  status: string;
  photos: { image: string | null; latitude: number | null; longitude: number | null; captured_at: string | null; exif_locked: boolean }[];
  coldchain_logs: { stage: string; location_name: string; temperature_c: number; humidity_pct: number | null; recorded_at: string; is_within_threshold: boolean }[];
  certificate: {
    certificate_number: string;
    overall_result: string;
    nabl_accreditation_number: string;
    lab_name: string;
    issued_at: string;
    shelf_life_days: number;
    test_results: Record<string, { result: string; value?: string }>;
    integrity_hash: string;
    signed_stamp: string;
  } | null;
}

export interface PublicTrustBadge {
  business_name: string;
  city: string;
  is_active: boolean;
}

export interface AdminAnalyticsOverview {
  suppliers_total: number;
  labs_total: number;
  hotels_total: number;
  pending_approvals: number;
  batches_total: number;
  batches_listed: number;
  verification_requests_pending: number;
  certificates_issued: number;
  orders_total: number;
  ledger_pending_amount: string;
}

export interface LabAnalytics {
  tests_completed: number;
  pass_count: number;
  fail_count: number;
  pass_rate: number | null;
  avg_turnaround_hours: number | null;
}

export interface PendingUser {
  id: number;
  email: string;
  role: Role;
  approval_status: ApprovalStatus;
  date_joined: string;
}

export interface AuditLogEntry {
  id: number;
  actor: number | null;
  actor_email: string | null;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}
