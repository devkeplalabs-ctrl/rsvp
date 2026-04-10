"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { RsvpStatusToggle } from "./RsvpStatusToggle";
import { recordRsvp } from "@/lib/rsvp";

interface Props {
  guestId: string;
  guestName: string;
  allowPlusOnes: boolean;
  maxPlusOnes: number;
  existingStatus?: "yes" | "no" | "maybe";
  existingPlusOnes?: number;
  thankYouPath: string;
}

export function RsvpForm({
  guestId,
  guestName,
  allowPlusOnes,
  maxPlusOnes,
  existingStatus,
  existingPlusOnes,
  thankYouPath,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"yes" | "no" | "maybe">(existingStatus ?? "yes");
  const [plusOnes, setPlusOnes] = useState(existingPlusOnes ?? 0);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("status", status);
    fd.set("plusOnes", String(plusOnes));
    startTransition(async () => {
      await recordRsvp(guestId, fd);
      router.push(thankYouPath);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label className="text-sm font-semibold text-zinc-700 mb-2 block">
          Will you join us?
        </Label>
        <RsvpStatusToggle value={status} onChange={setStatus} />
      </div>

      {allowPlusOnes && status === "yes" && (
        <div>
          <Label className="text-sm text-zinc-600 mb-2 block">
            Bringing any plus-ones?
          </Label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlusOnes((n) => Math.max(0, n - 1))}
              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-lg font-semibold w-6 text-center">{plusOnes}</span>
            <button
              type="button"
              onClick={() => setPlusOnes((n) => Math.min(maxPlusOnes, n + 1))}
              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="dietary" className="text-sm text-zinc-600">
          Dietary notes
        </Label>
        <Textarea
          id="dietary"
          name="dietary"
          placeholder="Vegan, nut allergies, etc."
          rows={2}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-sm text-zinc-600">
          Message to host
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Can't wait! See you there."
          rows={2}
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-rose-700 hover:bg-rose-800 text-white py-3"
      >
        {isPending ? "Sending..." : "Send Response"}
      </Button>
    </form>
  );
}
