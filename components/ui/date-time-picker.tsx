"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  value: string; // ISO datetime string or ""
  onChange: (value: string) => void;
  name: string;
  placeholder?: string;
  required?: boolean;
}

function toLocalDatetimeString(date: Date, time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  // Return as ISO string
  return d.toISOString();
}

function parseDate(value: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function parseTime(value: string): string {
  if (!value) return "12:00";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "12:00";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function DateTimePicker({
  value,
  onChange,
  name,
  placeholder = "Pick a date",
  required,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDate(value);
  const selectedTime = parseTime(value);

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;
    onChange(toLocalDatetimeString(day, selectedTime));
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDate) {
      onChange(toLocalDatetimeString(selectedDate, e.target.value));
    }
  };

  const displayLabel = selectedDate
    ? `${format(selectedDate, "MMM d, yyyy")} at ${selectedTime}`
    : null;

  return (
    <div className="flex gap-2">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} required={required} />

      {/* Date picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            "flex h-8 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-sm transition-colors hover:bg-muted",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarDays className="w-4 h-4 shrink-0" />
          <span className="truncate">{displayLabel ?? placeholder}</span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDaySelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Time input */}
      <Input
        type="time"
        value={selectedTime}
        onChange={handleTimeChange}
        disabled={!selectedDate}
        className="w-28 shrink-0"
      />
    </div>
  );
}
