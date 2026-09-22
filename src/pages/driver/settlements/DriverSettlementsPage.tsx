import { useMemo } from "react"
import { DataTable, type ColumnConfig } from "@/eano/data-table-builder"
import type { DriverPayout } from "@/types/driverPortal"
import { Eye, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button, Card, CardContent, Input, Page, PageHeader, Select, Skeleton, } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { useLanguage } from "@/i18n"
import { useGetOwnPayoutsQuery } from "@/services/api/driverPortal/driverPortalApi"
import type { PaymentStatus } from "@/types/settlement"
const money = (value:string,currency:string) => new Intl.NumberFormat(undefined,{style:"currency",currency}).format(Number(value))
export default function DriverSettlementsPage() {
 const {t}=useLanguage(); const [page,setPage]=useState(1); const [status,setStatus]=useState<PaymentStatus|"">(""); const [from,setFrom]=useState(""); const [to,setTo]=useState(""); const query=useGetOwnPayoutsQuery({page,payment_status:status||undefined,period_from:from||undefined,period_to:to||undefined}); const clear=()=>{setStatus("");setFrom("");setTo("");setPage(1)}

  const columns = useMemo<ColumnConfig<DriverPayout>[]>(() => [
    { key: "period", label: t("settlements.fields.period"), render: (_, item) => (<div>{item.period_start} – {item.period_end}</div>) },
    { key: "final_due", label: t("settlements.summary.final_due"), render: (_, item) => (<div>{money(item.final_due,item.currency)}</div>) },
    { key: "paid_amount", label: t("settlements.summary.paid"), render: (_, item) => (<div>{money(item.paid_amount,item.currency)}</div>) },
    { key: "remaining_amount", label: t("settlements.summary.remaining"), render: (_, item) => (<div>{money(item.remaining_amount,item.currency)}</div>) },
    { key: "payment_status", label: t("settlements.fields.status"), render: (_, item) => (<div>{t(`settlements.paymentStatus.${item.payment_status}`)}</div>) },
    { key: "actions", label: t("settlements.fields.actions"), render: (_, item) => (<div className="text-end"><Button asChild size="sm" variant="ghost"><Link to={`/driver/settlements/${item.id}`}><Eye />{t("settlements.actions.open")}</Link></Button></div>) },
  ], [t])
 return <Page><PageHeader title={t("driverPortal.payouts.title")} subtitle={t("driverPortal.payouts.subtitle")} />
 <Card className="mt-4"><CardContent className="grid gap-3 pt-6 md:grid-cols-4"><Select options={[{label:t("driverPortal.payouts.allStatuses"),value:"all"},...(["unpaid","partially_paid","paid"] as PaymentStatus[]).map(value=>({label:t(`settlements.paymentStatus.${value}`),value}))]} value={status||"all"} onChange={value=>{setStatus(value==="all"?"":value as PaymentStatus);setPage(1)}} /><Input type="date" aria-label={t("driverPortal.payouts.from")} value={from} onChange={e=>{setFrom(e.target.value);setPage(1)}}/><Input type="date" aria-label={t("driverPortal.payouts.to")} value={to} onChange={e=>{setTo(e.target.value);setPage(1)}}/><Button variant="outline" onClick={clear}><X />{t("settlements.actions.clear")}</Button></CardContent></Card>
 {query.isLoading?<div className="mt-4 space-y-3">{[1,2,3].map(i=><Skeleton key={i} className="h-14"/>)}</div>:query.error?<p className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">{apiError(query.error,t("driverPortal.errors.payouts")).message}</p>:<Card className="mt-4 overflow-hidden"><CardContent className="p-0">{!query.data?.data.length?<p className="p-10 text-center text-muted-foreground">{t("driverPortal.payouts.empty")}</p>:<DataTable<DriverPayout> tableId="fleetlery-driver-settlements" data={query.data?.data ?? []} columns={columns} rowKey={(item) => item.id} preset="simple" emptyMessage={t("driverPortal.payouts.empty")} className="rounded-none border-0 shadow-none" />}</CardContent>{query.data&&query.data.meta.last_page>1&&<div className="flex justify-end gap-2 border-t p-4"><Button size="sm" variant="outline" disabled={page<=1} onClick={()=>setPage(v=>v-1)}>{t("settlements.pagination.previous")}</Button><Button size="sm" variant="outline" disabled={page>=query.data.meta.last_page} onClick={()=>setPage(v=>v+1)}>{t("settlements.pagination.next")}</Button></div>}</Card>}
 </Page>
}
