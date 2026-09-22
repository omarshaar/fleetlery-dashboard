import { faker } from "@faker-js/faker";

import type { KanbanColumn, KanbanItem, KanbanUser } from "@/eano/components/blocks/Kanban/KanbanBlock";
import type { WeeklyTasksWidgetData } from "@/eano/components/widgets/WeeklyTasksWidget";
import type { SummaryListWidgetData } from "@/eano/components/widgets/SummaryListWidget";

export type TFunction = (key: string) => string;

export function buildTodoKanbanColumns(t: TFunction): KanbanColumn[] {
  return [
    {
      id: "backlog",
      name: t("todo.columns.backlog"),
      color: "#64748b",
      HeaderClassName: "bg-yellow-500/30",
    },
    {
      id: "inProgress",
      name: t("todo.columns.inProgress"),
      color: "#3b82f6",
      HeaderClassName: "bg-blue-500/30",
    },
    {
      id: "done",
      name: t("todo.columns.done"),
      color: "#22c55e",
      HeaderClassName: "bg-green-500/30",
    },
  ];
}

export function buildTodoUsers(): KanbanUser[] {
  return Array.from({ length: 4 }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  }));
}

const taskTitleKeys = [
  "todo.tasks.reviewNewOrders",
  "todo.tasks.replyCustomerQuestions",
  "todo.tasks.prepareSprint",
  "todo.tasks.fixCheckoutBug",
  "todo.tasks.updateProductCopy",
  "todo.tasks.auditDiscountRules",
  "todo.tasks.reviewReturns",
  "todo.tasks.syncInventory",
  "todo.tasks.qaLandingPage",
  "todo.tasks.planCampaign",
];

function pickTaskTitle(t: TFunction, index: number) {
  const key = taskTitleKeys[index % taskTitleKeys.length];
  return t(key);
}

export function buildTodoKanbanItems(t: TFunction, users: KanbanUser[]): KanbanItem[] {
  const now = Date.now();
  const columns = ["backlog", "inProgress", "done"] as const;

  return Array.from({ length: 14 }).map((_, index) => {
    const column = faker.helpers.arrayElement(columns);
    const startAt = faker.date.soon({ days: 4, refDate: now });
    const endAt = faker.date.soon({ days: 12, refDate: startAt });

    const owner = faker.datatype.boolean({ probability: 0.75 })
      ? faker.helpers.arrayElement(users)
      : null;

    return {
      id: faker.string.uuid(),
      name: pickTaskTitle(t, index),
      column,
      startAt,
      endAt,
      owner,
    };
  });
}

export function buildTodoSidebarTasks(t: TFunction): WeeklyTasksWidgetData {
  return {
    mainTitle: t("todo.sidebar.today.mainTitle"),
    title: t("todo.sidebar.today.subtitle"),
    stats: [
      { value: faker.number.int({ min: 8, max: 18 }), label: t("todo.sidebar.today.stats.planned") },
      { value: faker.number.int({ min: 3, max: 12 }), label: t("todo.sidebar.today.stats.inProgress") },
      { value: faker.number.int({ min: 1, max: 6 }), label: t("todo.sidebar.today.stats.blocked") },
    ],
    tasks: [
      {
        id: 1,
        title: t("todo.sidebar.today.items.triage"),
        desc: t("todo.sidebar.today.items.triageDesc"),
      },
      {
        id: 2,
        title: t("todo.sidebar.today.items.followUps"),
        desc: t("todo.sidebar.today.items.followUpsDesc"),
      },
      {
        id: 3,
        title: t("todo.sidebar.today.items.shipments"),
        desc: t("todo.sidebar.today.items.shipmentsDesc"),
      },
      {
        id: 4,
        title: t("todo.sidebar.today.items.analytics"),
        desc: t("todo.sidebar.today.items.analyticsDesc"),
      },
    ],
  };
}

export function buildTodoInsights(t: TFunction): SummaryListWidgetData {
  return {
    title: t("todo.sidebar.insights.title"),
    subtitle: t("todo.sidebar.insights.subtitle"),
    items: [
      {
        id: "i-1",
        title: t("todo.sidebar.insights.items.keepWipLow"),
        meta: t("todo.sidebar.insights.meta.recommended"),
      },
      {
        id: "i-2",
        title: t("todo.sidebar.insights.items.reviewDaily"),
        meta: t("todo.sidebar.insights.meta.tip"),
      },
      {
        id: "i-3",
        title: t("todo.sidebar.insights.items.limitBlocked"),
        meta: t("todo.sidebar.insights.meta.watch"),
      },
    ],
  };
}
