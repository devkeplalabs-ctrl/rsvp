import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events, users, guests, rsvps } from "@/db/schema";
import { PublicEventLayout } from "@/components/event/PublicEventLayout";
import { PublicRsvpIdentityForm } from "@/components/event/PublicRsvpIdentityForm";
import { RsvpForm } from "@/components/event/RsvpForm";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ guestId?: string }>;
}

export default async function PublicEventPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { guestId } = await searchParams;

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.publicSlug, slug))
    .limit(1);

  if (!event) notFound();

  const [host] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, event.hostId))
    .limit(1);

  // Attendee count for social proof
  const attendeeCount = await db
    .select({ id: guests.id })
    .from(guests)
    .innerJoin(rsvps, eq(rsvps.guestId, guests.id))
    .where(eq(guests.eventId, event.id));

  // If guestId supplied (after identity step), show RSVP form
  let guest = null;
  let existingRsvp = null;
  if (guestId) {
    const rows = await db
      .select()
      .from(guests)
      .where(eq(guests.id, guestId))
      .limit(1);
    guest = rows[0] ?? null;

    if (guest) {
      const rsvpRows = await db
        .select()
        .from(rsvps)
        .where(eq(rsvps.guestId, guest.id))
        .limit(1);
      existingRsvp = rsvpRows[0] ?? null;
    }
  }

  const isPastDeadline =
    event.rsvpDeadline && event.rsvpDeadline < new Date();

  return (
    <PublicEventLayout
      event={event}
      hostName={host?.name ?? null}
      sidebarTitle={guest ? "Will you join us?" : "Who's coming?"}
      badge={
        <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-xs font-medium">
          Public Event
        </Badge>
      }
    >
      {guest ? (
        isPastDeadline ? (
          <p className="text-zinc-500 text-sm">
            The RSVP deadline for this event has passed.
          </p>
        ) : (
          <RsvpForm
            guestId={guest.id}
            guestName={guest.name}
            allowPlusOnes={event.allowPlusOnes}
            maxPlusOnes={event.maxPlusOnes}
            existingStatus={existingRsvp?.status}
            existingPlusOnes={existingRsvp?.plusOnes}
            thankYouPath={`/e/${slug}/thanks`}
          />
        )
      ) : (
        <div className="space-y-4">
          <PublicRsvpIdentityForm eventId={event.id} slug={slug} />
          {attendeeCount.length > 0 && (
            <p className="text-xs text-zinc-400 text-center">
              {attendeeCount.length} others attending
            </p>
          )}
          {host?.name && (
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
              <div className="w-7 h-7 rounded-full bg-rose-700 flex items-center justify-center text-white text-xs font-bold">
                {host.name[0]?.toUpperCase()}
              </div>
              <div className="text-xs text-zinc-500">
                <span className="text-zinc-300 uppercase text-[10px] tracking-widest block">Hosted by</span>
                {host.name}
              </div>
            </div>
          )}
        </div>
      )}
    </PublicEventLayout>
  );
}
