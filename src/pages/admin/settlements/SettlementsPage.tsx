import { useMemo } from "react"
import { DataTable, type ColumnConfig } from "@/eano/data-table-builder"
import type { Settlement } from "@/types/settlement"
import { Eye, Plus, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button, Card, CardContent, Input, Page, PageHeader, Select, Skeleton, } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { useAuth } from "@/components/providers/authContext"
import { useLanguage } from "@/i18n"
import { useGetDriversQuery } from "@/services/api/drivers/driversApi"
import { useGetSettlementsQuery } from "@/services/api/settlements/settlementsApi"
import type { PaymentStatus, SettlementStatus } from "@/types/settlement"

const money = (value: string, currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(value))

export default function SettlementsPage() {
  const { t } = useLanguage()
  const { hasPermission } = useAuth()
  const [page, setPage] = useState(1)
  const [driverId, setDriverId] = useState("")
  const [status, setStatus] = useState<SettlementStatus | "">("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("")
  const [periodFrom, setPeriodFrom] = useState("")
  const [periodTo, setPeriodTo] = useState("")
  const drivers = useGetDriversQuery({ page: 1, per_page: 100 })
  const query = useGetSettlementsQuery({ page, per_page: 20, driver_id: driverId || undefined, status: status || undefined, payment_status: paymentStatus || undefined, period_from: periodFrom || undefined, period_to: periodTo || undefined })
  const clear = () => { setDriverId(""); setStatus(""); setPaymentStatus(""); setPeriodFrom(""); setPeriodTo(""); setPage(1) }
  const error = query.error ? apiError(query.error, t("settlements.errors.list")).message : ""


  const columns = useMemo<ColumnConfig<Settlement>[]>(() => [
    { key: "driver.full_name", label: t("settlements.fields.driver_id"), render: (_, item) => (<div className="font-medium">{item.driver.full_name}</div>) },
    { key: "period", label: t("settlements.fields.period"), render: (_, item) => (<div>{item.period_start} – {item.period_end}</div>) },
    { key: "final_due", label: t("settlements.fields.final_due"), render: (_, item) => (<div>{money(item.final_due, item.currency)}</div>) },
    { key: "status", label: t("settlements.fields.status"), render: (_, item) => (<div>{t(`settlements.status.${item.status}`)}</div>) },
    { key: "payment_status", label: t("settlements.fields.payment"), render: (_, item) => (<div>{t(`settlements.paymentStatus.${item.payment_status}`)}</div>) },
    { key: "actions", label: t("settlements.fields.actions"), render: (_, item) => (<div className="text-end"><Button asChild variant="ghost" size="sm"><Link to={`/admin/settlements/${item.id}`}><Eye />{t("settlements.actions.open")}</Link></Button></div>) },
  ], [t])
  return <Page>
    <PageHeader title={t("settlements.title")} subtitle={t("settlements.subtitle")}>
      {hasPermission("finance.manage") && <Button asChild size="sm"><Link to="/admin/settlements/new"><Plus />{t("settlements.actions.create")}</Link></Button>}
    </PageHeader>
    <Card className="mt-4"><CardContent className="grid grid-cols-1 gap-3 pt-6 md:grid-cols-2 xl:grid-cols-6">
      <Select placeholder={t("settlements.filters.allDrivers")} options={[{ label: t("settlements.filters.allDrivers"), value: "__all__" }, ...(drivers.data?.data ?? []).map((driver) => ({ label: driver.full_name, value: driver.id }))]} value={driverId || "__all__"} onChange={(value) => { setDriverId(value === "__all__" ? "" : value); setPage(1) }} />
      <Select placeholder={t("settlements.filters.allStatuses")} options={[{ label: t("settlements.filters.allStatuses"), value: "__all__" }, ...(["draft", "approved", "voided"] as SettlementStatus[]).map((value) => ({ label: t(`settlements.status.${value}`), value }))]} value={status || "__all__"} onChange={(value) => { setStatus(value === "__all__" ? "" : value as SettlementStatus); setPage(1) }} />
      <Select placeholder={t("settlements.filters.allPayments")} options={[{ label: t("settlements.filters.allPayments"), value: "__all__" }, ...(["unpaid", "partially_paid", "paid"] as PaymentStatus[]).map((value) => ({ label: t(`settlements.paymentStatus.${value}`), value }))]} value={paymentStatus || "__all__"} onChange={(value) => { setPaymentStatus(value === "__all__" ? "" : value as PaymentStatus); setPage(1) }} />
      <Input aria-label={t("settlements.filters.from")} type="date" value={periodFrom} onChange={(event) => { setPeriodFrom(event.target.value); setPage(1) }} />
      <Input aria-label={t("settlements.filters.to")} type="date" value={periodTo} onChange={(event) => { setPeriodTo(event.target.value); setPage(1) }} />
      <Button variant="outline" onClick={clear}><X />{t("settlements.actions.clear")}</Button>
    </CardContent></Card>
    {error ? <Card className="mt-4 border-destructive/50"><CardContent className="flex items-center justify-between pt-6"><p className="text-sm text-destructive">{error}</p><Button variant="outline" onClick={() => void query.refetch()}>{t("settlements.actions.retry")}</Button></CardContent></Card> :
      <Card className="mt-4 overflow-hidden"><CardContent className="p-0">{query.isLoading ? <div className="space-y-3 p-5">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-12 w-full" />)}</div> : query.data?.data.length === 0 ? <div className="p-10 text-center"><p className="font-medium">{t("settlements.empty")}</p></div> :
        <DataTable<Settlement> tableId="fleetlery-admin-settlements" data={query.data?.data ?? []} columns={columns} rowKey={(item) => item.id} preset="simple" emptyMessage={t("settlements.empty")} className="rounded-none border-0 shadow-none" />}
      </CardContent>{query.data && query.data.meta.last_page > 1 && <div className="flex items-center justify-between border-t p-4 text-sm"><span>{t("settlements.pagination.total", { count: query.data.meta.total })}</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>{t("settlements.pagination.previous")}</Button><span className="px-2 py-2">{page} / {query.data.meta.last_page}</span><Button variant="outline" size="sm" disabled={page >= query.data.meta.last_page} onClick={() => setPage((value) => value + 1)}>{t("settlements.pagination.next")}</Button></div></div>}</Card>}
  </Page>
}
