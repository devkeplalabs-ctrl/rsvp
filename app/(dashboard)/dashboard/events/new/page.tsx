import { NewEventForm } from "@/components/event/NewEventForm";

export const metadata = { title: "New Event — RSVP" };

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Design your celebration</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Fill in the details to create your bespoke invitation. Every milestone deserves a beautiful entrance.
        </p>
      </div>
      <NewEventForm />
    </div>
  );
}
