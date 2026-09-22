import type { SelectOption } from "@/eano/components/base-ui/Select";
import type { KanbanItem } from "@/eano/components/blocks/Kanban/KanbanBlock";
import type { FormConfig, FormField } from "@/eano/form-builder/types/form.types";

export const TODO_UNASSIGNED_OWNER = "__unassigned__";

// `t` comes from i18next and has multiple overloads; keep this flexible.
type Translate = (...args: any[]) => any;

type TodoUser = {
    id: string;
    name: string;
};

type BuildTodoCreateTaskFormParams = {
    t: Translate;
    users: TodoUser[];
    columnOptions: SelectOption[];
    ownerOptions: SelectOption[];
    onAddItem: (item: KanbanItem) => void;
    onClose: () => void;
    unassignedOwner?: string;
};

export function buildTodoCreateTaskForm({
    t,
    users,
    columnOptions,
    ownerOptions,
    onAddItem,
    onClose,
    unassignedOwner = TODO_UNASSIGNED_OWNER,
}: BuildTodoCreateTaskFormParams): { config: FormConfig; schema: FormField[] } {
    const config: FormConfig = {
        formId: "todoCreateTask",
        onSubmit: async ({ values, ctx }) => {
            const title = String(values.title ?? "").trim();
            const column = String(values.column ?? "backlog");
            const ownerId = String(values.ownerId ?? unassignedOwner);

            const owner =
                ownerId === unassignedOwner
                    ? null
                    : (users.find((u) => u.id === ownerId) ?? null);

            const next: KanbanItem = {
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                name: title,
                column,
                startAt: new Date(),
                endAt: undefined,
                owner,
            };

            onAddItem(next);

            // Reset defaults for next open
            ctx.setValue("title", "");
            ctx.setValue("column", "backlog");
            ctx.setValue("ownerId", unassignedOwner);

            onClose();
        },
    };

    const schema: FormField[] = [
        {
            type: "input",
            name: "title",
            label: t("todo.dialog.create.fields.title"),
            placeholder: t("todo.dialog.create.placeholders.title"),
            grid: "12",
            validation: "required|min:2",
        },
        {
            type: "select",
            name: "column",
            label: t("todo.dialog.create.fields.column"),
            grid: "12 md:6",
            defaultValue: "backlog",
            validation: "required",
            props: {
                placeholder: t("todo.dialog.create.placeholders.column"),
                options: columnOptions,
            },
        },
        {
            type: "select",
            name: "ownerId",
            label: t("todo.dialog.create.fields.owner"),
            grid: "12 md:6",
            defaultValue: unassignedOwner,
            props: {
                placeholder: t("todo.dialog.create.placeholders.owner"),
                options: ownerOptions,
            },
        },
        {
            type: "container",
            grid: "12",
            className: "flex items-center justify-end gap-2 pt-2",
            children: [
                {
                    type: "button",
                    name: "cancel",
                    grid: "12 sm:6",
                    props: {
                        text: t("todo.dialog.create.actions.cancel"),
                        type: "button",
                        variant: "outline",
                        onClick: onClose,
                    },
                },
                {
                    type: "button",
                    name: "create",
                    grid: "12 sm:6",
                    props: {
                        text: t("todo.dialog.create.actions.create"),
                        type: "submit",
                    },
                },
            ],
        },
    ];

    return { config, schema };
}
