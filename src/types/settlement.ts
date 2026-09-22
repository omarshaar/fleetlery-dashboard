import type { PaginationMeta } from "@/types/driver"

export type SettlementStatus = "draft" | "approved" | "voided"
export type PaymentStatus = "unpaid" | "partially_paid" | "paid"
export type PaymentMethod = "bank_transfer" | "cash" | "other"

export type SettlementPayment = {
  id: string
  amount: string
  currency: string
  paid_at: string
  method: PaymentMethod
  reference: string | null
  notes: string | null
  reversal_of_id: string | null
  reversal_reason: string | null
  created_at: string
}

export type Settlement = {
  id: string
  driver: { id: string; full_name: string }
  period_start: string
  period_end: string
  order_count: number
  kilometers: string
  order_revenue: string
  kilometer_revenue: string
  bonuses: string
  gross_revenue: string
  driver_share: string
  company_share: string
  contract_cost: string
  deductions: string
  final_due: string
  currency: string
  status: SettlementStatus
  payment_status: PaymentStatus
  paid_amount: string
  remaining_amount: string
  notes: string | null
  version: number
  approved_at: string | null
  voided_at: string | null
  void_reason: string | null
  payments: SettlementPayment[]
  created_at: string
  updated_at: string
}

export type SettlementFormValues = {
  driver_id: string
  period_start: string
  period_end: string
  order_count: string
  kilometers: string
  order_revenue: string
  kilometer_revenue: string
  bonuses: string
  gross_revenue: string
  driver_share: string
  company_share: string
  contract_cost: string
  deductions: string
  final_due: string
  notes: string
}

export type SettlementListParams = {
  page: number
  per_page: number
  driver_id?: string
  status?: SettlementStatus
  payment_status?: PaymentStatus
  period_from?: string
  period_to?: string
}

export type SettlementListResponse = { data: Settlement[]; meta: PaginationMeta }
