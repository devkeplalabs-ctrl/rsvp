import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guests, events, rsvps } from "@/db/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { getTemplate } from "@/lib/event-templates";
import { InviteTemplate } from "@/components/invite/InviteTemplate";
import { markGuestOpened } from "@/lib/rsvp";

export default async function TokenizedInvitePage({
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

  if (!event) notFound();

  const template = getTemplate(event.category);

  const attendeeRows = await db
    .select({ id: guests.id })
    .from(guests)
    .innerJoin(rsvps, eq(rsvps.guestId, guests.id))
    .where(eq(guests.eventId, event.id));

  const [existing] = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.guestId, guest.id))
    .limit(1);

  if (!guest.openedAt) {
    await markGuestOpened(guest.id);
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
      attendeeCount={attendeeRows.length}
      initialGuestId={guest.id}
      initialGuestName={guest.name}
      existingRsvp={existing ?? null}
      isPastDeadline={isPastDeadline}
    />
  );
}
