import { PageHeader, Button } from "@/components";
import { Plus, Filter } from "lucide-react";
import { StatMiniWidget } from "@/eano/components/widgets/StatMiniWidget";
import { StatProgressWidget } from "@/eano/components/widgets/StatProgressWidget";
import { RotaryDialWidget } from "@/eano/components/widgets/DialControlWidget";
import { ClockPreviewWidget } from "@/eano/components/widgets/ClockPreviewWidget";
import { ContributionMatrixWidget } from "@/eano/components/widgets/ContributionMatrixWidget";
import {
  KanbanBlock,
  type KanbanColumn,
  type KanbanItem,
  type KanbanUser,
} from "@/eano/components/blocks/Kanban/KanbanBlock";
import { useState } from "react";
import { Page } from "@/eano/components/page/Page";

export default function ProjectsPage() {
  const [budgetValue, setBudgetValue] = useState(65);
  const kanbanUser: KanbanUser = {
    id: "u1",
    name: "Omar Shaar",
  };

  const kanbanColumns: KanbanColumn[] = [
    { id: "todo", name: "To Do", color: "#6B7280" },
    { id: "in-progress", name: "In Progress", color: "#F59E0B" },
    { id: "review", name: "Review", color: "#6366F1" },
    { id: "done", name: "Done", color: "#10B981" },
  ];

  const [kanbanItems, setKanbanItems] = useState<KanbanItem[]>([
    {
      id: "task-1",
      name: "Kickoff meeting",
      column: "todo",
      owner: kanbanUser,
    },
    {
      id: "task-2",
      name: "Requirements review",
      column: "todo",
      owner: kanbanUser,
    },
    {
      id: "task-3",
      name: "UI wireframes",
      column: "in-progress",
      startAt: new Date("2024-01-12"),
      endAt: new Date("2024-01-18"),
      owner: kanbanUser,
    },
    {
      id: "task-4",
      name: "API integration",
      column: "review",
      startAt: new Date("2024-01-18"),
      endAt: new Date("2024-01-22"),
      owner: kanbanUser,
    },
    {
      id: "task-5",
      name: "QA checklist",
      column: "review",
      startAt: new Date("2024-01-22"),
      endAt: new Date("2024-01-24"),
      owner: kanbanUser,
    },
    {
      id: "task-6",
      name: "Release v1",
      column: "done",
      startAt: new Date("2024-01-26"),
      endAt: new Date("2024-01-26"),
      owner: kanbanUser,
    },
  ]);

  return (
    <Page>
      {/* Page Header */}
      <PageHeader title="Projects" subtitle="Manage and track your projects">
        <Button size="sm" variant="outline">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </PageHeader>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[120px] md:auto-rows-[140px]">
        <StatMiniWidget
          data={{
            title: "Total Projects",
            value: "48",
            growth: 12.5,
            subtitle: "this month",
          }}
          animated={true}
        />

        <StatMiniWidget
          data={{
            title: "Active Projects",
            value: "32",
            growth: 8.3,
            subtitle: "in progress",
          }}
          animated={true}
        />

        <StatMiniWidget
          data={{
            title: "Completed",
            value: "16",
            growth: -2.4,
            subtitle: "this month",
          }}
          animated={true}
        />

        <StatProgressWidget
          data={{
            title: "Completion Rate",
            growth: 5.2,
            growthLabel: "from last month",
            progress: 67,
          }}
          animated={true}
        />
      </div>

      {/* Additional Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-3 xl:gap-3 auto-rows-[140px]">
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 col-span-2 row-span-1 xl:grid-cols-1 xl:col-span-1 xl:row-span-2 gap-3">
          <ClockPreviewWidget
            data={{
              format: "12",
              timeZone: "America/New_York",
            }}
          />
          <RotaryDialWidget
            data={{
              min: 0,
              max: 100,
              value: budgetValue,
              step: 5,
              title: "Budget Allocation",
              subtitle: "Project Resources",
              unitLabel: "%",
            }}
            onValueChange={(v) => setBudgetValue(v)}
          />
        </div>

        <ContributionMatrixWidget
          data={{
            title: "Project Activity",
            subtitle: "Team contributions over the year",
            days: [
              { date: "2024-01-01", value: 8 },
              { date: "2024-01-15", value: 4 },
              { date: "2024-02-10", value: 6 },
              { date: "2024-03-05", value: 3 },
              { date: "2024-04-12", value: 7 },
              { date: "2024-05-08", value: 5 },
              { date: "2024-06-01", value: 4 },
              { date: "2024-06-15", value: 9 },
              { date: "2024-07-05", value: 6 },
              { date: "2024-07-20", value: 3 },
              { date: "2024-08-10", value: 8 },
              { date: "2024-09-12", value: 4 },
              { date: "2024-10-03", value: 7 },
              { date: "2024-11-20", value: 5 },
              { date: "2024-12-15", value: 6 },
              { date: "2025-01-10", value: 9 },
            ],
          }}
          onDayClick={(day) => console.log("Clicked:", day)}
          className="col-span-3 row-span-2"
        />
      </div>

      {/* Projects kanban */}
      <div className="w-full rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-neutral-700 p-4 flex flex-col justify-around shadow-sm dark:shadow-none overflow-hidden eano-widget">
        <p className="mb-4 font-bold text-xl"> Projects Todo </p>
        <KanbanBlock
          columns={kanbanColumns}
          items={kanbanItems}
          onChange={setKanbanItems}
          className="min-w-[900px] gap-3"
        />
      </div>
    </Page>
  );
}
