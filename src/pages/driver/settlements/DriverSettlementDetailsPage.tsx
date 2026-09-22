import { useMemo } from "react"
import { DataTable, type ColumnConfig } from "@/eano/data-table-builder"
import type { DriverPayout } from "@/types/driverPortal"
import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle, Page, PageHeader, Skeleton, } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { useLanguage } from "@/i18n"
import { useGetOwnPayoutQuery } from "@/services/api/driverPortal/driverPortalApi"
const money=(value:string,currency:string)=>new Intl.NumberFormat(undefined,{style:"currency",currency}).format(Number(value))
export default function DriverSettlementDetailsPage(){const {settlementId=""}=useParams();const {t}=useLanguage();const query=useGetOwnPayoutQuery(settlementId);
  const columns = useMemo<ColumnConfig<DriverPayout["payments"][number]>[]>(() => [
    { key: "paid_at", label: t("settlements.paymentForm.date"), render: (_, payment) => (<div>{payment.paid_at}</div>) },
    { key: "amount", label: t("settlements.paymentForm.amount"), render: (_, payment) => (<div>{money(payment.amount,payment.currency)}</div>) },
    { key: "method", label: t("settlements.paymentForm.method"), render: (_, payment) => (<div>{t(`settlements.methods.${payment.method}`)}{payment.is_reversal?` · ${t("driverPortal.payouts.reversal")}`:""}</div>) },
  ], [t])
if(query.isLoading)return <Page><Skeleton className="h-72"/></Page>;const item=query.data;if(!item)return <Page><p className="rounded-md bg-destructive/10 p-4 text-destructive">{apiError(query.error,t("driverPortal.errors.payout")).message}</p></Page>;return <Page><PageHeader title={`${item.period_start} – ${item.period_end}`} subtitle={t("driverPortal.payouts.detailsSubtitle")}><Button asChild variant="outline"><Link to="/driver/settlements"><ArrowLeft />{t("settlements.actions.back")}</Link></Button></PageHeader><div className="mt-4 grid gap-3 md:grid-cols-3">{[["final_due",item.final_due],["paid",item.paid_amount],["remaining",item.remaining_amount]].map(([key,value])=><Card key={key}><CardContent className="pt-6"><p className="text-sm text-muted-foreground">{t(`settlements.summary.${key}`)}</p><p className="mt-1 text-2xl font-semibold">{money(value,item.currency)}</p></CardContent></Card>)}</div><Card className="mt-4"><CardHeader><CardTitle>{t("settlements.payments.title")}</CardTitle></CardHeader><CardContent className="p-0">{!item.payments.length?<p className="p-6 text-muted-foreground">{t("settlements.payments.empty")}</p>:<DataTable<DriverPayout["payments"][number]> tableId="fleetlery-driver-settlement-payments" data={item.payments} columns={columns} rowKey={(payment) => payment.id} preset="simple" emptyMessage={t("settlements.payments.empty")} className="rounded-none border-0 shadow-none" />}</CardContent></Card></Page>}
