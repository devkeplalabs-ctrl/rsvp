"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/event-templates";
import type { EventCategory } from "@/lib/event-templates";

interface Props {
  defaultValue?: EventCategory;
}

export function TemplatePicker({ defaultValue = "birthday" }: Props) {
  const [selected, setSelected] = useState<EventCategory>(defaultValue);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {TEMPLATES.map((t) => {
          const active = selected === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setSelected(t.key)}
              className={`relative flex flex-col items-start gap-1.5 rounded-xl border px-3 py-3 text-left transition-all ${
                active
                  ? "border-2 shadow-sm"
                  : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
              }`}
              style={
                active
                  ? { borderColor: t.swatch, backgroundColor: t.swatch + "12" }
                  : {}
              }
            >
              <span
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{ background: t.swatch }}
              />
              <span
                className="text-xs font-semibold leading-tight"
                style={active ? { color: t.swatch } : { color: "#44403c" }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
      <input type="hidden" name="category" value={selected} />
    </div>
  );
}
