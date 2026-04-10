import { CalendarDays, MapPin } from "lucide-react";
import { Event } from "@/db/schema";

interface Props {
  event: Event;
}

export function EventCoverBanner({ event }: Props) {
  const dateStr = new Date(event.startsAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden bg-stone-200 mb-6">
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {/* Text */}
      <div className="absolute bottom-0 left-0 p-5 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">{event.title}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-white/80">
          <span className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            {dateStr} · {new Date(event.startsAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
