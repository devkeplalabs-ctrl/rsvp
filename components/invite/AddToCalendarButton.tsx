"use client";

import { useState, useRef, useEffect } from "react";
import type { Event } from "@/db/schema";

interface Props {
  event: Event;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIcsDate(d: Date) {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function googleUrl(event: Event) {
  const start = toIcsDate(event.startsAt);
  const end = event.endsAt ? toIcsDate(event.endsAt) : toIcsDate(new Date(event.startsAt.getTime() + 2 * 3600_000));
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    ...(event.description ? { details: event.description } : {}),
    ...(event.location ? { location: event.location } : {}),
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

function buildIcs(event: Event) {
  const start = toIcsDate(event.startsAt);
  const end = event.endsAt ? toIcsDate(event.endsAt) : toIcsDate(new Date(event.startsAt.getTime() + 2 * 3600_000));
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//rsvp//EN",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}` : null,
    event.location ? `LOCATION:${event.location}` : null,
    `UID:${event.id}@rsvp`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  return lines;
}

function downloadIcs(event: Event) {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AddToCalendarButton({ event }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        className="inv-btn-primary"
        onClick={() => setOpen((o) => !o)}
      >
        <CalendarIcon />
        Add to calendar
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="inv-cal-menu">
          <a
            href={googleUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="inv-cal-option"
            onClick={() => setOpen(false)}
          >
            <GoogleIcon /> Google Calendar
          </a>
          <button
            type="button"
            className="inv-cal-option"
            onClick={() => { downloadIcs(event); setOpen(false); }}
          >
            <AppleIcon /> Apple Calendar
          </button>
          <button
            type="button"
            className="inv-cal-option"
            onClick={() => { downloadIcs(event); setOpen(false); }}
          >
            <OutlookIcon /> Outlook
          </button>
        </div>
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ marginLeft: 2, transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none" }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 7.4l-12-2.4v14l12-2.4V7.4zM11 17.5L0 15.9V8.1L11 6.5v11z" opacity=".9"/>
      <path d="M5.5 9.5h3c.8 0 1.5.3 1.9.8.4.5.6 1.1.6 1.9 0 .9-.2 1.6-.7 2.1-.5.5-1.1.8-1.9.8H5.5V9.5zm1.5 4.2h1.3c.4 0 .7-.1.9-.4.2-.3.3-.6.3-1.1 0-.5-.1-.8-.3-1.1-.2-.3-.5-.4-.9-.4H7v3z"/>
    </svg>
  );
}
