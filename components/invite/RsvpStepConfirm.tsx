"use client";

import { useEffect, useState } from "react";
import { DIET_OPTIONS } from "@/lib/event-templates";
import type { RsvpFlowState } from "./InviteRsvpPanel";
import type { EventTemplate } from "@/lib/event-templates";
import type { Event } from "@/db/schema";
import { AddToCalendarButton } from "./AddToCalendarButton";

interface Props {
  state: RsvpFlowState;
  template: EventTemplate;
  event: Event;
  hostName?: string | null;
}

export function RsvpStepConfirm({ state, template, event, hostName }: Props) {
  const r = template.rsvp;
  const firstName = state.name.trim().split(/\s+/)[0] || "friend";

  const eventDay = event.startsAt.toLocaleDateString("en-US", { weekday: "long" });
  const confirmKicker = r.confirmKicker === "See you soon"
    ? `See you ${eventDay}`
    : r.confirmKicker;

  const sealText = [
    event.title.toUpperCase(),
    event.startsAt.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase(),
    event.location?.toUpperCase(),
  ].filter(Boolean).join(" · ") + " · ";
  const dietLabels = state.diet
    .map((k) => DIET_OPTIONS.find((d) => d.key === k)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="inv-step inv-step-confirm">
      <div className="inv-seal">
        <Bloom color="var(--accent)" />
        <svg
          viewBox="0 0 140 140"
          width="140"
          height="140"
          aria-hidden="true"
          className="inv-seal-svg"
        >
          <defs>
            <path
              id={`seal-${template.key}`}
              d="M70,70 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0"
            />
          </defs>
          <circle cx="70" cy="70" r="62" stroke="var(--accent)" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="2 3" />
          <text fill="var(--ink)" fontFamily="var(--font-archivo), sans-serif" fontSize="9" letterSpacing="3">
            <textPath href={`#seal-${template.key}`} startOffset="0">
              {sealText}
            </textPath>
          </text>
        </svg>
        <div className="inv-seal-core">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="inv-step-kicker" style={{ textAlign: "center", marginTop: 8 }}>
        {confirmKicker}
      </div>

      <h2 className="inv-step-title" style={{ textAlign: "center" }}>
        {r.confirmTitle.pre}{" "}
        <span className="inv-it">{r.confirmTitle.em}</span>
        {r.confirmTitle.post}{" "}
        <span style={{ color: "var(--muted)", fontStyle: "italic" }}>{firstName}.</span>
      </h2>

      <p
        className="inv-step-lede"
        style={{ textAlign: "center", maxWidth: 440, margin: "12px auto 0" }}
      >
        {r.confirmBody(state.name, state.guests)}
      </p>

      {(dietLabels.length > 0 || state.dietNote) && (
        <div className="inv-recap">
          <div className="inv-recap-head">Noted</div>
          <div className="inv-recap-body">
            {dietLabels.length > 0 && <div>{dietLabels.join(" · ")}</div>}
            {state.dietNote && (
              <div style={{ marginTop: 6, fontStyle: "italic" }}>"{state.dietNote}"</div>
            )}
          </div>
        </div>
      )}

      <div className="inv-confirm-actions">
        <AddToCalendarButton event={event} />
      </div>

      {(template.signOff || hostName) && (
        <div className="inv-signoff">
          <span className="inv-sig-x">×</span>
          <span className="inv-sig-name">{hostName ?? template.signOff?.name}</span>
          {template.signOff?.note && (
            <span className="inv-sig-note">{template.signOff.note}</span>
          )}
        </div>
      )}
    </div>
  );
}

// Particle burst on mount
function Bloom({ color }: { color: string }) {
  const [dots] = useState(() =>
    Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2;
      const dist = 80 + Math.random() * 140;
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        id: i,
      };
    })
  );

  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="inv-bloom">
      {dots.map((d) => (
        <span
          key={d.id}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            animation: `bloom-particle-${d.id} 1.1s cubic-bezier(.2,.7,.2,1) forwards`,
          }}
        />
      ))}
      <style>{dots
        .map(
          (d) => `@keyframes bloom-particle-${d.id} {
  0%   { opacity:0; transform:translate(-50%,-50%) scale(.6) }
  20%  { opacity:1 }
  100% { opacity:0; transform:translate(calc(-50% + ${d.dx}px), calc(-50% + ${d.dy}px)) scale(1) }
}`
        )
        .join("\n")}</style>
    </div>
  );
}
