"use client";

import type { RsvpFlowState } from "./InviteRsvpPanel";
import type { EventTemplate } from "@/lib/event-templates";

interface Props {
  state: RsvpFlowState;
  set: (patch: Partial<RsvpFlowState>) => void;
  next: () => void;
  template: EventTemplate;
  attendeeCount: number;
}

export function RsvpStepIdentity({ state, set, next, template, attendeeCount }: Props) {
  const r = template.rsvp;
  const taken = Math.min(attendeeCount, r.seatsTotal);
  const open = Math.max(0, r.seatsTotal - taken);
  const dots = Array.from({ length: Math.min(r.seatsTotal, 6) });
  const takenDots = Math.min(taken, 6);

  const nameErr = state.error && !state.name.trim() ? "We need your name" : null;
  const emailErr =
    state.error && !state.email.trim()
      ? "Email, please"
      : state.error && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)
      ? "Check that address"
      : null;

  return (
    <div className="inv-step">
      <div className="inv-step-kicker">{r.chapters[0]}</div>
      <h2 className="inv-step-title">
        {r.q0.pre} <span className="inv-it">{r.q0.em}</span>
        {r.q0.post}
      </h2>
      <p className="inv-step-lede">{r.lede0}</p>

      <div className="inv-fields">
        <label className="inv-field">
          <div className="inv-field-head">
            <span className="inv-field-label">01 · Name</span>
            {nameErr && <span className="inv-err">{nameErr}</span>}
          </div>
          <input
            type="text"
            placeholder="First and last"
            value={state.name}
            autoFocus
            onChange={(e) => set({ name: e.target.value })}
            onKeyDown={(e) => { if (e.key === "Enter") next(); }}
            className={`inv-input${nameErr ? " err" : ""}`}
          />
        </label>

        <label className="inv-field">
          <div className="inv-field-head">
            <span className="inv-field-label">02 · Email</span>
            {emailErr && <span className="inv-err">{emailErr}</span>}
          </div>
          <input
            type="email"
            placeholder="you@somewhere.com"
            value={state.email}
            onChange={(e) => set({ email: e.target.value })}
            onKeyDown={(e) => { if (e.key === "Enter") next(); }}
            className={`inv-input${emailErr ? " err" : ""}`}
          />
          <div className="inv-hint">We'll send details and a calendar invite — nothing else.</div>
        </label>
      </div>

      <div className="inv-cta-row">
        <button
          type="button"
          className="inv-btn-primary"
          onClick={next}
          disabled={state.submitting}
        >
          <span>{state.submitting ? "Saving…" : r.ctaNext}</span>
          <Arrow />
        </button>
        <div className="inv-seats-note">
          <span className="inv-dots">
            {dots.map((_, i) => (
              <i key={i} className={i < takenDots ? "taken" : ""} />
            ))}
          </span>
          <span>{r.seatCopy(open, r.seatsTotal)}</span>
        </div>
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
