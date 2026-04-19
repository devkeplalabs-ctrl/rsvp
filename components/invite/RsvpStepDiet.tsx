"use client";

import { DIET_OPTIONS } from "@/lib/event-templates";
import type { RsvpFlowState } from "./InviteRsvpPanel";
import type { EventTemplate } from "@/lib/event-templates";

interface Props {
  state: RsvpFlowState;
  set: (patch: Partial<RsvpFlowState>) => void;
  next: () => void;
  back: () => void;
  template: EventTemplate;
}

export function RsvpStepDiet({ state, set, next, back, template }: Props) {
  const r = template.rsvp;
  const { diet, dietNote } = state;

  function toggle(key: string) {
    let d = diet.includes(key) ? diet.filter((x) => x !== key) : [...diet, key];
    if (key === "none") d = diet.includes("none") ? [] : ["none"];
    else d = d.filter((x) => x !== "none");
    set({ diet: d });
  }

  return (
    <div className="inv-step">
      <div className="inv-step-kicker">{r.chapters[2]}</div>
      <h2 className="inv-step-title">
        {r.q2.pre} <span className="inv-it">{r.q2.em}</span>
        {r.q2.post}
      </h2>
      <p className="inv-step-lede">{r.lede2}</p>

      <div className="inv-chips">
        {DIET_OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            className={`inv-chip${diet.includes(o.key) ? " active" : ""}`}
            onClick={() => toggle(o.key)}
          >
            <span className="inv-chip-dot" />
            {o.label}
          </button>
        ))}
      </div>

      <label className="inv-field" style={{ marginTop: 26 }}>
        <div className="inv-field-head">
          <span className="inv-field-label">Notes</span>
          <span className="inv-hint" style={{ marginLeft: "auto" }}>optional</span>
        </div>
        <textarea
          className="inv-textarea"
          rows={3}
          placeholder="allergies, favourite dish, anything else"
          value={dietNote}
          onChange={(e) => set({ dietNote: e.target.value })}
        />
      </label>

      <div className="inv-cta-row">
        <button type="button" className="inv-btn-secondary" onClick={back}>← Back</button>
        <button
          type="button"
          className="inv-btn-primary"
          onClick={next}
          disabled={state.submitting}
        >
          <span>{state.submitting ? "Saving…" : r.ctaFinal}</span>
          <Arrow />
        </button>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
