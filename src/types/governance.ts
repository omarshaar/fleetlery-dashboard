import type { PaginationMeta } from "@/types/driver"

export type AdminUser = { id: string; name: string; email: string; is_active: boolean; roles: { name: string; slug: string }[]; last_login_at: string | null; disabled_at: string | null; driver_id: string | null }
export type RoleDefinition = { name: string; slug: string; permissions: { name: string; slug: string }[] }
export type ReadinessCheck = { name: string; passed: boolean; remediation: string | null }
export type ProductionReadiness = { ready: boolean; checks: ReadinessCheck[] }
export type PrivacyType = "access" | "correction" | "deletion" | "restriction"
export type PrivacyStatus = "open" | "under_review" | "approved" | "rejected" | "completed" | "cancelled"
export type PrivacySource = "email" | "phone" | "letter" | "in_person" | "other"
export type PrivacyRequest = { id: string; driver: { id: string; full_name: string; city: string }; type: PrivacyType; status: PrivacyStatus; received_at: string; due_at: string | null; source: PrivacySource; request_notes: string | null; legal_hold: boolean; legal_hold_reason: string | null; decision_reason: string | null; decided_at: string | null; completed_at: string | null; completion_reference: string | null; version: number; created_at: string }
export type PrivacyAssessment = { request_id: string; legal_hold: boolean; records: { documents: number; document_versions: number; settlements: number; payments: number }; automatic_deletion_available: boolean; requires_policy_review: boolean }
export type PageResponse<T> = { data: T[]; meta: PaginationMeta }