import type { Driver, DriverStatus, PaginationMeta } from "@/types/driver"
import type { DriverDocument } from "@/types/document"
import type { PaymentMethod, PaymentStatus } from "@/types/settlement"

export type DriverCityOption = { id: string; name: string }

export type DriverDashboard = {
  driver_status: DriverStatus
  documents: { total: number; missing: number; present: number; needs_review: number; accepted: number; rejected: number }
  requires_attention: boolean
  settlements: { total: number; open: number; total_final_due: string; remaining_amount: string; currency: string }
}
export type ProfileChangeStatus = "pending" | "approved" | "rejected"
export type ProfileChange = {
  id: string
  driver: { id: string; full_name: string; city: string } | null
  status: ProfileChangeStatus
  requested_changes: Partial<Record<"full_name" | "email" | "phone" | "city_id" | "transport_type" | "birth_date" | "social_security_number" | "identity_expires_at", string | null>>
  driver_note: string | null
  decision_reason: string | null
  base_driver_version: number
  version: number
  decided_at: string | null
  created_at: string
}
export type DriverPayout = {
  id: string
  period_start: string
  period_end: string
  final_due: string
  currency: string
  payment_status: PaymentStatus
  paid_amount: string
  remaining_amount: string
  approved_at: string | null
  payments: { id: string; amount: string; currency: string; paid_at: string; method: PaymentMethod; is_reversal: boolean }[]
}
export type DriverPayoutList = { data: DriverPayout[]; meta: PaginationMeta }
export type InvitationDetails = { valid: boolean; expires_at: string; cities: { id: string; name: string }[]; transport_types: string[] }
export type InvitationRegistration = {
  full_name: string; email: string; phone: string; password: string; password_confirmation: string
  city_id: string; transport_type: string; birth_date: string | null; social_security_number: string | null; identity_expires_at: string | null
}
export type DriverPortalDocument = DriverDocument & { rejection_reason: string | null }
export type DriverProfile = Driver

export type DriverInvitation = {
  id: string; label: string | null; admin_notes: string | null; status: "pending" | "consumed" | "revoked" | "expired"
  expires_at: string; consumed_at: string | null; revoked_at: string | null; revoke_reason: string | null; version: number; created_at: string
  created_by: { id: string; name: string } | null; consumed_by: { id: string; name: string; email: string } | null; invitation_url?: string
}