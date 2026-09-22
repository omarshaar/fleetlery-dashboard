import { DocumentPreview } from "@/components/documents/DocumentPreview"
import { Download, FileUp, RefreshCw } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Skeleton } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { DocumentStatusBadge } from "@/components/documents/DocumentStatusBadge"
import { useAuth } from "@/components/providers/authContext"
import { useLanguage } from "@/i18n"
import {
  useCreateDocumentAccessLinkMutation,
  useGetDriverDocumentsQuery,
  useUploadDriverDocumentMutation,
} from "@/services/api/documents/documentsApi"
import type { DriverDocument } from "@/types/document"

export function DriverDocumentsPanel({ driverId }: { driverId: string }) {
  const { t } = useLanguage()
  const documents = useGetDriverDocumentsQuery(driverId)

  return (
    <Card className="border-0 bg-transparent p-0 shadow-none">
      <CardHeader className="flex-row items-center justify-between p-0">
        <div><CardTitle>{t("documents.driver.title")}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{t("documents.driver.subtitle")}</p></div>
        <Button variant="outline" size="sm" disabled={documents.isFetching} onClick={() => void documents.refetch()}><RefreshCw className={documents.isFetching ? "animate-spin" : ""} />{t("documents.actions.refresh")}</Button>
      </CardHeader>
      <CardContent className="p-0">
        {documents.isLoading ? (
          <div className="grid gap-5 md:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-44 w-full" />)}</div>
        ) : documents.error ? (
          <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{apiError(documents.error, t("documents.errors.list")).message}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {documents.data?.map((document) => <DocumentItem key={document.id} driverId={driverId} document={document} />)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DocumentItem({ driverId, document }: { driverId: string; document: DriverDocument }) {
  const { t } = useLanguage()
  const { hasPermission } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [expiresAt, setExpiresAt] = useState(document.expires_at ?? "")
  const [message, setMessage] = useState("")
  const [upload, uploadState] = useUploadDriverDocumentMutation()
  const [accessLink, accessState] = useCreateDocumentAccessLinkMutation()

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!file) return
    setMessage("")
    try {
      await upload({ driverId, documentId: document.id, version: document.version, file, expiresAt: expiresAt || undefined }).unwrap()
      setFile(null)
    } catch (error) {
      setMessage(apiError(error, t("documents.errors.upload")).message)
    }
  }

  const download = async () => {
    if (!document.latest_file) return
    setMessage("")
    try {
      const result = await accessLink(document.latest_file.id).unwrap()
      window.open(result.url, "_blank", "noopener,noreferrer")
    } catch (error) {
      setMessage(apiError(error, t("documents.errors.download")).message)
    }
  }

  return (
    <article className="rounded-lg border bg-card p-5 text-card-foreground">
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="font-medium">{document.type.name}</h3><p className="text-xs text-muted-foreground">{t(`documents.part.${document.part}`, { defaultValue: document.part })}</p></div>
        <DocumentStatusBadge status={document.status} />
      </div>
      {document.latest_file && (
        <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm">
          <p className="truncate font-medium">{document.latest_file.original_name}</p>
          <div className="mt-2 flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{Math.ceil(document.latest_file.size_bytes / 1024)} KB</span></div>
        </div>
      )}
      {hasPermission("documents.download") && document.latest_file && (
        <DocumentPreview key={document.latest_file.id} file={document.latest_file} />
      )}
      {message && <p role="alert" className="mt-3 text-sm text-destructive">{message}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {hasPermission("documents.download") && document.latest_file && (
          <Button type="button" size="sm" variant="outline" disabled={accessState.isLoading} onClick={() => void download()}><Download />{t("documents.actions.download")}</Button>
        )}
      </div>
      {hasPermission("documents.manage") && (
        <form className="mt-3 space-y-3 border-t pt-3" onSubmit={(event) => void submit(event)}>
          <Input type="file" required aria-label={t("documents.actions.chooseFile")} onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          {document.type.requires_expiry && <Input type="date" required label={t("documents.fields.expiresAt")} value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />}
          <Button type="submit" size="sm" disabled={!file || uploadState.isLoading}><FileUp />{uploadState.isLoading ? t("common.loading") : t("documents.actions.upload")}</Button>
        </form>
      )}
    </article>
  )
}