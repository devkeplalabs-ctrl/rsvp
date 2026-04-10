import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guests, events, users, rsvps } from "@/db/schema";
import { PublicEventLayout } from "@/components/event/PublicEventLayout";
import { RsvpForm } from "@/components/event/RsvpForm";
import { Badge } from "@/components/ui/badge";
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

  const [host] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, event.hostId))
    .limit(1);

  const [existing] = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.guestId, guest.id))
    .limit(1);

  // Mark as opened (fire and forget)
  if (!guest.openedAt) {
    await markGuestOpened(guest.id);
  }

  const isPastDeadline =
    event.rsvpDeadline && event.rsvpDeadline < new Date();

  return (
    <div>
      {/* "Responding as" pill */}
      <div className="flex justify-center pt-5 pb-2">
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 px-4 py-1.5 text-sm font-medium">
          • Responding as {guest.name}
        </Badge>
      </div>

      <PublicEventLayout
        event={event}
        hostName={host?.name ?? null}
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
            existingStatus={existing?.status}
            existingPlusOnes={existing?.plusOnes}
            thankYouPath={`/i/${token}/thanks`}
          />
        )}
      </PublicEventLayout>
    </div>
  );
}
