import { useMemo, useState } from "react";
import { useLanguage } from "@/i18n/hooks";
import { Page } from "@/eano/components/page/Page";
import PageHeader from "@/eano/components/widgets/PageHeader";

import { StatMiniWidget } from "@/eano/components/widgets/StatMiniWidget";
import { Badge, Button, CardDescription, CardTitle } from "@/components";

import FileBrowserBlock from "@/eano/file-explorer/FileBrowserBlock";
import type { FileItem } from "@/eano/file-explorer/types/file-item";
import { useClearSelection } from "@/eano/file-explorer/state/selectors";
import { ArrowUp, FolderPlus, Layers, Folder, HardDrive, MousePointerClick } from "lucide-react";

import { FilesManagerUploadDialog } from "./components/FilesManagerUploadDialog";

import mockItems from "./mock.data/files-manager-items.json";

type FilesManagerMockItem = Omit<FileItem, "name"> & {
    name?: string;
    nameKey?: string;
};

function normalizePath(path: string) {
    if (!path) return "/";
    if (path === "/") return "/";
    const trimmed = path.trim();
    const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return withLeadingSlash.replace(/\/+$/, "");
}

function getParentPath(path: string) {
    const normalized = normalizePath(path);
    if (normalized === "/") return "/";

    const parts = normalized.split("/").filter(Boolean);
    parts.pop();
    return parts.length ? `/${parts.join("/")}` : "/";
}

function formatBytes(bytes: number) {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        sizes.length - 1
    );
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default function FilesManagerPage() {
    const { t } = useLanguage();
    const clearSelection = useClearSelection();

    const [allItems, setAllItems] = useState<FilesManagerMockItem[]>(
        () => mockItems as FilesManagerMockItem[]
    );
    const [currentPath, setCurrentPath] = useState<string>("/");
    const [selectedItems, setSelectedItems] = useState<FileItem[]>([]);

    const allItemsView = useMemo<FileItem[]>(() => {
        return allItems
            .map((item) => {
                const name = item.nameKey ? t(item.nameKey) : (item.name ?? "");
                return {
                    ...(item as Omit<FileItem, "name">),
                    name,
                };
            })
            .filter((x) => Boolean(x.id) && Boolean(x.type) && Boolean(x.name));
    }, [allItems, t]);

    const currentFolderItems = useMemo(() => {
        const normalizedCurrent = normalizePath(currentPath);
        return allItemsView.filter((item) => {
            const itemPath = normalizePath(item.path ?? "/");
            return getParentPath(itemPath) === normalizedCurrent;
        });
    }, [allItemsView, currentPath]);

    const stats = useMemo(() => {
        const totalItems = allItems.length;
        const folders = allItems.filter((x) => x.type === "folder").length;
        const storageUsedBytes = allItems.reduce((sum, x) => sum + (x.sizeBytes ?? 0), 0);

        return { totalItems, folders, storageUsedBytes };
    }, [allItems]);

    const canGoUp = normalizePath(currentPath) !== "/";

    const handleGoUp = () => {
        if (!canGoUp) return;
        setCurrentPath(getParentPath(currentPath));
    };


    return (
        <Page className="flex flex-col h-full">
            <PageHeader
                title={t("filesMedia.filesManager.pageTitle")}
                subtitle={t("filesMedia.filesManager.pageSubtitle")}
            >
                <Button variant="outline" size="sm" onClick={() => { }}>
                    <FolderPlus className="h-4 w-4" />
                    {t("filesMedia.filesManager.actions.newFolder")}
                </Button>

                <FilesManagerUploadDialog
                    t={t}
                    currentPath={currentPath}
                    allItemsView={allItemsView}
                    normalizePath={normalizePath}
                    getParentPath={getParentPath}
                    formatBytes={formatBytes}
                    onUploadItems={(items) => setAllItems((prev) => [...prev, ...items])}
                />

                {selectedItems.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                        {t("filesMedia.filesManager.actions.clearSelection")}
                    </Button>
                )}
            </PageHeader>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[100px]">
                <StatMiniWidget
                    className="text-sm!"
                    valueClassName="text-2xl!"
                    animated
                    data={{
                        title: t("filesMedia.filesManager.widgets.totalItems"),
                        icon: <Layers />,
                        value: stats.totalItems,
                    }}
                />
                <StatMiniWidget
                    className="text-sm!"
                    valueClassName="text-2xl!"
                    animated
                    data={{
                        title: t("filesMedia.filesManager.widgets.folders"),
                        icon: <Folder />,
                        value: stats.folders,
                    }}
                />
                <StatMiniWidget
                    className="text-sm!"
                    valueClassName="text-2xl!"
                    data={{
                        title: t("filesMedia.filesManager.widgets.storageUsed"),
                        icon: <HardDrive />,
                        value: formatBytes(stats.storageUsedBytes),
                    }}
                />
                <StatMiniWidget
                    className="text-sm!"
                    valueClassName="text-2xl!"
                    animated
                    data={{
                        title: t("filesMedia.filesManager.widgets.selected"),
                        icon: <MousePointerClick />,
                        value: selectedItems.length,
                    }}
                />
            </div>

            <div className="flex flex-wrap items-start justify-between gap-3 mt-5">
                <div>
                    <CardTitle>{t("filesMedia.filesManager.browser.cardTitle")}</CardTitle>
                    <CardDescription>{t("filesMedia.filesManager.browser.cardDescription")}</CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">

                    <Badge variant="secondary">
                        {t("filesMedia.filesManager.labels.path")} {normalizePath(currentPath)}
                    </Badge>
                    <Badge variant="outline">
                        {t("filesMedia.filesManager.labels.items")} {currentFolderItems.length}
                    </Badge>

                    <Button variant="outline" size="sm" onClick={handleGoUp} disabled={!canGoUp}>
                        <ArrowUp className="h-max! w-max!" />
                        {t("filesMedia.filesManager.actions.up")}
                    </Button>
                </div>
            </div>

            <FileBrowserBlock
                items={currentFolderItems}
                currentPath={normalizePath(currentPath)}
                onPathChange={(next) => setCurrentPath(normalizePath(next))}
                onSelectionChange={setSelectedItems}
                onFileMove={({ items, targetFolder }) => {
                    // Demo-only move: update item.path to be inside target folder
                    const targetPath = normalizePath(targetFolder.path ?? "/");
                    setAllItems((prev) =>
                        prev.map((it) => {
                            if (!items.some((m) => m.id === it.id)) return it;
                            if (it.id === targetFolder.id) return it;

                            return {
                                ...it,
                                path: `${targetPath}/${it.name}`,
                            };
                        })
                    );
                }}
                toolbarTitle={t("filesMedia.filesManager.browser.toolbarTitle")}
                defaultSort="name"
                defaultSortDirection="asc"
                defaultViewType="grid"
            />
        </Page>
    );
}
