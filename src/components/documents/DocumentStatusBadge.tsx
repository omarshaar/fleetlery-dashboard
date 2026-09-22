import { Badge } from "@/components"
import { useLanguage } from "@/i18n"
import type { DocumentStatus } from "@/types/document"

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const { t } = useLanguage()
  const variant = status === "accepted" ? "default" : status === "missing" || status === "rejected" ? "destructive" : status === "present" ? "secondary" : "outline"
  return <Badge variant={variant}>{t(`documents.status.${status}`)}</Badge>
}

