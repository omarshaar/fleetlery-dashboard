import { DataTable, type ColumnConfig } from "@/eano/data-table-builder"
import { Check, Download, Eye, X } from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Button, Card, CardContent, Input, Page, PageHeader, Select, Skeleton,

} from "@/components"
import { apiError } from "@/components/auth/apiError"
import { DocumentPreview } from "@/components/documents/DocumentPreview"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/eano/design-system/shadcn/dialog"
import { DocumentStatusBadge } from "@/components/documents/DocumentStatusBadge"
import { useAuth } from "@/components/providers/authContext"
import { useLanguage } from "@/i18n"
import {
  useCreateDocumentAccessLinkMutation,
  useGetDocumentQueueQuery,
  useGetDocumentQueueDriversQuery,
  useReviewDocumentMutation,
} from "@/services/api/documents/documentsApi"
import type { DocumentQueueItem, DocumentStatus } from "@/types/document"

export default function DocumentQueuePage() {
  const { t } = useLanguage()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<DocumentStatus | "">("")
  const [driverId, setDriverId] = useState("")
  const drivers = useGetDocumentQueueDriversQuery()
  const queue = useGetDocumentQueueQuery({ page, status: status || undefined, driver_id: driverId || undefined })
  const error = queue.error ? apiError(queue.error, t("documents.errors.queue")).message : ""


  const columns = useMemo<ColumnConfig<DocumentQueueItem>[]>(() => [
    { key: "driver", label: t("documents.fields.driver"), render: (_, item) => <><Link data-driver-link to={`/admin/drivers/${item.driver.id}?tab=documents`} className="font-medium rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.driver.full_name}</Link><div className="text-xs text-muted-foreground">{item.driver.city}</div></> },
    { key: "document", label: t("documents.fields.document"), render: (_, item) => <><div>{item.document.type.name}</div><div className="text-xs text-muted-foreground">{item.document.latest_file?.original_name ?? "—"}</div></> },
    { key: "status", label: t("documents.fields.status"), render: (_, item) => <DocumentStatusBadge status={item.document.status} /> },
    { key: "actions", label: t("documents.fields.actions"), minWidth: 300, render: (_, item) => <QueueActions key={item.document.id} item={item} /> },
  ], [t])
  return (
    <Page>
      <PageHeader title={t("documents.queue.title")} subtitle={t("documents.queue.subtitle")}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-56">
            <Select
              className="h-9"
              placeholder={t("documents.queue.openItems")}
              options={[
                { label: t("documents.queue.openItems"), value: "__all__" },
                { label: t("documents.status.missing"), value: "missing" },
                { label: t("documents.status.needs_review"), value: "needs_review" },
                { label: t("documents.status.rejected"), value: "rejected" },
              ]}
              value={status || "__all__"}
              onChange={(value) => { setStatus(value === "__all__" ? "" : value as DocumentStatus); setPage(1) }}
            />
          </div>
          <div className="w-full sm:w-56">
            <label className="sr-only" htmlFor="document-queue-driver">{t("documents.fields.driver")}</label>
            <Select
              id="document-queue-driver"
              className="h-9"
              options={[
                { label: t("documents.queue.allDrivers"), value: "__all__" },
                ...(drivers.data ?? []).map((driver) => ({ label: driver.full_name, value: driver.id })),
              ]}
              value={driverId || "__all__"}
              onChange={(value) => { setDriverId(value === "__all__" ? "" : value); setPage(1) }}
            />
          </div>
        </div>
      </PageHeader>
      {drivers.error && <p role="alert" className="mt-3 text-sm text-destructive">{apiError(drivers.error, t("documents.errors.list")).message} <Button size="sm" variant="outline" onClick={() => void drivers.refetch()}>{t("documents.actions.retry")}</Button></p>}

      {error ? (
        <Card className="mt-4 border-destructive/50"><CardContent className="flex items-center justify-between pt-6"><p role="alert" className="text-sm text-destructive">{error}</p><Button variant="outline" onClick={() => void queue.refetch()}>{t("documents.actions.retry")}</Button></CardContent></Card>
      ) : (
        <Card className="mt-4 overflow-hidden">
          <CardContent className="p-0">
            {queue.isLoading ? (
              <div className="space-y-3 p-5">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-12" />)}</div>
            ) : queue.data?.data.length === 0 ? (
              <div className="p-10 text-center"><p className="font-medium">{t("documents.queue.empty")}</p></div>
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
              <DataTable<DocumentQueueItem> tableId="fleetlery-admin-document-queue" data={queue.data?.data ?? []} columns={columns} rowKey={(item) => item.document.id} preset="simple" emptyMessage={t("documents.queue.empty")} className="rounded-none border-0 shadow-none" />
              </div>
            )}
          </CardContent>
          {queue.data && queue.data.meta.last_page > 1 && (
            <div className="flex items-center justify-between border-t p-4 text-sm">
              <span className="text-muted-foreground">{t("documents.queue.total", { count: queue.data.meta.total })}</span>
              <div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>{t("drivers.pagination.previous")}</Button><span className="flex items-center px-2">{page} / {queue.data.meta.last_page}</span><Button size="sm" variant="outline" disabled={page >= queue.data.meta.last_page} onClick={() => setPage((value) => value + 1)}>{t("drivers.pagination.next")}</Button></div>
            </div>
          )}
        </Card>
      )}
    </Page>
  )
}

function QueueActions({ item }: { item: DocumentQueueItem }) {
  const { t } = useLanguage()
  const { hasPermission } = useAuth()
  const [rejecting, setRejecting] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [message, setMessage] = useState("")
  const [review, reviewState] = useReviewDocumentMutation()
  const [accessLink, accessState] = useCreateDocumentAccessLinkMutation()
  const document = item.document
  const canReview = hasPermission("documents.manage") && document.status === "needs_review" && document.latest_file

  const decide = async (target: "accepted" | "rejected") => {
    if (target === "rejected" && !reason.trim()) return
    setMessage("")
    try {
      await review({ documentId: document.id, version: document.version, status: target, reason: target === "rejected" ? reason.trim() : undefined }).unwrap()
      setRejecting(false); setReason("")
    } catch (error) {
      setMessage(apiError(error, t("documents.errors.review")).message)
    }
  }

  const download = async () => {
    if (!document.latest_file) return
    try {
      const result = await accessLink(document.latest_file.id).unwrap()
      window.open(result.url, "_blank", "noopener,noreferrer")
    } catch (error) {
      setMessage(apiError(error, t("documents.errors.download")).message)
    }
  }

  return (
    <div>
        <div className="flex justify-end gap-1">
          {hasPermission("documents.download") && document.latest_file && <Button type="button" size="icon" variant="ghost" title={t("documents.actions.preview")} aria-label={t("documents.actions.preview")} onClick={() => setPreviewOpen(true)}><Eye /></Button>}
          {hasPermission("documents.download") && document.latest_file && <Button size="icon" variant="ghost" disabled={accessState.isLoading} title={t("documents.actions.download")} onClick={() => void download()}><Download /></Button>}
          {canReview && <Button size="icon" variant="ghost" disabled={reviewState.isLoading} title={t("documents.actions.accept")} onClick={() => void decide("accepted")}><Check className="text-primary" /></Button>}
          {canReview && <Button size="icon" variant="ghost" title={t("documents.actions.reject")} onClick={() => setRejecting((value) => !value)}><X className="text-destructive" /></Button>}
        </div>
        {rejecting && <div className="mt-2 flex min-w-72 gap-2"><Input placeholder={t("documents.review.reason")} value={reason} onChange={(event) => setReason(event.target.value)} /><Button size="sm" variant="destructive" disabled={!reason.trim() || reviewState.isLoading} onClick={() => void decide("rejected")}>{t("documents.actions.confirmReject")}</Button></div>}
      {message && <p role="alert" className="mt-1 text-xs text-destructive">{message}</p>}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] gap-1 overflow-hidden p-1 sm:max-w-5xl sm:p-2">
          <DialogHeader className="flex-row items-center justify-between gap-2 px-2 py-1">
            <DialogTitle className="min-w-0 truncate text-start text-base">{document.latest_file?.original_name}</DialogTitle>
            <DialogClose asChild><Button type="button" size="icon-sm" variant="ghost" aria-label={t("documents.actions.closePreview")}><X /></Button></DialogClose>
          </DialogHeader>
          {previewOpen && document.latest_file && <DocumentPreview key={document.latest_file.id} file={document.latest_file} expanded />}
        </DialogContent>
      </Dialog>
    </div>
  )
}