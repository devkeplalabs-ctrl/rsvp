import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Sign in — RSVP" };

export default async function LoginPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-52 bg-rose-100 rounded-2xl rotate-[-8deg] opacity-60 blur-sm" />
      <div className="absolute -bottom-10 -right-10 w-40 h-52 bg-stone-200 rounded-2xl rotate-[8deg] opacity-60 blur-sm" />
      <SignIn />
    </div>
  );
}
