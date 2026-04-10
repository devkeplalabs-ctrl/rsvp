import { CalendarDays, MapPin } from "lucide-react";
import { Event } from "@/db/schema";

interface Props {
  event: Event;
  hostName: string | null;
  children: React.ReactNode;
  badge?: React.ReactNode;
  sidebarTitle: string;
}

export function PublicEventLayout({
  event,
  hostName,
  children,
  badge,
  sidebarTitle,
}: Props) {
  const dateStr = new Date(event.startsAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = new Date(event.startsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {badge && (
        <div className="flex justify-center pt-4">
          {badge}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
        {/* Left: event info */}
        <div>
          <div className="relative rounded-xl overflow-hidden bg-stone-200 aspect-video mb-6">
            {event.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-900 to-stone-800" />
            )}
            {hostName && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                <div className="w-5 h-5 rounded-full bg-rose-700 flex items-center justify-center font-bold">
                  {hostName[0]?.toUpperCase()}
                </div>
                <span>
                  <span className="opacity-60">HOSTED BY</span> {hostName}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 mb-6">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-rose-700" />
              {dateStr}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-rose-700 opacity-0" />
              {timeStr}
            </span>
            {event.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-700" />
                {event.location}
                {event.locationUrl && (
                  <a
                    href={event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-700 underline text-xs"
                  >
                    Open in Maps
                  </a>
                )}
              </span>
            )}
          </div>

          {event.description && (
            <div>
              <h2 className="text-base font-semibold text-zinc-900 mb-2">About the Celebration</h2>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Right: RSVP sidebar */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-5">{sidebarTitle}</h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
