import { Badge } from "@/components"
import { useLanguage } from "@/i18n"
import type { DriverStatus } from "@/types/driver"

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  const { t } = useLanguage()
  const variant = status === "active"
    ? "default"
    : status === "rejected" || status === "suspended" || status === "documents_missing"
      ? "destructive"
      : status === "new"
        ? "secondary"
        : "outline"

  return <Badge variant={variant}>{t(`drivers.status.${status}`)}</Badge>
}