import { Download, FileUp, RefreshCw } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Button, Card, CardContent, Input, Page, PageHeader, Skeleton } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { DocumentStatusBadge } from "@/components/documents/DocumentStatusBadge"
import { useLanguage } from "@/i18n"
import { useGetOwnDocumentsQuery, useOwnDocumentAccessLinkMutation, useUploadOwnDocumentMutation } from "@/services/api/driverPortal/driverPortalApi"
import type { DriverPortalDocument } from "@/types/driverPortal"

export default function DriverDocumentsPage() {
  const { t } = useLanguage(); const query = useGetOwnDocumentsQuery()
  return <Page><PageHeader title={t("driverPortal.documents.title")} subtitle={t("driverPortal.documents.subtitle")}><Button variant="outline" size="sm" disabled={query.isFetching} onClick={() => void query.refetch()}><RefreshCw className={query.isFetching ? "animate-spin" : ""} />{t("driverPortal.actions.refresh")}</Button></PageHeader>
    {query.isLoading ? <div className="mt-4 grid gap-3 md:grid-cols-2">{[1,2,3,4].map((item) => <Skeleton key={item} className="h-56" />)}</div> : query.error ? <p className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">{apiError(query.error, t("driverPortal.errors.documents")).message}</p> : <div className="mt-4 grid gap-3 md:grid-cols-2">{query.data?.map((document) => <DocumentCard key={document.id} document={document} />)}</div>}
  </Page>
}
function DocumentCard({ document }: { document: DriverPortalDocument }) {
  const { t } = useLanguage(); const [file,setFile] = useState<File|null>(null); const [expiresAt,setExpiresAt] = useState(document.expires_at ?? ""); const [message,setMessage] = useState(""); const [upload,state] = useUploadOwnDocumentMutation(); const [link,linkState] = useOwnDocumentAccessLinkMutation()
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!file) return; setMessage(""); try { await upload({ id: document.id, version: document.version, file, expires_at: expiresAt || undefined }).unwrap(); setFile(null) } catch (error) { setMessage(apiError(error,t("driverPortal.errors.upload")).message) } }
  const download = async () => { if (!document.latest_file) return; setMessage(""); try { const result = await link(document.latest_file.id).unwrap(); window.open(result.url,"_blank","noopener,noreferrer") } catch (error) { setMessage(apiError(error,t("driverPortal.errors.download")).message) } }
  return <Card><CardContent className="pt-6"><div className="flex items-start justify-between gap-3"><div><h2 className="font-medium">{document.type.name}</h2><p className="text-xs text-muted-foreground">{t(`documents.part.${document.part}`, { defaultValue: document.part })}</p></div><DocumentStatusBadge status={document.status} /></div>
    {document.rejection_reason && <p className="mt-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{document.rejection_reason}</p>}
    {document.latest_file && <div className="mt-3 rounded-md bg-muted/50 p-3"><p className="truncate text-sm font-medium">{document.latest_file.original_name}</p><div className="mt-2 flex justify-between"><span className="text-xs text-muted-foreground">{Math.ceil(document.latest_file.size_bytes/1024)} KB</span></div><Button className="mt-3" variant="outline" size="sm" disabled={linkState.isLoading} onClick={() => void download()}><Download />{t("documents.actions.download")}</Button></div>}
    {message && <p className="mt-3 text-sm text-destructive">{message}</p>}
    <form className="mt-4 space-y-3 border-t pt-4" onSubmit={(event) => void submit(event)}><Input type="file" required aria-label={t("documents.actions.chooseFile")} accept="application/pdf,image/jpeg,image/png" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />{document.type.requires_expiry && <Input label={t("documents.fields.expiresAt")} type="date" required value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />}<Button type="submit" size="sm" disabled={!file || state.isLoading}><FileUp />{state.isLoading ? t("common.loading") : t("documents.actions.upload")}</Button></form>
  </CardContent></Card>
}
