import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events, guests, rsvps } from "@/db/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { PublicEventHero } from "@/components/event/PublicEventHero";
import { PublicEventLayout } from "@/components/event/PublicEventLayout";
import { PublicRsvpIdentityForm } from "@/components/event/PublicRsvpIdentityForm";
import { RsvpForm } from "@/components/event/RsvpForm";

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

  const client = await clerkClient();
  const hostUser = await client.users.getUser(event.hostId).catch(() => null);
  const hostName = hostUser?.fullName ?? hostUser?.firstName ?? null;

  const attendeeRows = await db
    .select({ id: guests.id })
    .from(guests)
    .innerJoin(rsvps, eq(rsvps.guestId, guests.id))
    .where(eq(guests.eventId, event.id));

  const attendeeCount = attendeeRows.length;

  // If guestId supplied (after identity step), show full RSVP form
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

  const isPastDeadline = event.rsvpDeadline && event.rsvpDeadline < new Date();

  // After identity step: use the standard two-column layout for the full RSVP form
  if (guest) {
    return (
      <PublicEventLayout
        event={event}
        hostName={hostName}
        sidebarTitle="Will you join us?"
      >
        {isPastDeadline ? (
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
        )}
      </PublicEventLayout>
    );
  }

  // Identity step: hero layout
  return (
    <PublicEventHero event={event}>
      <h2 className="text-lg font-bold text-zinc-900 mb-1">Who&apos;s coming?</h2>
      {attendeeCount > 0 && (
        <p className="text-xs text-zinc-400 mb-4">
          Join the {attendeeCount} {attendeeCount === 1 ? "other" : "others"} who have already secured their spot for this magical evening.
        </p>
      )}
      {!attendeeCount && (
        <p className="text-xs text-zinc-400 mb-4">
          Join the others who have already secured their spot for this magical evening.
        </p>
      )}
      <PublicRsvpIdentityForm eventId={event.id} slug={slug} />
    </PublicEventHero>
  );
}
