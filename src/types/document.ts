import type { PaginationMeta } from "@/types/driver"

export type DocumentStatus = "missing" | "present" | "needs_review" | "accepted" | "rejected"

export type DriverDocument = {
  id: string
  type: { id: string; slug: string; name: string; is_required: boolean; requires_expiry: boolean }
  part: string
  status: DocumentStatus
  expires_at: string | null
  version: number
  latest_file: {
    id: string | number
    original_name: string
    mime_type: string
    size_bytes: number
    checksum_sha256: string
    created_at: string
  } | null
  updated_at: string
}

export type DocumentQueueItem = {
  driver: { id: string; full_name: string; city: string }
  document: DriverDocument
}

export type DocumentQueueResponse = { data: DocumentQueueItem[]; meta: PaginationMeta }