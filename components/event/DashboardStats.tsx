interface Props {
  totalRsvps: number;
  activeEvents: number;
}

export function DashboardStats({ totalRsvps, activeEvents }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-5 bg-stone-100 rounded-xl">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wide">Total RSVPs</p>
        <p className="text-3xl font-bold text-zinc-900 mt-1">{totalRsvps}</p>
      </div>
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wide">Active Events</p>
        <p className="text-3xl font-bold text-zinc-900 mt-1">{activeEvents}</p>
      </div>
    </div>
  );
}
