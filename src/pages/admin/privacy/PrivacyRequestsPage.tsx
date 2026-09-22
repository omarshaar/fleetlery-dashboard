import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, DataTable, Input, Page, PageHeader, Select, Skeleton, Textarea } from "@/components"
import type { ColumnConfig } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { DynamicForm } from "@/eano/form-builder/DynamicForm"
import type { FormConfig, FormField } from "@/eano/form-builder/types/form.types"
import { removeForm } from "@/eano/form-builder/core/formSlice"
import { useDispatch } from "react-redux"
import { useLanguage } from "@/i18n"
import { useGetDriversQuery } from "@/services/api/drivers/driversApi"
import { useCompletePrivacyRequestMutation, useCreatePrivacyRequestMutation, useGetPrivacyAssessmentQuery, useGetPrivacyRequestQuery, useGetPrivacyRequestsQuery, useSetPrivacyLegalHoldMutation, useTransitionPrivacyRequestMutation } from "@/services/api/governance/governanceApi"
import type { PrivacyRequest, PrivacySource, PrivacyStatus, PrivacyType } from "@/types/governance"

const privacyTypes: PrivacyType[] = ["access", "correction", "deletion", "restriction"]
const statuses: PrivacyStatus[] = ["open", "under_review", "approved", "rejected", "completed", "cancelled"]
const sources: PrivacySource[] = ["email", "phone", "letter", "in_person", "other"]
const nextStatuses = (status: PrivacyStatus): PrivacyStatus[] => status === "open" ? ["under_review", "cancelled"] : status === "under_review" ? ["approved", "rejected", "cancelled"] : []

export default function PrivacyRequestsPage() {
  const { t } = useLanguage()
  const dispatch = useDispatch()
  useEffect(() => () => { dispatch(removeForm({ formId: "fleetlery-privacy-create" })) }, [dispatch])
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<{ type?: PrivacyType; status?: PrivacyStatus; overdue?: boolean }>({})
  const [driverSearchDraft, setDriverSearchDraft] = useState("")
  const [driverSearch, setDriverSearch] = useState("")
  const [selectedId, setSelectedId] = useState("")
  const [target, setTarget] = useState<PrivacyStatus | "">("")
  const [reason, setReason] = useState("")
  const [holdReason, setHoldReason] = useState("")
  const [reference, setReference] = useState("")
  const [completionNotes, setCompletionNotes] = useState("")
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState("")
  const drivers = useGetDriversQuery({ page: 1, per_page: 100, search: driverSearch || undefined })
  const requests = useGetPrivacyRequestsQuery({ page, ...filters })
  const detail = useGetPrivacyRequestQuery(selectedId, { skip: !selectedId })
  const selected = detail.data
  const assessment = useGetPrivacyAssessmentQuery(selectedId, { skip: !selectedId })
  const [createRequest, createState] = useCreatePrivacyRequestMutation()
  const [transition, transitionState] = useTransitionPrivacyRequestMutation()
  const [setLegalHold, holdState] = useSetPrivacyLegalHoldMutation()
  const [complete, completeState] = useCompletePrivacyRequestMutation()

  const schema = useMemo<FormField[]>(() => [
    { type: "select", name: "driver_id", label: t("governance.privacy.driver"), options: (drivers.data?.data ?? []).map((driver) => ({ label: driver.full_name, value: driver.id })), grid: "12 md:6", validation: "required" },
    { type: "select", name: "type", label: t("governance.privacy.type"), options: privacyTypes.map((value) => ({ label: t(`governance.privacy.types.${value}`), value })), defaultValue: "access", grid: "12 md:6", validation: "required" },
    { type: "input", name: "received_at", label: t("governance.privacy.receivedAt"), defaultValue: new Date().toISOString().slice(0, 10), grid: "12 md:4", validation: "required", props: { type: "date" } },
    { type: "input", name: "due_at", label: t("governance.privacy.dueAt"), grid: "12 md:4", props: { type: "date" } },
    { type: "select", name: "source", label: t("governance.privacy.source"), options: sources.map((value) => ({ label: t(`governance.privacy.sources.${value}`), value })), defaultValue: "email", grid: "12 md:4", validation: "required" },
    { type: "textarea", name: "request_notes", label: t("governance.privacy.notes"), grid: "12" },
    { type: "button", name: "submit", grid: "12", props: { text: createState.isLoading ? t("common.loading") : t("governance.privacy.create"), type: "submit" } },
  ], [createState.isLoading, drivers.data?.data, t])
  const config = useMemo<FormConfig>(() => ({ formId: "fleetlery-privacy-create", showSuccessToast: false, persistence: { enabled: false, storage: "session" }, onSubmit: async ({ values, ctx }) => {
    setMessage(""); setSuccess("")
    try {
      await createRequest({ driver_id: String(values.driver_id), type: values.type as PrivacyType, received_at: String(values.received_at), due_at: values.due_at ? String(values.due_at) : null, source: values.source as PrivacySource, request_notes: values.request_notes ? String(values.request_notes) : null }).unwrap()
      ctx.setValue("driver_id", ""); ctx.setValue("request_notes", "")
      setSuccess(t("governance.privacy.created"))
      return true
    } catch (error) { setMessage(apiError(error, t("governance.privacy.errors.create")).message); return false }
  } }), [createRequest, t])
  const columns = useMemo<ColumnConfig<PrivacyRequest>[]>(() => [
    { key: "driver", label: t("governance.privacy.driver"), type: "custom", render: (_value, row) => <div><p className="font-medium">{row.driver.full_name}</p><p className="text-xs text-muted-foreground">{row.driver.city}</p></div> },
    { key: "type", label: t("governance.privacy.type"), type: "custom", render: (value) => t(`governance.privacy.types.${String(value)}`) },
    { key: "status", label: t("governance.privacy.status"), type: "custom", render: (value) => t(`governance.privacy.statuses.${String(value)}`) },
    { key: "received_at", label: t("governance.privacy.receivedAt"), type: "text" },
    { key: "due_at", label: t("governance.privacy.dueAt"), type: "custom", render: (value) => value ? String(value) : "—" },
    { key: "id", label: t("governance.privacy.actions"), type: "custom", render: (_value, row) => <Button size="sm" variant="outline" onClick={() => { setSelectedId(row.id); setTarget(""); setReason(""); setHoldReason("") }}>{t("governance.privacy.open")}</Button> },
  ], [t])
  const run = async (action: () => Promise<PrivacyRequest>) => {
    setMessage(""); setSuccess("")
    try { await action(); setSuccess(t("governance.privacy.updated")); setTarget(""); setReason(""); setHoldReason(""); setReference(""); setCompletionNotes("") }
    catch (error) { setMessage(apiError(error, t("governance.privacy.errors.update")).message); if (typeof error === "object" && error && "status" in error && error.status === 409) void detail.refetch() }
  }
  const searchDriver = (event: FormEvent) => { event.preventDefault(); setDriverSearch(driverSearchDraft.trim()) }

  return <Page>
    <PageHeader title={t("governance.privacy.title")} subtitle={t("governance.privacy.subtitle")} />
    {message && <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
    {success && <p role="status" className="mt-4 rounded-md bg-primary/10 p-3 text-sm text-primary">{success}</p>}
    <Card className="mt-4"><CardHeader><CardTitle>{t("governance.privacy.createTitle")}</CardTitle></CardHeader><CardContent>
      <form className="mb-4 flex flex-col gap-2 sm:flex-row" onSubmit={searchDriver}><Input aria-label={t("governance.privacy.searchDriver")} placeholder={t("governance.privacy.searchDriver")} value={driverSearchDraft} onChange={(event) => setDriverSearchDraft(event.target.value)} /><Button type="submit" variant="outline">{t("governance.privacy.searchAction")}</Button></form>
      {drivers.isError && <p role="alert" className="mb-3 text-sm text-destructive">{apiError(drivers.error, t("governance.privacy.errors.drivers")).message}</p>}
      <DynamicForm config={config} schema={schema} />
    </CardContent></Card>
    <Card className="mt-4"><CardContent className="grid gap-3 pt-6 md:grid-cols-3">
      <Select label={t("governance.privacy.type")} options={[{ label: t("governance.privacy.all"), value: "all" }, ...privacyTypes.map((value) => ({ label: t(`governance.privacy.types.${value}`), value }))]} value={filters.type ?? "all"} onChange={(value) => { setPage(1); setFilters((current) => ({ ...current, type: value === "all" ? undefined : value as PrivacyType })) }} />
      <Select label={t("governance.privacy.status")} options={[{ label: t("governance.privacy.all"), value: "all" }, ...statuses.map((value) => ({ label: t(`governance.privacy.statuses.${value}`), value }))]} value={filters.status ?? "all"} onChange={(value) => { setPage(1); setFilters((current) => ({ ...current, status: value === "all" ? undefined : value as PrivacyStatus })) }} />
      <Select label={t("governance.privacy.deadline")} options={[{ label: t("governance.privacy.all"), value: "all" }, { label: t("governance.privacy.overdue"), value: "overdue" }]} value={filters.overdue ? "overdue" : "all"} onChange={(value) => { setPage(1); setFilters((current) => ({ ...current, overdue: value === "overdue" || undefined })) }} />
    </CardContent></Card>
    {requests.isLoading ? <Skeleton className="mt-4 h-64" /> : requests.isError ? <div role="alert" className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive"><p>{apiError(requests.error, t("governance.privacy.errors.list")).message}</p><Button className="mt-2" variant="outline" onClick={() => void requests.refetch()}>{t("driverPortal.actions.refresh")}</Button></div> : <div className="mt-4"><DataTable<PrivacyRequest> tableId="fleetlery-privacy-requests" data={requests.data?.data ?? []} columns={columns} emptyMessage={t("governance.privacy.empty")} features={{ hideableColumns: true }} /></div>}
    {requests.data && requests.data.meta.last_page > 1 && <div className="mt-4 flex justify-end gap-2"><Button variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>{t("settlements.pagination.previous")}</Button><Button variant="outline" disabled={page >= requests.data.meta.last_page} onClick={() => setPage((value) => value + 1)}>{t("settlements.pagination.next")}</Button></div>}
    {selectedId && (detail.isLoading ? <Skeleton className="mt-4 h-64" /> : detail.isError ? <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">{apiError(detail.error, t("governance.privacy.errors.details")).message}</p> : selected && <Card className="mt-4"><CardHeader><CardTitle>{t("governance.privacy.workflow")}: {selected.driver.full_name}</CardTitle></CardHeader><CardContent className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs text-muted-foreground">{t("governance.privacy.status")}</p><p className="font-medium">{t(`governance.privacy.statuses.${selected.status}`)}</p></div>{assessment.data && Object.entries(assessment.data.records).map(([key, value]) => <div key={key}><p className="text-xs text-muted-foreground">{t(`governance.privacy.records.${key}`)}</p><p className="font-medium">{value}</p></div>)}</div>
      {nextStatuses(selected.status).length > 0 && <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]"><Select label={t("governance.privacy.nextStatus")} placeholder={t("governance.privacy.chooseStatus")} options={nextStatuses(selected.status).map((value) => ({ label: t(`governance.privacy.statuses.${value}`), value }))} value={target} onChange={(value) => setTarget(value as PrivacyStatus)} /><Textarea label={t("governance.privacy.reason")} value={reason} onChange={(event) => setReason(event.target.value)} /><Button className="self-end" disabled={!target || (target === "rejected" && !reason.trim()) || transitionState.isLoading} onClick={() => target && void run(() => transition({ id: selected.id, status: target, reason: reason.trim() || null, version: selected.version }).unwrap())}>{t("governance.privacy.apply")}</Button></div>}
      <div className="grid gap-3 md:grid-cols-[1fr_auto]"><Input label={t("governance.privacy.holdReason")} value={holdReason} onChange={(event) => setHoldReason(event.target.value)} /><Button className="self-end" variant="outline" disabled={!holdReason.trim() || holdState.isLoading} onClick={() => void run(() => setLegalHold({ id: selected.id, enabled: !selected.legal_hold, reason: holdReason.trim(), version: selected.version }).unwrap())}>{selected.legal_hold ? t("governance.privacy.removeHold") : t("governance.privacy.addHold")}</Button></div>
      {selected.status === "approved" && <div className="grid gap-3 md:grid-cols-2"><Input label={t("governance.privacy.reference")} value={reference} onChange={(event) => setReference(event.target.value)} /><Textarea label={t("governance.privacy.completionNotes")} value={completionNotes} onChange={(event) => setCompletionNotes(event.target.value)} /><Button disabled={!reference.trim() || completeState.isLoading || selected.legal_hold || selected.type === "deletion"} onClick={() => void run(() => complete({ id: selected.id, completion_reference: reference.trim(), completion_notes: completionNotes.trim() || null, version: selected.version }).unwrap())}>{t("governance.privacy.complete")}</Button>{selected.type === "deletion" && <p className="text-sm text-muted-foreground">{t("governance.privacy.deletionPolicy")}</p>}</div>}
    </CardContent></Card>)}
  </Page>
}