interface Props {
  yes: number;
  no: number;
  maybe: number;
  total: number;
}

export function EventStatStrip({ yes, no, maybe, total }: Props) {
  return (
    <div className="flex gap-4 text-xs font-medium">
      <span className="text-zinc-500 uppercase tracking-wide">
        <span className="text-zinc-900 font-bold text-sm mr-1">{yes}</span>YES
      </span>
      <span className="text-zinc-500 uppercase tracking-wide">
        <span className="text-zinc-900 font-bold text-sm mr-1">{no}</span>NO
      </span>
      <span className="text-zinc-500 uppercase tracking-wide">
        <span className="text-zinc-900 font-bold text-sm mr-1">{maybe}</span>MAYBE
      </span>
      <span className="text-zinc-500 uppercase tracking-wide">
        <span className="text-zinc-900 font-bold text-sm mr-1">{total}</span>TOTAL
      </span>
    </div>
  );
}
