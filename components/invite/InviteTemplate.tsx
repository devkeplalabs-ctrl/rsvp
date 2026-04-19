import "./invite.css";
import type React from "react";
import type { EventTemplate } from "@/lib/event-templates";
import type { Event, Rsvp } from "@/db/schema";
import { InviteHero } from "./InviteHero";
import { InviteRsvpPanel } from "./InviteRsvpPanel";

interface Props {
  event: Event;
  template: EventTemplate;
  hostName?: string | null;
  attendeeCount?: number;
  initialGuestId?: string;
  initialGuestName?: string;
  existingRsvp?: Pick<Rsvp, "status" | "plusOnes" | "dietary"> | null;
  isPastDeadline?: boolean;
}

export function InviteTemplate({
  event,
  template,
  hostName,
  attendeeCount = 0,
  initialGuestId,
  initialGuestName,
  existingRsvp,
  isPastDeadline,
}: Props) {
  const cssVars = {
    "--paper": template.theme.paper,
    "--ink": template.theme.ink,
    "--muted": template.theme.muted,
    "--hint": template.theme.hint,
    "--rule": template.theme.rule,
    "--accent": template.theme.accent,
    "--accent-soft": template.theme.accentSoft,
    "--hero-tint": template.theme.heroTint,
  } as React.CSSProperties;

  return (
    <div className="inv-root" style={cssVars} data-template={template.key}>
      <InviteHero event={event} template={template} />
      <InviteRsvpPanel
        event={event}
        templateKey={template.key}
        hostName={hostName}
        attendeeCount={attendeeCount}
        initialGuestId={initialGuestId}
        initialGuestName={initialGuestName}
        existingRsvp={existingRsvp}
        isPastDeadline={isPastDeadline}
      />
    </div>
  );
}
