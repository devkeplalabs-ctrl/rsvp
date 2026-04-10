import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/nav/LoginForm";

export const metadata = { title: "Sign in — RSVP" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verify?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  const { verify } = await searchParams;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blurred card blobs */}
      <div className="absolute -top-10 -left-10 w-40 h-52 bg-rose-100 rounded-2xl rotate-[-8deg] opacity-60 blur-sm" />
      <div className="absolute -bottom-10 -right-10 w-40 h-52 bg-stone-200 rounded-2xl rotate-[8deg] opacity-60 blur-sm" />

      <div className="relative bg-white rounded-2xl border border-stone-200 shadow-sm w-full max-w-sm p-8 space-y-6">
        {/* Logo */}
        <div className="text-center">
          <p className="text-rose-700 font-bold text-2xl tracking-widest uppercase">RSVP</p>
        </div>

        {verify ? (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-zinc-900">Check your email</p>
            <p className="text-zinc-500 text-sm">
              We sent a magic link to your inbox. Click it to sign in — no password needed.
            </p>
          </div>
        ) : (
          <LoginForm />
        )}

        <p className="text-center text-xs text-zinc-400">
          By signing in, you agree to our{" "}
          <a href="#" className="underline">Terms</a> and{" "}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
