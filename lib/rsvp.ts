"use server";

import { and, count, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { events, guests, rsvps } from "@/db/schema";
import { sendInviteEmail, sendRsvpConfirmationEmail } from "@/lib/email/client";
import { generateInviteToken, generatePublicSlug } from "@/lib/tokens";
import {
  addGuestSchema,
  batchInviteSchema,
  createEventSchema,
  rsvpSchema,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

// ─── Event actions ────────────────────────────────────────────────────────────

export async function createEvent(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const raw = {
    category: formData.get("category"),
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    locationUrl: formData.get("locationUrl"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    rsvpDeadline: formData.get("rsvpDeadline"),
    coverImageUrl: formData.get("coverImageUrl"),
    allowPlusOnes: formData.get("allowPlusOnes") === "true",
    maxPlusOnes: formData.get("maxPlusOnes"),
    capacity: formData.get("capacity"),
    customDetails: formData.get("customDetails"),
  };

  const parsed = createEventSchema.parse(raw);
  const customDetails = parsed.customDetails ? JSON.parse(parsed.customDetails) : null;

  const [event] = await db
    .insert(events)
    .values({
      hostId: userId,
      category: parsed.category,
      title: parsed.title,
      description: parsed.description || null,
      location: parsed.location || null,
      locationUrl: parsed.locationUrl || null,
      startsAt: new Date(parsed.startsAt),
      endsAt: parsed.endsAt ? new Date(parsed.endsAt) : null,
      rsvpDeadline: parsed.rsvpDeadline ? new Date(parsed.rsvpDeadline) : null,
      publicSlug: generatePublicSlug(),
      coverImageUrl: parsed.coverImageUrl || null,
      allowPlusOnes: parsed.allowPlusOnes,
      maxPlusOnes: parsed.maxPlusOnes,
      capacity: parsed.capacity ? Number(parsed.capacity) : null,
      customDetails,
    })
    .returning();

  redirect(`/dashboard/events/${event.id}`);
}

export async function deleteEvent(eventId: string) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const [event] = await db
    .select({ hostId: events.hostId })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event || event.hostId !== userId) return;

  await db.delete(events).where(eq(events.id, eventId));
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateEvent(eventId: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const raw = {
    category: formData.get("category"),
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    locationUrl: formData.get("locationUrl"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    rsvpDeadline: formData.get("rsvpDeadline"),
    coverImageUrl: formData.get("coverImageUrl"),
    allowPlusOnes: formData.get("allowPlusOnes") === "true",
    maxPlusOnes: formData.get("maxPlusOnes"),
    capacity: formData.get("capacity"),
    customDetails: formData.get("customDetails"),
  };

  const parsed = createEventSchema.parse(raw);
  const customDetails = parsed.customDetails ? JSON.parse(parsed.customDetails) : null;

  await db
    .update(events)
    .set({
      category: parsed.category,
      title: parsed.title,
      description: parsed.description || null,
      location: parsed.location || null,
      locationUrl: parsed.locationUrl || null,
      startsAt: new Date(parsed.startsAt),
      endsAt: parsed.endsAt ? new Date(parsed.endsAt) : null,
      rsvpDeadline: parsed.rsvpDeadline ? new Date(parsed.rsvpDeadline) : null,
      coverImageUrl: parsed.coverImageUrl || null,
      allowPlusOnes: parsed.allowPlusOnes,
      maxPlusOnes: parsed.maxPlusOnes,
      capacity: parsed.capacity ? Number(parsed.capacity) : null,
      customDetails,
      updatedAt: new Date(),
    })
    .where(eq(events.id, eventId));

  revalidatePath(`/dashboard/events/${eventId}`);
  redirect(`/dashboard/events/${eventId}`);
}

export async function getEventSummary(eventId: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) return null;

  const stats = await db
    .select({
      status: rsvps.status,
      count: count(),
      plusOnes: sql<number>`sum(${rsvps.plusOnes})`,
    })
    .from(rsvps)
    .innerJoin(guests, eq(rsvps.guestId, guests.id))
    .where(eq(guests.eventId, eventId))
    .groupBy(rsvps.status);

  const going = stats.find((s) => s.status === "yes")?.count ?? 0;
  const notGoing = stats.find((s) => s.status === "no")?.count ?? 0;
  const maybe = stats.find((s) => s.status === "maybe")?.count ?? 0;
  const plusOnes = stats.reduce((sum, s) => sum + Number(s.plusOnes ?? 0), 0);

  return { event, going, notGoing, maybe, plusOnes };
}

export async function getEventGuests(eventId: string) {
  return db
    .select({
      id: guests.id,
      name: guests.name,
      email: guests.email,
      inviteToken: guests.inviteToken,
      source: guests.source,
      invitedAt: guests.invitedAt,
      createdAt: guests.createdAt,
      status: rsvps.status,
      plusOnes: rsvps.plusOnes,
      dietary: rsvps.dietary,
      message: rsvps.message,
      respondedAt: rsvps.respondedAt,
    })
    .from(guests)
    .leftJoin(rsvps, eq(rsvps.guestId, guests.id))
    .where(eq(guests.eventId, eventId))
    .orderBy(guests.createdAt);
}

// ─── Guest / invite actions ───────────────────────────────────────────────────

export async function addGuest(eventId: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const parsed = addGuestSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    sendEmail: formData.get("sendEmail") === "true",
  });

  const token = generateInviteToken();

  const [guest] = await db
    .insert(guests)
    .values({
      eventId,
      name: parsed.name,
      email: parsed.email || null,
      inviteToken: token,
      source: "manual",
      invitedAt: parsed.sendEmail ? new Date() : null,
    })
    .returning();

  if (parsed.sendEmail && parsed.email) {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);
    if (event) {
      await sendInviteEmail({
        to: parsed.email,
        guestName: parsed.name,
        event,
        token,
      });
    }
  }

  revalidatePath(`/dashboard/events/${eventId}`);
  return guest;
}

export async function addGuestsBatch(eventId: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const parsed = batchInviteSchema.parse({ emails: formData.get("emails") });

  const emailList = parsed.emails
    .split(/[\n,]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"));

  const unique = [...new Set(emailList)];

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) return { sent: 0, errors: 0 };

  let sent = 0;
  let errors = 0;

  for (const email of unique) {
    try {
      const token = generateInviteToken();
      await db.insert(guests).values({
        eventId,
        name: email.split("@")[0],
        email,
        inviteToken: token,
        source: "batch",
        invitedAt: new Date(),
      });
      await sendInviteEmail({ to: email, guestName: email.split("@")[0], event, token });
      sent++;
    } catch {
      errors++;
    }
  }

  revalidatePath(`/dashboard/events/${eventId}`);
  return { sent, errors };
}

export async function resendInvite(guestId: string) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const [guest] = await db
    .select()
    .from(guests)
    .where(eq(guests.id, guestId))
    .limit(1);

  if (!guest?.email) return;

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, guest.eventId))
    .limit(1);

  if (!event) return;

  await sendInviteEmail({
    to: guest.email,
    guestName: guest.name,
    event,
    token: guest.inviteToken,
  });

  await db
    .update(guests)
    .set({ remindedAt: new Date() })
    .where(eq(guests.id, guestId));

  revalidatePath(`/dashboard/events/${event.id}`);
}

// ─── RSVP actions ─────────────────────────────────────────────────────────────

export async function recordRsvp(guestId: string, formData: FormData) {
  const parsed = rsvpSchema.parse({
    status: formData.get("status"),
    plusOnes: formData.get("plusOnes"),
    dietary: formData.get("dietary"),
    message: formData.get("message"),
  });

  const [guest] = await db
    .select()
    .from(guests)
    .where(eq(guests.id, guestId))
    .limit(1);

  if (!guest) throw new Error("Guest not found");

  await db
    .insert(rsvps)
    .values({
      guestId,
      status: parsed.status,
      plusOnes: parsed.plusOnes,
      dietary: parsed.dietary || null,
      message: parsed.message || null,
      respondedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: rsvps.guestId,
      set: {
        status: parsed.status,
        plusOnes: parsed.plusOnes,
        dietary: parsed.dietary || null,
        message: parsed.message || null,
        respondedAt: new Date(),
      },
    });

  // Mark opened if not already
  if (!guest.openedAt) {
    await db
      .update(guests)
      .set({ openedAt: new Date() })
      .where(eq(guests.id, guestId));
  }

  if (guest.email) {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, guest.eventId))
      .limit(1);
    if (event) {
      await sendRsvpConfirmationEmail({
        to: guest.email,
        guestName: guest.name,
        event,
        status: parsed.status,
        token: guest.inviteToken,
      });
    }
  }
}

export async function createPublicGuest(
  eventId: string,
  name: string,
  email: string
): Promise<string> {
  const [existing] = await db
    .select({ id: guests.id })
    .from(guests)
    .where(and(eq(guests.eventId, eventId), eq(guests.email, email)))
    .limit(1);

  if (existing) return existing.id;

  const token = generateInviteToken();
  const [guest] = await db
    .insert(guests)
    .values({
      eventId,
      name,
      email,
      inviteToken: token,
      source: "public",
      invitedAt: new Date(),
    })
    .returning();
  return guest.id;
}

export async function deleteGuest(guestId: string) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const [guest] = await db
    .select({ eventId: guests.eventId })
    .from(guests)
    .where(eq(guests.id, guestId))
    .limit(1);

  if (!guest) return;

  await db.delete(guests).where(eq(guests.id, guestId));
  revalidatePath(`/dashboard/events/${guest.eventId}`);
}

export async function markGuestOpened(guestId: string) {
  await db
    .update(guests)
    .set({ openedAt: new Date() })
    .where(and(eq(guests.id, guestId)));
}
