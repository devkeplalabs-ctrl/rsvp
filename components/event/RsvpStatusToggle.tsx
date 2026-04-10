"use client";

import { cn } from "@/lib/utils";

type Status = "yes" | "no" | "maybe";

interface Props {
  value: Status;
  onChange: (s: Status) => void;
}

const options: { value: Status; label: string }[] = [
  { value: "yes", label: "Going" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "Can't go" },
];

export function RsvpStatusToggle({ value, onChange }: Props) {
  return (
    <div className="flex rounded-lg border border-stone-200 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 py-2.5 text-sm font-medium transition-colors border-r last:border-r-0 border-stone-200",
            value === opt.value
              ? "bg-rose-700 text-white"
              : "bg-white text-zinc-500 hover:bg-stone-50"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
