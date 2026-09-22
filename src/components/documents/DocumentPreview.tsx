import { FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { Button, Skeleton } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { useLanguage } from "@/i18n"
import { useCreateDocumentAccessLinkMutation } from "@/services/api/documents/documentsApi"
import type { DriverDocument } from "@/types/document"

export function DocumentPreview({ file, expanded = false }: { file: NonNullable<DriverDocument["latest_file"]>; expanded?: boolean }) {
  const { t } = useLanguage()
  const [createLink] = useCreateDocumentAccessLinkMutation()
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [attempt, setAttempt] = useState(0)
  const isImage = file.mime_type === "image/jpeg" || file.mime_type === "image/png"
  const isPdf = file.mime_type === "application/pdf"

  useEffect(() => {
    const controller = new AbortController()
    let objectUrl: string | undefined
    setUrl(null)
    setError("")
    const request = createLink(file.id)
    void (async () => {
      try {
        const link = await request.unwrap()
        if (controller.signal.aborted) return
        const response = await fetch(link.url, { credentials: "include", cache: "no-store", headers: { Accept: file.mime_type }, signal: controller.signal })
        if (!response.ok) {
          const data: unknown = await response.json().catch(() => undefined)
          throw { status: response.status, data }
        }
        // Never render a login page or an HTML error response as a PDF/image.
        const responseType = response.headers.get("content-type")?.split(";")[0].trim()
        if (responseType !== file.mime_type && responseType !== "application/octet-stream") {
          throw new Error("Unexpected document content type")
        }
        const blob = await response.blob()
        if (controller.signal.aborted) return
        // The server sends attachments; a local Blob URL allows inline rendering.
        const contentType = isImage || isPdf ? file.mime_type : "application/octet-stream"
        objectUrl = URL.createObjectURL(new Blob([blob], { type: contentType }))
        setUrl(objectUrl)
      } catch (cause) {
        if (!controller.signal.aborted) setError(apiError(cause, t("documents.preview.error")).message)
      }
    })()
    return () => {
      controller.abort()
      request.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [file.id, file.mime_type, createLink, attempt, isImage, isPdf, t])

  if (error) return <div className={expanded ? "rounded-md border p-2" : "mt-3 rounded-md border p-3"}><p role="alert" className="text-sm text-destructive">{error}</p><Button className="mt-2" type="button" variant="outline" size="sm" onClick={() => setAttempt(value => value + 1)}>{t("documents.actions.retry")}</Button></div>
  if (!url) return <div className={expanded ? "" : "mt-3"} role="status" aria-label={t("common.loading")}><Skeleton className={expanded ? "h-[min(78dvh,900px)] w-full" : "h-44 w-full"} /></div>

  return (
    <div className={expanded ? "relative overflow-hidden rounded-sm bg-muted/30" : "relative mt-3 overflow-hidden rounded-md border bg-muted/30"}>
      <div className={expanded ? "h-[min(70vh,800px)]" : "h-44"} aria-hidden={!expanded}>
        {isImage ? (
          <img src={url} alt={expanded ? file.original_name : ""} className="h-full w-full object-contain" onError={() => setError(t("documents.preview.error"))} />
        ) : isPdf ? (
          <iframe src={url + "#toolbar=0&navpanes=0&view=FitH"} title={file.original_name} tabIndex={expanded ? 0 : -1} className={expanded ? "h-full w-full border-0 bg-white" : "pointer-events-none h-full w-full border-0 bg-white"} />
        ) : (
          <div className="flex h-full items-center justify-center"><FileText className="size-12 text-muted-foreground" /></div>
        )}
      </div>
      {!expanded && (
        <>
          <p className="border-t bg-background px-3 py-2 text-center text-xs text-muted-foreground">{t("documents.preview.open")}</p>
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={t("documents.preview.openFile", { name: file.original_name })} className="absolute inset-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring hover:bg-primary/5" />
        </>
      )}
    </div>
  )
}
