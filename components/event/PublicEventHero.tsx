import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/db/schema";

interface Props {
  event: Event;
  children: React.ReactNode;
}

export function PublicEventHero({ event, children }: Props) {
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
    <div>
      {/* Hero — full screen on mobile, left side on desktop */}
      <div className="relative h-[100dvh] flex flex-col lg:flex-row">
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          {event.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.coverImageUrl}
              alt={event.title}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-rose-900 to-stone-800" />
          )}
          {/* Dark gradient: covers bottom half strongly, fades to transparent at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent [mask-image:linear-gradient(to_top,black_40%,transparent_100%)]" />
        </div>

        {/* Left: badge + event info */}
        <div className="relative flex-1 flex flex-col px-6 pt-10 pb-0 lg:px-10 lg:py-10">
          <Badge className="self-start bg-green-500/20 text-green-300 border-green-400/30 backdrop-blur-sm px-3 py-1 text-xs">
            Public Event
          </Badge>
          <div className="flex flex-col justify-end flex-1 pb-10 lg:pb-14 text-white space-y-3">
            <h1
              className="text-5xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
              style={{ animationDelay: "0ms" }}
            >
              {event.title}
            </h1>
            {event.description && (
              <p
                className="text-sm text-white/80 line-clamp-2 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                style={{ animationDelay: "150ms" }}
              >
                {event.description}
              </p>
            )}
            <div
              className="flex flex-wrap gap-2 pt-1 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
              style={{ animationDelay: "300ms" }}
            >
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-medium px-3 py-2 rounded-full">
                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                {dateStr}
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-medium px-3 py-2 rounded-full">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {timeStr}
              </span>
              {event.location && (
                event.locationUrl ? (
                  <a
                    href={event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-medium px-3 py-2 rounded-full hover:bg-white/25 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {event.location}
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-medium px-3 py-2 rounded-full">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {event.location}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right: form card — desktop only, absolutely centered in the right third */}
        <div className="hidden lg:block absolute right-[8%] top-1/2 -translate-y-1/2 w-[380px] z-10">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {children}
          </div>
        </div>
      </div>

      {/* Form card — mobile only, below the hero */}
      <div className="lg:hidden bg-stone-50 px-5 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
