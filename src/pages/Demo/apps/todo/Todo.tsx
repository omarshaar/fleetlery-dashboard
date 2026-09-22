import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, Info, Plus, RotateCcw } from "lucide-react";

import { useLanguage } from "@/i18n/hooks";

import { Page } from "@/eano/components/page/Page";
import PageHeader from "@/eano/components/widgets/PageHeader";
import { InfoAlertCard } from "@/eano/components/feedback-alerts/InfoAlertCard";

import {
    KanbanBlock,
    type KanbanItem,
} from "@/eano/components/blocks/Kanban/KanbanBlock";

import { Button } from "@/eano/components/base-ui/Button";
import { Dialog } from "@/eano/components/layout-ui/Dialog";

import { type SelectOption } from "@/eano/components/base-ui/Select";

import { Sheet } from "@/eano/components/layout-ui/Sheet";

import { TodoSidebar } from "./components/TodoSidebar";

import { DynamicForm } from "@/eano/form-builder/DynamicForm";

import { buildTodoCreateTaskForm, TODO_UNASSIGNED_OWNER } from "./todo.schemas";

import {
    buildTodoKanbanColumns,
    buildTodoKanbanItems,
    buildTodoUsers,
} from "./Todo.fakeData";

function mapLanguageToLocale(language: string) {
    if (language === "ar") return "ar";
    if (language === "de") return "de-DE";
    return "en-US";
}

export default function TodoKanbanPage() {
    const { t, language } = useLanguage();

    const locale = useMemo(() => mapLanguageToLocale(language), [language]);

    const users = useMemo(() => buildTodoUsers(), []);
    const columns = useMemo(() => buildTodoKanbanColumns(t), [t]);

    const demoItems = useMemo(() => buildTodoKanbanItems(t, users), [t, users]);
    const [items, setItems] = useState<KanbanItem[]>(demoItems);

    const [createOpen, setCreateOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarScrollRef = useRef<HTMLDivElement | null>(null);
    const [sidebarMaxHeight, setSidebarMaxHeight] = useState<number>();

    useEffect(() => {
        if (!sidebarScrollRef.current) return;

        let raf = 0;

        const update = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                // If hidden (display:none), skip until it becomes visible.
                if (
                    !sidebarScrollRef.current ||
                    sidebarScrollRef.current.offsetParent === null
                ) {
                    return;
                }

                const rect = sidebarScrollRef.current.getBoundingClientRect();
                const bottomPadding = 16; // matches `top-4`
                const next = Math.max(
                    240,
                    Math.floor(window.innerHeight - rect.top - bottomPadding),
                );
                setSidebarMaxHeight(next);
            });
        };

        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, { passive: true });

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update);
        };
    }, []);

    const columnOptions: SelectOption[] = useMemo(
        () => columns.map((c) => ({ label: c.name, value: c.id })),
        [columns],
    );

    const ownerOptions: SelectOption[] = useMemo(
        () => [
            {
                label: t("todo.dialog.create.owner.none"),
                value: TODO_UNASSIGNED_OWNER,
            },
            ...users.map((u) => ({ label: u.name, value: u.id })),
        ],
        [t, users],
    );

    const resetDemo = () => setItems(demoItems);

    const counts = useMemo(() => {
        let planned = 0;
        let inProgress = 0;
        let blocked = 0;

        for (const it of items) {
            if (it.column === "backlog") planned += 1;
            if (it.column === "inProgress") inProgress += 1;
            if (!it.owner) blocked += 1;
        }

        return { planned, inProgress, blocked };
    }, [columns, items]);

    const { createTodoFormConfig, createTodoFormSchema } = useMemo(() => {
        const { config, schema } = buildTodoCreateTaskForm({
            t,
            users,
            columnOptions,
            ownerOptions,
            onAddItem: (item) => setItems((prev) => [item, ...prev]),
            onClose: () => setCreateOpen(false),
        });

        return { createTodoFormConfig: config, createTodoFormSchema: schema };
    }, [t, users, columnOptions, ownerOptions]);

    const SidebarContent = (
        <TodoSidebar
            t={t}
            counts={counts}
            onOpenCreate={() => setCreateOpen(true)}
        />
    );

    return (
        <Page>
            <PageHeader
                className="mb-4"
                title={t("todo.pageTitle")}
                subtitle={t("todo.pageSubtitle")}
            >
                <Button variant="outline" size="sm" onClick={resetDemo}>
                    <RotateCcw className="h-4 w-4" />
                    {t("todo.actions.resetDemo")}
                </Button>

                <Button size="sm" onClick={() => setCreateOpen(true)}>
                    <Plus className="h-4 w-4" />
                    {t("todo.actions.addTask")}
                </Button>
            </PageHeader>

            <InfoAlertCard
                className="mt-3"
                variant="blue"
                icon={<Info className="h-5 w-5" />}
                title={t("todo.alert.title")}
                description={t("todo.alert.description")}
            />

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-2.5">
                <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
                    <div
                        ref={sidebarScrollRef}
                        className="sticky top-4 overflow-y-auto pr-1"
                        style={
                            sidebarMaxHeight ? { maxHeight: sidebarMaxHeight } : undefined
                        }
                    >
                        {SidebarContent}
                    </div>
                </div>
                <div className="col-span-1 lg:col-span-8 xl:col-span-9 rounded-2xl bg-white dark:bg-black border border-border shadow-sm dark:shadow-none p-3 eano-widget">
                    <div className="flex items-start justify-between gap-3 px-2 pb-2">
                        <div className="space-y-1">
                            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                                {t("todo.board.title")}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                {t("todo.board.subtitle")}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Sheet
                                open={sidebarOpen}
                                onOpenChange={setSidebarOpen}
                                side="left"
                                size="md"
                                title={t("navigation.todo")}
                                description={t("todo.pageSubtitle")}
                                className="p-0"
                                innerClassName="px-4 py-3"
                                trigger={
                                    <Button className="lg:hidden" size="sm" variant="outline">
                                        <Filter className="h-4 w-4" />
                                        {t("navigation.todo")}
                                    </Button>
                                }
                            >
                                <div className="pb-4">{SidebarContent}</div>
                            </Sheet>
                            <div className="text-xs text-muted-foreground pt-1 hidden sm:block">
                                {t("todo.board.dragHint")}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <KanbanBlock
                            className="min-w-[980px]"
                            columns={columns}
                            items={items}
                            onChange={setItems}
                            locale={locale}
                            ownerLabel={t("todo.kanban.ownerLabel")}
                        />
                    </div>
                </div>
            </div>

            <Dialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                title={t("todo.dialog.create.title")}
                description={t("todo.dialog.create.subtitle")}
                trigger={<span className="hidden" aria-hidden="true" />}
                className="p-0"
                innerClassName="px-4 py-3"
            >
                <DynamicForm
                    config={createTodoFormConfig}
                    schema={createTodoFormSchema}
                />
            </Dialog>
        </Page>
    );
}
