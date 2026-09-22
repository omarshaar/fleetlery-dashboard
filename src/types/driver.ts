export type DriverStatus = "new" | "documents_missing" | "under_review" | "ready_for_activation" | "active" | "suspended" | "rejected"
export type TransportType = "car" | "bicycle"

export type DriverCity = {
  id: string
  name: string
  is_active: boolean
  drivers_count?: number
}

export type Driver = {
  id: string
  full_name: string
  email: string | null
  phone: string
  whatsapp_url: string
  city: DriverCity
  transport_type: TransportType
  birth_date: string | null
  social_security_number: string | null
  identity_expires_at: string | null
  status: DriverStatus
  version: number
  is_archived: boolean
  archived_at: string | null
  created_at: string
  updated_at: string
}

export type DriverFormValues = {
  full_name: string
  email: string
  phone: string
  city_id: string
  transport_type: TransportType
  birth_date: string
  social_security_number: string
  identity_expires_at: string
}

export type DriverListParams = {
  page: number
  per_page: number
  search?: string
  status?: DriverStatus
  transport_type?: TransportType
  city_id?: string
}

export type PaginationMeta = {
  current_page: number
  per_page: number
  total: number
  last_page: number
}