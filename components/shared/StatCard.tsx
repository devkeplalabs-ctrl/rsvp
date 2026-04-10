import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
  iconClassName?: string;
}

export function StatCard({ icon: Icon, label, value, iconClassName }: Props) {
  return (
    <Card>
      <CardContent className="p-5 flex items-start gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
            iconClassName ?? "bg-stone-100"
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-900">{value}</p>
          <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
