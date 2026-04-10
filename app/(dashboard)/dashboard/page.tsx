import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { events, guests, rsvps } from "@/db/schema";
import { LinkButton } from "@/components/ui/link-button";
import { EventCard } from "@/components/event/EventCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { DashboardStats } from "@/components/event/DashboardStats";

async function getHostEvents(hostId: string) {
  const rows = await db.query.events.findMany({
    where: eq(events.hostId, hostId),
    orderBy: (e, { desc }) => [desc(e.createdAt)],
  });

  // Fetch stats for each event
  const withStats = await Promise.all(
    rows.map(async (event) => {
      const guestRows = await db
        .select({ status: rsvps.status })
        .from(rsvps)
        .innerJoin(guests, eq(rsvps.guestId, guests.id))
        .where(eq(guests.eventId, event.id));

      const yes = guestRows.filter((g) => g.status === "yes").length;
      const no = guestRows.filter((g) => g.status === "no").length;
      const maybe = guestRows.filter((g) => g.status === "maybe").length;
      return { event, stats: { yes, no, maybe, total: guestRows.length } };
    })
  );

  return withStats;
}

export default async function DashboardPage() {
  const session = await auth();
  const hostId = session!.user!.id!;
  const eventList = await getHostEvents(hostId);

  const totalRsvps = eventList.reduce((s, e) => s + e.stats.total, 0);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Your events</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage and monitor your upcoming celebrations.
          </p>
        </div>
        <LinkButton href="/dashboard/events/new" className="bg-rose-700 hover:bg-rose-800 text-white">
          + New event
        </LinkButton>
      </div>

      {eventList.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Create your first celebration to get started. From intimate dinners to grand galas, your journey begins here."
          actionLabel="Create Event"
          actionHref="/dashboard/events/new"
        />
      ) : (
        <div className="space-y-4">
          {/* Featured event */}
          <EventCard event={eventList[0].event} stats={eventList[0].stats} featured />

          {/* Rest of events */}
          {eventList.slice(1).map(({ event, stats }) => (
            <EventCard key={event.id} event={event} stats={stats} />
          ))}

          {/* Summary stats strip */}
          {totalRsvps > 0 && (
            <DashboardStats
              totalRsvps={totalRsvps}
              activeEvents={eventList.filter((e) => e.event.startsAt > new Date()).length}
            />
          )}
        </div>
      )}
    </div>
  );
}
