import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/db/schema";
import { EventStatStrip } from "./EventStatStrip";
import { cn } from "@/lib/utils";

interface Props {
  event: Event;
  stats: { yes: number; no: number; maybe: number; total: number };
  featured?: boolean;
}

function statusBadge(event: Event) {
  const now = new Date();
  if (event.startsAt > now) return { label: "Active", className: "bg-green-100 text-green-700 border-green-200" };
  return { label: "Past", className: "bg-zinc-100 text-zinc-500 border-zinc-200" };
}

export function EventCard({ event, stats, featured = false }: Props) {
  const badge = statusBadge(event);
  const dateStr = new Date(event.startsAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = new Date(event.startsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Link href={`/dashboard/events/${event.id}`} className="block group">
      <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", featured && "")}>
        <div className={cn("flex", featured ? "flex-col sm:flex-row" : "flex-row")}>
          {/* Cover image */}
          <div
            className={cn(
              "relative bg-stone-200 flex-shrink-0",
              featured ? "sm:w-56 h-40 sm:h-auto" : "w-20 h-20"
            )}
          >
            {event.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-100 to-stone-200" />
            )}
            <Badge
              variant="outline"
              className={cn(
                "absolute top-2 left-2 text-xs font-semibold",
                badge.className
              )}
            >
              {badge.label}
            </Badge>
          </div>

          {/* Details */}
          <CardContent className={cn("flex flex-col justify-between gap-3", featured ? "p-5 flex-1" : "p-3 flex-1")}>
            <div>
              <h3 className={cn("font-bold text-zinc-900 group-hover:text-rose-700 transition-colors", featured ? "text-xl" : "text-base")}>
                {event.title}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {dateStr} @ {timeStr}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
            <EventStatStrip {...stats} />
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
