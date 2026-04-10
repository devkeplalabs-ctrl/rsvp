import { LucideIcon } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import Link from "next/link";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
        <Icon className="w-7 h-7 text-zinc-400" />
      </div>
      <div>
        <p className="text-zinc-900 font-semibold text-lg">{title}</p>
        <p className="text-zinc-500 text-sm mt-1 max-w-xs">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <LinkButton href={actionHref} variant="outline" className="mt-2">
          {actionLabel}
        </LinkButton>
      )}
    </div>
  );
}
