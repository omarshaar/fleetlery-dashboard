"use client";

import * as React from "react";

import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
} from "@/eano/design-system/shadcn/kanban";
import { cn } from "@/eano/lib/utils";

/* ======================================================
   🔹 Types
====================================================== */

export type KanbanColumn = {
  id: string;
  name: string;
  color: string;
  /** Optional CSS class applied to this column header. */
  HeaderClassName?: string;
};

export type KanbanUser = {
  id: string;
  name: string;
};

export type KanbanItem = {
  id: string;
  name: string;
  column: string;
  startAt?: Date;
  endAt?: Date;
  owner?: KanbanUser | null;
};

export interface KanbanBlockProps {
  columns: KanbanColumn[];
  items: KanbanItem[];
  onChange?: (updated: KanbanItem[]) => void;
  className?: string;
  /** Locale used for date formatting inside cards (defaults to en-US). */
  locale?: string;
  /** Label shown before the owner name (defaults to "Owner"). */
  ownerLabel?: string;
  /** Optional CSS class names for the header */
  HeaderClassName?: string;
}

/* ======================================================
   🔹 Component
====================================================== */

export function KanbanBlock({
  columns,
  items,
  onChange,
  className,
  locale = "en-US",
  ownerLabel = "Owner",
  HeaderClassName,
}: KanbanBlockProps) {
  const [data, setData] = React.useState(items);

  // sync when parent changes
  React.useEffect(() => {
    setData(items);
  }, [items]);

  const handleChange = (updated: KanbanItem[]) => {
    setData(updated);
    onChange?.(updated);
  };

  const dateLong = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const dateShort = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  });

  return (
    <div className={className}>
      <KanbanProvider columns={columns} data={data} onDataChange={handleChange}>
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            {/* Header */}
            <KanbanHeader className={cn(HeaderClassName, column.HeaderClassName)}>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <span>{column.name}</span>
              </div>
            </KanbanHeader>

            {/* Cards */}
            <KanbanCards id={column.id}>
              {(item: KanbanItem) => (
                <KanbanCard
                  className="data-[dragging=true]:transition-none"
                  key={item.id}
                  id={item.id}
                  column={column.id}
                  name={item.name}
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm m-0">{item.name}</p>

                    {(item.startAt || item.endAt) && (
                      <p className="text-muted-foreground text-xs m-0">
                        {item.startAt && dateShort.format(new Date(item.startAt))}
                        {" - "}
                        {item.endAt && dateLong.format(new Date(item.endAt))}
                      </p>
                    )}

                    {item.owner && (
                      <p className="text-xs text-muted-foreground m-0">
                        {ownerLabel}: {item.owner.name}
                      </p>
                    )}
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
}
