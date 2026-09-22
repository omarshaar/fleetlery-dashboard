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

import { Save, X, Droplet, PaintBucket } from "lucide-react";

interface EventCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: { start: Date; end: Date } | null;
  onSubmit: (event: {
    title: string;
    start: Date;
    end: Date;
    color: string;
  }) => void;
}

export function CalendarEventCreateDialog({
  open,
  onOpenChange,
  slot,
  onSubmit,
}: EventCreateDialogProps) {
  const { t } = useTranslation("components");

  const [title, setTitle] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [startTime, setStartTime] = React.useState("00:00");
  const [endTime, setEndTime] = React.useState("00:00");
  const [color, setColor] = React.useState("#3B82F6");

  const [colorDialogOpen, setColorDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!slot) return;

    setTitle("");

    setStartDate(slot.start);
    setEndDate(slot.end);

    setStartTime(slot.start.toTimeString().slice(0, 5));
    setEndTime(slot.end.toTimeString().slice(0, 5));

    setColor("#3B82F6");
  }, [slot]);

  const handleSubmit = () => {
    if (!startDate || !endDate) return;

    const s = new Date(startDate);
    const [sh, sm] = startTime.split(":");
    s.setHours(Number(sh), Number(sm));

    const e = new Date(endDate);
    const [eh, em] = endTime.split(":");
    e.setHours(Number(eh), Number(em));

    onSubmit({
      title: title || t("calender.event.untitled"),
      start: s,
      end: e,
      color,
    });

    onOpenChange(false);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* Main Dialog (Create Event)                               */}
      {/* ========================================================= */}
      <Dialog
        open={open && !colorDialogOpen} // يغلق عندما يفتح اللون
        onOpenChange={onOpenChange}
        title={t("calender.dialogs.create.title")}
        description={t("calender.dialogs.create.description")}
        size="md"
        trigger={null}
      >
        <div className="p-4 pt-0 flex flex-col gap-4">

          <Input
            label={t("calender.dialogs.create.fields.title")}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label={t("calender.dialogs.create.fields.startDate")}
              value={startDate || undefined}
              onChange={(v) => setStartDate(v ?? null)}
            />
            <TimePicker
              label={t("calender.dialogs.create.fields.startTime")}
              value={startTime}
              onChange={(v) => setStartTime(v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label={t("calender.dialogs.create.fields.endDate")}
              value={endDate || undefined}
              onChange={(v) => setEndDate(v ?? null)}
            />
            <TimePicker
              label={t("calender.dialogs.create.fields.endTime")}
              value={endTime}
              onChange={(v) => setEndTime(v)}
            />
          </div>

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

        <div className="flex justify-end gap-2 p-4 pt-0">
          <Button variant="outline" size="icon" onClick={() => onOpenChange(false)}>
            <X size={18} />
          </Button>

          <Button size="icon" onClick={handleSubmit} className="flex-1"> 
            <Save size={18} />
          </Button>
        </div>
      </Dialog>

      {/* ========================================================= */}
      {/* Color Picker Dialog                                      */}
      {/* ========================================================= */}
      <Dialog
        open={colorDialogOpen}
        onOpenChange={(v) => {
          setColorDialogOpen(v);
          if (!v) {
            setTimeout(() => onOpenChange(true), 10);
          }
        }}
        title={t("calender.dialogs.color.pickerTitle")}
        description={t("calender.dialogs.color.pickerDescription")}
        size="sm"
        trigger={null}
      >
        <div className="p-4">
          <ColorPicker
            defaultValue={color}
            onChange={(v) => setColor(v)}
          />
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
