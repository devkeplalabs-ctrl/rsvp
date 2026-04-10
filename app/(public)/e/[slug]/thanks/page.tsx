import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/db";
import { events } from "@/db/schema";
import { Button } from "@/components/ui/button";

export default async function PublicThanksPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.publicSlug, slug))
    .limit(1);

  if (!event) notFound();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 border-4 border-rose-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-rose-700" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-zinc-900">You&apos;re in! 🎉</h1>
          <p className="text-zinc-500 mt-2 text-sm">Your response has been recorded.</p>
        </div>

        {event.coverImageUrl && (
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-left flex gap-3 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.coverImageUrl}
              alt={event.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold text-zinc-900 text-sm">{event.title}</p>
              <p className="text-xs text-zinc-500">
                {new Date(event.startsAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button className="w-full bg-rose-700 hover:bg-rose-800 text-white">
            Add to Calendar
          </Button>
          <Button variant="outline" className="w-full">
            Share with friends
          </Button>
          <Link
            href={`/e/${slug}`}
            className="block text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            View event page
          </Link>
        </div>
      </div>
    </div>
  );
}
