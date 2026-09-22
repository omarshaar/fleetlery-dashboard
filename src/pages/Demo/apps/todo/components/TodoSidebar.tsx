import { LayoutList, Lightbulb, Plus, Sparkles } from "lucide-react";

import { Button } from "@/eano/components/base-ui/Button";

type Counts = {
    planned: number;
    inProgress: number;
    blocked: number;
};

export type TodoSidebarProps = {
    t: (key: string) => string;
    counts: Counts;
    onOpenCreate: () => void;
};

export function TodoSidebar({
    t,
    counts,
    onOpenCreate,
}: TodoSidebarProps) {
    return (
        <div className="space-y-3">
            <div className="rounded-2xl border border-border/80 bg-white/70 dark:bg-black/40 backdrop-blur shadow-sm p-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                            {t("todo.sidebar.today.mainTitle")}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {t("todo.sidebar.today.subtitle")}
                        </div>
                    </div>
                    <LayoutList className="h-4 w-4 text-neutral-500" />
                </div>

                <div className="mt-3 rounded-md shadow-sm p-2 bg-primary">
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-white dark:text-black">
                            {t("todo.board.title")}
                        </div>
                        <Button size="sm" variant="outline" onClick={onOpenCreate} className="bg-white! text-black! text-sm!">
                            <Plus className="h-4 w-4" />
                            {t("todo.actions.addTask")}
                        </Button>
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-md p-2 border border-yellow-600/80 bg-yellow-600/20! ">
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {t("todo.sidebar.today.stats.planned")}
                        </div>
                        <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                            {counts.planned}
                        </div>
                    </div>
                    <div className="rounded-md p-2 border border-blue-600/80 bg-blue-600/20! ">
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {t("todo.sidebar.today.stats.inProgress")}
                        </div>
                        <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                            {counts.inProgress}
                        </div>
                    </div>
                    <div className="rounded-md p-2 border border-green-600/80 bg-green-600/20!">
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {t("todo.sidebar.today.stats.blocked")}
                        </div>
                        <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                            {counts.blocked}
                        </div>
                    </div>
                </div>

                <div className="mt-3 space-y-2">
                    {["triage", "followUps", "shipments", "analytics"].map((key) => (
                        <div
                            key={key}
                            className="rounded-md border border-border bg-white dark:bg-neutral-950 p-2 hover:bg-gray-50 dark:hover:bg-neutral-900 transition"
                        >
                            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                {t(`todo.sidebar.today.items.${key}`)}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                {t(`todo.sidebar.today.items.${key}Desc`)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white/70 dark:bg-black/40 backdrop-blur shadow-sm p-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                            {t("todo.sidebar.insights.title")}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {t("todo.sidebar.insights.subtitle")}
                        </div>
                    </div>
                    <Sparkles className="h-4 w-4 text-neutral-500" />
                </div>

                <div className="mt-3 space-y-2">
                    {[
                        {
                            tag: t("todo.sidebar.insights.meta.recommended"),
                            icon: <Lightbulb className="h-4 w-4" />,
                            text: t("todo.sidebar.insights.items.keepWipLow"),
                        },
                        {
                            tag: t("todo.sidebar.insights.meta.tip"),
                            icon: <Lightbulb className="h-4 w-4" />,
                            text: t("todo.sidebar.insights.items.reviewDaily"),
                        },
                        {
                            tag: t("todo.sidebar.insights.meta.watch"),
                            icon: <Lightbulb className="h-4 w-4" />,
                            text: t("todo.sidebar.insights.items.limitBlocked"),
                        },
                    ].map((it) => (
                        <div
                            key={it.tag}
                            className="flex items-start gap-2 rounded-md border border-border bg-white dark:bg-neutral-950 p-2"
                        >
                            <div className="mt-0.5 text-neutral-500 dark:text-neutral-400">
                                {it.icon}
                            </div>
                            <div className="min-w-0">
                                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                    {it.tag}
                                </div>
                                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                                    {it.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
