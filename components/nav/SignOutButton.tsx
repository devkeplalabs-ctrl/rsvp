"use client";

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOutButton() {
  return (
    <DropdownMenuItem
      className="text-rose-700 cursor-pointer"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Sign out
    </DropdownMenuItem>
  );
}
