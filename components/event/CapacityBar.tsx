interface Props {
  used: number;
  total: number;
}

export function CapacityBar({ used, total }: Props) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const remaining = total - used;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-zinc-900">Capacity</span>
        <span className="text-zinc-500">{used} / {total} guests</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-700 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500">
        {remaining > 0
          ? `${remaining} spots remaining. You're well within the venue's limit.`
          : "Event is at capacity."}
      </p>
    </div>
  );
}
