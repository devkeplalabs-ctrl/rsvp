import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Pencil, CheckCircle2, XCircle, HelpCircle, Users } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { events, guests, rsvps } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { EventCoverBanner } from "@/components/event/EventCoverBanner";
import { StatCard } from "@/components/shared/StatCard";
import { CapacityBar } from "@/components/event/CapacityBar";
import { GuestListTable } from "@/components/event/GuestListTable";
import { InviteComposer } from "@/components/event/InviteComposer";
import { getEventGuests } from "@/lib/rsvp";
import { ShareButton } from "@/components/event/ShareButton";
import { DeleteEventButton } from "@/components/event/DeleteEventButton";

async function getEvent(id: string, hostId: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  if (!event || event.hostId !== hostId) return null;
  return event;
}

export default async function EventManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const event = await getEvent(id, userId);
  if (!event) notFound();

  const guestList = await getEventGuests(id);

  const going = guestList.filter((g) => g.status === "yes").length;
  const notGoing = guestList.filter((g) => g.status === "no").length;
  const maybe = guestList.filter((g) => g.status === "maybe").length;
  const plusOnes = guestList.reduce((s, g) => s + (g.plusOnes ?? 0), 0);
  const totalAttendees = going + plusOnes;

  const recentGuests = guestList.slice(-5).reverse();

  return (
    <div>
      {/* Action buttons */}
      <div className="flex justify-end gap-2 mb-2">
        <ShareButton publicSlug={event.publicSlug} />
        <LinkButton href={`/dashboard/events/${id}/edit`} variant="outline" size="sm" className="gap-1.5">
          <Pencil className="w-4 h-4" /> Edit
        </LinkButton>
        <DeleteEventButton eventId={id} eventTitle={event.title} />
      </div>

      <EventCoverBanner event={event} />

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guests">Guests</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-6">
              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={CheckCircle2}
                  label="Going"
                  value={going}
                  iconClassName="bg-green-50 text-green-600"
                />
                <StatCard
                  icon={XCircle}
                  label="Not Going"
                  value={notGoing}
                  iconClassName="bg-zinc-100 text-zinc-400"
                />
                <StatCard
                  icon={HelpCircle}
                  label="Maybe"
                  value={maybe}
                  iconClassName="bg-amber-50 text-amber-500"
                />
                <StatCard
                  icon={Users}
                  label="Plus-Ones"
                  value={plusOnes}
                  iconClassName="bg-rose-50 text-rose-700"
                />
              </div>

              {/* Capacity */}
              {event.capacity && (
                <Card>
                  <CardContent className="p-5">
                    <CapacityBar used={totalAttendees} total={event.capacity} />
                  </CardContent>
                </Card>
              )}

              <LinkButton
                href={`/dashboard/events/${id}?tab=invites`}
                className="w-full bg-rose-700 hover:bg-rose-800 text-white justify-center"
              >
                Send New Invitation
              </LinkButton>
            </div>

            {/* Recent activity */}
            <div>
              <h3 className="text-base font-semibold text-zinc-900 mb-4">Recent Activity</h3>
              {guestList.filter((g) => g.status).slice(0, 5).length === 0 ? (
                <p className="text-sm text-zinc-400">No responses yet.</p>
              ) : (
                <ul className="space-y-3">
                  {guestList
                    .filter((g) => g.status)
                    .slice(0, 5)
                    .map((g) => (
                      <li key={g.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-700 text-xs font-bold">
                          {g.name[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-700">
                            <span className="font-medium">{g.name}</span> responded:{" "}
                            <span className={
                              g.status === "yes"
                                ? "text-green-600 font-medium"
                                : g.status === "maybe"
                                ? "text-amber-600 font-medium"
                                : "text-zinc-500 font-medium"
                            }>
                              {g.status === "yes" ? "Going" : g.status === "maybe" ? "Maybe" : "Can't go"}
                              {g.plusOnes && g.plusOnes > 0 ? ` (+${g.plusOnes})` : ""}
                            </span>
                          </p>
                          {g.respondedAt && (
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {g.respondedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Guests tab */}
        <TabsContent value="guests">
          <GuestListTable
            guests={guestList.map((g) => ({
              id: g.id,
              name: g.name,
              email: g.email,
              status: g.status as "yes" | "no" | "maybe" | null,
              plusOnes: g.plusOnes,
              dietary: g.dietary,
              message: g.message,
              respondedAt: g.respondedAt,
            }))}
          />
        </TabsContent>

        {/* Invites tab */}
        <TabsContent value="invites">
          <Card>
            <CardContent className="p-6">
              <InviteComposer
                eventId={id}
                publicSlug={event.publicSlug}
                recentGuests={recentGuests.map((g) => ({
                  id: g.id,
                  name: g.name,
                  email: g.email,
                  inviteToken: g.inviteToken,
                  createdAt: g.createdAt,
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings tab */}
        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6">
              <p className="text-zinc-500 text-sm">Event settings coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
