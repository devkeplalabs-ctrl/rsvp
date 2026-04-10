"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { CalendarDays, Loader2, MapPin, Minus, Plus } from "lucide-react";
import { createEvent } from "@/lib/rsvp";
import { ImageUploader } from "@/components/shared/ImageUploader";

export function NewEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [allowPlusOnes, setAllowPlusOnes] = useState(false);
  const [maxPlusOnes, setMaxPlusOnes] = useState(1);
  const [isPending, startTransition] = useTransition();

  const formattedDate = startsAt
    ? new Date(startsAt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      })
    : "Saturday, April 25";

  const formattedTime = startsAt
    ? new Date(startsAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "7:00 PM";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
      {/* Form */}
      <form
        action={(fd) => startTransition(() => createEvent(fd))}
        className="space-y-8"
      >
        {/* Section: Essentials */}
        <section>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold mb-4">
            01 / Essentials
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Sasha's 30th"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell your guests what to expect..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
        </section>

        {/* Section: Time & Venue */}
        <section>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold mb-4">
            02 / Time & Venue
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Start Date & Time</Label>
              <div className="mt-1">
                <DateTimePicker
                  name="startsAt"
                  value={startsAt}
                  onChange={setStartsAt}
                  placeholder="Pick start date"
                  required
                />
              </div>
            </div>
            <div>
              <Label>End Date & Time</Label>
              <div className="mt-1">
                <DateTimePicker
                  name="endsAt"
                  value={endsAt}
                  onChange={setEndsAt}
                  placeholder="Pick end date"
                />
              </div>
            </div>
            <div>
              <Label>RSVP Deadline</Label>
              <div className="mt-1">
                <DateTimePicker
                  name="rsvpDeadline"
                  value={rsvpDeadline}
                  onChange={setRsvpDeadline}
                  placeholder="Pick deadline"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Bar Pisellino, NYC"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="locationUrl">Location URL (optional)</Label>
              <Input
                id="locationUrl"
                name="locationUrl"
                type="url"
                placeholder="https://maps.google.com/..."
                className="mt-1"
              />
            </div>
          </div>
        </section>

        {/* Section: Logistics */}
        <section>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold mb-4">
            03 / Logistics
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                placeholder="30"
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Cover Image</Label>
              <div className="mt-1">
                <ImageUploader
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  name="coverImageUrl"
                />
              </div>
            </div>
            <div className="flex items-center justify-between sm:col-span-2 bg-stone-50 border border-stone-200 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-zinc-900">Allow plus-ones</p>
                <p className="text-xs text-zinc-500">Let guests bring a friend or partner</p>
              </div>
              <Switch
                checked={allowPlusOnes}
                onCheckedChange={setAllowPlusOnes}
                className="data-[state=checked]:bg-rose-700"
              />
              <input type="hidden" name="allowPlusOnes" value={String(allowPlusOnes)} />
            </div>
            {/* Always submit maxPlusOnes so Zod gets a valid number */}
            <input type="hidden" name="maxPlusOnes" value={maxPlusOnes} />
            {allowPlusOnes && (
              <div className="sm:col-span-2">
                <Label>Max plus-ones per guest</Label>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setMaxPlusOnes((n) => Math.max(1, n - 1))}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-lg font-semibold w-6 text-center">{maxPlusOnes}</span>
                  <button
                    type="button"
                    onClick={() => setMaxPlusOnes((n) => Math.min(10, n + 1))}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-200 pt-6">
          <p className="text-xs text-zinc-400">Review your invitation details before finalising.</p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => history.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-rose-700 hover:bg-rose-800 text-white min-w-32"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Live preview */}
      <div className="lg:sticky lg:top-24">
        <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold mb-3">
          Live Preview
        </p>
        <Card className="overflow-hidden">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt="Cover"
              className="w-full h-36 object-cover"
            />
          ) : (
            <div className="w-full h-36 bg-gradient-to-br from-rose-100 to-stone-200" />
          )}
          <CardContent className="p-4 space-y-3">
            <h3 className="text-lg font-bold text-zinc-900">
              {title || "Event Title"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <CalendarDays className="w-3 h-3" />
              <span>{formattedDate} · {formattedTime}</span>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-zinc-500 line-clamp-3">{description}</p>
            )}
            <Button
              size="sm"
              className="w-full bg-rose-700 hover:bg-rose-800 text-white mt-2"
              disabled
            >
              RSVP Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
