"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium pb-0.5 border-b-2 transition-colors",
        isActive
          ? "text-zinc-900 border-rose-700"
          : "text-zinc-500 border-transparent hover:text-zinc-900"
      )}
    >
      {children}
    </Link>
  );
}
