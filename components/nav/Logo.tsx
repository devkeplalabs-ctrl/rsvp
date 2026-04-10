import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/dashboard"
      className="text-rose-700 font-bold text-xl tracking-widest uppercase"
    >
      RSVP
    </Link>
  );
}
