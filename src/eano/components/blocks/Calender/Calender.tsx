// =============================================
// CalenderBlock Component
// Uses external CalendarEventCreateDialog
// Now also supports EventEditDialog
// =============================================

"use client";

import * as React from "react";
import {
  Calendar,
  Views,
  type View,
  type NavigateAction,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useTranslation } from "react-i18next";

import { localizer } from "@/eano/components/blocks/Calender/localizer";
import "@/eano/components/blocks/Calender/calendar.css";

import { CalendarEventCreateDialog } from "./components/EventCreateDialog";
import { CalendarEventEditDialog } from "./components/EventEditDialog";

export interface CalenderEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

export interface CalenderBlockProps {
  events?: CalenderEvent[];
  defaultView?: View;
  views?: Array<View>;
  height?: string | number;
  className?: string;
  onCreateEvent?: (event: CalenderEvent) => void;
  onEditEvent?: (event: CalenderEvent) => void;
  onDeleteEvent?: (id: string | number) => void;
  onNavigate?: (date: Date, view: View, action: NavigateAction) => void;
}

export function CalenderBlock({
  events = [],
  defaultView = Views.MONTH,
  views = ["month", "week", "day"],
  height = "84dvh",
  className = "p-4 bg-card rounded-md shadow w-full h-full",
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onNavigate,
}: CalenderBlockProps) {
  const { t, i18n } = useTranslation("components");

  const [view, setView] = React.useState<View>(defaultView);
  const [date, setDate] = React.useState<Date>(new Date());
  const [internalEvents, setInternalEvents] =
    React.useState<CalenderEvent[]>(events);

  const culture = React.useMemo(() => {
    const base = (i18n.resolvedLanguage || i18n.language || "en")
      .toLowerCase()
      .split("-")[0];
    if (base === "ar" || base === "de" || base === "en") return base;
    return "en";
  }, [i18n.language, i18n.resolvedLanguage]);

  const rbcMessages = React.useMemo(
    () => ({
      today: t("calender.rbc.today"),
      previous: t("calender.rbc.previous"),
      next: t("calender.rbc.next"),
      month: t("calender.rbc.month"),
      week: t("calender.rbc.week"),
      day: t("calender.rbc.day"),
      agenda: t("calender.rbc.agenda"),
      date: t("calender.rbc.date"),
      time: t("calender.rbc.time"),
      event: t("calender.rbc.event"),
      noEventsInRange: t("calender.rbc.noEventsInRange"),
      showMore: (total: number) => t("calender.rbc.showMore", { count: total }),
    }),
    [t, i18n.language]
  );

  // =====================================================
  // Create Event Dialog
  // =====================================================

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [pendingSlot, setPendingSlot] = React.useState<any>(null);

  // =====================================================
  // Edit Event Dialog (NEW)
  // =====================================================

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<CalenderEvent | null>(
    null
  );

  React.useEffect(() => {
    setInternalEvents(events);
  }, [events]);

  // =====================================================
  // Slot selection → Create Dialog
  // =====================================================

  const handleSlotSelect = (slot: any) => {
    // Normalize dates to handle both date-only and datetime selections
    const startTime = new Date(slot.start).getTime();
    const endTime = new Date(slot.end).getTime();
    
    // react-big-calendar in month view adds an extra day to slot.end
    // Check if this is a multi-day selection by comparing timestamps
    const isMultiDay = endTime - startTime > 24 * 60 * 60 * 1000;
    
    let finalEnd = new Date(slot.end);
    
    if (isMultiDay) {
      // For multi-day selections, subtract 1 day but keep the time
      finalEnd = new Date(endTime - 24 * 60 * 60 * 1000);
    }
    
    // If start is after or equal to end, make it a single point in time
    if (startTime >= finalEnd.getTime()) {
      setPendingSlot({
        start: slot.start,
        end: slot.start,
      });
    } else {
      setPendingSlot({
        start: slot.start,
        end: finalEnd,
      });
    }

    setCreateDialogOpen(true);
  };

  // =====================================================
  // Event selection → Edit Dialog (NEW)
  // =====================================================

  const handleEditDelete = (event: CalenderEvent) => {
    setEditingEvent(event);
    setEditDialogOpen(true);
  };

  return (
    <div className={className} style={{direction: "ltr"}}>
      <Calendar
        localizer={localizer}
        events={internalEvents}
        view={view}
        onView={setView}
        date={date}
        culture={culture}
        messages={rbcMessages}
        onNavigate={(newDate, _view, _action) => {
          setDate(newDate);
          onNavigate?.(newDate, _view, _action);
        }}
        views={views}
        selectable
        style={{ height }}
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEditDelete}
        eventPropGetter={(event) => {
          const bg = event.color || "#3B82F6";
          return {
            style: {
              backgroundColor: bg,
              borderRadius: "6px",
              color: "#fff",
            },
          };
        }}
      />

      {/* ====================================== */}
      {/* CREATE EVENT DIALOG                   */}
      {/* ====================================== */}

      <CalendarEventCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        slot={pendingSlot}
        onSubmit={(ev) => {
          const newEvent = {
            ...ev,
            id: Date.now(),
          };

          onCreateEvent?.(newEvent);

          setInternalEvents((prev) => [...prev, newEvent]);
        }}
      />

      {/* ====================================== */}
      {/* EDIT EVENT DIALOG (NEW)               */}
      {/* ====================================== */}

      <CalendarEventEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        event={editingEvent}
        onSave={(updatedEvent) => {
          onEditEvent?.(updatedEvent);

          setInternalEvents((prev) =>
            prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
          );
        }}
        onDelete={(id) => {
          onDeleteEvent?.(id);

          setInternalEvents((prev) => prev.filter((ev) => ev.id !== id));

          setEditDialogOpen(false);
        }}
      />
    </div>
  );
}

export default CalenderBlock;
