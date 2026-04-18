"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export interface CustomDetail {
  label: string;
  content: string;
}

interface Props {
  value: CustomDetail[];
  onChange: (details: CustomDetail[]) => void;
}

export function CustomDetailsEditor({ value, onChange }: Props) {
  const add = () => onChange([...value, { label: "", content: "" }]);

  const update = (index: number, field: keyof CustomDetail, text: string) => {
    const next = value.map((d, i) => (i === index ? { ...d, [field]: text } : d));
    onChange(next);
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {value.map((detail, i) => (
        <div key={i} className="rounded-lg border border-stone-200 bg-stone-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Label (e.g. Dress Code)"
              value={detail.label}
              onChange={(e) => update(i, "label", e.target.value)}
              className="bg-white"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <Textarea
            placeholder="Content (e.g. Smart casual)"
            value={detail.content}
            onChange={(e) => update(i, "content", e.target.value)}
            rows={2}
            className="bg-white"
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-4 h-4" /> Add detail
      </Button>
    </div>
  );
}
