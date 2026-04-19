"use client";

import type { RsvpFlowState } from "./InviteRsvpPanel";
import type { EventTemplate } from "@/lib/event-templates";

interface Props {
  state: RsvpFlowState;
  set: (patch: Partial<RsvpFlowState>) => void;
  next: () => void;
  back: () => void;
  template: EventTemplate;
}

export function RsvpStepParty({ state, set, next, back, template }: Props) {
  const r = template.rsvp;
  const { guests, plusOnes } = state;

  function setCount(n: number) {
    const arr = Array.from({ length: Math.max(0, n - 1) }, (_, i) => plusOnes[i] ?? { name: "" });
    set({ guests: n, plusOnes: arr });
  }

  const hint = r.partyHints[Math.min(guests - 1, r.partyHints.length - 1)];

  return (
    <div className="inv-step">
      <div className="inv-step-kicker">{r.chapters[1]}</div>
      <h2 className="inv-step-title">
        {r.q1.pre} <span className="inv-it">{r.q1.em}</span>
        {r.q1.post}
      </h2>
      <p className="inv-step-lede">{r.lede1}</p>

      <div style={{ marginBottom: 26 }}>
        <div className="inv-field-label" style={{ marginBottom: 0 }}>{r.partyLabel}</div>
        <div className="inv-stepper">
          <button
            type="button"
            className="inv-step-btn"
            onClick={() => setCount(Math.max(1, guests - 1))}
            disabled={guests <= 1}
          >
            −
          </button>
          <div className="inv-stepper-num">{guests}</div>
          <button
            type="button"
            className="inv-step-btn"
            onClick={() => setCount(Math.min(r.partyMax, guests + 1))}
            disabled={guests >= r.partyMax}
          >
            +
          </button>
          <div className="inv-stepper-hint">{hint}</div>
        </div>
      </div>

      {plusOnes.length > 0 && (
        <div className="inv-plusones">
          <div className="inv-field-label" style={{ marginBottom: 10 }}>Your guests</div>
          {plusOnes.map((p, i) => (
            <div key={i} className="inv-plusone">
              <span className="inv-plusone-n">{String(i + 2).padStart(2, "0")}</span>
              <input
                className="inv-input inv-input-sm"
                placeholder={`Guest ${i + 1} name`}
                value={p.name}
                onChange={(e) => {
                  const copy = [...plusOnes];
                  copy[i] = { name: e.target.value };
                  set({ plusOnes: copy });
                }}
              />
            </div>
          ))}
          <div className="inv-hint">Names are optional — helps with place cards.</div>
        </div>
      )}

      <div className="inv-cta-row">
        <button type="button" className="inv-btn-secondary" onClick={back}>← Back</button>
        <button type="button" className="inv-btn-primary" onClick={next}>
          <span>{r.ctaNext}</span>
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
