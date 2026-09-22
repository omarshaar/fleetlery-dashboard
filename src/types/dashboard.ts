export type CitySummary = { id: string; name: string; total: number }
export type CityOption = { id: string; name: string; is_active: boolean; drivers_count: number }

export type AdminDashboard = {
  drivers: {
    total: number
    active: number
    new: number
    under_review: number
    by_status: Record<string, number>
    by_city: CitySummary[]
  }
  documents: {
    missing: number
    needs_review: number
    rejected: number
  }
  finance: { open_settlements: number }
  privacy: {
    open_requests: number
    overdue_requests: number
    legal_holds: number
  }
  attention: {
    identity_expired: number
    identity_expiring_within_30_days: number
  }
  generated_at: string
}