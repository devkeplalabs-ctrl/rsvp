import type { EventTemplate } from "@/lib/event-templates";
import type { Event } from "@/db/schema";

interface Props {
  event: Event;
  template: EventTemplate;
}

export function InviteHero({ event, template }: Props) {
  const heroImage = event.coverImageUrl || template.defaultHero;

  const formattedDate = event.startsAt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = event.startsAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const endsTime = event.endsAt
    ? event.endsAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : null;

  const timeStr = endsTime ? `${formattedTime} — ${endsTime}` : formattedTime;

  // Use event.customDetails as the running sheet items
  const sheetItems = event.customDetails?.map((d) => ({ n: d.label, t: d.content })) ?? [];

  return (
    <aside className="inv-hero">
      <div
        className="inv-hero-img"
        style={{ backgroundImage: `url(${heroImage})` }}
        role="img"
        aria-label={template.heroAlt}
      />
      <div className="inv-hero-tint" />
      <div className="inv-hero-grain" aria-hidden="true" />

      <div className="inv-overlay">
        {/* Brand strip */}
        <div className="inv-topstrip">
          <div className="inv-logo">
            <svg width="30" height="30" viewBox="0 0 28 28" aria-hidden="true">
              <circle cx="14" cy="14" r="13" fill="rgba(0,0,0,0.7)" />
              <text
                x="14"
                y="18.5"
                textAnchor="middle"
                fontFamily="var(--font-fraunces), Georgia, serif"
                fontStyle="italic"
                fontSize="14"
                fill="var(--paper)"
              >
                {event.title.trim()[0]?.toUpperCase()}
              </text>
            </svg>
            <div>
              <div className="inv-brand-name">{event.title}</div>
              <div className="inv-brand-sub">{formattedDate}</div>
            </div>
          </div>
        </div>

        {/* Main editorial content */}
        <div className="inv-overlay-main">
          <div className="inv-kicker">{template.label.toUpperCase()} · {event.location ?? formattedDate}</div>

          <h1 className="inv-title">
            <EventTitle title={event.title} />
          </h1>

          {event.description && (
            <div className="inv-byline">{event.description}</div>
          )}

          <div className="inv-meta">
            <div className="inv-meta-item">
              <div className="inv-meta-k">Date</div>
              <div className="inv-meta-v">{formattedDate}</div>
            </div>
            <div className="inv-meta-div" />
            <div className="inv-meta-item">
              <div className="inv-meta-k">Time</div>
              <div className="inv-meta-v">{timeStr}</div>
            </div>
            {event.location && (
              <>
                <div className="inv-meta-div" />
                <div className="inv-meta-item">
                  <div className="inv-meta-k">Where</div>
                  <div className="inv-meta-v">
                    {event.locationUrl ? (
                      <a
                        href={event.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline", textUnderlineOffset: 3 }}
                      >
                        {event.location}
                      </a>
                    ) : (
                      event.location
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {sheetItems.length > 0 && (
            <div className="inv-sheet">
              <div className="inv-sheet-head">
                <span>The programme</span>
                <span className="inv-sheet-rule" />
                <span className="inv-sheet-sub">in order</span>
              </div>
              <ol className="inv-sheet-list">
                {sheetItems.map((item, i) => (
                  <li key={i}>
                    <span>{item.n}</span>
                    {item.t}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// Splits title at the last word and renders it italic for editorial treatment
function EventTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  if (words.length === 1) return <span>{title}</span>;
  const last = words[words.length - 1];
  const rest = words.slice(0, -1).join(" ");
  return (
    <>
      <span style={{ display: "block" }}>{rest}</span>
      <span className="inv-title-soft" style={{ display: "block" }}>{last}</span>
    </>
  );
}
