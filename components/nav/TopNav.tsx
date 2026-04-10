import Link from "next/link";
import { Bell } from "lucide-react";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { SignOutButton } from "./SignOutButton";

export async function TopNav() {
  const session = await auth();
  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-40 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-8">
        <Logo />

        <nav className="hidden sm:flex items-center gap-6 flex-1">
          <NavLink href="/dashboard">Events</NavLink>
          <NavLink href="/dashboard/calendar">Calendar</NavLink>
          <NavLink href="/dashboard/guests">Guests</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button className="text-zinc-500 hover:text-zinc-900 transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
                <AvatarFallback className="bg-rose-700 text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user?.email && (
                <div className="px-3 py-2">
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard" className="w-full">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
