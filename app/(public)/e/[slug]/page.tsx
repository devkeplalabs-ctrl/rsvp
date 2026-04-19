import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events, guests, rsvps } from "@/db/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { getTemplate } from "@/lib/event-templates";
import { InviteTemplate } from "@/components/invite/InviteTemplate";


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

  const template = getTemplate(event.category);

  const attendeeRows = await db
    .select({ id: guests.id })
    .from(guests)
    .innerJoin(rsvps, eq(rsvps.guestId, guests.id))
    .where(eq(guests.eventId, event.id));

  const attendeeCount = attendeeRows.length;

  let initialGuestId: string | undefined;
  let initialGuestName: string | undefined;
  let existingRsvp = null;

  if (guestId) {
    const rows = await db.select().from(guests).where(eq(guests.id, guestId)).limit(1);
    const guest = rows[0] ?? null;
    if (guest) {
      initialGuestId = guest.id;
      initialGuestName = guest.name;
      const rsvpRows = await db.select().from(rsvps).where(eq(rsvps.guestId, guest.id)).limit(1);
      existingRsvp = rsvpRows[0] ?? null;
    }
  }

  const isPastDeadline = !!(event.rsvpDeadline && event.rsvpDeadline < new Date());

  const client = await clerkClient();
  const hostUser = await client.users.getUser(event.hostId).catch(() => null);
  const hostName = hostUser?.fullName ?? hostUser?.firstName ?? null;

  return (
    <InviteTemplate
      event={event}
      template={template}
      hostName={hostName}
      attendeeCount={attendeeCount}
      initialGuestId={initialGuestId}
      initialGuestName={initialGuestName}
      existingRsvp={existingRsvp}
      isPastDeadline={isPastDeadline}
    />
  );
}
