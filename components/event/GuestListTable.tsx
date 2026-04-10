"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RsvpStatusBadge } from "@/components/shared/RsvpStatusBadge";
import { Search, Trash2 } from "lucide-react";
import { deleteGuest } from "@/lib/rsvp";

interface GuestRow {
  id: string;
  name: string;
  email: string | null;
  status: "yes" | "no" | "maybe" | null;
  plusOnes: number | null;
  respondedAt: Date | null;
}

interface Props {
  guests: GuestRow[];
  onResend?: (guestId: string) => void;
}

const TABS = ["All Guests", "Going", "Maybe", "Pending"] as const;
type Tab = (typeof TABS)[number];

function filterByTab(guests: GuestRow[], tab: Tab): GuestRow[] {
  if (tab === "Going") return guests.filter((g) => g.status === "yes");
  if (tab === "Maybe") return guests.filter((g) => g.status === "maybe");
  if (tab === "Pending") return guests.filter((g) => !g.status);
  return guests;
}

function DeleteButton({ guestId, guestName }: { guestId: string; guestName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Remove ${guestName} from the guest list?`)) return;
    startTransition(() => deleteGuest(guestId));
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40"
      title="Remove guest"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

export function GuestListTable({ guests, onResend }: Props) {
  const [tab, setTab] = useState<Tab>("All Guests");
  const [search, setSearch] = useState("");

  const filtered = filterByTab(guests, tab).filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plus-ones</TableHead>
              <TableHead>Responded</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-zinc-400">
                  No guests found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="text-xs bg-rose-50 text-rose-700">
                          {guest.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-zinc-900 text-sm">{guest.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">{guest.email ?? "—"}</TableCell>
                  <TableCell>
                    <RsvpStatusBadge status={guest.status ?? "pending"} />
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">{guest.plusOnes ?? 0}</TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {guest.respondedAt
                      ? guest.respondedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : (
                        <span className="text-zinc-400">
                          No response{" "}
                          {guest.email && onResend && (
                            <button
                              onClick={() => onResend(guest.id)}
                              className="text-rose-700 hover:underline ml-1"
                            >
                              Resend
                            </button>
                          )}
                        </span>
                      )}
                  </TableCell>
                  <TableCell>
                    <DeleteButton guestId={guest.id} guestName={guest.name} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-zinc-400">
        Showing {filtered.length} of {guests.length} guests
      </p>
    </div>
  );
}
