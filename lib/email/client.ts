import { Resend } from "resend";
import { Event } from "@/db/schema";
import { InviteEmail } from "./templates/InviteEmail";
import { RsvpConfirmationEmail } from "./templates/RsvpConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
const FROM = process.env.EMAIL_FROM ?? "RSVP <noreply@example.com>";
const BASE_URL = process.env.AUTH_URL ?? "http://localhost:3000";

interface InviteEmailParams {
  to: string;
  guestName: string;
  event: Event;
  token: string;
}

interface ConfirmationEmailParams {
  to: string;
  guestName: string;
  event: Event;
  status: "yes" | "no" | "maybe";
  token: string;
}

export async function sendInviteEmail({
  to,
  guestName,
  event,
  token,
}: InviteEmailParams) {
  const inviteUrl = `${BASE_URL}/i/${token}`;
  await resend.emails.send({
    from: FROM,
    to,
    subject: `You're invited: ${event.title}`,
    react: InviteEmail({ guestName, event, inviteUrl }),
  });
}

export async function sendRsvpConfirmationEmail({
  to,
  guestName,
  event,
  status,
  token,
}: ConfirmationEmailParams) {
  const changeUrl = `${BASE_URL}/i/${token}`;
  await resend.emails.send({
    from: FROM,
    to,
    subject: `RSVP confirmed: ${event.title}`,
    react: RsvpConfirmationEmail({ guestName, event, status, changeUrl }),
  });
}
