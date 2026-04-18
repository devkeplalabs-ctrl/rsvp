"use client";

import { useClerk } from "@clerk/nextjs";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOutButton() {
  const { signOut } = useClerk();
  return (
    <DropdownMenuItem
      className="text-rose-700 cursor-pointer"
      onClick={() => signOut({ redirectUrl: "/login" })}
    >
      Sign out
    </DropdownMenuItem>
  );
}
