import { useMemo } from "react"
import { DataTable, type ColumnConfig } from "@/eano/data-table-builder"
import type { Driver } from "@/types/driver"
import { useState, type FormEvent } from "react"
import { Plus, Search, X } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Button, Card, CardContent, Input, Page, PageHeader, Select, Skeleton,
  } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { DriverStatusBadge } from "@/components/drivers/DriverStatusBadge"
import { useAuth } from "@/components/providers/authContext"
import { useLanguage } from "@/i18n"
import { useGetCitiesQuery } from "@/services/api/dashboard/dashboardApi"
import { useGetDriversQuery } from "@/services/api/drivers/driversApi"
import type { DriverStatus, TransportType } from "@/types/driver"

export default function DriversPage() {
  const { t } = useLanguage()
  const { hasPermission } = useAuth()
  const [page, setPage] = useState(1)
  const [searchDraft, setSearchDraft] = useState("")
  const [search, setSearch] = useState("")
  const [cityId, setCityId] = useState("")
  const [status, setStatus] = useState<DriverStatus | "">("")
  const [transport, setTransport] = useState<TransportType | "">("")
  const cities = useGetCitiesQuery()
  const drivers = useGetDriversQuery({
    page, per_page: 20,
    search: search || undefined,
    city_id: cityId || undefined,
    status: status || undefined,
    transport_type: transport || undefined,
  })

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    setPage(1)
    setSearch(searchDraft.trim())
  }
  const clearFilters = () => {
    setSearchDraft(""); setSearch(""); setCityId(""); setStatus(""); setTransport(""); setPage(1)
  }
  const hasFilters = Boolean(search || cityId || status || transport)
  const error = drivers.error ? apiError(drivers.error, t("drivers.errors.list")).message : ""


  const columns = useMemo<ColumnConfig<Driver>[]>(() => [
    { key: "full_name", label: t("drivers.fields.fullName"), render: (_, driver) => (<div><Link data-driver-link to={`/admin/drivers/${driver.id}`} className="font-medium rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{driver.full_name}</Link><div className="text-xs text-muted-foreground">{driver.email || "—"}</div></div>) },
    { key: "city.name", label: t("drivers.fields.city"), render: (_, driver) => (<div>{driver.city.name}</div>) },
    { key: "status", label: t("drivers.fields.status"), render: (_, driver) => (<div><DriverStatusBadge status={driver.status} /></div>) },
    { key: "transport_type", label: t("drivers.fields.transport"), render: (_, driver) => (<div>{t(`drivers.transport.${driver.transport_type}`)}</div>) },
    { key: "phone", label: t("drivers.fields.phone"), render: (_, driver) => (<div dir="ltr">{driver.phone}</div>) },
  ], [t])
  return (
    <Page>
      <PageHeader title={t("drivers.title")} subtitle={t("drivers.subtitle")}>
        {hasPermission("drivers.create") && (
          <Button asChild size="sm"><Link to="/admin/drivers/new"><Plus />{t("drivers.actions.add")}</Link></Button>
        )}
      </PageHeader>

      <Card className="mt-4">
        <CardContent className="pt-6">
          <form className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(220px,2fr)_repeat(3,minmax(150px,1fr))_auto]" onSubmit={submitSearch}>
            <Input aria-label={t("drivers.filters.search")} placeholder={t("drivers.filters.search")} value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} />
            <Select
              placeholder={t("drivers.filters.allCities")}
              options={[{ label: t("drivers.filters.allCities"), value: "__all__" }, ...(cities.data ?? []).map((city) => ({ label: city.name, value: city.id }))]}
              value={cityId || "__all__"}
              onChange={(value) => { setCityId(value === "__all__" ? "" : value); setPage(1) }}
            />
            <Select
              placeholder={t("drivers.filters.allStatuses")}
              options={[
                { label: t("drivers.filters.allStatuses"), value: "__all__" },
                ...(["new", "documents_missing", "under_review", "active", "rejected"] as DriverStatus[]).map((value) => ({ label: t("drivers.status." + value), value })),
              ]}
              value={status || "__all__"}
              onChange={(value) => { setStatus(value === "__all__" ? "" : value as DriverStatus); setPage(1) }}
            />
            <Select
              placeholder={t("drivers.filters.allTransport")}
              options={[
                { label: t("drivers.filters.allTransport"), value: "__all__" },
                { label: t("drivers.transport.car"), value: "car" },
                { label: t("drivers.transport.bicycle"), value: "bicycle" },
              ]}
              value={transport || "__all__"}
              onChange={(value) => { setTransport(value === "__all__" ? "" : value as TransportType); setPage(1) }}
            />
            <div className="flex gap-2">
              <Button type="submit" variant="outline"><Search />{t("drivers.actions.search")}</Button>
              {hasFilters && <Button type="button" variant="ghost" size="icon" title={t("drivers.actions.clear")} onClick={clearFilters}><X /></Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      {error ? (
        <Card className="mt-4 border-destructive/50"><CardContent className="flex items-center justify-between pt-6"><p role="alert" className="text-sm text-destructive">{error}</p><Button variant="outline" onClick={() => void drivers.refetch()}>{t("drivers.actions.retry")}</Button></CardContent></Card>
      ) : (
        <Card className="mt-4 overflow-hidden">
          <CardContent className="p-0">
            {drivers.isLoading ? (
              <div className="space-y-3 p-5">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-12 w-full" />)}</div>
            ) : drivers.data?.data.length === 0 ? (
              <div className="p-10 text-center"><p className="font-medium">{t("drivers.empty.title")}</p><p className="mt-1 text-sm text-muted-foreground">{t("drivers.empty.description")}</p></div>
            ) : (
              <div
                className="[&_tbody_tr:has(a[data-driver-link])]:cursor-pointer [&_tbody_tr:focus-within]:bg-muted/50"
                onClick={(event) => {
                  if (!(event.target instanceof Element)) return
                  // Native links and controls keep their own pointer/keyboard behavior.
                  if (event.target.closest('a, button, input, select, textarea, [role="button"]')) return
                  if (window.getSelection()?.toString()) return
                  const row = event.target.closest("tr")
                  const link = row?.querySelector<HTMLAnchorElement>("a[data-driver-link]")
                  if (!link || !event.currentTarget.contains(link)) return
                  if (event.ctrlKey || event.metaKey || event.shiftKey) {
                    window.open(link.href, "_blank", "noopener,noreferrer")
                  } else {
                    link.click()
                  }
                }}
              >
              <DataTable<Driver> tableId="fleetlery-admin-drivers" data={drivers.data?.data ?? []} columns={columns} rowKey={(driver) => driver.id} preset="simple" emptyMessage={t("drivers.empty.title")} className="rounded-none border-0 shadow-none" />
              </div>
            )}
          </CardContent>
          {drivers.data && drivers.data.meta.last_page > 1 && (
            <div className="flex items-center justify-between border-t p-4 text-sm">
              <span className="text-muted-foreground">{t("drivers.pagination.total", { count: drivers.data.meta.total })}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>{t("drivers.pagination.previous")}</Button>
                <span className="flex items-center px-2">{page} / {drivers.data.meta.last_page}</span>
                <Button variant="outline" size="sm" disabled={page >= drivers.data.meta.last_page} onClick={() => setPage((value) => value + 1)}>{t("drivers.pagination.next")}</Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </Page>
  )
}