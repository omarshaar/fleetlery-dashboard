import { Check, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Badge, Button, Card, CardContent, Input, Page, PageHeader, Select, Skeleton } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { useAuth } from "@/components/providers/authContext"
import { useLanguage } from "@/i18n"
import { useGetCitiesQuery } from "@/services/api/dashboard/dashboardApi"
import { useDecideProfileChangeMutation, useGetAdminProfileChangesQuery } from "@/services/api/driverPortal/driverPortalApi"
import type { ProfileChange, ProfileChangeStatus } from "@/types/driverPortal"

const fieldLabels: Record<keyof ProfileChange["requested_changes"], string> = {
  full_name: "drivers.fields.fullName",
  email: "drivers.fields.email",
  phone: "drivers.fields.phone",
  city_id: "drivers.fields.city",
  transport_type: "drivers.fields.transport",
  birth_date: "drivers.fields.birthDate",
  social_security_number: "drivers.fields.socialSecurity",
  identity_expires_at: "drivers.fields.identityExpiry",
}

export default function ProfileChangeRequestsPage() {
  const { t } = useLanguage()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<ProfileChangeStatus | "">("pending")
  const query = useGetAdminProfileChangesQuery({ page, status: status || undefined })
  const cities = useGetCitiesQuery()

  return (
    <Page>
      <PageHeader title={t("driverPortal.adminRequests.title")} subtitle={t("driverPortal.adminRequests.subtitle")} />
      <div className="mt-4 max-w-xs">
        <Select
          options={[
            { label: t("driverPortal.adminRequests.all"), value: "all" },
            ...(["pending", "approved", "rejected"] as ProfileChangeStatus[]).map((value) => ({ label: t("driverPortal.requestStatus." + value), value })),
          ]}
          value={status || "all"}
          onChange={(value) => { setStatus(value === "all" ? "" : value as ProfileChangeStatus); setPage(1) }}
        />
      </div>
      {query.isLoading ? (
        <Skeleton className="mt-4 h-56" />
      ) : query.error ? (
        <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">{apiError(query.error, t("driverPortal.errors.adminRequests")).message}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {!query.data?.data.length ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">{t("driverPortal.adminRequests.empty")}</CardContent></Card>
          ) : query.data.data.map((item) => (
            <RequestCard key={item.id} item={item} cities={cities.data ?? []} citiesLoading={cities.isLoading} onConflict={() => void query.refetch()} />
          ))}
        </div>
      )}
      {query.data && query.data.meta.last_page > 1 && (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>{t("settlements.pagination.previous")}</Button>
          <Button variant="outline" disabled={page >= query.data.meta.last_page} onClick={() => setPage((value) => value + 1)}>{t("settlements.pagination.next")}</Button>
        </div>
      )}
    </Page>
  )
}

type RequestCardProps = {
  item: ProfileChange
  cities: { id: string; name: string }[]
  citiesLoading: boolean
  onConflict: () => void
}

function RequestCard({ item, cities, citiesLoading, onConflict }: RequestCardProps) {
  const { t, language } = useLanguage()
  const { hasPermission } = useAuth()
  const [reason, setReason] = useState("")
  const [message, setMessage] = useState("")
  const [decide, state] = useDecideProfileChangeMutation()
  const dateFormatter = new Intl.DateTimeFormat(language, { dateStyle: "medium", timeZone: "Europe/Berlin" })
  const changes = Object.entries(item.requested_changes)

  const displayValue = (key: string, value: string | null | undefined) => {
    if (!value) return t("driverPortal.adminRequests.notProvided")
    if (key === "transport_type") {
      return value === "car" || value === "bicycle" ? t("drivers.transport." + value) : t("driverPortal.adminRequests.unknownValue")
    }
    if (key === "city_id") {
      return cities.find((city) => city.id === value)?.name ?? t(citiesLoading ? "common.loading" : "driverPortal.adminRequests.cityUnavailable")
    }
    if (key === "birth_date" || key === "identity_expires_at") {
      const date = new Date(value + "T12:00:00Z")
      return Number.isNaN(date.getTime()) ? t("driverPortal.adminRequests.unknownValue") : new Intl.DateTimeFormat(language, { dateStyle: "medium", timeZone: "UTC" }).format(date)
    }
    return value
  }

  const submit = async (decision: "approve" | "reject") => {
    setMessage("")
    try {
      await decide({ id: item.id, version: item.version, decision, reason: reason || undefined }).unwrap()
    } catch (error) {
      setMessage(apiError(error, t("driverPortal.errors.decision")).message)
      if (typeof error === "object" && error && "status" in error && error.status === 409) onConflict()
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold">{item.driver?.full_name ?? t("driverPortal.adminRequests.driverUnavailable")}</p>
            <p className="text-sm text-muted-foreground">{item.driver?.city ? item.driver.city + " · " : ""}{dateFormatter.format(new Date(item.created_at))}</p>
          </div>
          <Badge variant="secondary">{t("driverPortal.requestStatus." + item.status)}</Badge>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">{t("driverPortal.adminRequests.requestedChanges")}</p>
          <dl className="grid gap-2 sm:grid-cols-2">
            {changes.map(([key, value]) => (
              <div key={key} className="min-w-0 rounded-md bg-muted/50 p-3">
                <dt className="text-xs text-muted-foreground">{t(fieldLabels[key as keyof typeof fieldLabels] ?? "driverPortal.adminRequests.otherField")}</dt>
                <dd className="mt-1 break-words text-sm font-medium" dir={key === "phone" || key === "email" ? "ltr" : undefined}>{displayValue(key, value)}</dd>
              </div>
            ))}
          </dl>
        </div>

        {item.driver_note && (
          <div className="rounded-md border p-3">
            <p className="text-xs font-medium text-muted-foreground">{t("driverPortal.adminRequests.driverNote")}</p>
            <p className="mt-1 break-words text-sm [overflow-wrap:anywhere]">{item.driver_note}</p>
          </div>
        )}
        {item.decision_reason && (
          <div className="rounded-md border p-3">
            <p className="text-xs font-medium text-muted-foreground">{t("driverPortal.adminRequests.decisionReason")}</p>
            <p className="mt-1 break-words text-sm">{item.decision_reason}</p>
          </div>
        )}
        {item.driver && <Button asChild variant="outline" size="sm"><Link to={"/admin/drivers/" + item.driver.id}>{t("driverPortal.adminRequests.openDriver")}</Link></Button>}
        {message && <p role="alert" className="text-sm text-destructive">{message}</p>}

        {item.status === "pending" && hasPermission("drivers.edit") && (
          <div className="flex flex-col gap-3 border-t pt-4 md:flex-row">
            <Input className="flex-1" label={t("driverPortal.adminRequests.reason")} value={reason} onChange={(event) => setReason(event.target.value)} />
            <Button disabled={state.isLoading} onClick={() => void submit("approve")}><Check />{t("driverPortal.adminRequests.approve")}</Button>
            <Button variant="destructive" disabled={state.isLoading || !reason.trim()} onClick={() => void submit("reject")}><X />{t("driverPortal.adminRequests.reject")}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
