export type EventCategory = "supper" | "wedding" | "birthday" | "play" | "weekend";

export type TemplateTheme = {
  paper: string;
  ink: string;
  muted: string;
  hint: string;
  rule: string;
  accent: string;
  accentSoft: string;
  heroTint: string;
};

export type EventTemplate = {
  key: EventCategory;
  label: string;
  swatch: string;
  theme: TemplateTheme;
  defaultHero: string;
  heroAlt: string;
  brand: { mark: string; brand: string; sub: string };
  kicker: string;
  rsvp: {
    crumbs: [string, string, string, string];
    chapters: [string, string, string, string];
    q0: { pre: string; em: string; post: string };
    lede0: string;
    q1: { pre: string; em: string; post: string };
    lede1: string;
    q2: { pre: string; em: string; post: string };
    lede2: string;
    ctaNext: string;
    ctaFinal: string;
    confirmKicker: string;
    confirmTitle: { pre: string; em: string; post: string };
    confirmBody: (name: string, guests: number) => string;
    seatsTotal: number;
    seatsLabel: string;
    sealTop: string;
    seatCopy: (open: number, total: number) => string;
    partyMax: number;
    partyLabel: string;
    partyHints: string[];
    dietLede: string;
  };
  signOff: { name: string; note: string } | null;
};

export const TEMPLATES: EventTemplate[] = [
  // ── 01 · SUPPER CLUB ──────────────────────────────────────────────────────
  {
    key: "supper",
    label: "Supper",
    swatch: "#a03b1d",
    theme: {
      paper: "#f2ead9",
      ink: "#2a1f14",
      muted: "#584430",
      hint: "#8a7458",
      rule: "rgba(42,31,20,0.18)",
      accent: "#a03b1d",
      accentSoft: "#e6b88a",
      heroTint: "linear-gradient(180deg, rgba(20,14,8,0.1), rgba(20,14,8,0.55))",
    },
    defaultHero:
      "https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "A table set for dinner under warm light",
    brand: { mark: "N", brand: "Kinfolk Table", sub: "Issue Nº 14 · Spring" },
    kicker: "A private supper · Six seats · One long table",
    rsvp: {
      crumbs: ["Your seat", "The table", "The menu", "Confirmed"],
      chapters: ["Chapter one", "Chapter two", "Chapter three", "Confirmed"],
      q0: { pre: "Who's", em: "joining", post: " us?" },
      lede0:
        "We're keeping it to six at the table. If you can make it, write your name into the book.",
      q1: { pre: "Bringing", em: "anyone", post: "?" },
      lede1:
        "Claim up to four seats — one for you, and a few for the people you can't imagine eating without.",
      q2: { pre: "Anything we", em: "shouldn't", post: " cook?" },
      lede2: "Tell us now and we'll adjust the menu. Every restriction is taken seriously.",
      ctaNext: "Continue",
      ctaFinal: "Confirm seat",
      confirmKicker: "Confirmed",
      confirmTitle: { pre: "Your seat is", em: "set", post: "" },
      confirmBody: (n, g) =>
        `The address and a menu keepsake will hit your inbox shortly.${g > 1 ? ` We'll set ${g} places at the table.` : ""}`,
      seatsTotal: 6,
      seatsLabel: "seats",
      sealTop: "THE HEARTH & HOLLOW · SUPPER Nº 14 · TOPANGA CANYON · ",
      seatCopy: (open, total) => `${open} of ${total} seats still open`,
      partyMax: 4,
      partyLabel: "Seats, including you",
      partyHints: ["Just you. Lovely.", "Two seats.", "Three seats.", "A full half-table."],
      dietLede: "Any food considerations for the kitchen?",
    },
    signOff: null,
  },

  // ── 02 · WEDDING ──────────────────────────────────────────────────────────
  {
    key: "wedding",
    label: "Wedding",
    swatch: "#6d4c2b",
    theme: {
      paper: "#f6f0e6",
      ink: "#1f1a14",
      muted: "#5b4a36",
      hint: "#8a7a5f",
      rule: "rgba(31,26,20,0.15)",
      accent: "#6d4c2b",
      accentSoft: "#c9a36d",
      heroTint: "linear-gradient(180deg, rgba(10,8,6,0.08), rgba(10,8,6,0.5))",
    },
    defaultHero:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Wedding table with ivory flowers and candlelight",
    brand: { mark: "O", brand: "Otis & Marlowe", sub: "Save the date · 2026" },
    kicker: "An intimate ceremony · Fifty guests · Under the olives",
    rsvp: {
      crumbs: ["Your name", "Your party", "The meal", "Confirmed"],
      chapters: ["With love", "With guests", "With care", "With thanks"],
      q0: { pre: "Will you", em: "join", post: " us?" },
      lede0: "Tell us who you are, and we'll save your spot under the olives.",
      q1: { pre: "Who's coming", em: "with", post: " you?" },
      lede1:
        "We've kept the guest list intimate. Let us know who to expect beside you.",
      q2: { pre: "Anything the", em: "kitchen", post: " should know?" },
      lede2: "We're serving a set menu family-style. Dietary needs are no trouble at all.",
      ctaNext: "Continue",
      ctaFinal: "Send our love",
      confirmKicker: "RSVP received",
      confirmTitle: { pre: "We can't", em: "wait", post: "." },
      confirmBody: (n, g) =>
        `Event details will hit your inbox shortly.${g > 1 ? ` We've reserved ${g} seats for you.` : ""}`,
      seatsTotal: 50,
      seatsLabel: "seats",
      sealTop: "OTIS & MARLOWE · JUNE 13 2026 · OLIVE GROVE · ",
      seatCopy: (open, total) => `${total - open} of ${total} have replied`,
      partyMax: 4,
      partyLabel: "You and your guests",
      partyHints: [
        "Just you — we'll seat you well.",
        "You + a plus one.",
        "Three of you.",
        "A foursome.",
      ],
      dietLede: "Allergies, preferences, dietary needs?",
    },
    signOff: { name: "O & M", note: "xoxo" },
  },

  // ── 03 · BIRTHDAY ─────────────────────────────────────────────────────────
  {
    key: "birthday",
    label: "Birthday",
    swatch: "#e14b5a",
    theme: {
      paper: "#fff4e8",
      ink: "#2b1414",
      muted: "#6a3a3a",
      hint: "#a8746f",
      rule: "rgba(43,20,20,0.16)",
      accent: "#e14b5a",
      accentSoft: "#f7a399",
      heroTint: "linear-gradient(180deg, rgba(20,5,5,0.05), rgba(40,10,10,0.45))",
    },
    defaultHero:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "A birthday cake with candles, warm tones",
    brand: { mark: "J", brand: "June's Thirty", sub: "One night, many candles" },
    kicker: "A birthday · All the people · All the songs",
    rsvp: {
      crumbs: ["Your name", "Your crew", "Your notes", "See you soon"],
      chapters: ["RSVP 01", "RSVP 02", "RSVP 03", "RSVP 04"],
      q0: { pre: "Are you", em: "in", post: "?" },
      lede0:
        "Pop your name down. We'll send the address, the playlist link, and a cab code the day-of.",
      q1: { pre: "Rolling", em: "solo", post: " or bringing trouble?" },
      lede1:
        "Feel free to bring up to three people — just tell us who so we can greet them properly.",
      q2: { pre: "Food", em: "stuff", post: "?" },
      lede2: "The menu is mostly veg-friendly. Let us know anything we should plan around.",
      ctaNext: "Continue",
      ctaFinal: "I'm there",
      confirmKicker: "See you soon",
      confirmTitle: { pre: "You're on the", em: "list", post: "." },
      confirmBody: (n, g) =>
        `The address and event details will hit your inbox shortly.${g > 1 ? ` We've got you down for ${g}.` : ""}`,
      seatsTotal: 60,
      seatsLabel: "spots",
      sealTop: "JUNE TURNS THIRTY · MAY 9 · ONE NIGHT ONLY · ",
      seatCopy: (open, total) => `${total - open} coming so far`,
      partyMax: 4,
      partyLabel: "How many of you",
      partyHints: [
        "Just you. The party needs you.",
        "You + one.",
        "A trio.",
        "A full crew.",
      ],
      dietLede: "Allergies or preferences?",
    },
    signOff: { name: "J", note: "x" },
  },

  // ── 04 · FUN & PLAY ───────────────────────────────────────────────────────
  {
    key: "play",
    label: "Fun & Play",
    swatch: "#2f7a4a",
    theme: {
      paper: "#f5f1e4",
      ink: "#14241a",
      muted: "#3f5a48",
      hint: "#7c907f",
      rule: "rgba(20,36,26,0.14)",
      accent: "#2f7a4a",
      accentSoft: "#f4b948",
      heroTint: "linear-gradient(180deg, rgba(10,15,10,0.1), rgba(10,20,14,0.48))",
    },
    defaultHero:
      "https://images.unsplash.com/photo-1526485646667-eb9950ce7499?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Summer picnic on a lawn, blanket, fruit, frisbee",
    brand: { mark: "F", brand: "Field Day Co.", sub: "Summer league · 2026" },
    kicker: "Lawn games · Long picnic · Bring something to throw",
    rsvp: {
      crumbs: ["Name", "Your team", "Food", "You're in"],
      chapters: ["Field 01", "Field 02", "Field 03", "Warmed up"],
      q0: { pre: "See you at", em: "the park", post: "?" },
      lede0:
        "Drop your name; we'll send the meet-up pin and a list of what we've still got covered.",
      q1: { pre: "Bringing", em: "anyone", post: "?" },
      lede1:
        "Kids, dogs, plus-ones — all welcome. Count your whole crew so we bring enough watermelon.",
      q2: { pre: "Food", em: "notes", post: "?" },
      lede2: "Potluck-ish. Let us know if there are allergies, and what you want to bring.",
      ctaNext: "Continue",
      ctaFinal: "Count me in",
      confirmKicker: "See you on the lawn",
      confirmTitle: { pre: "You're", em: "on the team", post: "." },
      confirmBody: (n, g) =>
        `The address and event details will hit your inbox shortly.${g > 1 ? ` ${g} spots reserved.` : ""}`,
      seatsTotal: 40,
      seatsLabel: "people",
      sealTop: "FIELD DAY · JUNE 14 · PROSPECT PARK · LONG MEADOW · ",
      seatCopy: (open, total) => `${total - open} on the lawn so far`,
      partyMax: 5,
      partyLabel: "Your crew (kids + dogs count)",
      partyHints: [
        "Solo — we'll find you a team.",
        "Two of you.",
        "Three.",
        "A full crew.",
        "A whole team.",
      ],
      dietLede: "Anything for the potluck to know?",
    },
    signOff: { name: "S & T", note: "" },
  },

  // ── 05 · WEEKEND AWAY ─────────────────────────────────────────────────────
  {
    key: "weekend",
    label: "Weekend",
    swatch: "#4a5d3a",
    theme: {
      paper: "#ede7d6",
      ink: "#1c241a",
      muted: "#4a5d3a",
      hint: "#7c8670",
      rule: "rgba(28,36,26,0.18)",
      accent: "#4a5d3a",
      accentSoft: "#c48a52",
      heroTint: "linear-gradient(180deg, rgba(10,14,8,0.1), rgba(10,18,10,0.55))",
    },
    defaultHero:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "A cabin at dusk in mountain woods",
    brand: { mark: "P", brand: "Pine Hollow", sub: "Weekend Nº 3 · Catskills" },
    kicker: "Three nights in the woods · Ten of us · One wood stove",
    rsvp: {
      crumbs: ["Your name", "Your party", "Notes", "Packed"],
      chapters: ["Note one", "Note two", "Note three", "See you up there"],
      q0: { pre: "Coming", em: "up", post: "?" },
      lede0: "Drop your name and we'll send driving notes, a packing list, and the door code.",
      q1: { pre: "Who's", em: "with", post: " you?" },
      lede1: "Up to four beds are yours — we'll sort sleeping arrangements by couples and dogs.",
      q2: { pre: "Kitchen &", em: "comfort", post: " notes" },
      lede2: "We cook family style. Share allergies or favorite breakfast cereals.",
      ctaNext: "Continue",
      ctaFinal: "Pack it up",
      confirmKicker: "See you up there",
      confirmTitle: { pre: "Your bunk is", em: "waiting", post: "." },
      confirmBody: (n, g) =>
        `The address and event details will hit your inbox shortly.${g > 1 ? ` ${g} beds made.` : ""}`,
      seatsTotal: 10,
      seatsLabel: "beds",
      sealTop: "PINE HOLLOW · SEPT 18—21 · CATSKILLS · WEEKEND Nº 3 · ",
      seatCopy: (open, total) => `${total - open} of ${total} beds claimed`,
      partyMax: 4,
      partyLabel: "Beds, including you",
      partyHints: [
        "Solo — bunk with a view.",
        "A pair.",
        "Three of you.",
        "A full cabin.",
      ],
      dietLede: "Anything for the cabin kitchen to know?",
    },
    signOff: { name: "Mara", note: "xxx" },
  },
];

export const TEMPLATE_MAP = Object.fromEntries(
  TEMPLATES.map((t) => [t.key, t])
) as Record<EventCategory, EventTemplate>;

export function getTemplate(key: EventCategory | string): EventTemplate {
  return TEMPLATE_MAP[key as EventCategory] ?? TEMPLATE_MAP["birthday"];
}

export const DIET_OPTIONS = [
  { key: "veg", label: "Vegetarian" },
  { key: "vgn", label: "Vegan" },
  { key: "gf", label: "Gluten-free" },
  { key: "df", label: "Dairy-free" },
  { key: "pesc", label: "Pescatarian" },
  { key: "halal", label: "Halal" },
  { key: "kshr", label: "Kosher" },
  { key: "nuts", label: "Nut allergy" },
  { key: "none", label: "No restrictions" },
] as const;
