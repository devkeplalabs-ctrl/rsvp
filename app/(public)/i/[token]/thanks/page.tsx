import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/db";
import { guests, events, rsvps } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { RsvpStatusBadge } from "@/components/shared/RsvpStatusBadge";

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const [guest] = await db
    .select()
    .from(guests)
    .where(eq(guests.inviteToken, token))
    .limit(1);

  if (!guest) notFound();

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, guest.eventId))
    .limit(1);

  const [rsvp] = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.guestId, guest.id))
    .limit(1);

  const dateStr = event
    ? new Date(event.startsAt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      })
    : "";
  const timeStr = event
    ? new Date(event.startsAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const hostFirstName = guest.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Checkmark */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 border-4 border-rose-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-rose-700" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-zinc-900">You&apos;re in! 🎉</h1>
          <p className="text-zinc-500 mt-2 text-sm">
            We&apos;ve told {hostFirstName} you&apos;re coming.
          </p>
        </div>

        {/* Mini event card */}
        {event && (
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-left flex gap-3 items-start">
            {event.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-200 to-stone-200 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-zinc-900 text-sm truncate">{event.title}</p>
                {rsvp && <RsvpStatusBadge status={rsvp.status} />}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{dateStr}</p>
              <p className="text-xs text-zinc-500">{timeStr}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full bg-rose-700 hover:bg-rose-800 text-white">
            Add to Calendar
          </Button>
          <Button variant="outline" className="w-full">
            Share with friends
          </Button>
          <Link
            href={`/i/${token}`}
            className="block text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            Change your response
          </Link>
        </div>
      </div>
    </div>
  );
}
