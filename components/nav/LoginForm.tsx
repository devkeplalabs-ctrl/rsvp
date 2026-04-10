"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await signIn("resend", { email, redirect: false, callbackUrl: "/dashboard" });
      // Auth.js will redirect to /login?verify=1
      window.location.href = "/login?verify=1";
    });
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Sign in to RSVP</h1>
        <p className="text-zinc-500 text-sm mt-1">
          The digital concierge for your milestones.
        </p>
      </div>

      <form onSubmit={handleMagicLink} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 focus:ring-rose-700 focus:border-rose-700"
          />
        </div>
        <Button
          type="submit"
          disabled={isPending || !email}
          className="w-full bg-rose-700 hover:bg-rose-800 text-white"
        >
          {isPending ? "Sending..." : "Send magic link →"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-zinc-400 uppercase tracking-wide">or continue with</span>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="text-sm"
        >
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
          className="text-sm"
        >
          Apple
        </Button>
      </div>

      <p className="text-center text-xs text-zinc-400">
        New here? You&apos;ll be able to create your first event right after signing in.
      </p>
    </div>
  );
}
