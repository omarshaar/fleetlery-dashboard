import { useEffect, useMemo, useRef, useState } from "react";

import type { FileItem } from "@/eano/file-explorer/types/file-item";

import {
  Badge,
  Button,
  Dialog,
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
  ScrollArea,
  Separator,
} from "@/components";

import { UploadCloud, X } from "lucide-react";

type Translator = (key: string, options?: Record<string, unknown>) => string;

type FilesManagerUploadDialogProps = {
  t: Translator;
  currentPath: string;
  allItemsView: FileItem[];

  normalizePath: (path: string) => string;
  getParentPath: (path: string) => string;
  formatBytes: (bytes: number) => string;

  onUploadItems: (items: FileItem[]) => void;

  maxFiles?: number;
};

function inferFileType(fileName: string, mimeType?: string): FileItem["type"] {
  const ext = (fileName.split(".").pop() ?? "").toLowerCase();
  const mime = (mimeType ?? "").toLowerCase();

  if (
    mime.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif"].includes(ext)
  )
    return "image";
  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  if (
    mime.startsWith("video/") ||
    ["mp4", "webm", "mov", "m4v", "avi", "mkv"].includes(ext)
  )
    return "video";
  if (
    mime.startsWith("audio/") ||
    ["mp3", "wav", "ogg", "m4a", "flac"].includes(ext)
  )
    return "audio";

  if (
    ["txt", "md", "log", "csv", "json", "xml", "yml", "yaml"].includes(ext) ||
    mime.startsWith("text/")
  )
    return "text";
  if (
    [
      "ts",
      "tsx",
      "js",
      "jsx",
      "css",
      "scss",
      "html",
      "py",
      "java",
      "c",
      "cpp",
      "go",
      "rs",
      "php",
    ].includes(ext)
  )
    return "code";
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext))
    return "document";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";

  return "other";
}

function ensureUniqueName(desiredName: string, reservedNames: Set<string>) {
  if (!reservedNames.has(desiredName)) {
    reservedNames.add(desiredName);
    return desiredName;
  }

  const dotIdx = desiredName.lastIndexOf(".");
  const base = dotIdx > 0 ? desiredName.slice(0, dotIdx) : desiredName;
  const ext = dotIdx > 0 ? desiredName.slice(dotIdx) : "";

  let i = 2;
  while (reservedNames.has(`${base} (${i})${ext}`)) i++;

  const finalName = `${base} (${i})${ext}`;
  reservedNames.add(finalName);
  return finalName;
}

function createId() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = globalThis.crypto as any;
    if (c?.randomUUID) return c.randomUUID() as string;
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function FilesManagerUploadDialog({
  t,
  currentPath,
  allItemsView,
  normalizePath,
  getParentPath,
  formatBytes,
  onUploadItems,
  maxFiles = 50,
}: FilesManagerUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[] | undefined>(undefined);

  const createdObjectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      for (const url of createdObjectUrlsRef.current) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const resetDialog = () => {
    setStagedFiles(undefined);
  };

  const stagedSummary = useMemo(() => {
    const files = stagedFiles ?? [];
    const totalBytes = files.reduce((sum, f) => sum + (f.size ?? 0), 0);
    return { count: files.length, totalBytes };
  }, [stagedFiles]);

  const existingNames = useMemo(() => {
    const normalizedCurrent = normalizePath(currentPath);
    return new Set(
      allItemsView
        .filter((it) => {
          const itemPath = normalizePath(it.path ?? "/");
          return getParentPath(itemPath) === normalizedCurrent;
        })
        .map((it) => it.name)
    );
  }, [allItemsView, currentPath, getParentPath, normalizePath]);

  const handleCommit = () => {
    if (!stagedFiles || stagedFiles.length === 0) return;

    const normalizedCurrent = normalizePath(currentPath);
    const basePath = normalizedCurrent === "/" ? "" : normalizedCurrent;

    // Make a local copy (so we don't mutate the memoized Set reference)
    const reserved = new Set(existingNames);

    const now = new Date().toISOString();

    const nextItems: FileItem[] = stagedFiles.map((file) => {
      const finalName = ensureUniqueName(file.name, reserved);
      const extension =
        (finalName.split(".").pop() ?? "").toLowerCase() || undefined;

      const url = URL.createObjectURL(file);
      createdObjectUrlsRef.current.push(url);

      const type = inferFileType(finalName, file.type);

      return {
        id: createId(),
        name: finalName,
        type,
        path: `${basePath}/${finalName}`,
        url,
        extension,
        mimeType: file.type || undefined,
        sizeBytes: file.size,
        createdAt: now,
        updatedAt: now,
      };
    });

    onUploadItems(nextItems);

    setOpen(false);
    resetDialog();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetDialog();
      }}
      title={t("filesMedia.filesManager.uploadDialog.title")}
      description={t("filesMedia.filesManager.uploadDialog.description")}
      size="lg"
      trigger={
        <Button size="sm" type="button">
          <UploadCloud className="h-4 w-4" />
          {t("filesMedia.filesManager.actions.upload")}
        </Button>
      }
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {stagedSummary.count > 0
              ? t("filesMedia.filesManager.uploadDialog.footerSummary", {
                  count: stagedSummary.count,
                  size: formatBytes(stagedSummary.totalBytes),
                })
              : t("filesMedia.filesManager.uploadDialog.footerEmpty")}
          </div>

          <div className="flex items-center gap-2">
            {stagedSummary.count > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStagedFiles(undefined)}
              >
                {t("filesMedia.filesManager.uploadDialog.actions.clear")}
              </Button>
            )}

            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {t("filesMedia.filesManager.uploadDialog.actions.cancel")}
            </Button>

            <Button
              type="button"
              onClick={handleCommit}
              disabled={stagedSummary.count === 0}
            >
              {t("filesMedia.filesManager.uploadDialog.actions.uploadNow")}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <Dropzone
          src={stagedFiles}
          maxFiles={maxFiles}
          onDrop={(accepted) => {
            if (!accepted || accepted.length === 0) return;

            setStagedFiles((prev) => {
              const next = [...(prev ?? []), ...accepted];

              // De-dup by (name + size + lastModified)
              const map = new Map<string, File>();
              for (const f of next) {
                const key = `${f.name}__${f.size}__${f.lastModified}`;
                map.set(key, f);
              }

              return Array.from(map.values()).slice(0, maxFiles);
            });
          }}
        >
          <DropzoneEmptyState>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="mt-2 text-sm font-medium">
                {t("filesMedia.filesManager.uploadDialog.dropzone.emptyTitle")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("filesMedia.filesManager.uploadDialog.dropzone.emptySubtitle")}
              </p>
            </div>
          </DropzoneEmptyState>

          <DropzoneContent>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="mt-2 text-sm font-medium">
                {t("filesMedia.filesManager.uploadDialog.dropzone.selectedTitle")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("filesMedia.filesManager.uploadDialog.dropzone.selectedSubtitle")}
              </p>
            </div>
          </DropzoneContent>
        </Dropzone>

        <Separator />

        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">
            {t("filesMedia.filesManager.uploadDialog.selectedFiles")}
          </div>
          <Badge variant="secondary">
            {t("filesMedia.filesManager.labels.path")} {normalizePath(currentPath)}
          </Badge>
        </div>

        <ScrollArea className="h-44 w-full rounded-md border">
          <div className="p-2 space-y-1">
            {(stagedFiles ?? []).length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                {t("filesMedia.filesManager.uploadDialog.noFiles")}
              </div>
            ) : (
              (stagedFiles ?? []).map((f) => (
                <div
                  key={`${f.name}-${f.size}-${f.lastModified}`}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {inferFileType(f.name, f.type)} • {formatBytes(f.size)}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setStagedFiles((prev) => {
                        const list = prev ?? [];
                        const next = list.filter(
                          (x) =>
                            !(
                              x.name === f.name &&
                              x.size === f.size &&
                              x.lastModified === f.lastModified
                            )
                        );
                        return next.length ? next : undefined;
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Dialog>
  );
}
