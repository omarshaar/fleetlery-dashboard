"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  Button,
  Input,
  DatePicker,
  TimePicker,
  ColorPicker,
} from "@/components";
import { Save, X, Trash2, Droplet, PaintBucket } from "lucide-react";

interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface EventEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  onSave: (updatedEvent: CalendarEvent) => void;
  onDelete: (id: CalendarEvent["id"]) => void;
}

export function CalendarEventEditDialog({
  open,
  onOpenChange,
  event,
  onSave,
  onDelete,
}: EventEditDialogProps) {
  const { t } = useTranslation("components");

  const [title, setTitle] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [startTime, setStartTime] = React.useState("00:00");
  const [endTime, setEndTime] = React.useState("00:00");
  const [color, setColor] = React.useState("#3B82F6");

  // dialog تبع اللون
  const [colorDialogOpen, setColorDialogOpen] = React.useState(false);

  // تحميل بيانات الحدث عند الدخول
  React.useEffect(() => {
    if (!event) return;

    setTitle(event.title);

    setStartDate(event.start);
    setEndDate(event.end);

    setStartTime(event.start.toTimeString().slice(0, 5));
    setEndTime(event.end.toTimeString().slice(0, 5));

    setColor(event.color ?? "#3B82F6");
  }, [event]);

  const handleSaveEvent = () => {
    if (!event || !startDate || !endDate) return;

    const s = new Date(startDate);
    const [sh, sm] = startTime.split(":");
    s.setHours(Number(sh), Number(sm));

    const e = new Date(endDate);
    const [eh, em] = endTime.split(":");
    e.setHours(Number(eh), Number(em));

    onSave({
      ...event,
      title,
      start: s,
      end: e,
      color,
    });

    onOpenChange(false);
  };

  return (
    <>
      {/* Main Edit Dialog */}
      <Dialog
        open={open && !colorDialogOpen}
        onOpenChange={onOpenChange}
        title={t("calender.dialogs.edit.title")}
        description={t("calender.dialogs.edit.description")}
        size="md"
        trigger={null}
      >
        <div className="p-4 pt-0 flex flex-col gap-4">
          <Input
            label={t("calender.dialogs.edit.fields.title")}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label={t("calender.dialogs.edit.fields.startDate")}
              value={startDate || undefined}
              onChange={(v) => setStartDate(v ?? null)}
            />
            <TimePicker
              label={t("calender.dialogs.edit.fields.startTime")}
              value={startTime}
              onChange={(v) => setStartTime(v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label={t("calender.dialogs.edit.fields.endDate")}
              value={endDate || undefined}
              onChange={(v) => setEndDate(v ?? null)}
            />
            <TimePicker
              label={t("calender.dialogs.edit.fields.endTime")}
              value={endTime}
              onChange={(v) => setEndTime(v)}
            />
          </div>

          {/* زر لون داخل EditDialog */}
          <div className="flex flex-col gap-1">
            <p className="text-sm opacity-70">{t("calender.dialogs.color.label")}</p>

            <Button
              variant="outline"
              size="sm"
              className="w-max flex items-center gap-2"
              onClick={() => setColorDialogOpen(true)}
            >
              <span
                className="w-4 h-4 rounded-full border"
                style={{ background: color }}
              />
                {t("calender.dialogs.color.change")}
              <Droplet size={16} />
            </Button>
          </div>
        </div>

        <div className="flex pt-0 gap-2 mt-3">
          {/* DELETE BUTTON */}
          <Button
            variant="destructive"
            size="icon"
            onClick={() => event && onDelete(event.id)}
          >
            <Trash2 size={18} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </Button>

          <Button size="icon" onClick={handleSaveEvent} className="flex-1">
            <Save size={18} />
          </Button>
        </div>
      </Dialog>

      {/* Color Picker inside second dialog */}
      <Dialog
        open={colorDialogOpen}
        onOpenChange={(v) => {
          setColorDialogOpen(v);

          if (!v && open) {
            setTimeout(() => onOpenChange(true), 15);
          }
        }}
        title={t("calender.dialogs.color.pickerTitle")}
        description={t("calender.dialogs.color.pickerDescription")}
        size="sm"
        trigger={null}
      >
        <div className="p-4">
          <ColorPicker defaultValue={color} onChange={(v) => setColor(v)} />
        </div>

        <div className="flex justify-end p-4 pt-0">
          <Button
            variant="outline"
            size="icon"
            className="w-full"
            onClick={() => setColorDialogOpen(false)}
          >
            <PaintBucket size={18} />
          </Button>
        </div>
      </Dialog>
    </>
  );
}
