import { useMemo } from "react"
import { DataTable, type ColumnConfig } from "@/eano/data-table-builder"
import type { SettlementPayment } from "@/types/settlement"
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Page, PageHeader, Select, Skeleton, Textarea } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { useAuth } from "@/components/providers/authContext"
import { SettlementForm } from "@/components/settlements/SettlementForm"
import { useLanguage } from "@/i18n"
import { useGetDriversQuery } from "@/services/api/drivers/driversApi"
import { useApproveSettlementMutation, useGetSettlementQuery, useRecordPaymentMutation, useReversePaymentMutation, useUpdateSettlementMutation, useVoidSettlementMutation } from "@/services/api/settlements/settlementsApi"
import type { PaymentMethod, SettlementFormValues } from "@/types/settlement"

const money = (value: string, currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(value))

export default function SettlementDetailsPage() {
  const { settlementId = "" } = useParams()
  const { t } = useLanguage()
  const { hasPermission } = useAuth()
  const query = useGetSettlementQuery(settlementId)
  const drivers = useGetDriversQuery({ page: 1, per_page: 100 })
  const [update, updateState] = useUpdateSettlementMutation()
  const [approve, approveState] = useApproveSettlementMutation()
  const [voidSettlement, voidState] = useVoidSettlementMutation()
  const [recordPayment, paymentState] = useRecordPaymentMutation()
  const [reversePayment, reverseState] = useReversePaymentMutation()
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState("")
  const [fields, setFields] = useState<Record<string, string[]>>({})
  const [voidReason, setVoidReason] = useState("")
  const [payment, setPayment] = useState({ amount: "", paid_at: new Date().toISOString().slice(0, 10), method: "bank_transfer" as PaymentMethod, reference: "", notes: "" })
  const [reverse, setReverse] = useState<{ id: string; reason: string } | null>(null)


  const columns = useMemo<ColumnConfig<SettlementPayment>[]>(() => {
    const reversedPaymentIds = new Set(query.data?.payments.map(entry => entry.reversal_of_id).filter(Boolean))
    return [
    { key: "paid_at", label: t("settlements.paymentForm.date"), render: (_, entry) => (<div>{entry.paid_at}</div>) },
    { key: "amount", label: t("settlements.paymentForm.amount"), render: (_, entry) => (<div>{money(entry.amount, entry.currency)}</div>) },
    { key: "method", label: t("settlements.paymentForm.method"), render: (_, entry) => (<div>{t(`settlements.methods.${entry.method}`)}</div>) },
    { key: "reference", label: t("settlements.paymentForm.reference"), render: (_, entry) => (<div>{entry.reference || "—"}</div>) },
    { key: "actions", label: t("settlements.fields.actions"), render: (_, entry) => (<div className="text-end">{hasPermission("payments.record") && !entry.reversal_of_id && !reversedPaymentIds.has(entry.id) && Number(entry.amount) > 0 && <Button variant="ghost" size="sm" onClick={() => setReverse({ id: entry.id, reason: "" })}><RotateCcw />{t("settlements.actions.reverse")}</Button>}</div>) },
  ]
  }, [t, hasPermission, query.data])
  if (query.isLoading) return <Page><div className="space-y-4"><Skeleton className="h-12 w-72" /><Skeleton className="h-80 w-full" /></div></Page>
  const item = query.data
  if (!item) return <Page><p className="rounded-md bg-destructive/10 p-4 text-destructive">{apiError(query.error, t("settlements.errors.details")).message}</p></Page>
  const fail = (error: unknown, fallback: string) => { const parsed = apiError(error, fallback); setMessage(parsed.message); setFields(parsed.fields); if (typeof error === "object" && error && "status" in error && error.status === 409) void query.refetch() }
  const clearMessages = () => { setMessage(""); setSuccess(""); setFields({}) }
  const values: SettlementFormValues = { driver_id: item.driver.id, period_start: item.period_start, period_end: item.period_end, order_count: String(item.order_count), kilometers: item.kilometers, order_revenue: item.order_revenue, kilometer_revenue: item.kilometer_revenue, bonuses: item.bonuses, gross_revenue: item.gross_revenue, driver_share: item.driver_share, company_share: item.company_share, contract_cost: item.contract_cost, deductions: item.deductions, final_due: item.final_due, notes: item.notes ?? "" }
  const save = async (form: SettlementFormValues) => { clearMessages(); const { driver_id, ...editable } = form; void driver_id; try { await update({ ...editable, id: item.id, version: item.version, order_count: Number(form.order_count), notes: form.notes || null }).unwrap(); setSuccess(t("settlements.messages.saved")) } catch (error) { fail(error, t("settlements.errors.update")) } }
  const approveItem = async () => { clearMessages(); try { await approve({ id: item.id, version: item.version }).unwrap(); setSuccess(t("settlements.messages.approved")) } catch (error) { fail(error, t("settlements.errors.approve")) } }
  const voidItem = async (event: FormEvent) => { event.preventDefault(); clearMessages(); try { await voidSettlement({ id: item.id, version: item.version, reason: voidReason }).unwrap(); setSuccess(t("settlements.messages.voided")); setVoidReason("") } catch (error) { fail(error, t("settlements.errors.void")) } }
  const pay = async (event: FormEvent) => { event.preventDefault(); clearMessages(); try { await recordPayment({ id: item.id, version: item.version, amount: payment.amount, paid_at: payment.paid_at, method: payment.method, reference: payment.reference || null, notes: payment.notes || null }).unwrap(); setPayment((current) => ({ ...current, amount: "", reference: "", notes: "" })); setSuccess(t("settlements.messages.paid")) } catch (error) { fail(error, t("settlements.errors.payment")) } }
  const reverseEntry = async (event: FormEvent) => { event.preventDefault(); if (!reverse) return; clearMessages(); try { await reversePayment({ id: item.id, paymentId: reverse.id, version: item.version, reason: reverse.reason }).unwrap(); setReverse(null); setSuccess(t("settlements.messages.reversed")) } catch (error) { fail(error, t("settlements.errors.reverse")) } }


  return <Page>
    <PageHeader title={`${item.driver.full_name} · ${item.period_start} – ${item.period_end}`} subtitle={t("settlements.details.subtitle")}><Button asChild variant="outline" size="sm"><Link to="/admin/settlements"><ArrowLeft />{t("settlements.actions.back")}</Link></Button></PageHeader>
    {message && <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}{success && <p role="status" className="mt-4 rounded-md bg-primary/10 p-3 text-sm text-primary">{success}</p>}
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">{[["status", t(`settlements.status.${item.status}`)], ["payment", t(`settlements.paymentStatus.${item.payment_status}`)], ["final_due", money(item.final_due, item.currency)], ["paid", money(item.paid_amount, item.currency)], ["remaining", money(item.remaining_amount, item.currency)]].map(([key, value]) => <Card key={key}><CardContent className="pt-6"><p className="text-sm text-muted-foreground">{t(`settlements.summary.${key}`)}</p><p className="mt-1 text-xl font-semibold">{value}</p></CardContent></Card>)}</div>
    {item.status === "draft" && hasPermission("finance.manage") && <div className="mt-4"><SettlementForm key={item.version} values={values} drivers={drivers.data?.data ?? []} errors={fields} saving={updateState.isLoading} lockDriver onSubmit={(form) => void save(form)} /><Card className="mt-4"><CardHeader><CardTitle>{t("settlements.actions.approve")}</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">{t("settlements.details.approveHint")}</p><Button disabled={approveState.isLoading} onClick={() => void approveItem()}><Check />{t("settlements.actions.approve")}</Button></CardContent></Card></div>}
    {item.status === "approved" && hasPermission("payments.record") && item.payment_status !== "paid" && <Card className="mt-4"><CardHeader><CardTitle>{t("settlements.paymentForm.title")}</CardTitle></CardHeader><CardContent><form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" onSubmit={pay}><div className="space-y-2"><Label>{t("settlements.paymentForm.amount")}</Label><Input type="number" min="0.01" step="0.01" max={item.remaining_amount} required value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} /></div><div className="space-y-2"><Label>{t("settlements.paymentForm.date")}</Label><Input type="date" required value={payment.paid_at} onChange={(event) => setPayment({ ...payment, paid_at: event.target.value })} /></div><div className="space-y-2"><Label>{t("settlements.paymentForm.method")}</Label><Select options={(["bank_transfer", "cash", "other"] as PaymentMethod[]).map((value) => ({ label: t(`settlements.methods.${value}`), value }))} value={payment.method} onChange={(value) => setPayment({ ...payment, method: value as PaymentMethod })} /></div><div className="space-y-2"><Label>{t("settlements.paymentForm.reference")}</Label><Input value={payment.reference} onChange={(event) => setPayment({ ...payment, reference: event.target.value })} /></div><div className="space-y-2 md:col-span-2"><Label>{t("settlements.fields.notes")}</Label><Input value={payment.notes} onChange={(event) => setPayment({ ...payment, notes: event.target.value })} /></div><div><Button disabled={paymentState.isLoading} type="submit">{t("settlements.actions.recordPayment")}</Button></div></form></CardContent></Card>}
    <Card className="mt-4"><CardHeader><CardTitle>{t("settlements.payments.title")}</CardTitle></CardHeader><CardContent className="p-0">{item.payments.length === 0 ? <p className="p-6 text-sm text-muted-foreground">{t("settlements.payments.empty")}</p> : <DataTable<SettlementPayment> tableId="fleetlery-admin-settlement-payments" data={item.payments} columns={columns} rowKey={(entry) => entry.id} preset="simple" emptyMessage={t("settlements.payments.empty")} className="rounded-none border-0 shadow-none" />}</CardContent></Card>
    {reverse && <Card className="mt-4"><CardHeader><CardTitle>{t("settlements.reverse.title")}</CardTitle></CardHeader><CardContent><form className="flex flex-col gap-3 md:flex-row" onSubmit={reverseEntry}><Textarea required value={reverse.reason} placeholder={t("settlements.reverse.reason")} onChange={(event) => setReverse({ ...reverse, reason: event.target.value })} /><Button disabled={reverseState.isLoading} type="submit"><RotateCcw />{t("settlements.actions.confirmReverse")}</Button><Button type="button" variant="outline" onClick={() => setReverse(null)}><X />{t("settlements.actions.cancel")}</Button></form></CardContent></Card>}
    {item.status !== "voided" && hasPermission("finance.manage") && Number(item.paid_amount) === 0 && <Card className="mt-4"><CardHeader><CardTitle>{t("settlements.void.title")}</CardTitle></CardHeader><CardContent><form className="flex flex-col gap-3 md:flex-row" onSubmit={voidItem}><Textarea required value={voidReason} placeholder={t("settlements.void.reason")} onChange={(event) => setVoidReason(event.target.value)} /><Button variant="destructive" disabled={voidState.isLoading} type="submit"><X />{t("settlements.actions.void")}</Button></form></CardContent></Card>}
  </Page>
}
