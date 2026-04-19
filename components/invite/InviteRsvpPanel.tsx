"use client";

import { useState } from "react";
import { getTemplate } from "@/lib/event-templates";
import type { EventCategory } from "@/lib/event-templates";
import type { Event, Rsvp } from "@/db/schema";
import { createPublicGuest, recordRsvp } from "@/lib/rsvp";
import { RsvpStepIdentity } from "./RsvpStepIdentity";
import { RsvpStepParty } from "./RsvpStepParty";
import { RsvpStepDiet } from "./RsvpStepDiet";
import { RsvpStepConfirm } from "./RsvpStepConfirm";

export type RsvpFlowState = {
  step: number;
  name: string;
  email: string;
  guests: number;
  plusOnes: { name: string }[];
  diet: string[];
  dietNote: string;
  guestId: string | null;
  submitting: boolean;
  error: string | null;
};

interface Props {
  event: Event;
  templateKey: EventCategory;
  hostName?: string | null;
  attendeeCount: number;
  initialGuestId?: string;
  initialGuestName?: string;
  existingRsvp?: Pick<Rsvp, "status" | "plusOnes" | "dietary"> | null;
  isPastDeadline?: boolean;
}

export function InviteRsvpPanel({
  event,
  templateKey,
  hostName,
  attendeeCount,
  initialGuestId,
  initialGuestName,
  existingRsvp,
  isPastDeadline,
}: Props) {
  const template = getTemplate(templateKey);
  const skipIdentity = !!initialGuestId;
  const r = template.rsvp;

  const [state, setState] = useState<RsvpFlowState>({
    step: skipIdentity ? 1 : 0,
    name: initialGuestName ?? "",
    email: "",
    guests: existingRsvp?.plusOnes ? existingRsvp.plusOnes + 1 : 1,
    plusOnes: [],
    diet: [],
    dietNote: "",
    guestId: initialGuestId ?? null,
    submitting: false,
    error: null,
  });

  const set = (patch: Partial<RsvpFlowState>) =>
    setState((s) => ({ ...s, ...patch, error: null }));

  // Step 0 → 1: create guest record
  async function submitIdentity() {
    if (!state.name.trim() || !state.email.trim()) return;
    set({ submitting: true });
    try {
      const guestId = await createPublicGuest(event.id, state.name.trim(), state.email.trim());
      setState((s) => ({ ...s, step: 1, guestId, submitting: false, error: null }));
    } catch {
      set({ submitting: false, error: "Something went wrong. Please try again." });
    }
  }

  // Step 2 → 3: record RSVP
  async function submitRsvp() {
    if (!state.guestId) return;
    set({ submitting: true });
    try {
      const fd = new FormData();
      fd.append("status", "yes");
      fd.append("plusOnes", String(Math.max(0, state.guests - 1)));
      fd.append("dietary", state.diet.join(", "));
      fd.append("message", state.dietNote);
      await recordRsvp(state.guestId, fd);
      setState((s) => ({ ...s, step: 3, submitting: false, error: null }));
    } catch {
      set({ submitting: false, error: "Couldn't save your RSVP. Please try again." });
    }
  }

  function next() {
    if (state.step === 0) { submitIdentity(); return; }
    if (state.step === 2) { submitRsvp(); return; }
    set({ step: state.step + 1 });
  }

  function back() {
    set({ step: Math.max(skipIdentity ? 1 : 0, state.step - 1) });
  }

  function goTo(step: number) {
    if (step < state.step) set({ step });
  }

  return (
    <main className="inv-form">
      <div className="inv-form-inner">
        {/* Breadcrumb nav */}
        <div className="inv-form-head">
          <div className="inv-crumbs">
            {r.crumbs.map((lbl, i) => {
              const isActive = state.step === i;
              const isDone = state.step > i;
              return (
                <button
                  key={i}
                  className={`inv-crumb${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                  onClick={() => isDone && goTo(i)}
                  disabled={!isDone}
                  type="button"
                >
                  <span className="inv-crumb-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="inv-crumb-l">{lbl}</span>
                </button>
              );
            })}
          </div>
          <div className="inv-rule" />
        </div>

        {/* Step content */}
        <div className="inv-body" key={state.step}>
          {isPastDeadline ? (
            <div className="inv-step">
              <div className="inv-step-kicker">Closed</div>
              <h2 className="inv-step-title">
                RSVP <span className="inv-it">deadline</span> has passed.
              </h2>
              <p className="inv-step-lede">
                The host has closed RSVPs for this event.
              </p>
            </div>
          ) : (
            <>
              {state.step === 0 && (
                <RsvpStepIdentity
                  state={state}
                  set={set}
                  next={next}
                  template={template}
                  attendeeCount={attendeeCount}
                />
              )}
              {state.step === 1 && (
                <RsvpStepParty
                  state={state}
                  set={set}
                  next={next}
                  back={back}
                  template={template}
                />
              )}
              {state.step === 2 && (
                <RsvpStepDiet
                  state={state}
                  set={set}
                  next={next}
                  back={back}
                  template={template}
                />
              )}
              {state.step === 3 && (
                <RsvpStepConfirm state={state} template={template} event={event} hostName={hostName} />
              )}
            </>
          )}
        </div>

        {state.error && (
          <p className="inv-err" style={{ marginTop: 12, textAlign: "center" }}>
            {state.error}
          </p>
        )}

        {/* Footer */}
        <footer className="inv-footer">
          <span>{event.title}</span>
          <span>{state.step < 3 ? `Step ${state.step + 1} of 3` : "Complete"}</span>
        </footer>
      </div>
    </main>
  );
}
