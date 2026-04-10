import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  locationUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: z.string().optional(),
  rsvpDeadline: z.string().optional(),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  allowPlusOnes: z.boolean().default(false),
  maxPlusOnes: z.coerce.number().int().min(1).max(10).default(1),
  capacity: z.coerce.number().int().min(1).optional().or(z.literal("")),
});

export const addGuestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  sendEmail: z.boolean().default(false),
});

export const batchInviteSchema = z.object({
  emails: z.string().min(1, "Paste at least one email"),
});

export const rsvpSchema = z.object({
  status: z.enum(["yes", "no", "maybe"]),
  plusOnes: z.coerce.number().int().min(0).max(10).default(0),
  dietary: z.string().optional(),
  message: z.string().optional(),
});

export const publicRsvpIdentitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type AddGuestInput = z.infer<typeof addGuestSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
export type PublicRsvpIdentityInput = z.infer<typeof publicRsvpIdentitySchema>;
