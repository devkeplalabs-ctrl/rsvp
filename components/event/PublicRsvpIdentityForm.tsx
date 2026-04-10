"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createPublicGuest } from "@/lib/rsvp";

interface Props {
  eventId: string;
  slug: string;
}

export function PublicRsvpIdentityForm({ eventId, slug }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleNext = () => {
    startTransition(async () => {
      const guestId = await createPublicGuest(eventId, name, email);
      router.push(`/e/${slug}?guestId=${guestId}`);
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Join the others who have already secured their spot for this magical evening.
      </p>
      <div>
        <Label htmlFor="pubName">Full Name</Label>
        <Input
          id="pubName"
          placeholder="e.g. Julianne Moore"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="pubEmail">Email Address</Label>
        <Input
          id="pubEmail"
          type="email"
          placeholder="julianne@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
        />
      </div>
      <Button
        onClick={handleNext}
        disabled={!name || !email || isPending}
        className="w-full bg-rose-700 hover:bg-rose-800 text-white"
      >
        {isPending ? "Loading..." : "Next →"}
      </Button>
      <p className="text-xs text-zinc-400 text-center">
        Secure your nomination in under 60 seconds.
      </p>
    </div>
  );
}
