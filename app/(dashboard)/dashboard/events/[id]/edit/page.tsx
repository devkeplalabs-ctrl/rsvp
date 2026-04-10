import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { events } from "@/db/schema";
import { EditEventForm } from "@/components/event/EditEventForm";

export const metadata = { title: "Edit Event — RSVP" };

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  if (!event || event.hostId !== session.user.id) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Edit event</h1>
        <p className="text-zinc-500 text-sm mt-1">Update your event details.</p>
      </div>
      <EditEventForm event={event} />
    </div>
  );
}
