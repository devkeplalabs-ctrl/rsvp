"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Copy, Check } from "lucide-react";
import { addGuest, addGuestsBatch } from "@/lib/rsvp";

interface RecentGuest {
  id: string;
  name: string;
  email: string | null;
  inviteToken: string;
  createdAt: Date;
}

interface Props {
  eventId: string;
  publicSlug: string;
  recentGuests: RecentGuest[];
}

function CopyableLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/i/${token}`;

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copy} className="text-zinc-400 hover:text-rose-700 transition-colors ml-auto flex-shrink-0">
      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export function InviteComposer({ eventId, publicSlug, recentGuests }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [batchEmails, setBatchEmails] = useState("");
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [isPending, startTransition] = useTransition();

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/e/${publicSlug}`
    : `/e/${publicSlug}`;

  const handleAddGuest = () => {
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("sendEmail", String(sendEmail));
    startTransition(async () => {
      await addGuest(eventId, fd);
      setName("");
      setEmail("");
      toast.success("Guest added");
    });
  };

  const handleBatchSend = () => {
    const fd = new FormData();
    fd.set("emails", batchEmails);
    startTransition(async () => {
      const result = await addGuestsBatch(eventId, fd);
      toast.success(`Sent ${result.sent} invites${result.errors ? `, ${result.errors} failed` : ""}`);
      setBatchEmails("");
    });
  };

  return (
    <Tabs defaultValue="add">
      <TabsList className="mb-4">
        <TabsTrigger value="add">Add guest</TabsTrigger>
        <TabsTrigger value="batch">Batch import</TabsTrigger>
        <TabsTrigger value="link">Public link</TabsTrigger>
      </TabsList>

      {/* Add single guest */}
      <TabsContent value="add">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="guestName">Full Name</Label>
              <Input
                id="guestName"
                placeholder="e.g. Julianne Moore"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="guestEmail">Email Address</Label>
              <Input
                id="guestEmail"
                type="email"
                placeholder="julianne@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="accent-rose-700"
            />
            Send invite email automatically
          </label>

          <Button
            onClick={handleAddGuest}
            disabled={!name || isPending}
            className="bg-rose-700 hover:bg-rose-800 text-white"
          >
            Add Guest
          </Button>

          {/* Recently added */}
          {recentGuests.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-zinc-700">Recently added</p>
                <p className="text-xs text-zinc-400">
                  {recentGuests.length} of {recentGuests.length}
                </p>
              </div>
              <ul className="space-y-2">
                {recentGuests.slice(0, 5).map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-rose-50 text-rose-700">
                        {g.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{g.name}</p>
                      {g.email && (
                        <p className="text-xs text-zinc-400 truncate">{g.email}</p>
                      )}
                    </div>
                    <CopyableLink token={g.inviteToken} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Batch import */}
      <TabsContent value="batch">
        <div className="space-y-4">
          <div>
            <Label htmlFor="batchEmails">Email addresses</Label>
            <Textarea
              id="batchEmails"
              placeholder="Paste emails, one per line or comma-separated&#10;jane@example.com&#10;john@example.com"
              value={batchEmails}
              onChange={(e) => setBatchEmails(e.target.value)}
              rows={6}
              className="mt-1 font-mono text-sm"
            />
          </div>
          {batchEmails && (
            <p className="text-sm text-zinc-500">
              {batchEmails.split(/[\n,]+/).filter((e) => e.trim().includes("@")).length} valid emails detected
            </p>
          )}
          <Button
            onClick={handleBatchSend}
            disabled={!batchEmails || isPending}
            className="bg-rose-700 hover:bg-rose-800 text-white"
          >
            {isPending ? "Sending..." : "Send Invites"}
          </Button>
        </div>
      </TabsContent>

      {/* Public link */}
      <TabsContent value="link">
        <div className="space-y-4">
          <div>
            <Label>Public RSVP link</Label>
            <p className="text-xs text-zinc-500 mt-0.5 mb-2">
              Anyone with this link can see the event and RSVP.
            </p>
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  setCopiedPublic(true);
                  setTimeout(() => setCopiedPublic(false), 2000);
                }}
              >
                {copiedPublic ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Smart Reminders</p>
                <p className="text-xs text-green-700 mt-0.5">
                  Let us manage gentle follow-ups for guests who haven't responded within 72 hours of receiving their invite.
                </p>
                <button className="text-xs text-green-700 underline mt-1">
                  Configure automations →
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
