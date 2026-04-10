import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "yes" | "no" | "maybe" | "pending";

const config: Record<Status, { label: string; className: string }> = {
  yes: {
    label: "Going",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  no: {
    label: "Can't go",
    className: "bg-zinc-100 text-zinc-500 border-zinc-200",
  },
  maybe: {
    label: "Maybe",
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  pending: {
    label: "Pending",
    className: "bg-zinc-100 text-zinc-400 border-zinc-200",
  },
};

interface Props {
  status: Status;
  className?: string;
}

export function RsvpStatusBadge({ status, className }: Props) {
  const { label, className: base } = config[status];
  return (
    <Badge variant="outline" className={cn(base, "font-medium text-xs", className)}>
      {label}
    </Badge>
  );
}
