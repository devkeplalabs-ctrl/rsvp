import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ─── App tables ──────────────────────────────────────────────────────────────

export const eventCategoryEnum = pgEnum("event_category", [
  "supper",
  "wedding",
  "birthday",
  "play",
  "weekend",
]);

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  hostId: text("host_id").notNull(),
  category: eventCategoryEnum("category").default("birthday").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  locationUrl: text("location_url"),
  startsAt: timestamp("starts_at", { mode: "date" }).notNull(),
  endsAt: timestamp("ends_at", { mode: "date" }),
  rsvpDeadline: timestamp("rsvp_deadline", { mode: "date" }),
  publicSlug: text("public_slug").unique().notNull(),
  coverImageUrl: text("cover_image_url"),
  allowPlusOnes: boolean("allow_plus_ones").default(false).notNull(),
  maxPlusOnes: integer("max_plus_ones").default(1).notNull(),
  capacity: integer("capacity"),
  customDetails: json("custom_details").$type<{ label: string; content: string }[]>(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const guestSourceEnum = pgEnum("guest_source", [
  "manual",
  "batch",
  "public",
]);

export const guests = pgTable("guests", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  inviteToken: text("invite_token").unique().notNull(),
  source: guestSourceEnum("source").default("manual").notNull(),
  invitedAt: timestamp("invited_at", { mode: "date" }),
  openedAt: timestamp("opened_at", { mode: "date" }),
  remindedAt: timestamp("reminded_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const rsvpStatusEnum = pgEnum("rsvp_status", ["yes", "no", "maybe"]);

export const rsvps = pgTable("rsvps", {
  id: uuid("id").defaultRandom().primaryKey(),
  guestId: uuid("guest_id")
    .notNull()
    .unique()
    .references(() => guests.id, { onDelete: "cascade" }),
  status: rsvpStatusEnum("status").notNull(),
  plusOnes: integer("plus_ones").default(0).notNull(),
  dietary: text("dietary"),
  message: text("message"),
  respondedAt: timestamp("responded_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type Event = typeof events.$inferSelect;
export type Guest = typeof guests.$inferSelect;
export type Rsvp = typeof rsvps.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type NewGuest = typeof guests.$inferInsert;
export type NewRsvp = typeof rsvps.$inferInsert;
